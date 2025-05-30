import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
  
const dummyBlogs = [
  {
     BlogId: 1,
    Header: "React Basics",
    ShortDesc: "Introduction to React",
    Slug: "react-basics",
    Category: "Web Development",
    CatSequence: 1,
    Timestamp: "2025-05-30T10:00",
    Date: "2025-05-30",
    WrittenBy: "Admin",
    Status: "Published",
    Body: "React is a library...",
    ReviewStatus: "Approved",
    ApprovedBy: "Editor",
    ApproveDate: "2025-05-30",
  },
  {
    BlogId: 2,
    Header: "React Basics",
    ShortDesc: "Introduction to React",
    Slug: "react-basics",
    Category: "Web Development",
    CatSequence: 1,
    timestamp: "2025-05-30T10:00",
    Date: "2025-05-30",
    WrittenBy: "Admin",
    Status: "Published",
    Body: "React is a library...",
    ReviewStatus: "Approved",
    ApprovedBy: "Editor",
    ApproveDate: "2025-05-30",
  },
  {
     BlogId: 3,
    Header: "React Basics",
    ShortDesc: "Introduction to React",
    Slug: "react-basics",
    Category: "Web Development",
    CatSequence: 1,
    timestamp: "2025-05-30T10:00",
    Date: "2025-05-30",
    WrittenBy: "Admin",
    Status: "Published",
    Body: "React is a library...",
    ReviewStatus: "Approved",
    ApprovedBy: "Editor",
    ApproveDate: "2025-05-30",
  },
  
];

const Blogs = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [filteredBlogs, setFilteredBlogs] = useState(dummyBlogs);

  useEffect(() => {

    const filtered = dummyBlogs.filter((blog) => {
      const nameMatch = blog.Header
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const categoryMatch =
        categoryFilter === "All" || blog.category === categoryFilter;
      return nameMatch && categoryMatch;
    });
    setFilteredBlogs(filtered);
  }, [searchTerm, categoryFilter]);

  const handleDelete = (id) => {
    alert(`Delete course with ID ${id}`);
  };

  // const handleEdit = (id) => {
  //   alert(`Edit course with ID ${id}`);
  // };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Blogs List</h1>

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
          <option value="Technology">Yoga</option>
          <option value="Health">Meditation</option>
          <option value="Technology">Bhagwat Geeta</option>
          <option value="Health">Karm Sidhaant</option>
          <option value="Technology">Adwait Vedant</option>
          <option value="Health">KarmYog</option>
        </select>

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
              <th className="p-2 border">Short Desc</th>
              <th className="p-2 border">Slug</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Seq (Cat)</th>
              <th className="p-2 border">Time Stamp</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Written By</th>
              <th className="p-2 border">Body</th>
              <th className="p-2 border">Review Status</th>
              <th className="p-2 border">Approve Date</th>
              <th className="p-2 border">Aprove By</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map((course) => (
              <tr key={course.course_id} className="text-sm hover:bg-gray-50">
                <td className="p-2 border">{course.BlogId}</td>
                <td className="p-2 border">{course.Header}</td>
                <td className="p-2 border">{course.ShortDesc}</td>
                <td className="p-2 border">{course.Category}</td>
                <td className="p-2 border">{course.CatSequence}</td>          
              
                <td className="p-2 border">{course.Timestamp}</td>
                <td className="p-2 border">{course.Date}</td>
                <td className="p-2 border">{course.WrittenBy}</td>
                <td className="p-2 border">{course.Body}</td>
                <td className="p-2 border">{course.ReviewStatus}</td>
                <td className="p-2 border">{course.ApproveDate}</td>
                <td className="p-2 border">{course.ApprovedBy}</td>
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
            {filteredBlogs.length === 0 && (
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

export default   Blogs 
;
