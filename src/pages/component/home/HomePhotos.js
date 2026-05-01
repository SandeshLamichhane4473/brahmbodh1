// src/components/HomePhotos.js
import React, { useState } from 'react';
import { FaArrowRight, FaEye, FaShareAlt } from 'react-icons/fa';
import FullScreenModal from '../FullscreenModal';
import useLatestPhotosBlog from '../../hooks/useLatestPhotosBlog';
import SocialShare from '../SocialShare';

const HomePhotos = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showShareModalLink, setShowShareModalLink] = useState("");

  const { photosBlogs, photosBlogLoading, loadMore, hasMore } = useLatestPhotosBlog();

  function createShareLink(blog) {
    if (!blog || !blog.slug || !blog.timestamp) return;
    const shareableLink = `${window.location.origin}/readblog/${blog.timestamp}/${blog.slug}`;
    setShowShareModalLink(shareableLink);
    setShowShareModal(true);
  }

  return (
    <div className="p-4 md:p-8 bg-white rounded-lg shadow-sm">

      {photosBlogLoading && (
        <p className="text-gray-500 text-center">Loading...</p>
      )}

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
  {photosBlogs.map((blog) => (
    <div
      key={blog.timestamp}
      className="group bg-white border border-neutral-200 rounded-xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-neutral-400 shadow-lg"
    >
      {/* Image with overlay on hover */}
   <div className="relative w-full overflow-hidden bg-neutral-100">
  <img
    src={blog.image_url}
    alt={blog.header}
    className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
    onClick={() => setSelectedBlog(blog)}
  />
        <div
          className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-center justify-center"
          onClick={() => setSelectedBlog(blog)}
        >
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
            <FaEye className="text-neutral-700 text-sm" />
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1 gap-1">
    

      <h2 className="font-serif text-2xl sm:text-2xl lg:text-2xl leading-snug text-neutral-900 line-clamp-2 mb-0.5">
          {blog.header}
        </h2>

        <p className="text-[11px] uppercase tracking-widest text-neutral-400">
          {new Date(blog?.timestamp).toDateString()}
        </p>

        <hr className="my-1 border-neutral-200" />

        {/* Actions */}
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => createShareLink(blog)}
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-800 border border-neutral-200 hover:border-neutral-400 rounded-full px-3 py-1.5 transition-all duration-200 bg-transparent hover:bg-neutral-50"
            title="Share"
          >
            <FaShareAlt className="text-[11px]" />
            Share
          </button>
          <button
            onClick={() => setSelectedBlog(blog)}
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-800 border border-neutral-200 hover:border-neutral-400 rounded-full px-3 py-1.5 transition-all duration-200 bg-transparent hover:bg-neutral-50"
            title="Read More"
          >
            <FaEye className="text-[11px]" />
            View
          </button>
          
        </div>
      </div>
    </div>
  ))}
</div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            Show More <FaArrowRight className="ml-2" />
          </button>
        </div>
      )}

      {selectedBlog && (
        <FullScreenModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
      )}

      {showShareModal && (
        <SocialShare
          link={showShareModalLink}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default HomePhotos;