import React, { useEffect, useCallback } from 'react';
import { signInWithGoogle } from '../firebase/firebaseUtils';
import { useNavigate, useLocation } from 'react-router-dom';
import GoogleButton from 'react-google-button';
import { useAuth } from '../context/AuthContext';

const GoogleLoginButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, login, logout } = useAuth();

  // ✅ Memoize the redirect_url function
  const redirect_url = useCallback(() => {
    const isAdminRoute = location.pathname.includes("/admin/");
    const isUserRoute = location.pathname.includes("/user/");

    if (user?.role === "admin" && isAdminRoute) {
      navigate('/admin/');
    } else if (user?.role === "admin" && isUserRoute) {
      navigate('/');
    } else if (user?.role === "user" && isUserRoute) {
      navigate('/');
    }
  }, [location.pathname, navigate, user]);

  useEffect(() => {
    if (user) {
      redirect_url();
    }
  }, [user, redirect_url]);

  const handleLogin = async () => {
    try {
      const firebaseUser = await signInWithGoogle();
      console.log("Here is the user: " + firebaseUser.uid + firebaseUser.displayName);

      const userData = {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        uid: firebaseUser.uid,
        photoURL: firebaseUser.photoURL,
        role: firebaseUser.role, // Make sure role is present
      };

      login(userData);
      redirect_url();
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
          Welcome, <strong>{user.name + " (" + user.role + ")"}</strong>!
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <GoogleButton
          onClick={handleLogin}
          style={{ width: '100%', backgroundColor: '#ff3d10' }}
        />
      )}
    </>
  );
};

export default GoogleLoginButton;
