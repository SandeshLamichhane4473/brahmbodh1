// src/routes/AdminRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import Users from '../pages/admin/Users'; // ✅ Import Users
import Blogs from '../pages/admin/Blogs';
import Settings from '../pages/admin/Settings';
import { AdminTitleProvider } from '../layouts/AdminTitleContext'; // ✅ Import the context
import PrivateRoute from './PrivateRoute';
import AdminCourse from '../pages/admin/AdminCourse';
import AddNewCourse from '../pages/admin/AddNewCourse';
import EditUser from '../pages/admin/EditUser';
import AddEditBlog from '../pages/admin/BlogAddEdit';
import AddCategories from '../pages/admin/extra/AddCategories';
const AdminRoutes = () => {
  return (
    <Routes>
     
    <Route
        path=""
        element={
          <PrivateRoute>
            <AdminTitleProvider>
              <AdminLayout />
            </AdminTitleProvider>
          </PrivateRoute>
        }
      >


     
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="blogs" element={<Blogs />} />     
         <Route path="course" element={<AdminCourse />} />  
        <Route path="settings" element={<Settings />} />  
        <Route path="addnewcourse" element={<AddNewCourse />} />
        <Route path="editcourse/:courseId" element={<AddNewCourse />} />
        <Route path="edituser/:userId" element={<EditUser />} />
         <Route path="addblog" element={<AddEditBlog />} />
         <Route path="editblog/:blogId" element={<AddEditBlog />} />
         <Route path="addcat" element={<AddCategories />} />
         </Route>
    </Routes>
  );
};

export default AdminRoutes;
