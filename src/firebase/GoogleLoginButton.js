import React, {useEffect } from 'react';
import { signInWithGoogle } from '../firebase/firebaseUtils';
 import { useNavigate } from 'react-router-dom';
 import GoogleButton from 'react-google-button'
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';


const GoogleLoginButton = () => {
   const location = useLocation();
 


  const navigate = useNavigate();
  // use context
   const { user, login ,logout} = useAuth(); 

   function redirect_url(){
    const isAdminRoute = location.pathname.includes("/admin/");
     const isUserRoute = location.pathname.includes("/user/");
    if (user && user.role==="admin" && isAdminRoute) {
      navigate('/admin/');
    }
    if (user && user.role==="admin" && isUserRoute) {
      navigate('/');
    }

    if (user && user.role==="user" && isUserRoute) {
      navigate('/');
    }
   }
   useEffect(() => {
    //if the user is already alogged in and has role admin
     redirect_url()
     
  }, [user, navigate,redirect_url]);
   
  const handleLogin = async () => {
    try {
      const firebaseUser = await signInWithGoogle();
       // Store essential info in context
       console.log("hers is the user"+firebaseUser.uid+firebaseUser.displayName)
      const userData = {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        uid: firebaseUser.uid,
        photoURL: firebaseUser.photoURL,
        role:firebaseUser.role
      };
      login(userData);
      redirect_url()
 
    } catch (error) {
      alert(error);

    }
  };

  return (
   <>
      {user ? (
        <div>
          <img
            src={user.photoURL}
            alt=""
            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
             referrerPolicy="no-referrer"
          />
          Welcome, <strong>{user.name+ user.role}</strong>!
          <button onClick={()=>{logout()}}>Logout</button>
        </div>
      ) : (

        <GoogleButton
            onClick={handleLogin}
            style={{width:'100%', backgroundColor: '#ff3d10',}}
            
          />
        
      )}
    </>
  );
};

export default GoogleLoginButton;
