// src/pages/admin/Dashboard.jsx
import React from 'react';
import { useAdminTitle } from '../../layouts/AdminTitleContext';
import { useEffect } from 'react';
 


const Dashboard = () => {
  const { setTitle } = useAdminTitle();
    useEffect(() => {
    setTitle('Dashboardx');
  }, [setTitle]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-red-600">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome to the admin panel.</p>
    </div>
  );
};

export default Dashboard;
