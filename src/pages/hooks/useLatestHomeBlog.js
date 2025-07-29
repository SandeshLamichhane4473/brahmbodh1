// src/hooks/useLatestHomeBlog.js
import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const CACHE_KEY = 'latest_home_blog';
const CACHE_EXPIRY_MS = 3 * 60 * 60 * 1000; // 3 hours

const useLatestHomeBlog = () => {
  const [homeBlog, setHomeBlog] = useState(null);
  const [homeBlogLoading, setHomeBlogLoading] = useState(true);

  // Load from localStorage cache
  const loadFromCache = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
        return data;
      } else {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
    } catch {
      return null;
    }
  };

  useEffect(() => {
    
    const fetchLatestHomeBlog = async () => {
      try {
        const blogsRef = collection(db, 'blogs');
        const q = query(
                    blogsRef,
                    where('category', '==', 'home'),
                    where('visible', '==', 'public'),
                    where('status', '==', 'C'),
                    orderBy('timestamp', 'desc'),
                    limit(1)
                    );

 
        const querySnapshot = await getDocs(q);
       
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const blogData = { id: docSnap.id, ...docSnap.data() };

          // Cache the result
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ timestamp: Date.now(), data: blogData })
          );
        
          setHomeBlog(blogData);
        } else {
          console.warn('No blog found in home category');
        }
      } catch (error) {
        console.error('Error fetching latest home blog:', error);
      } finally {
        setHomeBlogLoading(false);
      }
    };

    const cached = loadFromCache();
    if (cached) {
      setHomeBlog(cached);
      setHomeBlogLoading(false);
    } else {
      fetchLatestHomeBlog();
    }
  }, []);

  return { homeBlog, homeBlogLoading };
};

export default useLatestHomeBlog;
