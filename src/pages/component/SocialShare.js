// src/components/SocialShare.js
import React from "react";

const SocialShare = ({ link, onClose }) => {
//   if (!blogId || !slug) return null;

  const shareableLink = link;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    alert("Link copied to clipboard!");
    onClose()
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative">
        {/* Modal Header */}
        <h2 className="text-xl font-semibold text-center mb-4">🔗 Share this Link</h2>

        {/* Input and Copy Button */}
        <div className="flex items-center space-x-2 mb-6">
          <input
            type="text"
            value={shareableLink}
            readOnly
            className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm"
          />
          <button
            onClick={copyToClipboard}
            className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
          >
            Copy
          </button>
        </div>

        {/* Close Button (Top Right X) */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-600 hover:text-black text-xl font-bold"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default SocialShare;

// const shareableLink = `${window.location.origin}/readblog/${blog.id}/${blog.slug}`;
