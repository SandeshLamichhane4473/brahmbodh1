import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
 import { db } from "../../../firebase/config";// / adjust path based on your project structure

export function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("categories");

    if (stored) {
      
      setCategories(JSON.parse(stored));
    } else {
      const fetchCategories = async () => {
        try {
          const docRef = doc(db, "categories", "list");
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const list = Object.keys(data);
            
            setCategories(data); // set to categories
            localStorage.setItem("categories", JSON.stringify(data));
          }
        } catch (err) {
          console.error("Error fetching categories:", err);
        }
      };

      fetchCategories();
    }
  }, []);

  return categories;
}
