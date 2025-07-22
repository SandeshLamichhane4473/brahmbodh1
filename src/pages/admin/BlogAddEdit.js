import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RichTextEditor from "../component/RichTextEditor";
import { db } from "../../firebase/config";
import { doc,setDoc,getDoc } from "firebase/firestore";
import { useCategories } from "./extra/useCategories";
import 'jodit/es2021/jodit.min.css';
import { getNextCounterValue } from "./extra/getNextCounterValue";
import { useAuth } from "../../context/AuthContext";
 
import { ref, uploadString, getDownloadURL, uploadBytes } from 'firebase/storage';
import { storage } from "../../firebase/config";

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
 const usecategories = useCategories()

 const { blogId } = useParams();
  const isEdit = Boolean(blogId);


  const navigate = useNavigate();
  const [formData, setFormData] =  useState(getInitialBlog());
  const [loading, setLoading] = useState(false);
  const { user} = useAuth();
  const [imageFile, setImageFile] = useState(null); // holds the selected image
const [imagePreview, setImagePreview] = useState(null);

 
const clearRichText=()=>{
  setText('')
}


const clearImageFile=()=>{
  setImageFile(null);
  setImagePreview(null)
}

/// if the file is for updating then fetching the data is necessary
  const fetchBlogForEdit = async () => {

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
        alert("Error fetching blog:", error);
      }
    
  };

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


// ########################################
  useEffect(() => {
        if (isEdit && blogId) {
          fetchBlogForEdit()
          }


    return () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  };

  }, [blogId, isEdit]);
  // SS


   ////HEERE IS THE HANDLE IMAGE FILE UPLOAD
   const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }
};


  const handleChange = async (e) => {
    const { name, value } = e.target;
  //for the new category id 
 
  //create slug
    if(name=='header'){
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



  const handleSubmit = async (e) => {
    e.preventDefault();
      
      if( formData && formData.category.trim().length <1){
      alert("Category shouldnot be null.")
      return;
    }
      
  // check the header first 
    if( formData && formData.header === undefined || formData.header.trim().length<10){
      alert("Header should not be null and less than 10 character.")
      return;
    }
 
    //body content
    if(text.trim().length<20){
       alert("Text length is less than 20 is forbidden")
      return;
    }  
   //form data blog id not eqaul formData timestamp
     if( formData.timestamp ===""){
      alert("Blog id is"+formData.blog_id +"TimeStamp "+formData.timestamp)
      return;
     }

 
    try{
   //generate category primary id :
   const category = formData.category;

      setLoading(true)
    
      const metadata = {
        contentType: "text/html;charset=UTF-8",
        contentDisposition: "inline", // Ensures the file is displayed, not downloaded
      };
      //upload into the firebase storage
      const fileName = `${formData.timestamp}.html`;
      const storageRef = ref(storage, `blogs/ ${fileName}`); 
      // Save the HTML as a string in Firebase Storage
      await uploadString(storageRef, text, 'raw',metadata);
      const downloadURL =  await getDownloadURL(storageRef);
      if(!downloadURL){alert("unable to download url"); return;}


      //UPLOAD THE IMAGE TO THE  FIREBASE FIRESTORAGE
       let imageUrl = isEdit && formData.image_url? formData.image_url: "";
      if (imageFile) {
        const imageRef = ref(storage, `blog-images/${formData.timestamp}-${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
        if(imageUrl==""){
          alert("Empty Image URL.") ; return;
        }
      }
 
      let nextId=formData.category_primary_id;
      ////////////  GET NEXT COUNTER VALUE
      if(!isEdit){ //only get new cat if there is new uinstead cat remain as old as it is;
        nextId = await getNextCounterValue("category_counters", category);
        if(!nextId || nextId<1){alert("unable to download catgory countrer"); return;}
      }

       const initialBlog = {
      ...formData,
       category_primary_id: nextId.toString(),
       creator:currentCreator(),  // make changes to the name while editing
       image_url:imageUrl,  // in update it becomes blanks
       body_url: downloadURL  //for future purpose add image url also
    };
          
         const userRef = doc(db, "blogs",initialBlog.timestamp.toString());
         await setDoc(userRef, initialBlog, { merge: true });
         alert('Saved successfully!');
       
         
      // if its update then  donot clear the form
      //clear the form
     if(!isEdit){
      setFormData( getInitialBlog())
      clearRichText();
      clearImageFile();
     }
     else{
      //relaod the page
         navigate(0); // reloads the current route


     }

    }catch(e){
      alert(e);
      console.log(e);
     }
    finally  {
           setLoading(false)
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
            {Object.keys(usecategories).length === 0 ? (
          <p className="text-gray-400">No categories yet.</p>
        ) : (
          <select
              disabled={isEdit} // Disable when isEdit is true
            name="category"
             value={formData.category || ""} 
                  onChange={  handleChange }
                 className="border px-3 py-2 rounded w-full"
          >
              <option value="" disabled>
                  Select a category  
              </option>.
            {Object.entries(usecategories).map(([key, value], idx) => (
              <option key={key} value={key}>
                {value+"///"+key}
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
