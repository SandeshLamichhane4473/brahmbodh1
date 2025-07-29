import React, { useState } from 'react';
import FullScreenModal from '../component/FullscreenModal';
import { useNavigate } from 'react-router-dom';
import useLatestCategories from '../hooks/useCategories';
import useAllBlog from '../hooks/useAllBlog';
 

const Blog  = () => {
 
  
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { categoriesList, loadingCategories } = useLatestCategories();
   
const {
  allBlogs,
  loadingaLLBlogs,
  loadMore,
  hasMore
} = useAllBlog(selectedCategory); //
  
 
  ///////////////// FOR MODAL
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

 

  const openModal = (blog) => {
    setSelectedBlog(blog);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBlog(null);
  };// For modal
 
   const handleRead = (id,slug) => {
    navigate(`/readblog/${id}/${slug}`);
   }

const handleCategorySearch = (key) => {
  
  setSelectedCategory(key); // Triggers useEffect inside hook
};



  if (loadingaLLBlogs) return <p className="text-center mt-10">Loading blogs...</p>;
 

  return (
    <div className="min-h-screen bg-[#fef9f2] p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Sidebar */}

         
        <aside className="md:w-1/4 mt-16">
          <div className="bg-white rounded-lg shadow p-4">
            <input
              type="text"
              placeholder="Search title..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full p-2 border rounded mb-6"
            />
            <h2 className="text-xl font-bold mb-2">📂 Categories</h2>
                                <div className="flex">
                          {
                          loadingCategories?<></>:
                          !categoriesList || Object.keys(categoriesList).length === 0 ? (
                            <p className="text-gray-400">No categories yet.</p>
                          ) : (
                            <ul className="space-y-2">
                              {Object.entries(categoriesList)
                                .filter(([key, _]) => key !== "home") // 🔥 Skip the "home" key
                                .map(([key, value]) => (
                                  <li
                                    key={key}
                                    onClick={() => {
                                     setSelectedCategory(key);
                                     handleCategorySearch?.(key); // optional if needed
                                    }}
                                    className={`cursor-pointer px-3 py-2 rounded hover:bg-gray-100 ${
                                      selectedCategory === key ? 'bg-amber-200 font-semibold' : ''
                                    }`}
                                  >
                                    {value}
                                  </li>
                                ))}
                            </ul>
                          )}
                                            </div>
             
           


          </div>
        </aside>

        {/* Blog Grid */}
        <main className="md:w-4/4">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">📝 Blog Posts</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allBlogs.map((blog) => (
                <div
                  key={blog.timestamp}
                  onClick={() => handleRead(blog.timestamp, blog.slug)} // click on card redirects
                  className="cursor-pointer bg-white border rounded-xl p-4 shadow hover:shadow-lg transition"
                >
                  {/* Image click opens modal */}
                  {blog.image_url && (
                    <img
                      src={blog.image_url}
                      alt="Blog"
                      className="w-98 h-60 object-cover rounded mb-3"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent card click
                        openModal(blog);
                      }}
                    />
                  )}

                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{blog.header}</h2>
                  <p className="text-sm text-gray-500">
                    📅 {blog.timestamp} | 🏷 {blog.category} |  <span className='text-blue-500 cursor-pointer underline'  onClick={() => handleRead(blog.timestamp, blog.slug)}>Read More</span>
                  </p>
                </div>
              ))}

      </div>

       
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                className="bg-primary text-white px-6 py-2 rounded-full hover:bg-amber-600 transition"
              >
                Load More
              </button>
            </div>
          )}

         
        </main>
      </div>

      
  
      {/* Full Screen Modal */}
      {modalOpen && selectedBlog && (
        <FullScreenModal blog={selectedBlog} onClose={closeModal} />
      )}
    </div>
  );
};

export default Blog;
