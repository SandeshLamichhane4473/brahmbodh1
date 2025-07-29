// src/pages/ViewBlog.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useBlogIdDetails from '../hooks/useBlogIdDetails';
import {  FaShareAlt} from 'react-icons/fa'; 
import SocialShare from '../component/SocialShare';
import useLatestBlogs
 from '../hooks/useLatestBlogs';
 
const ViewBlog = () => {
  const { id: fullId } = useParams();
  const blogId = fullId.split('/')[0]; // Handles slug by splitting at slash
 
  const { blogIdDetails: blog, loadingId, htmlBody } = useBlogIdDetails(blogId);
  const { latestBlogs, loading } = useLatestBlogs();
   


    const [showShareModal, setShowShareModal] = useState(false);
   const [showShareModalLink, setShowShareModalLink] = useState("");




    useEffect(() => {
  if (blog?.header) {
    document.title = `${blog.header} | ब्रह्मबोध`;
  }

  return () => {
    document.title = "ब्रह्मबोध";
  };
}, [blog?.header]);


 function createShareLink(blog) {
  if (!blog || !blog.slug || !blog.timestamp) return;
  const blogId = typeof blog.timestamp === 'object' && blog.timestamp?.toMillis
    ? blog.timestamp
    : blog.timestamp;
  const shareableLink = `${window.location.origin}/readblog/${blogId}/${blog.slug}`;
  setShowShareModalLink(shareableLink); // ✅ Pass link to state
  setShowShareModal(true);              // ✅ Trigger modal to show
}


  



  if (loadingId) return <p>Loading blog...</p>;



  return (
 <div className="bg-gray-100 min-h-screen py-10">
  <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-10 gap-1">
    {/* Column 1: Blog Content - now spans more columns */}
    {!blog ?(<> <h1 className="text-2xl px-5  font-semibold text-gray-800">Oops! 😎✨ </h1></>):(
    <div className="col-span-1 lg:col-span-8 bg-gray-100   bg-white p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        {blog?.header}
      </h1>
          <p className="text-sm text-gray-500 mb-4 flex items-center flex-wrap gap-2">
          📅 {new Date(blog?.timestamp).toDateString()} | 🏷 {blog?.category}
          <FaShareAlt
            className="text-gray-500 hover:text-gray-400 cursor-pointer ml-2"
            onClick={() => createShareLink(blog)}
            title="Share Blog"
          />
        </p>


        
      <img
        src={blog?.image_url}
        alt={blog.header}
        className="w-full max-h-[500px] object-contain rounded-md shadow mb-6"
      />

      <div
        dangerouslySetInnerHTML={{ __html: htmlBody }}
        className="prose prose-lg max-w-none mt-6"
      />
    </div>
    )}

    {/* Column 2: Recent Blogs - adjusted span */}

    <div className="col-span-1 lg:col-span-2 bg-gray-100    p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Recent Blogs  </h3>
      
              {
          loading? <p>Loading latest blogs...</p> :
          latestBlogs.length === 0? <p>No blogs found.</p>:
          !latestBlogs ?<>😎✨</>:
          <ul className="space-y-4">
        {latestBlogs.map((b) => (
          <li key={b.timestamp}>
            <a
              href={`/readblog/${b.timestamp}/${b.slug || ''}`}
              className="text-blue-600 hover:underline font-medium"
            >
              {b.header}
            </a>
            <p className="text-sm text-gray-500">
              {new Date(b?.timestamp).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
      }
      


    </div>
  </div>
   {showShareModal && (
                <SocialShare
                  link={showShareModalLink}
                  onClose={() => setShowShareModal(false)}
                />
              )}
          
</div>

 


  );
};

export default ViewBlog;
