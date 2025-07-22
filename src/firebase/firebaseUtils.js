import { signInWithPopup  } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, provider, db } from "./config";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
     
    if (!userSnap.exists()) {
      const userData={
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        role:'user',
        authorization: 'N'
      }
      await setDoc(userRef, userData, { merge: true });
    //if user not exist 
     return userData;
    } else{
      return userData;
    }

    
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};
