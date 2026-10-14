import React, { useEffect, useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle2, Loader2 } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../../../firebase/config';
import paymentQrImage from '../../../assets/payment-qr.png';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const MAX_ADDITIONAL_PHOTOS = 3;

const COUNTRY_CODES = [
  { code: '+977', label: 'Nepal (+977)' },
  { code: '+91', label: 'India (+91)' },
  { code: '+1', label: 'USA/Canada (+1)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+61', label: 'Australia (+61)' },
  { code: '+971', label: 'UAE (+971)' },
];

const QUESTION_PLACEHOLDERS = [
  'What should I focus on in my career?',
  'What can I learn about my relationship?',
  'What opportunities might I explore?',
  'What challenges should I prepare for?',
  'What guidance can help me move forward?',
];

const EMPTY_QUESTIONS = ['', '', '', '', ''];

// ---------------------------------------------------------------------------
// Backend integration point — Firebase (Firestore + Storage)
// ---------------------------------------------------------------------------
// Images go to Storage first (same pattern as BlogAddEdit.js), then the
// resulting download URLs are saved alongside the rest of the fields in a
// single Firestore document under the "tarot_requests" collection. Admins
// read that collection from src/pages/admin/TarotRequests.jsx.
//
// This requires Firestore + Storage security rules that allow a public
// visitor to CREATE a tarot_requests doc and upload to tarot-requests/*,
// while only admins can read them back. See the rules shared alongside
// this file for the exact rule text to paste into the Firebase Console.
async function uploadImage(file, pathPrefix) {
  const fileExtension = file.name.split('.').pop();
  const imageRef = ref(storage, `tarot-requests/${pathPrefix}-${Date.now()}.${fileExtension}`);
  const snapshot = await uploadBytes(imageRef, file);
  return getDownloadURL(snapshot.ref);
}

async function submitTarotRequest(payload) {
  const requestId = `${Date.now()}`;

  let profilePictureUrl = '';
  if (payload.profilePicture) {
    profilePictureUrl = await uploadImage(payload.profilePicture, `${requestId}-profile`);
  }

  const additionalPhotoUrls = [];
  for (let i = 0; i < payload.additionalPhotos.length; i += 1) {
    const url = await uploadImage(payload.additionalPhotos[i], `${requestId}-photo${i + 1}`);
    additionalPhotoUrls.push(url);
  }

  const docData = {
    fullName: payload.fullName,
    address: payload.address,
    phone: payload.phone,
    questions: payload.questions,
    profilePictureUrl,
    additionalPhotoUrls,
    status: 'new', // admins can update this to 'responded' once handled
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, 'tarot_requests'), docData);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function validateImageFile(file) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return `"${file.name}" isn't a supported format. Please upload a JPG, PNG, or WebP image.`;
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `"${file.name}" is too large. Please upload an image under ${MAX_IMAGE_SIZE_MB}MB.`;
  }
  return null;
}

