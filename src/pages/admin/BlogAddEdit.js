import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const initialBlog = {
  BlogId: "",
  Header: "",
  ShortDesc: "",
  Slug: "",
  Category: "",
  CatSequence: "",
  timestamp: "",
  Date: "",
  WrittenBy: "",
  Status: "",
  Body: "",
  ReviewStatus: "",
  ApprovedBy: "",
  ApproveDate: "",
};

const AddEditBlog = ({ blogs = [], onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [formData, setFormData] = useState(initialBlog);

  useEffect(() => {
    if (isEdit) {
      const blogToEdit = blogs.find((b) => b.BlogId === id);
      if (blogToEdit) {
        setFormData(blogToEdit);
      }
    }
  }, [id, isEdit, blogs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    navigate("/blogs");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        {isEdit ? "Edit Blog" : "Add New Blog"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Blog ID", name: "BlogId", disabled: isEdit },
          { label: "Header", name: "Header" },
          { label: "Short Description", name: "ShortDesc" },
          { label: "Slug", name: "Slug" },
          { label: "Category", name: "Category" },
          { label: "Category Sequence", name: "CatSequence" },
          { label: "Timestamp", name: "timestamp", type: "datetime-local" },
          { label: "Date", name: "Date", type: "date" },
          { label: "Written By", name: "WrittenBy" },
          { label: "Status", name: "Status" },
          { label: "Review Status", name: "ReviewStatus" },
          { label: "Approved By", name: "ApprovedBy" },
          { label: "Approve Date", name: "ApproveDate", type: "date" },
        ].map(({ label, name, type = "text", disabled = false }) => (
          <div key={name} className="flex flex-col">
            <label className="font-medium mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              disabled={disabled}
              className="border p-2 rounded"
              required
            />
          </div>
        ))}

        {/* Body Field (Full Width) */}
        <div className="md:col-span-3 flex flex-col">
          <label className="font-medium mb-1">Body</label>
          <textarea
            name="Body"
            value={formData.Body}
            onChange={handleChange}
            className="border p-2 rounded min-h-[150px]"
            required
          />
        </div>

        {/* Submit Button (Bottom Right) */}
        <div className="md:col-span-3 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {isEdit ? "Update Blog" : "Save Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditBlog;
