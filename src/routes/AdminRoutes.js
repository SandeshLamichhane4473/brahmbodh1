// src/routes/AdminRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import Users from '../pages/admin/Users'; // ✅ Import Users
import Blogs from '../pages/admin/Blogs';
import Settings from '../pages/admin/Settings';
import { AdminTitleProvider } from '../layouts/AdminTitleContext'; // ✅ Import the context

const AdminRoutes = () => {
  return (
    <Routes>
       <Route path="/admin"  element={
          <AdminTitleProvider>
            <AdminLayout />
          </AdminTitleProvider>
        }>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="blogs" element={<Blogs />} />     
        <Route path="settings" element={<Settings />} />  



         </Route>
    </Routes>
  );
};

export default AdminRoutes;