function inputClasses(hasError) {
  return [
    'w-full px-4 py-2.5 border rounded-lg bg-white text-gray-800 placeholder-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition',
    hasError ? 'border-red-400' : 'border-gray-300',
  ].join(' ');
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const TarotRequestForm = () => {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [countryCode, setCountryCode] = useState('+977');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [profilePicture, setProfilePicture] = useState(null); // { file, previewUrl }
  const [additionalPhotos, setAdditionalPhotos] = useState([]); // [{ file, previewUrl }]

  const [questions, setQuestions] = useState(EMPTY_QUESTIONS);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'success'

  const profilePictureInputRef = useRef(null);
  const additionalPhotosInputRef = useRef(null);

  // Revoke object URLs on unmount / change so we don't leak memory.
  useEffect(() => {
    return () => {
      if (profilePicture?.previewUrl) URL.revokeObjectURL(profilePicture.previewUrl);
      additionalPhotos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const questionsAddedCount = questions.filter((q) => q.trim().length > 0).length;

  // -- Handlers -------------------------------------------------------------

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      setErrors((prev) => ({ ...prev, profilePicture: error }));
      e.target.value = '';
      return;
    }

    if (profilePicture?.previewUrl) URL.revokeObjectURL(profilePicture.previewUrl);
    setProfilePicture({ file, previewUrl: URL.createObjectURL(file) });
    setErrors((prev) => ({ ...prev, profilePicture: undefined }));
    e.target.value = '';
  };

  const handleRemoveProfilePicture = () => {
    if (profilePicture?.previewUrl) URL.revokeObjectURL(profilePicture.previewUrl);
    setProfilePicture(null);
  };

  const handleAdditionalPhotosChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = MAX_ADDITIONAL_PHOTOS - additionalPhotos.length;
    if (remainingSlots <= 0) {
      setErrors((prev) => ({
        ...prev,
        additionalPhotos: `You can upload up to ${MAX_ADDITIONAL_PHOTOS} additional photos.`,
      }));
      e.target.value = '';
      return;
    }

    const filesToAdd = files.slice(0, remainingSlots);
    const newEntries = [];
    let firstError = null;

    for (const file of filesToAdd) {
      const error = validateImageFile(file);
      if (error) {
        firstError = firstError || error;
        continue;
      }
      newEntries.push({ file, previewUrl: URL.createObjectURL(file) });
    }

    if (newEntries.length > 0) {
      setAdditionalPhotos((prev) => [...prev, ...newEntries]);
    }

    setErrors((prev) => ({
      ...prev,
      additionalPhotos:
        firstError || (files.length > remainingSlots
          ? `Only ${remainingSlots} more photo(s) could be added (max ${MAX_ADDITIONAL_PHOTOS}).`
          : undefined),
    }));
    e.target.value = '';
  };

  const handleRemoveAdditionalPhoto = (index) => {
    setAdditionalPhotos((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return next;
    });
  };

  const handleQuestionChange = (index, value) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!address.trim()) nextErrors.address = 'Address is required.';

    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (!digitsOnly) {
      nextErrors.phoneNumber = 'Phone number is required.';
    } else if (digitsOnly.length < 6 || digitsOnly.length > 12) {
      nextErrors.phoneNumber = 'Please enter a valid phone number.';
    }

    if (questionsAddedCount === 0) {
      nextErrors.questions = 'Please add at least one question.';
    }

    return nextErrors;
  };

  const resetForm = () => {
    setFullName('');
    setAddress('');
    setCountryCode('+977');
    setPhoneNumber('');
    handleRemoveProfilePicture();
    additionalPhotos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setAdditionalPhotos([]);
    setQuestions(EMPTY_QUESTIONS);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateForm();
    setErrors((prev) => ({ ...prev, ...validationErrors, submit: undefined }));

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        fullName: fullName.trim(),
        address: address.trim(),
        phone: `${countryCode} ${phoneNumber.trim()}`,
        profilePicture: profilePicture?.file || null,
        additionalPhotos: additionalPhotos.map((p) => p.file),
        questions: questions.map((q) => q.trim()).filter(Boolean),
      };

      await submitTarotRequest(payload);
      setSubmitStatus('success');
      resetForm();
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: 'Something went wrong while submitting your request. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // -- Render -----------------------------------------------------------

  if (submitStatus === 'success') {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 text-center border border-amber-100">
        <CheckCircle2 className="mx-auto text-primary" size={48} />
        <h3 className="mt-4 text-2xl font-semibold text-gray-800">Your request has been received</h3>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">
          Thank you for sharing your questions with us. Once our messaging workflow is configured, you'll
          receive your personalized reading on your preferred platform below.
        </p>
        <button
          type="button"
          onClick={() => setSubmitStatus('idle')}
          className="mt-6 inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition focus:outline-none focus:ring-2 focus:ring-primary/60"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      {/* -------------------- Left card: Your Details -------------------- */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-amber-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Your Details</h3>

        <div className="space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
              Full name <span className="text-primary">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Sita Sharma"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              className={inputClasses(errors.fullName)}
            />
            {errors.fullName && (
              <p id="fullName-error" className="mt-1.5 text-sm text-red-500">
                {errors.fullName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">
              Address <span className="text-primary">*</span>
            </label>
            <input
              id="address"
              name="address"
              type="text"
              autoComplete="street-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Kathmandu, Nepal"
              aria-invalid={Boolean(errors.address)}
              aria-describedby={errors.address ? 'address-error' : undefined}
              className={inputClasses(errors.address)}
            />
            {errors.address && (
              <p id="address-error" className="mt-1.5 text-sm text-red-500">
                {errors.address}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone number <span className="text-primary">*</span>
            </label>
            <div className="flex gap-2">
              <label htmlFor="countryCode" className="sr-only">
                Country code
              </label>
              <select
                id="countryCode"
                name="countryCode"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="px-2 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition shrink-0 w-[7.5rem] sm:w-36"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="98XXXXXXXX"
                aria-invalid={Boolean(errors.phoneNumber)}
                aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
                className={inputClasses(errors.phoneNumber)}
              />
            </div>
            {errors.phoneNumber && (
              <p id="phoneNumber-error" className="mt-1.5 text-sm text-red-500">
                {errors.phoneNumber}
              </p>
            )}
          </div>

          {/* Profile picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Profile picture <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="flex items-center gap-4">
              {profilePicture ? (
                <div className="relative shrink-0">
                  <img
                    src={profilePicture.previewUrl}
                    alt="Profile preview"
                    className="w-16 h-16 rounded-full object-cover border border-amber-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveProfilePicture}
                    aria-label="Remove profile picture"
                    className="absolute -top-1.5 -right-1.5 bg-white rounded-full shadow p-1 text-gray-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-amber-50 border border-dashed border-amber-200 flex items-center justify-center shrink-0 text-amber-300">
                  <ImageIcon size={22} />
                </div>
              )}

              <button
                type="button"
                onClick={() => profilePictureInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition focus:outline-none focus:ring-2 focus:ring-primary/60"
              >
                <Upload size={16} />
                {profilePicture ? 'Change photo' : 'Upload photo'}
              </button>
              <input
                ref={profilePictureInputRef}
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-400">JPG, PNG, or WebP · up to {MAX_IMAGE_SIZE_MB}MB</p>
            {errors.profilePicture && (
              <p className="mt-1.5 text-sm text-red-500">{errors.profilePicture}</p>
            )}
          </div>

          {/* Additional photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Additional photos{' '}
              <span className="text-gray-400 font-normal">
                (optional, up to {MAX_ADDITIONAL_PHOTOS})
              </span>
            </label>

            <div className="flex flex-wrap gap-3">
              {additionalPhotos.map((photo, index) => (
                <div key={photo.previewUrl} className="relative">
                  <img
                    src={photo.previewUrl}
                    alt={`Additional upload ${index + 1}`}
                    className="w-16 h-16 rounded-lg object-cover border border-amber-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAdditionalPhoto(index)}
                    aria-label={`Remove additional photo ${index + 1}`}
                    className="absolute -top-1.5 -right-1.5 bg-white rounded-full shadow p-1 text-gray-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {additionalPhotos.length < MAX_ADDITIONAL_PHOTOS && (
                <button
                  type="button"
                  onClick={() => additionalPhotosInputRef.current?.click()}
                  className="w-16 h-16 rounded-lg border border-dashed border-amber-300 text-amber-400 hover:text-primary hover:border-primary flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-primary/60"
                  aria-label="Add a photo"
                >
                  <Upload size={18} />
                </button>
              )}
            </div>
            <input
              ref={additionalPhotosInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              multiple
              onChange={handleAdditionalPhotosChange}
              className="hidden"
            />
            <p className="mt-1.5 text-xs text-gray-400">JPG, PNG, or WebP · up to {MAX_IMAGE_SIZE_MB}MB each</p>
            {errors.additionalPhotos && (
              <p className="mt-1.5 text-sm text-red-500">{errors.additionalPhotos}</p>
            )}
          </div>
        </div>
      </div>

      {/* -------------------- Right card: Your Questions -------------------- */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-amber-100 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-semibold text-gray-800">Your Questions</h3>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-primary border border-amber-200 whitespace-nowrap">
            {questionsAddedCount} of {QUESTION_PLACEHOLDERS.length} questions added
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-6">Share at least one question you'd like guidance on.</p>

        <div className="space-y-4 flex-1">
          {QUESTION_PLACEHOLDERS.map((placeholder, index) => (
            <div key={index}>
              <label htmlFor={`question-${index}`} className="block text-sm font-medium text-gray-700 mb-1.5">
                Question {index + 1} <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id={`question-${index}`}
                rows={2}
                value={questions[index]}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                placeholder={placeholder}
                className={`${inputClasses(false)} resize-none`}
              />
            </div>
          ))}
        </div>

        {errors.questions && <p className="mt-3 text-sm text-red-500">{errors.questions}</p>}

        <p className="mt-6 text-xs text-gray-400 leading-relaxed">
          Tarot readings are intended for personal reflection and guidance, not guaranteed predictions.
        </p>
      </div>

      {/* -------------------- Submit -------------------- */}
      <div className="lg:col-span-2 flex flex-col items-center">
        {errors.submit && <p className="mb-3 text-sm text-red-500">{errors.submit}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-semibold text-base shadow-md hover:bg-primary/90 hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          {isSubmitting ? 'Submitting...' : 'Submit Tarot Request'}
        </button>

        {/* -------------------- Payment QR code --------------------
            To use your own QR code: replace src/assets/payment-qr.jpg
            with your image (keep the same filename, or update the
            import path above). */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-amber-100 px-6 py-6 text-center max-w-xs w-full">
          <p className="text-sm font-medium text-gray-600 mb-4">Scan to pay</p>
          <img
            src={paymentQrImage}
            alt="QR code for payment"
            className="w-64 h-64 sm:w-64 sm:h-64 mx-auto rounded-lg object-contain border border-gray-200 p-2"
          />
        </div>
      </div>
    </form>
  );
};

export default TarotRequestForm;