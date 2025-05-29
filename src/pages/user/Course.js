import React from "react";
import { useNavigate } from "react-router-dom";
const courses = [
  {
    id: 1,
    title: "Web Development",
    description: "Learn HTML, CSS, JavaScript and modern frameworks.",
    image: "https://picsum.photos/seed/picsum/200/300",
  },
  {
    id: 2,
    title: "Data Science",
    description: "Data analysis, visualization, and machine learning.",
    image: "https://picsum.photos/seed/picsum/200/300",
  },
  {
    id: 3,
    title: "Mobile App Development",
    description: "Build native and cross-platform apps.",
    image: "https://picsum.photos/seed/picsum/200/300",
  },
  {
    id: 4,
    title: "UI/UX Design",
    description: "Design modern, user-friendly interfaces.",
    image: "https://picsum.photos/seed/picsum/200/300",
  },
];

const Course = () => {

  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/course/${id}/`);
  };


  return (
    <div className="px-4 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            onClick={() => handleCardClick(course.id)}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-600 text-sm">{course.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Course;

