import { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
const useCourseHeader = () => {
  const [courseHeader, setCourseHeader] = useState([]);
  const [loadingcourseHeader, setLoading] = useState(false);
  const [errorcourseHeader, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const snap = await getDocs(collection(db, "courseheader"));

      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      
      setCourseHeader(data);
    } catch (err) {
      console.error("Error fetching courses header:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courseHeader, loadingcourseHeader, errorcourseHeader, refetch: fetchCourses };
};

export default useCourseHeader;