// src/components/HomePhotos.js
import React, { useState } from 'react';
import { FaArrowRight, FaEye ,FaShareAlt} from 'react-icons/fa';
import FullScreenModal from './FullscreenModal';
import useLatestPhotosBlog from '../hooks/useLatestPhotosBlog';
import SocialShare from './SocialShare';
const HomePhotos = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);
const [showShareModal, setShowShareModal] = useState(false);
 const [showShareModalLink, setShowShareModalLink] = useState("");

  const {
    photosBlogs,
    photosBlogLoading,
    loadMore,
    hasMore
  } = useLatestPhotosBlog();
  
 function createShareLink(blog) {
  if (!blog || !blog.slug || !blog.timestamp) return;

  // Convert Firestore timestamp safely
  const blogId = typeof blog.timestamp === 'object' && blog.timestamp?.toMillis
    ? blog.timestamp
    : blog.timestamp;

  const shareableLink = `${window.location.origin}/readblog/${blogId}/${blog.slug}`;

  setShowShareModalLink(shareableLink); // ✅ Pass link to state
  setShowShareModal(true);              // ✅ Trigger modal to show
}

  return (
    <div className="p-4 md:p-8 bg-white rounded-lg shadow-sm">
    

      {/* Loading State */}
      {photosBlogLoading && (
        <p className="text-gray-500 text-center">Loading...</p>
      )}

      {/* Blogs Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {photosBlogs.map((blog) => (
          <div
            key={blog.timestamp}
            className="border rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-lg transition"
          >
            <img
                src={blog.image_url}
                alt={blog.header}
                className="w-full h-[350px] md:h-[450px] lg:h-[450px] object-cover rounded-lg transition-transform duration-300 hover:scale-105"

                onClick={() => setSelectedBlog(blog)}
                />
            <div className="p-4 bg-gray-100">
              <h2 className="text-2xl font-medium mb-2">{blog.header}</h2>
              <p className="text-sm text-gray-500 mb-4">
                {new Date(blog?.timestamp).toDateString()}
              </p>
              <div className="flex justify-right items-center">
                 
                
                  

                 <FaShareAlt
                  className="text-blue-500 hover:text-green-700 cursor-pointer mr-7"
                  onClick={() => createShareLink(blog)} // define this function
                  title="Share Blog"
                />

                <FaEye
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                  onClick={() => setSelectedBlog(blog)}
                  title="Read More"
                />
              </div>
            </div>
          </div>
        ))}
        
      </div>

      {/* Show More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            Show More {hasMore}<FaArrowRight className="ml-2" />
          </button>
        </div>
      )}

      {/* Fullscreen Modal */}
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
