import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { iconOptions } from "../../../constant/courseIcons";

export default function CoursesGrid() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(collection(db, "courseheader"), orderBy("order"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-neutral-100 rounded-2xl h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <>
    <h2 className="text-2xl font-bold text-gray-800 pl-4 border-l-4 border-primary mb-4"
          style={{ fontFamily: "'Noto Sans Devanagari', Arial, sans-serif" }}>
        प्रमुख शीर्षकहरु
      </h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {courses.map((course) => (
        <div
          key={course.id}
          onClick={() => navigate("/coursedetail/"+course.id)}
          className="group bg-white border border-neutral-200 rounded-2xl px-3 py-6 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 hover:border-neutral-900 hover:bg-gray-200 hover:-translate-y-1"
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: course.bg, color: course.stroke }}
          >
            { iconOptions.find((icon) => icon.key === course.iconKey)?.preview 
              ?? iconOptions[0].preview}
          </div>

          <div className="text-center">
            <p className="text-base font-semibold text-neutral-900 leading-tight text-xl"
               style={{ fontFamily: 'Arial, sans-serif' }}>
              {course.name}
            </p>
            <p className="text-[11px] text-neutral-400 mt-0.5 tracking-wide uppercase">
              {course.sub}
            </p>
          </div>
        </div>
      ))}
    </div></>
  );
}