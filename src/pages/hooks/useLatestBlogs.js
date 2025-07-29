// src/hooks/useLatestBlogs.js
import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

import { db } from '../../firebase/config';
const CACHE_KEY = 'latestBlogsCache';
const CACHE_EXPIRY_MS = 5 * 60 * 60 * 1000; // 24 hours

const useLatestBlogs = () => {
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    const loadFromCache = () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const { timestamp, blogs } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
          return blogs;
        } else {
          localStorage.removeItem(CACHE_KEY);
          return null;
        }
      } catch {
        return null;
      }
    };

    const fetchLatestBlogs = async () => {
      try {
        const blogRef = collection(db, 'blogs');
        const q = query(blogRef, orderBy('timestamp', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);
        const blogs = querySnapshot.docs.map(doc => ({
          id: doc.timestamp,
          ...doc.data(),
        }));

        // Cache blogs with current timestamp
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), blogs })
        );

        setLatestBlogs(blogs);
      } catch (error) {
        console.error('Error fetching latest blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    const cachedBlogs = loadFromCache();
    if (cachedBlogs) {
      setLatestBlogs(cachedBlogs);
      setLoading(false);
    } else {
      fetchLatestBlogs();
    }
  }, []);

  return { latestBlogs, loading };
};

export default useLatestBlogs;
