import { useState } from "react";
import { db } from "../../../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function JoinModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name:"",
    phone_number: "",
    email: "",
    facebook_url: "",
    remarks: "",
  });
  const [errors, setErrors] = useState({});

  function validate() {
    const newErrors = {};
    if (!form.phone_number.trim()) newErrors.phone_number = "फोन नम्बर आवश्यक छ";
    if (!form.name.trim()) newErrors.name = "नाम आवश्यक छ";
    // if (!form.email.trim()) newErrors.email = "इमेल आवश्यक छ";
    // else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "मान्य इमेल लेख्नुहोस्";
    return newErrors;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  async function handleSubmit() {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "join_requests"), {
        ...form,
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setForm({ name: "", phone_number: "", email: "", facebook_url: "", remarks: "" });
    } catch (e) {
      console.error("Failed to save:", e);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setSuccess(false);
    setErrors({});
    setForm({ phone_number: "", email: "", facebook_url: "", remarks: "" });
  }

  return (
    <>
      {/* Trigger Button */}
                <button
                onClick={() => setOpen(true)}
                className="bg-primary hover:opacity-90 active:scale-95 transition-all duration-150 text-white font-semibold px-6 py-2.5 rounded-lg shadow-md flex items-center gap-2 mx-auto"
                style={{ fontFamily: "'Noto Sans Devanagari', Arial, sans-serif" }}
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <line x1="19" y1="8" x2="19" y2="14"/>
                    <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
                जोडिनुहोस्
                </button>

      {/* Modal Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          {/* Modal Box */}
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
            style={{ fontFamily: "'Noto Sans Devanagari', Arial, sans-serif" }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl leading-none"
            >
              ✕
            </button>

            {success ? (
              /* Success State */
              <div className="flex flex-col items-center py-8 gap-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">
                  ✓
                </div>
                <h2 className="text-xl font-bold text-gray-800 text-center">
                  धन्यवाद!
                </h2>
                <p className="text-gray-500 text-center text-sm">
                  तपाईंको जानकारी सफलतापूर्वक पठाइयो। हामी चाँडै सम्पर्क गर्नेछौं।
                </p>
                <button
                  onClick={handleClose}
                  className="mt-2 bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  बन्द गर्नुहोस्
                </button>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-gray-800">
                    हाम्रो शिक्षासंग जोडिनुहोस्
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    तलको फारम भर्नुहोस् र हामीसँग जोडिनुहोस्।
                  </p>
                </div>

                <div className="flex flex-col gap-4">

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                     तपाइको नाम <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="सपना ..."
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition
                        ${errors.phone_number ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                     तपाइको  फोन नम्बर <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={form.phone_number}
                      onChange={handleChange}
                      placeholder="९८XXXXXXXX"
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition
                        ${errors.phone_number ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errors.phone_number && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      इमेल <span className="text-red-500"></span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition
                        ${errors.email ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Facebook */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      फेसबुक प्रोफाइल लिंक
                    </label>
                    <input
                      type="url"
                      name="facebook_url"
                      value={form.facebook_url}
                      onChange={handleChange}
                      placeholder="https://facebook.com/yourprofile"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition"
                    />
                  </div>

                  {/* Remarks */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                       सहित थप जानकारी / कैफियत
                    </label>
                    <textarea
                      name="remarks"
                      value={form.remarks}
                      onChange={handleChange}
                      rows={3}
                      placeholder="यहाँ लेख्नुहोस्..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                  >
                    {loading ? "पठाउँदै..." : "पठाउनुहोस्"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}