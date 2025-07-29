import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
 
import { FaDownload } from "react-icons/fa";
import BlogModal from "./extra/BlogModal";
import VisibilityModal from "./extra/VisibilityModal";
 
import useLatestCategories  from "../hooks/useCategories";
import useAllBlogAdmin from "../hooks/useAllBlogAdmin";
 
 

const Blogs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
 
   const [showModal, setShowModal] = useState(false);
  
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [showVisibilityModal, setShowVisibilityModal] = useState(false);
   
    const [selectedCategory, setSelectedCategory]= useState("")
     const[filteredBlogs,setFilteredBlogs]=useState(null)

   const { categoriesList } = useLatestCategories();
 const {
   allBlogs,
  loadingaLLBlogs,
  loadMore,
  hasMore
} = useAllBlogAdmin(selectedCategory); 
 

  const handleConfirmClick = async (id) => {
    try {
        const blog = allBlogs.find((b) => b.timestamp === id);
       setSelectedBlog(blog);
        setShowModal(true);
    } catch (error) {
      console.error("Error fetching blog:", error);
      alert(error)
    }
  };

 
   useEffect(() => {
  setFilteredBlogs(allBlogs);
}, [allBlogs]);


  const handleDelete = (id) => {
     
  };

  
/// trim the user name
        const trimText = (text, wordLimit = 5) => {
          if (!text) return "";
          return  text.slice(0, 10)+" ";
        };

        // this one for updating the filtered update

    const handleBlogUpdate = (updatedBlog) => {
      try{
        setFilteredBlogs((prev) =>
          prev.map((b) =>
            b.timestamp === updatedBlog.timestamp ? updatedBlog : b
          )
        );
        setSelectedBlog(updatedBlog); // also update modal
      }
   
    catch(e){
      console.log(e); alert(e)
    }
  }
 
 
   if (loadingaLLBlogs) return <div className="text-center mt-10">Loading...</div>;
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Blogs List</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          disabled
          type="text"
          placeholder="Search by course name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full md:w-1/2"
        />
 
    <div className="flex">
  {!categoriesList || Object.keys(categoriesList).length === 0 ? (
    <p className="text-gray-400">No categories yet.</p>
  ) : (
    <select
      name="category"
      value={selectedCategory}
      onChange={(e) => {
        setSelectedCategory(e.target.value);
   
      }}
      className="border px-3 py-2 rounded w-full"
    >
      <option value="" disabled>
        Select a category
      </option>
      {Object.entries(categoriesList)
        // 🔥 filter out "home"
        .map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
    </select>
  )}
</div>


        {/* add new button  */}
        <div className="">
            <button
              onClick={() => navigate("/admin/addblog")}
              className="bg-secondary text-white px-4 py-2 rounded hover:bg-primary"
            >
              + Add New Blog
            </button>
 

          </div>
      </div>

 



      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr className="text-sm text-left">
              <th className="p-2 border">Blog Id</th>
              <th className="p-2 border">Header</th>
      
              {/* <th className="p-2 border">Slug</th> */}
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Img</th>
               <th className="p-2 border">Main</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
               <th className="p-2 border">visible</th>

              <th className="p-2 border">Creator</th>
              <th className="p-2 border">Checker</th>
               <th className="p-2 border">Manage</th>
               
   
            
              
            </tr>
          </thead>
          <tbody>
               {filteredBlogs.map((blog, index) => (
                  <tr key={blog.timestamp} className="text-sm hover:bg-gray-50">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{blog.header}</td>
                   
                    {/* <td className="p-2 border">{blog.slug}</td> */}
                    <td className="p-2 border">{blog.category}</td>
                    <td className="p-2 border">
                    {blog.image_url ? (
                      <a
                        href={blog.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>


                    <td className="p-2 border">
                    {blog.body_url ? (
                      <a
                        href={blog.body_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        <FaDownload className="text-sm text-secondary cursor-pointer" />
                      </a>
                    ) : (
                      " ### "
                    )}
                  </td>


                     
                    <td className="p-2 border">{new Date(blog.timestamp).toLocaleDateString()}</td>
                      <td className="p-2 border">{blog.status || "_"}</td>
                        {/*  make trhe visiblity */}
                      <td
                        onClick={() => {
                         //check the permisiion first 
                      
                          setSelectedBlog(blog);
                         
                          setShowVisibilityModal(true);
                        }}
                        className="p-2 border text-blue-600 cursor-pointer hover:underline"
                      >
                       {!blog.visible ? "—" : blog.visible === "private" ? "No" : blog.visible}


                      </td>



                    <td className="p-2 border whitespace-nowrap overflow-hidden text-ellipsis">{trimText(blog.creator, 4)}</td>
                  
                    <td
                        onClick={() => {
                          if (blog.status === "U") {
                            handleConfirmClick(blog.timestamp);
                          }
                        }}
                        className={`p-2 border cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis ${
                          blog.status === "U" ? "hover:underline text-blue-600" : "text-gray-800"
                        }`}
                      >
                        {blog.status === "U"
                          ? "Confirm"
                          : trimText(blog.checker, 4)}
                      </td>

                    
                    <td className="p-2 border flex gap-2">
                       <button
                        onClick={() => handleConfirmClick(blog.timestamp) }
                        className="text-blue-600 hover:underline"
                      >View</button>
                      <button
                        onClick={() => navigate(`/admin/editblog/${blog.timestamp}`)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog.timestamp)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
    {/*  here is the code tfor the  show modal :  */}
              
           
           {/* For the Loading and filtered */}

                            {loadingaLLBlogs && (
                    <tr>
                      <td colSpan="13" className="text-center p-4 text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  )}

                  {!loadingaLLBlogs && allBlogs.length === 0 && (
                    <tr>
                      <td colSpan="13" className="text-center p-4 text-gray-500">
                        No blogs found.
                      </td>
                    </tr>
                  )}


          </tbody>
        </table>

        {hasMore && (
            <div className="flex justify-center mt-4">
              <button
                onClick={loadMore}
                className="bg-secondary text-white px-4 py-2 rounded hover:bg-primary"
              >
                Load More
              </button>
            </div>
          )}

      </div>

            <BlogModal         
               isOpen={showModal}
              onClose={() => setShowModal(false)}
              blog={selectedBlog}
              setBlog={setSelectedBlog}
                onBlogUpdate={handleBlogUpdate}
            />

            <VisibilityModal
            isOpen={showVisibilityModal}
            blog={selectedBlog}
            onClose={() => setShowVisibilityModal(false)}
            onUpdated={(updatedBlog) => {
              setFilteredBlogs((prev) =>
                prev.map((b) =>
                  b.timestamp === updatedBlog.timestamp ? updatedBlog : b
                )
              );
            }}
          />

    </div>
  );
};

export default   Blogs 
;
