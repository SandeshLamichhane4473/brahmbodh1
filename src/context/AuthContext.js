// src/context/AuthContext.js
import React, { createContext, useContext, useState,useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { db } from '../firebase/config';
import { getDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
// Create the context
const AuthContext = createContext();

// Custom hook to use the context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component that wraps your app
export const AuthProvider = ({ children }) => {
  // Simulated user state (null = not logged in)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Simulate login (replace with API later)

   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) =>  {
      if (firebaseUser) {
       
        // You can optionally fetch more user data from Firestore here
        try {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
         if (userSnap.exists()) {
 
          const firestoreData = userSnap.data();
          const userData = {
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            uid: firebaseUser.uid,
            photoURL: firebaseUser.photoURL,
            authorization: firestoreData.authorization || "N",
            role: firestoreData.role || "user",
          };

          setUser(userData);
        } else {
          console.warn("No user doc found in Firestore.");
        }
        } catch (error) {
        console.error("Error fetching user data from Firestore:", error);
      }

      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const login = (userData) => setUser(userData);

  // Logout
  const logout = async () =>{ await signOut(auth);setUser(null)};

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
