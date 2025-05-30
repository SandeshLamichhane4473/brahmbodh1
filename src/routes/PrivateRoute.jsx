// src/routes/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  // ✅ Only allow if user exists and has "admin" role (optional)
  return user && user.role === 'admin' ? children : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;
