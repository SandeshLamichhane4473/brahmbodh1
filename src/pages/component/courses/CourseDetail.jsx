import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import useCourseHeader from "../../hooks/useCourseHeader";
import { useNavigate } from "react-router-dom";

export default function CourseDetail() {
  // const { id: courseId } = useParams();
  // Add :topicId and :slug to useParams
const { id: courseId, topicId, slug } = useParams();
  const [topics, setTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bodyHtml, setBodyHtml] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
   const { courseHeader }  =useCourseHeader();
   const navigate=useNavigate();
  

// load all data
   useEffect(() => {
  async function fetchDocsByCourseId() {
    try {
      const snap = await getDocs(
        query(
          collection(db, "coursecontent"),
          where("courseheading", "==", courseId),
          where("status", "==", "ACTIVE"),
          where("visible", "==", "PUBLIC")
        )
      );

      const data = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.seqno - b.seqno);

      setTopics(data);
      setActiveTopic(data[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  fetchDocsByCourseId();
}, [courseId]);


  // After topics load, sync activeTopic from URL params
useEffect(() => {
  if (!topics.length) return;

  if (topicId && slug) {
    const matched = topics.find(t => t.id === topicId && t.slug === slug);
    if (matched) {
      setActiveTopic(matched);
      return;
    }
  }
  // Fallback to first topic and redirect to its URL
  const first = topics[0];
  navigate(`/coursedetail/${courseId}/${first.id}/${first.slug}`, { replace: true });
}, [topics, courseId, navigate, slug, topicId]);
  useEffect(() => {
    if (!activeTopic?.body_url) return;
    setBodyHtml("");

    fetch(activeTopic.body_url)
      .then(res => res.text())
      .then(html => setBodyHtml(html))
      .catch(err => console.error("Failed to load content:", err));
  }, [activeTopic]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="flex h-screen  bg-gray-200 text-black overflow-hidden">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
 

      {/* Sidebar */}
      <div className={`
        fixed md:static mt-5 z-30 h-full w-64 bg-white shadow-lg rounded-lg mb-5
        overflow-y-auto p-4 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}>
           <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-gray-500 hover:text-gray-800 text-2xl leading-none float-right"
              >
                ✕
              </button>
        {/* <h2 className="font-bold mb-4 text-gray-800"> {courseId}</h2> */}
         {/* Close button — mobile only */}
 

        {topics.map((topic) => (
          <>
          <div
            key={topic.id}
           // When clicking a sidebar topic, update the URL too
              onClick={() => {
                setActiveTopic(topic);
                setSidebarOpen(false);
                navigate(`/coursedetail/${courseId}/${topic.id}/${topic.slug}`);
              }}
            className={`p-2 rounded cursor-pointer mb-1 text-md
              ${activeTopic?.id === topic.id
                ? "bg-primary text-white font-bold"
                : "text-gray-600 hover:bg-gray-100"}
            `}
          >
            {topic.coursesubheading}

          </div>
           <hr></hr>
          </>
         
        ))}
      </div>

        {/* This wrapper must fill remaining height */}
        {/* <div className="flex flex-1 overflow-hidden"> */}
          {/* This wrapper must switch to column on mobile */}
            <div className="flex flex-col  lg:flex-row flex-1 overflow-hidden"> 

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Mobile topbar */}
            <div className="md:hidden flex items-center gap-3 bg-white border-b border-gray-100 px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all duration-150"
              >
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                  <rect y="0" width="18" height="2" rx="1" fill="#374151"/>
                  <rect y="6" width="13" height="2" rx="1" fill="#374151"/>
                  <rect y="12" width="9" height="2" rx="1" fill="#374151"/>
                </svg>
              </button>
              <div className="w-px h-5 bg-gray-200" />
              <span className="flex-1 font-semibold text-gray-800 text-sm truncate tracking-tight">
                {activeTopic?.coursesubheadingtitle || `Course ${courseId}`}
              </span>
              <span className="shrink-0 text-xs font-medium text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-full">
                In Progress
              </span>
            </div>

            {/* Scrollable gray wrapper */}
            <div className="flex-1 overflow-y-auto bg-gray-200 p-6">
              <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm p-8 min-h-full">
                {activeTopic ? (
                  <>
                    <h1 className="text-2xl font-bold mb-2">
                      {activeTopic.coursesubheadingtitle}
                    </h1>
                    <p className="text-sm text-gray-400 mb-6">
                      {activeTopic.coursesubheading}
                    </p>
                    {bodyHtml
                      ? <div
                          className="text-gray-700 leading-relaxed prose max-w-none text-xl"
                          style={{ fontFamily: "'Noto Sans Devanagari', Arial, sans-serif", fontSize: "1.65rem" }}
                          dangerouslySetInnerHTML={{ __html: bodyHtml }}
                        />
                      : <p className="text-gray-400 animate-pulse">Loading content...</p>
                    }
                  </>
                ) : (
                  <p className="text-gray-500">No content found for course {courseId}.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right panel — must be sibling inside the flex row, with its own scroll */}
      
  {/* Right panel — below on mobile, sidebar on desktop */}
          <div className="flex flex-col mt-5 lg:w-56 lg:shrink-0 lg:border-l lg:overflow-y-auto
                          bg-white border-t lg:border-t-0 border-gray-100 p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              In this course
            </h3>
            <div className="flex flex-col gap-1">
              {courseHeader.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => navigate("/coursedetail/"+topic.id)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-all duration-150
                    ${activeTopic?.id === topic.id
                      ? "bg-indigo-50 text-indigo-600 font-semibold"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                >
                  {topic.id}
                </button>
              ))}
            </div>
          </div>

        </div>



    </div>
  );
}