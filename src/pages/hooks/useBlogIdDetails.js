// src/hooks/useBlogIdDetails.js
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { fetchBlogBody } from '../component/fetchBlogBody';

const CACHE_EXPIRY_MS = 3 * 60 * 60 * 1000; // 3 hours

const useBlogIdDetails = (blogId) => {
  const [blogIdDetails, setBlogIdDetails] = useState(null);
  const [loadingId, setLoadingId] = useState(true);
  const [htmlBody, setHtmlBody] = useState(null);

  useEffect(() => {
    if (!blogId) return;

    const CACHE_KEY = `blog_${blogId}`; // unique cache key per blog ID

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

    const fetchBlogIdDetails = async () => {
      try {
        const blogRef = doc(db, 'blogs', blogId);
        const blogSnap = await getDoc(blogRef);
        if (blogSnap.exists()) {
          const data = blogSnap.data();

          // Save to cache
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ timestamp: Date.now(), data })
          );

          setBlogIdDetails(data);

          // Fetch blog HTML body
          const html = await fetchBlogBody(data.body_url);
          setHtmlBody(html);
        } else {
          console.warn('No blog found with ID:', blogId);
        }
      } catch (error) {
        console.error('Error fetching blog details:', error);
      } finally {
        setLoadingId(false);
      }
    };

    const cached = loadFromCache();
    if (cached) {
      setBlogIdDetails(cached);
      fetchBlogBody(cached.body_url).then(setHtmlBody); // fetch html body even if cache used
      setLoadingId(false);
    } else {
      fetchBlogIdDetails();
    }
  }, [blogId]);

  return { blogIdDetails, loadingId, htmlBody };
};

export default useBlogIdDetails;
