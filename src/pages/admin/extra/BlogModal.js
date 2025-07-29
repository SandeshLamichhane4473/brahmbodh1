import React from "react";
import { useState,useEffect } from "react";
import { db } from "../../../firebase/config";
import { updateDoc } from "firebase/firestore";
 import { doc } from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
 
const BlogModal = ({ isOpen, onClose, blog, setBlog ,onBlogUpdate}) => {
const [bodyHtml, setBodyHtml] = useState("");

    const [updating, setUpdating] = useState(false);
  const { user} = useAuth();



const fetchBodyHTML = async (url) => {
  try {
    const res = await fetch(url);
     
    if (!res.ok) throw new Error("Failed to fetch body HTML");
    return await res.text();
  } catch (error) {
     
    alert("Error fetching HTML body:", error);
    return "";
  }
};


useEffect(() => {
  const loadBody = async () => {
    if (!blog?.body_url) return;
    const html = await fetchBodyHTML(blog.body_url);
    setBodyHtml(html);
  };

  loadBody();
}, [blog?.body_url]);


  if (!isOpen) return null;



  const handleConfirm = async () => {
    try {
      setUpdating(true);

      const blogRef = doc(db, "blogs",   String(blog.timestamp)); // or blog.blog_id if using blog_id as doc ID
     const currentChecker = blog.checker || "";
      const newChecker =  user?.email || "unknown";

    const updatedChecker = currentChecker
      ? `${currentChecker}, ${newChecker}`
      : newChecker;
   
   const updatedBlog = {
          ...blog,
          checker: updatedChecker,
          status: 'C',
        };
    await updateDoc(blogRef,updatedBlog);
         alert("Confirmed.")
         setBlog(updatedBlog);          // update local modal blog
        onBlogUpdate(updatedBlog);     // update list in Blog.js
  
    } catch (err) {
        alert(err)
        console.log(err)
    } finally {
      setUpdating(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Blog Details</h2>

        {blog ? (
          <div className="space-y-4">
            <p><strong>ID:</strong> {blog.blog_id}</p>
            <p><strong>Slug:</strong> {blog.slug}</p>
            <p><strong>Header:</strong> {blog.header}</p>
            <p><strong>Category:</strong> {blog.category}</p>
            <p><strong>Creator:</strong> {blog.creator}</p>
            <p><strong>Checker:</strong> {blog.checker}</p>
            <p><strong>Visible:</strong> {blog.visible}</p>
            <p><strong>Status:</strong> {blog.status}</p>
            <p><strong>Date:</strong> {new Date(blog.timestamp).toLocaleDateString()}</p>

            <div>
              <strong>Image:</strong>
              {blog.image_url ? (
                <img src={blog.image_url} alt="blog" className="mt-2 w-full max-h-64 object-contain border rounded" />
              ) : (
                <p className="text-gray-500">No image available</p>
              )}
            </div>

            <div>
              <strong>Body Content:</strong>
              {/* <div className="w-full h-[400px] mt-2 border rounded overflow-hidden"> */}
               {/* <div className="w-full min-h-[400px] mt-2 border rounded p-4 overflow-auto bg-gray-50"> */}
                  <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
                {/* </div>
              </div> */}
            </div>
          </div>
        ) : (
          <p>Loading blog info...</p>
        )}

 
        
   
        <div className="mt-4 flex justify-end gap-1">
             {(blog.status === "U") && (
            <button
              onClick={handleConfirm}
              disabled={updating}
              className="bg-secondary text-white px-4 py-2 rounded hover:bg-green-800"
            >
              {updating ? "Confirming..." : "Confirm"}
            </button>
          )}
       
       
         <div className="w-10"></div>
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2  rounded hover:bg-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogModal;
