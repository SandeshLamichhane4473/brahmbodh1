// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

// Create the context
const AuthContext = createContext();

// Custom hook to use the context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component that wraps your app
export const AuthProvider = ({ children }) => {
  // Simulated user state (null = not logged in)
  const [user, setUser] = useState(null);

  // Simulate login (replace with API later)
  const login = (userData) => setUser(userData);

  // Logout
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
