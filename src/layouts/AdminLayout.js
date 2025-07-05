import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaTachometerAlt, FaUsers,FaBaby, FaBlog, FaCog, FaBars } from 'react-icons/fa';
import { useAdminTitle } from './AdminTitleContext';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
   const { logout } = useAuth();
    const navigate = useNavigate();
   //logout 
  
 const handleLogout = () => {
  alert("are you sure ?")
  logout();
   navigate('/admin/login');
  setMobileOpen(false); // Close sidebar on mobile
};
   /////////


  const navItemStyle = ({ isActive }) =>
    `flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-700 transition ${
      isActive ? 'bg-gray-700 text-white font-semibold' : 'text-gray-300'
    }`;
  const { title } = useAdminTitle();

   
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Topbar (mobile only) */}
      <header className="lg:hidden flex items-center bg-gray-800 text-white p-4">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open sidebar"
          className="mr-4"
        >
          <FaBars size={24} />
        </button>
        <h1 className="text-xl font-semibold">{title}</h1>
      </header>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 bg-gray-800 text-white p-4
          w-64
          transform transition-transform duration-300 ease-in-out
          z-50
          lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:w-auto
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed && 'lg:w-20'}
        `}
      >
        {/* Close button (mobile only) */}
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h2 className="text-xl font-semibold">{!collapsed && 'Admin'}</h2>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
            className="text-white"
          >
            ✕
          </button>
        </div>

        {/* Desktop toggle button */}
        <div className="hidden lg:flex justify-between items-center mb-6">
          {!collapsed && <h2 className="text-xl font-semibold">Admin</h2>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white"
            aria-label="Toggle sidebar"
          >
            <FaBars className='ml-3' />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2">
          <NavLink
            to="/admin"
            end
            className={navItemStyle}
            onClick={() => setMobileOpen(false)}
          >
            <FaTachometerAlt />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>
          <NavLink
            to="/admin/users"
            className={navItemStyle}
            onClick={() => setMobileOpen(false)}
          >

         
            <FaUsers />
            {!collapsed && <span>Users</span>}
          </NavLink>
          
          <NavLink
            to="/admin/blogs"
            className={navItemStyle}
            onClick={() => setMobileOpen(false)}
          >
            <FaBlog />
            {!collapsed && <span>Blogs</span>}
          </NavLink>


         <NavLink
            to="/admin/course"
            className={navItemStyle}
            onClick={() => setMobileOpen(false)}
          >
            <FaBaby />
            {!collapsed && <span>Course</span>}
          </NavLink>
          




          <NavLink
             to="/admin/settings"
            className={navItemStyle}
            onClick={() => setMobileOpen(false)}
          >
            <FaCog />
            {!collapsed && <span>Settings</span>}
          </NavLink>

            <hr className="my-2 border-gray-600" />
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded text-red-300 hover:bg-red-700 hover:text-white transition"
            >
              <FaSignOutAlt />
              {!collapsed && <span>Logout</span>}
            </button>

        </nav>
      </aside>

      {/* Overlay backdrop for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <main
         className={`
          flex-1 bg-gray-100 p-6
          transition-all duration-300
           
        `}
        style={{ marginLeft: collapsed && window.innerWidth >= 1024 ? '0rem' : window.innerWidth >= 1024 ? '0rem' : '0' }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
