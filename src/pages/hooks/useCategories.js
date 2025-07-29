// src/hooks/useLatestHomeBlog.js
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const CACHE_KEY = 'latest_categories';
const CACHE_EXPIRY_MS = 4 * 60 * 60 * 1000; // 4 hours

const useLatestCategories = () => {
  const [categoriesList, setCategoriesList] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);

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
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchLatestCategories = async () => {
      try {
        const docRef = doc(db, "categories", "list");
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCategoriesList(data);
          
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ timestamp: Date.now(), data })
          );
        } else {
          console.warn('No category data found at categories/list');
        }
      } catch (error) {
        alert('Error fetching categories:', error.message);
        console.log("erros"+error.message);
      } finally {
        setLoadingCategories(false);
      }
    };

    const cached = loadFromCache();
  

    if (cached) {
      setCategoriesList(cached);
      setLoadingCategories(false);
    } else {
  
      fetchLatestCategories();
    }
  }, []);

  return { categoriesList, loadingCategories };
};

export default useLatestCategories;
