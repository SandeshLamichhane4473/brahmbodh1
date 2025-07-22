import React, { useState, useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";

const AddNewCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  
  const isEdit = Boolean(courseId);
  const [formData, setFormData] = useState({
    course_id: "",
    course_name: "",
    course_short_desc: "",
    category: "",
    image: "",
    timestamp: "",
    created_by: "",
    status: "",
    approve_by: "",
    approved_date: "",
    approve_status: "",
    subtitles: "",
  });
  

   useEffect(() => {
    if (isEdit) {
      // Fetch course data by ID (replace with real fetch)
      const courseFromServer = {
        course_id: courseId,
        course_name: "React Fundamentals",
        course_short_desc: "Intro to React.js",
        category: "Web Development",
        image: "https://via.placeholder.com/150",
        timestamp: "2025-05-30T14:00",
        created_by: "admin",
        status: "active",
        approve_by: "moderator",
        approved_date: "2025-05-29",
        approve_status: "approved",
        subtitles: "10",
      };
      setFormData(courseFromServer);
    }
  }, [courseId, isEdit]);

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      console.log("Updating Course:", formData);
      alert("Course updated successfully!");
    } else {
      console.log("Creating Course:", formData);
      alert("Course created successfully!");
    };
    navigate("/admin/course"); // Navigate back to course list
   
    }
 

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4"> {isEdit ? "Edit Course" : "Add New Course"}</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: "Course ID", name: "course_id", disabled: isEdit }, // Disable ID in edit mode
          { label: "Course Name", name: "course_name" },
          { label: "Short Description", name: "course_short_desc" },
          { label: "Category", name: "category" },
          { label: "Image URL", name: "image" },
          { label: "Timestamp", name: "timestamp", type: "datetime-local" },
          { label: "Created By", name: "created_by" },
          { label: "Status", name: "status" },
          { label: "Approved By", name: "approve_by" },
          { label: "Approved Date", name: "approved_date", type: "date" },
          { label: "Approve Status", name: "approve_status" },
          { label: "Subtitles", name: "subtitles", type: "number" },
        ].map(({ label, name, type = "text", disabled = false }) => (
          <div key={name} className="flex flex-col">
            <label className="font-medium">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="border p-2 rounded"
               
              disabled={disabled}
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {isEdit ? "Update Course" : "Save Course"}
        </button>
      </form>


 
    </div>
  );

}
 

export default AddNewCourse;
