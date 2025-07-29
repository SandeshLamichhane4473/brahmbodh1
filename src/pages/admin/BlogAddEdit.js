import React, { useEffect, useState,useCallback,useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RichTextEditor from "../component/RichTextEditor";
import { db } from "../../firebase/config";
import { doc,setDoc,getDoc } from "firebase/firestore";
 
import 'jodit/es2021/jodit.min.css';
import { getNextCounterValue } from "./extra/getNextCounterValue";
import { useAuth } from "../../context/AuthContext";
 
import { ref, uploadString, getDownloadURL, uploadBytes } from 'firebase/storage';
import { storage } from "../../firebase/config";
import useLatestCategories from "../hooks/useCategories";
const generateTimestampId = () => new Date().valueOf();

 
const getInitialBlog = () => {
  const timestamp_id = generateTimestampId();
  return {
    
    header: "",
    slug: "",
    category: "",
    category_primary_id: "",
    timestamp: timestamp_id,
    creator: "",
    checker:"",
    update_log: "",  //updated by Sandesh at Dat1-1,updated by ABC at dsate-2,
    update_log_backup:"", // only last update file
    body_url: "",
    image_url:"",
    last_update_by: "",
    approve_remarks: "",
    visible: "private",
    
    status: "U"
  };
};


const AddEditBlog = ({ blogs = [], onSave }) => {
  const [text, setText] = useState('');
 

 const { blogId } = useParams();
  const isEdit = Boolean(blogId);


  const navigate = useNavigate();
  const [formData, setFormData] =  useState(getInitialBlog());
  const [loading, setLoading] = useState(false);
  const { user} = useAuth();
  const [imageFile, setImageFile] = useState(null); // holds the selected image
 const [imagePreview, setImagePreview] = useState(null);
 const imagePreviewUrlRef = useRef(null);


  const { categoriesList } = useLatestCategories();




const clearRichText=()=>{
  setText('')
}


const clearImageFile=()=>{
  setImageFile(null);
  setImagePreview(null)
}

/// if the file is for updating then fetching the data is necessary
  

//  Add Helper Function to Fetch HTML Content from body_url:
 
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

const fetchBlogForEdit = useCallback(async () => {
  try {
    const docRef = doc(db, "blogs", blogId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const blogData = docSnap.data();
      setFormData(blogData);
      setText(await fetchBodyHTML(blogData.body_url));
      setImagePreview(blogData.image_url || null);
    } else {
      alert("Blog not found");
    }
  } catch (error) {
    alert("Error fetching blog: " + error.message);
  }
}, [blogId]); // include all used vars

// ########################################
useEffect(() => {
  if (isEdit && blogId) {
    fetchBlogForEdit();
  }
  const currentPreview = imagePreviewUrlRef.current;

  return () => {
    if (currentPreview) {
      URL.revokeObjectURL(currentPreview);
    }
  }
}, [blogId, isEdit, fetchBlogForEdit]);
 
 
   ////HEERE IS THE HANDLE IMAGE FILE UPLOAD
   const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
  if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current);
    }

     const objectUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(objectUrl);
  }
};


  const handleChange = async (e) => {
    const { name, value } = e.target;
  //for the new category id 
 
  //create slug
    if(name==='header'){
        const new_slug=generateSlug(value);
     
        setFormData((prev) => ({
        ...prev,
        'slug': new_slug,
      }));
    }
    // for the normal
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


const generateSlug = (text) => {
  return text
    .normalize("NFC")
    .trim()
    .replace(/[^\u0900-\u097F\w\s-]/g, '')  // Devanagari + Latin + digits + spaces + hyphen
    .replace(/\s+/g, '-')                   // Replace spaces with hyphen
    .replace(/-+/g, '-')                    // Collapse multiple hyphens
    .replace(/^-|-$/g, '')                  // Trim hyphens from start/end
    .toLowerCase();
};
const currentCreator=()=>{
           
  const oldCreator = formData.creator === "" ? "" : formData.creator;
  const newCreator = user?.email || "unknown";
  const updatedCreator = oldCreator !== ""
    ? `${oldCreator}, ${newCreator}`
    : newCreator;

  return updatedCreator;
}

const currentUpdateLog=()=>{
           
  const oldlog = formData.update_log === "" ? "" : formData.update_log;
  const timestamp = new Date().toISOString(); // or Date.now()
  const newCreator = user?.email ? `${user.email} @ ${timestamp}` : `unknown @ ${timestamp}`;

  const updatedCreator = oldlog !== ""
    ? `${oldlog}, ${newCreator}`
    : newCreator;

  return updatedCreator;
 
}

const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData?.category?.trim().length < 1) {
    alert("Category should not be null.");
    return;
  }

  if (!formData?.header || formData.header.trim().length < 10) {
    alert("Header should not be null and must be at least 10 characters.");
    return;
  }

  if (text.trim().length < 20) {
    alert("Text length less than 20 is forbidden.");
    return;
  }

  if (!formData.timestamp) {
    alert(`Blog ID: ${formData.blog_id}, Timestamp: ${formData.timestamp}`);
    return;
  }

  try {
    const category = formData.category;
    setLoading(true);

    const metadata = {
      contentType: "text/html;charset=UTF-8", // still html so browser renders
      contentDisposition: "inline",           // forces render, not download
    };

    // ✅ Save file with .txt extension but HTML content
    const fileName = `${formData.timestamp}.txt`;
    const storageRef = ref(storage, `blogs/${fileName}`);

    // Upload the HTML string
    await uploadString(storageRef, text, 'raw', metadata);
    const downloadURL = await getDownloadURL(storageRef);

    if (!downloadURL) {
      alert("Unable to get download URL");
      return;
    }

    // ✅ Upload image if provided
    let imageUrl = isEdit && formData.image_url ? formData.image_url : "";
    if (imageFile) {
      const fileExtension = imageFile.name.split('.').pop(); // e.g., "jpg", "png"
      const imageRef = ref(storage, `blog-images/${formData.timestamp}.${fileExtension}`);

 
      const snapshot = await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
      if (!imageUrl) {
        alert("Empty image URL.");
        return;
      }
    }
    // ✅ Get category counter if not editing
    let nextId = formData.category_primary_id;
    if (!isEdit) {
      nextId = await getNextCounterValue("category_counters", category);
      if (!nextId || nextId < 1) {
        alert("Unable to get category counter");
        return;
      }
    }

    // ✅ Create blog document
    const initialBlog = {
      ...formData,
      category_primary_id: nextId.toString(),
      creator: currentCreator(),
      image_url: imageUrl,
      body_url: downloadURL,
      status: isEdit? 'U':formData.status,
      visible:isEdit ?'private':formData.visible,
      update_log: currentUpdateLog()

       
    };

    const userRef = doc(db, "blogs", initialBlog.timestamp.toString());
    await setDoc(userRef, initialBlog, { merge: true });
    alert("Saved successfully!");

    // ✅ Clear form if it's a new blog
    if (!isEdit) {
      setFormData(getInitialBlog());
      clearRichText();
      clearImageFile();
    } else {
      navigate(0); // Reload the page
    }

  } catch (e) {
    alert(e.message);
    console.error(e);
  } finally {
    setLoading(false);
  }
};


  if (loading) return <div className="text-center mt-10">Loading...</div>;
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        {isEdit ? "Edit Blog" : "Add New Blog"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-1 gap-6">
 
      <div >
      <label className="block mb-2">Category</label>
      <div className="flex">
         {!categoriesList || Object.keys(categoriesList).length === 0 ? (
              <p className="text-gray-400">No categories yet.</p>
            ) : (
              <select
                disabled={isEdit} // Disable when isEdit is true
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
                className="border px-3 py-2 rounded w-full"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {Object.entries(categoriesList).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            )}
    
       <button
        type="button"
        onClick={()=>{  navigate('/admin/addcat')}} // Your custom handler
        className="bg-secondary text-white px-2 py-2 rounded hover:bg-primary"
        >
        + 
      </button>
      </div>
 
    </div>
       {/* add categorie */}
        <div>
  
      </div>
       <div className="md:col-span-3 flex flex-col">
          <label className="font-medium mb-1">Header   </label>
            <input
              value={formData.header || ""}
              type="text"
              name="header"
              onChange={handleChange}
              className="border p-2 rounded"
            />
        </div>
         
         <div className="md:col-span-3 flex flex-col">
            <label className="font-medium mb-1">Upload Thumbnail Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="border p-2 rounded"
            />
          </div>


          {imagePreview && (
  <div className="mt-1">
    <p className="font-medium mb-2">Image Preview:</p>
    <img
      src={imagePreview}
      alt="Preview"
      className="w-98 h-auto rounded border"
       style={{ width: "400px", height: "300px", objectFit: "cover" }}
    />
  </div>
)}


        {/* Body Field (Full Width) */}
        <div className="md:col-span-3 flex flex-col">
          <label className="font-medium mb-1">Body</label>
          <RichTextEditor value={text} onChange={setText} />
          <h2 className="mt-6 text-lg">Output:</h2>
        </div>

        {/* Submit Button (Bottom Right) */}
        <div className="md:col-span-3 flex justify-end">
          <button 
           
            type="submit"
            className="bg-secondary text-white px-6 py-2 rounded hover:bg-primary"
          >
            {isEdit ? "Update Blog" : "Save Blog"}
          </button>
        </div>
      </form>



 {/* MODAL for addition of categories and others */}
 
    </div>
  );
};

export default AddEditBlog;
