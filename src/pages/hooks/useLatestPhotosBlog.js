// src/hooks/useLatestPhotosBlog.js
 
import { db } from '../../firebase/config';
import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  startAfter
} from 'firebase/firestore';
 

const CACHE_KEY = 'cached_photos_blogs';
const CACHE_EXPIRY_MS = 3 * 60 * 60 * 1000; // 3 hours
const BATCH_SIZE = 2;

const useLatestPhotosBlog = () => {
  const [photosBlogs, setPhotosBlogs] = useState([]);
  const [photosBlogLoading, setPhotosBlogLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

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

  const saveToCache = (blogs) => {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), data: blogs })
    );
  };

  const fetchPhotosBlogs = useCallback(async (startAfterDoc = null) => {
    const blogsRef = collection(db, 'blogs');
    let q = query(
      blogsRef,
      where('category', '==', 'photos'),
      where('visible', '==', 'public'),
      where('status', '==', 'C'),
      orderBy('timestamp', 'desc'),
      limit(BATCH_SIZE)
    );

    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc));
    }

    const snapshot = await getDocs(q);

    const newBlogs = snapshot.docs.map((doc) => ({
      ...doc.data(),
    }));

    if (newBlogs.length < BATCH_SIZE) {
      setHasMore(false);
    }

    setPhotosBlogs((prevBlogs) => {
      const updated = startAfterDoc ? [...prevBlogs, ...newBlogs] : newBlogs;
      saveToCache(updated);
      return updated;
    });

    setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
  }, []); // ✅ empty dependencies

  useEffect(() => {
    const cached = loadFromCache();
    
    if (cached) {
      console.log("photo loaded from cache");
      setPhotosBlogs(cached);

          
    // ✅ SET lastVisible manually if cached data exists
    const lastBlogTimestamp = cached[cached.length - 1]?.timestamp;
    if (lastBlogTimestamp) {
      // Re-query to get the document snapshot for `startAfter`
      const fetchLastVisible = async () => {
        const blogsRef = collection(db, 'blogs');
        const q = query(
          blogsRef,
          where('category', '==', 'photos'),
          where('visible', '==', 'public'),
          where('status', '==', 'C'),
          orderBy('timestamp', 'desc'),
          limit(BATCH_SIZE)
        );
        const snapshot = await getDocs(q);
        const lastDoc = snapshot.docs.find(doc => doc.data().timestamp === lastBlogTimestamp);
        if (lastDoc) {
          setLastVisible(lastDoc);
        }
      };
      fetchLastVisible();
    }




      setPhotosBlogLoading(false);
    } else {
      console.log("photo not loaded from cache");
      fetchPhotosBlogs().finally(() => setPhotosBlogLoading(false));
    }
  }, [fetchPhotosBlogs]); // ✅ safe to use empty array now

  const loadMore = async () => {
     
    if (lastVisible && hasMore) {
      await fetchPhotosBlogs(lastVisible);
    }
  };

  return {
    photosBlogs,
    photosBlogLoading,
    loadMore,
    hasMore,
  };
};

export default useLatestPhotosBlog;
