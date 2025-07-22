import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, startAfter, getDocs } from "firebase/firestore";

const usePaginatedQuery = ({
  db,
  collectionName,
  orderByField = "timestamp",
  pageSize = 5,
  initialLoad = true,
}) => {
  const [data, setData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadInitial = async () => {
    setLoading(true);
    const q = query(
      collection(db, collectionName),
      orderBy(orderByField, "desc"),
      limit(pageSize)
    );

    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    setData(docs);
    setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    setHasMore(snapshot.docs.length === pageSize);
    setLoading(false);
  };

  const loadMore = async () => {
    if (!lastVisible || !hasMore) return;
    setLoading(true);

    const q = query(
      collection(db, collectionName),
      orderBy(orderByField, "desc"),
      startAfter(lastVisible),
      limit(pageSize)
    );

    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    setData((prev) => [...prev, ...docs]);
    setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    setHasMore(snapshot.docs.length === pageSize);
    setLoading(false);
  };

  useEffect(() => {
    if (initialLoad) loadInitial();
  }, [collectionName]);

  return { data, loading, loadMore, hasMore, reload: loadInitial };
};

export default usePaginatedQuery;
