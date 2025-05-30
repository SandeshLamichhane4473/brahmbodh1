import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
  
const dummyCourses = [
  {
    course_id: 1,
    course_name: "Web Development",
    course_short_desc: "Learn to build websites",
    category: "Technology",
    image: "https://source.unsplash.com/100x100/?web",
    timestamp: "2025-05-30",
    created_by: "Admin",
    status: "Active",
    approve_by: "Manager",
    approved_date: "2025-05-29",
    approve_status: "Approved",
    subtitles: 5,
  },
  {
    course_id: 2,
    course_name: "Yoga Basics",
    course_short_desc: "Basic yoga postures",
    category: "Health",
    image: "https://source.unsplash.com/100x100/?yoga",
    timestamp: "2025-05-28",
    created_by: "Trainer",
    status: "Inactive",
    approve_by: "Admin",
    approved_date: "2025-05-29",
    approve_status: "Pending",
    subtitles: 3,
  },
  {
    course_id: 2,
    course_name: "Yoga Basics",
    course_short_desc: "Basic yoga postures",
    category: "Health",
    image: "https://source.unsplash.com/100x100/?yoga",
    timestamp: "2025-05-28",
    created_by: "Trainer",
    status: "Inactive",
    approve_by: "Admin",
    approved_date: "2025-05-29",
    approve_status: "Pending",
    subtitles: 3,
  },
  {
    course_id: 2,
    course_name: "Yoga Basics",
    course_short_desc: "Basic yoga postures",
    category: "Health",
    image: "https://source.unsplash.com/100x100/?yoga",
    timestamp: "2025-05-28",
    created_by: "Trainer",
    status: "Inactive",
    approve_by: "Admin",
    approved_date: "2025-05-29",
    approve_status: "Pending",
    subtitles: 3,
  },
];

const AdminCourse = () => {
  const navigate = useNavigate();


  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [filteredCourses, setFilteredCourses] = useState(dummyCourses);

  useEffect(() => {
    const filtered = dummyCourses.filter((course) => {
      const nameMatch = course.course_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const categoryMatch =
        categoryFilter === "All" || course.category === categoryFilter;
      return nameMatch && categoryMatch;
    });
    setFilteredCourses(filtered);
  }, [searchTerm, categoryFilter]);

  const handleDelete = (id) => {
    alert(`Delete course with ID ${id}`);
  };

  // const handleEdit = (id) => {
  //   alert(`Edit course with ID ${id}`);
  // };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Course List</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by course name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full md:w-1/2"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        >
          <option value="All">All Categories</option>
          <option value="Technology">Technology</option>
          <option value="Health">Health</option>
        </select>

        {/* add new button  */}
        <div className="">
            <button
              onClick={() => navigate("/admin/addnewcourse")}
              className="bg-secondary text-white px-4 py-2 rounded hover:bg-primary"
            >
              + Add New Course
            </button>
          </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr className="text-sm text-left">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Created By</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Approved By</th>
              <th className="p-2 border">Approved Date</th>
              <th className="p-2 border">Approve Status</th>
              <th className="p-2 border">Subtitles</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => (
              <tr key={course.course_id} className="text-sm hover:bg-gray-50">
                <td className="p-2 border">{course.course_id}</td>
                <td className="p-2 border">{course.course_name}</td>
                <td className="p-2 border">{course.course_short_desc}</td>
                <td className="p-2 border">{course.category}</td>
                <td className="p-2 border">
                  <img
                    src={course.image}
                    alt={course.course_name}
                    className="w-10 h-10 object-cover rounded"
                  />
                </td>
                <td className="p-2 border">{course.timestamp}</td>
                <td className="p-2 border">{course.created_by}</td>
                <td className="p-2 border">{course.status}</td>
                <td className="p-2 border">{course.approve_by}</td>
                <td className="p-2 border">{course.approved_date}</td>
                <td className="p-2 border">{course.approve_status}</td>
                <td className="p-2 border">{course.subtitles}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    onClick={
                    ()=> navigate(`/admin/editcourse/${course.course_id}`) 
                     }
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.course_id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredCourses.length === 0 && (
              <tr>
                <td colSpan="13" className="text-center p-4 text-gray-500">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default   AdminCourse 
;
