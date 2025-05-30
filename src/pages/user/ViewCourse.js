import { useParams,useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const courseDetails = {
  1: {
    title: "Web Development",
    image: "https://source.unsplash.com/800x300/?web,code",
    subtitles: [
      { id: "html", title: "HTML Basics", description: "Yoga is a group of physical, mental, Yoga is a group of physical, mental, Yoga is a group of physical, mental, Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Learn HTMLksjdbska jkdbhkald dihasd ajdbapdbhkad jhbskaldbakds jbaskdbam djasbda dashdbaskd ajsl djhdm djhasbda djabdam dapbdmasn djhabdjas djlas djlasdasbdm djbasdba.d asdbasdmas dkajbdk;asbdp structure." },
      { id: "css", title: "CSS Styling", description: "Style with CSS." },
      { id: "js", title: "JavaScript", description: "Make it interactive with JS." },
      { id: "html", title: "HTML Basics", description: "Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Learn HTMLksjdbska jkdbhkald dihasd ajdbapdbhkad jhbskaldbakds jbaskdbam djasbda dashdbaskd ajsl djhdm djhasbda djabdam dapbdmasn djhabdjas djlas djlasdasbdm djbasdba.d asdbasdmas dkajbdk;asbdp structure." },
      { id: "css", title: "CSS Styling", description: "Style with CSS." },
      { id: "js", title: "JavaScript", description: "Make it interactive with JS." },

        { id: "html", title: "HTML Basics", description: "Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Yoga is a group of physical, mental, and spiritual practices or disciplines that originated with its own philosophy in ancient India, aimed at controlling body and mind to attain various salvation goals, as practiced in the Hindu, Jain, and Buddhist traditions.Learn HTMLksjdbska jkdbhkald dihasd ajdbapdbhkad jhbskaldbakds jbaskdbam djasbda dashdbaskd ajsl djhdm djhasbda djabdam dapbdmasn djhabdjas djlas djlasdasbdm djbasdba.d asdbasdmas dkajbdk;asbdp structure." },
      { id: "css", title: "CSS Styling", description: "Style with CSS." },
      { id: "js", title: "JavaScript", description: "Make it interactive with JS." },

    ],
  },
};

const ViewCourse = () => {
   const { courseId, subtitleId } = useParams();
   const navigate = useNavigate();
   const [showMobileSidebar, setShowMobileSidebar] = useState(false);
   const course = courseDetails[courseId];

   const defaultSubtitle = course?.subtitles?.[0];
   const activeSubtitle = course?.subtitles.find((s) => s.id === subtitleId) || defaultSubtitle;

   

  
   useEffect(() => {
    if (course && !subtitleId && defaultSubtitle) {
      navigate(`/course/${courseId}/${defaultSubtitle.id}`, { replace: true });
    }
  }, [course, courseId, subtitleId, defaultSubtitle, navigate]);



  if (!course) return <p className="text-center mt-10 text-red-600 text-xl">Course not found.</p>;
  if (!activeSubtitle) return <p className="text-center mt-10 text-red-600 text-xl">Subtitle not found.</p>;

  return (
    <div className="max-w-7xl mx-auto p-1 relative">
      <h1 className="text-3xl font-bold mb-6 text-center">{course.title}</h1>

      <div className="flex gap-6">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 pr-4 sticky top-0 h-[calc(100vh-6rem)] overflow-y-auto border-r">
          <h2 className="text-xl font-semibold mb-4">Topics</h2>
          <ul className="space-y-2">
            {course.subtitles.map((subtitle) => (
              <li key={subtitle.id}>
                <button
                   onClick={() => navigate(`/course/${courseId}/${subtitle.id}`)}
                  className={`text-left w-full p-2 rounded-lg transition-colors duration-200 ${
                                        subtitle.id === subtitleId
                      ? "bg-blue-100 text-blue-600 font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {subtitle.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">{activeSubtitle.title}</h2>
            <p className="text-gray-700 text-3xl">{activeSubtitle.description}</p>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" onClick={() => setShowMobileSidebar(false)}>
          <div
            className="absolute left-0 top-0 h-full w-64 bg-white p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Topics</h2>
            <ul className="space-y-2">
              {course.subtitles.map((subtitle) => (
                <li key={subtitle.id}>
                  <button
                    onClick={() => {
                    navigate(-1)
                    //   setActiveSubtitleId(subtitle.id);
                    //   setShowMobileSidebar(false);
                    }}
                    className={`text-left w-full p-2 rounded-lg transition-colors duration-200 ${
                      subtitle.id === subtitleId
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {subtitle.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        className="fixed bottom-4 left-4 md:hidden bg-primary text-white px-4 py-2 rounded-full shadow-lg z-50"
      >
        {showMobileSidebar ? 'Close Topics' : 'View Topics'}
      </button>
    </div>
  );
};

export default ViewCourse;
