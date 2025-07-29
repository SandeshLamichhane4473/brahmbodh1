import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";


const VisibilityModal = ({ isOpen, onClose, blog, onUpdated }) => {
  const [updating, setUpdating] = useState(false);
  if (!isOpen || !blog) return null;
  const handleToggle = async () => {
   if(blog.status==="U"){
    alert("Please check first.")
    return;
   }

    setUpdating(true);
    try {
      const blogRef = doc(db, "blogs", String(blog.timestamp));
      const newVisibility = blog.visible === "private" ? "public" : "private";
      await updateDoc(blogRef, { visible: newVisibility });

      onUpdated({ ...blog, visible: newVisibility });
      onClose();
    } catch (error) {
     alert("Error"+error)
      console.error("Error updating visibility:", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Change Visibility</h2>
        <p className="mb-4">
          Current visibility is <strong>{blog.visible}</strong>. <br />
          Do you want to change it to{" "}
          <strong>{blog.visible === "private" ? "public" : "private"}</strong>?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleToggle}
            disabled={updating}
            className="bg-secondary text-white px-4 py-2 rounded hover:bg-primary"
          >
            {updating ? "Updating..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisibilityModal;
