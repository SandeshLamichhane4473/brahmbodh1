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

const BATCH_SIZE = 6;

const useLatestPhotosBlog = () => {
  const [photosBlogs, setPhotosBlogs] = useState([]);
  const [photosBlogLoading, setPhotosBlogLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

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

    setPhotosBlogs((prevBlogs) =>
      startAfterDoc ? [...prevBlogs, ...newBlogs] : newBlogs
    );

    setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
  }, []);

  useEffect(() => {
    fetchPhotosBlogs().finally(() => setPhotosBlogLoading(false));
  }, [fetchPhotosBlogs]);

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