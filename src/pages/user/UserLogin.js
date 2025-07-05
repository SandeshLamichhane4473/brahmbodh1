import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png'
import GoogleLoginButton from '../../firebase/GoogleLoginButton'

const UserLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Simulate validation (replace with real logic in future)
    if (email && password) {
      alert(email + password)
      const userData = { name: email, role: 'admin' };
      localStorage.setItem('user', JSON.stringify(userData)); // Persist login
      login(userData);
     
    if (userData.role === 'user') {
      navigate('/');
    } else {
      navigate('/admin/'); // Redirect to main page for non-admin users
    }
      
    } else {
      alert('Please enter both email and password');
    }
  };
   

  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="bg-white shadow-lg rounded-lg p-5 w-full max-w-sm">
    
    {/* Logo */}
    <div className="flex justify-center mb-6">
     <img
          src={logo}
          alt="Logo"
          className="h-[150px] w-[150px] rounded-full object-cover"
        />

    </div>

 

    {/* Title */}
    <h2 className="text-2xl font-semibold text-center text-secondary mb-6">Normal User Login</h2>
    <GoogleLoginButton />

    {/* Email Field */}
    {/* <input
      type="email"
      placeholder="Email"
      className="w-full mb-3 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    /> */}

    {/* Password Field */}
    {/* <input
      type="password"
      placeholder="Password"
      className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    /> */}

    {/* Login Button */}
    {/* <button
      onClick={handleLogin}
      className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
    >
      Login
    </button> */}
  </div>
</div>

  );
};

export default UserLogin;
