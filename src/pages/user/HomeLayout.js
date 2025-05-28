import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const navLinks = [
   { to: '/home', label: 'Home' },
  { to: '/blog', label: 'Blog' },
  { to: '/faq', label: 'FAQ' },
  { to: '/yoga', label: 'Yoga' },
  { to: '/vedant', label: 'Vedant' },
  { to: '/about', label: 'About Us' },
];

const HomeLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header / Navbar */}
      <header className="bg-primary text-white shadow px-6 py-4 flex justify-between items-center">
        <div className="font-bold text-xl">YourLogo</div>
        <nav className="space-x-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? 'text-yellow-300 font-semibold' : 'text-white hover:text-yellow-200'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Sidebar & Main Content */}
      <div className="flex flex-1">
        <aside className="w-64 bg-secondary text-white p-4 hidden md:block">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? 'text-yellow-300' : 'text-white hover:text-yellow-200'
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; {new Date().getFullYear()} YourWebsite. All rights reserved.
      </footer>
    </div>
  );
};

export default HomeLayout;
