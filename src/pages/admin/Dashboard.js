// src/pages/admin/Dashboard.jsx
import React from 'react';
import { useAdminTitle } from '../../layouts/AdminTitleContext';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';


const Dashboard = () => {
  const { setTitle } = useAdminTitle();
  const { user} = useAuth();

   
    useEffect(() => {
    setTitle('Dashboardx');
  }, [setTitle]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-red-600">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome to the admin panel.</p>

      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={user.photoURL}
            alt=""
            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
             referrerPolicy="no-referrer"
          />
          <span>Welcome, <strong>{user.name}</strong></span><br/>
           <span> <strong>{ user.email}</strong></span> <br />
            <span> <strong>{user.role}</strong></span><br/>
           <span>  <strong>{user.authorization}</strong></span>
           
        </div>
      ) : 
      <></>
    }
    </div>
  );
};

export default Dashboard;
