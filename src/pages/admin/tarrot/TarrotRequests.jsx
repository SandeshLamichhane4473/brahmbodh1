
import { useEffect, useState } from 'react';
import { db } from "../../../firebase/config";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { X, Download, CheckCircle, Lock } from 'lucide-react';

const STATUS_OPTIONS = ['new', 'pending', 'rejected', 'completed'];

const STATUS_STYLES = {
  new: 'bg-amber-50 text-amber-700 border-amber-200',
  pending: 'bg-blue-50 text-blue-600 border-blue-200',
  rejected: 'bg-red-50 text-red-600 border-red-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
};

const FINAL_STATUSES = ['rejected', 'completed'];

const formatStatus = (status) =>
  status.charAt(0).toUpperCase() + status.slice(1);

export default function TarotRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Update status in Firestore.
  // Rejected and completed requests cannot be changed again.
  const handleStatusChange = async (id, newStatus) => {
    const currentRequest = requests.find((r) => r.id === id);

    if (
      !currentRequest ||
      FINAL_STATUSES.includes(currentRequest.status) ||
      !STATUS_OPTIONS.includes(newStatus)
    ) {
      return;
    }

    setUpdatingId(id);

    try {
      await updateDoc(doc(db, 'tarot_requests', id), {
        status: newStatus,
      });

      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: newStatus } : r
        )
      );

      setSelected((prev) =>
        prev && prev.id === id
          ? { ...prev, status: newStatus }
          : prev
      );
    } catch (error) {
      console.error('Status update error:', error);
      alert('Could not update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Download photo.
  const downloadPhoto = async (url, filename) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Could not fetch image');
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
    } catch (error) {
      console.error('Photo download error:', error);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Fetch requests.
  useEffect(() => {
    async function fetchRequests() {
      try {
        const snap = await getDocs(
          query(
            collection(db, 'tarot_requests'),
            orderBy('createdAt', 'desc')
          )
        );

        const data = snap.docs.map((docSnap, index) => {
          const request = docSnap.data();

          return {
            id: docSnap.id,
            sn: index + 1,
            ...request,
            status: request.status || 'new',
            questions: Array.isArray(request.questions)
              ? request.questions
              : [],
            additionalPhotoUrls: Array.isArray(
              request.additionalPhotoUrls
            )
              ? request.additionalPhotoUrls
              : [],
            createdAtLabel:
              request.createdAt?.toDate().toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }) || '—',
          };
        });

        setRequests(data);
      } catch (error) {
        console.error('Error fetching tarot requests:', error);
        alert('Could not load tarot requests. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, []);

  // Search.
  const filtered = requests.filter((r) =>
    [
      r.fullName,
      r.phone,
      r.address,
      ...r.questions,
    ]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        Loading tarot requests...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Tarot Requests
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {requests.length} request(s) received
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, question..."
          className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-400/40 w-full sm:w-80"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No tarot requests found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Address</th>
                <th className="px-4 py-3 font-semibold">Questions</th>
                <th className="px-4 py-3 font-semibold">Submitted</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => {
                const isFinal = FINAL_STATUSES.includes(r.status);

                return (
                  <tr
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className="bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 text-gray-400 font-mono">
                      {r.sn}
                    </td>

                    <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">
                      {r.fullName || '—'}
                    </td>

                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {r.phone || '—'}
                    </td>

                    <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">
                      {r.address || '—'}
                    </td>

                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {r.questions.length} question(s)
                    </td>

                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {r.createdAtLabel}
                    </td>

                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2">
                        <select
                          value={r.status}
                          disabled={isFinal || updatingId === r.id}
                          onChange={(e) =>
                            handleStatusChange(r.id, e.target.value)
                          }
                          aria-label={`Status for ${r.fullName || 'request'}`}
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold outline-none ${
                            STATUS_STYLES[r.status] || STATUS_STYLES.new
                          } ${
                            isFinal
                              ? 'cursor-not-allowed opacity-75'
                              : 'cursor-pointer'
                          } disabled:opacity-75`}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {formatStatus(status)}
                            </option>
                          ))}
                        </select>

                        {isFinal && (
                          <Lock
                            size={14}
                            className="text-gray-400 shrink-0"
                            title="Final status locked"
                          />
                        )}

                        {updatingId === r.id && (
                          <span className="text-xs text-gray-400">
                            Saving...
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Details modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-2 sm:p-5 overflow-y-auto"
          onClick={() => setSelected(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Tarot request details"
            className="bg-white rounded-2xl shadow-xl max-w-5xl w-full p-4 sm:p-8 relative my-3 sm:my-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 pr-10">
              Tarot Request Details
            </h2>

            {/* Larger profile photo: show the entire image */}
            <div className="mb-8">
              {selected.profilePictureUrl ? (
                <div className="bg-gray-100 rounded-xl border border-gray-200 p-2 sm:p-4">
                  <img
                    src={selected.profilePictureUrl}
                    alt={selected.fullName || 'Profile'}
                    className="w-full max-h-[75vh] min-h-[300px] sm:min-h-[400px] object-contain rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      downloadPhoto(
                        selected.profilePictureUrl,
                        'tarot-profile-photo.jpg'
                      )
                    }
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-700"
                  >
                    <Download size={17} />
                    Download profile photo
                  </button>
                </div>
              ) : (
                <div className="h-48 rounded-xl bg-amber-50 border border-dashed border-amber-200 flex items-center justify-center text-gray-400">
                  No profile photo available
                </div>
              )}
            </div>

            {/* Customer information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Full name</p>
                <p className="text-gray-800 font-semibold break-words">
                  {selected.fullName || '—'}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">Phone</p>
                <p className="text-gray-800">
                  {selected.phone || '—'}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-gray-400 text-sm mb-1">Address</p>
                <p className="text-gray-800 break-words">
                  {selected.address || '—'}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">Submitted</p>
                <p className="text-gray-800">
                  {selected.createdAtLabel}
                </p>
              </div>
            </div>

            {/* Status controls */}
            <div className="mb-7 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <label
                htmlFor="modal-status"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Request status
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  id="modal-status"
                  value={selected.status}
                  disabled={
                    FINAL_STATUSES.includes(selected.status) ||
                    updatingId === selected.id
                  }
                  onChange={(e) =>
                    handleStatusChange(selected.id, e.target.value)
                  }
                  className={`rounded-lg border px-4 py-2.5 text-sm font-semibold outline-none ${
                    STATUS_STYLES[selected.status] || STATUS_STYLES.new
                  } disabled:cursor-not-allowed disabled:opacity-75`}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {formatStatus(status)}
                    </option>
                  ))}
                </select>

                {FINAL_STATUSES.includes(selected.status) ? (
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                    <Lock size={15} />
                    Final status locked
                  </span>
                ) : updatingId === selected.id ? (
                  <span className="text-sm text-gray-400">
                    Saving...
                  </span>
                ) : null}
              </div>

              {selected.status === 'completed' && (
                <p className="text-sm text-green-700 mt-3">
                  <CheckCircle size={15} className="inline mr-1" />
                  This request has been completed.
                </p>
              )}

              {selected.status === 'rejected' && (
                <p className="text-sm text-red-600 mt-3">
                  This request has been rejected.
                </p>
              )}
            </div>

            {/* Questions */}
            <div className="mb-8">
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                Questions ({selected.questions.length})
              </h3>

              {selected.questions.length ? (
                <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700">
                  {selected.questions.map((question, i) => (
                    <li key={i} className="break-words">
                      {question}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-gray-400">
                  No questions submitted.
                </p>
              )}
            </div>

            {/* Additional photos: large, uncropped, downloadable */}
            {selected.additionalPhotoUrls.length > 0 && (
              <div className="mb-8">
                <h3 className="text-base font-semibold text-gray-800 mb-4">
                  Additional Photos ({selected.additionalPhotoUrls.length})
                </h3>

                <div className="space-y-6">
                  {selected.additionalPhotoUrls.map((url, i) => (
                    <div
                      key={`${url}-${i}`}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-2 sm:p-4"
                    >
                      <p className="text-sm font-medium text-gray-500 mb-3">
                        Photo {i + 1}
                      </p>

                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        title="Open full-size image"
                        className="block"
                      >
                        <img
                          src={url}
                          alt={`Additional upload ${i + 1}`}
                          loading="lazy"
                          className="w-full max-h-[80vh] min-h-[300px] sm:min-h-[400px] object-contain rounded-lg"
                        />
                      </a>

                      <button
                        type="button"
                        onClick={() =>
                          downloadPhoto(
                            url,
                            `tarot-additional-photo-${i + 1}.jpg`
                          )
                        }
                        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        <Download size={17} />
                        Download photo {i + 1}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-5 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
