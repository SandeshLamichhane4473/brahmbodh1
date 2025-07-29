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
import { db } from '../../firebase/config';

const BATCH_SIZE = 5;

const useAllBlog = (categoryFilter = null) => {
  const [allBlogs, setAllBlogs] = useState([]);
  const [loadingaLLBlogs, setLoadingAllBlogs] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchAllBlogs = useCallback(
    async (startAfterDoc = null, isNewCategory = false) => {
      try {
        const blogsRef = collection(db, 'blogs');
        let q;

        if (categoryFilter) {
          q = query(
            blogsRef,
            where('category', '==', categoryFilter),
            where('visible', '==', 'public'),
            where('status', '==', 'C'),
            orderBy('timestamp', 'desc'),
            limit(BATCH_SIZE)
          );
        } else {
          q = query(
            blogsRef,
            where('category', '!=', 'home'),
            where('visible', '==', 'public'),
            where('status', '==', 'C'),
            orderBy('category'),
            orderBy('timestamp', 'desc'),
            limit(BATCH_SIZE)
          );
        }

        if (startAfterDoc) {
          q = query(q, startAfter(startAfterDoc));
        }

        const snapshot = await getDocs(q);
        const newBlogs = snapshot.docs.map((doc) => ({ ...doc.data() }));

        setAllBlogs((prev) => {
          return startAfterDoc && !isNewCategory ? [...prev, ...newBlogs] : newBlogs;
        });

        setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
        setHasMore(newBlogs.length === BATCH_SIZE);
      } catch (e) {
        console.error('Error fetching blogs:', e);
      }
    },
    [categoryFilter]
  );

  useEffect(() => {
    setAllBlogs([]);
    setLastVisible(null);
    setHasMore(true);
    setLoadingAllBlogs(true);

    fetchAllBlogs(null, true).finally(() => setLoadingAllBlogs(false));
  }, [categoryFilter, fetchAllBlogs]);

  const loadMore = async () => {
    if (lastVisible && hasMore) {
      await fetchAllBlogs(lastVisible);
    }
  };

  return {
    allBlogs,
    loadingaLLBlogs,
    loadMore,
    hasMore
  };
};

export default useAllBlog;
