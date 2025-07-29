// src/components/FullscreenModal.js
import React from 'react';
import { useState , useEffect} from 'react';
import { fetchBlogBody } from './fetchBlogBody';
  
const FullScreenModal = ({ blog, onClose }) => {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    if (blog?.body_url) {
      fetchBlogBody(blog.body_url).then(setHtmlContent);
    }
  }, [blog]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-start overflow-y-auto pt-10">
      <div className="bg-white w-full max-w-6xl mx-4 rounded-lg shadow-lg relative p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-3xl font-bold z-50"
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="text-3xl font-bold mb-4 text-center">{blog.header}</h2>

        {/* Image */}
        {blog.image_url && (
       <img
            src={blog.image_url}
            alt={blog.header}
            className="rounded mb-6"
            style={{ width: 'auto', height: 'auto', maxWidth: '100%' }} // Responsive: shrink if wider than screen
          />

        )}

        {/* Blog Content from .txt */}
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
};

export default FullScreenModal;
