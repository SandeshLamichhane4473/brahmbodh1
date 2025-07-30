import React, { useState } from 'react';
import { Outlet, NavLink,useNavigate} from 'react-router-dom';
import { FaChevronDown,FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
const navLinks = [
  { to: '/home', label: 'Home' },
  { to: '/blog', label: 'Blog' },
  { to: '/courses', label: 'Courses' },
  { to: '/about', label: 'About Us' },
];

// const courseList = [
//   { to: '/courses/web-development', label: 'Web Development' },
//   { to: '/courses/data-science', label: 'Data Science' },
//   { to: '/courses/ai', label: 'Artificial Intelligence' },
// ];

const navLinkClass = ({ isActive }) =>
  isActive ? 'text-yellow-300 font-semibold underline' : 'text-white hover:text-yellow-200';

const HomeLayout = () => {
  const [showCourses, setShowCourses] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const navigate = useNavigate();

  // const location = useLocation();

  const { user, logout } = useAuth(); // Now you can use user.name
 const [showUserMenu, setShowUserMenu] = useState(false);
  //for the login and logout
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const handleLogin = () => {
  //   navigate('/user/login');
  // };

// const handleLogout = () => setIsLoggedIn(false);
const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    setShowCourses(false); // Close dropdown in mobile
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg px-6 py-4 flex justify-between items-center relative z-50">
 <div  onClick={() => navigate('/')}   className="text-3xl cursor-pointer font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-100 drop-shadow-md tracking-wide font-[Noto Sans Devanagari]">
  ब्रह्म-बोध
</div>


        {/* Hamburger Icon (Mobile) */}
        
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-white text-2xl focus:outline-none"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Nav */}
        <nav className="space-x-4 items-center hidden md:flex relative">
          {navLinks.map((link) =>
            link.label === 'Courses' ? (<></>
              // <div key={link.to} className="relative inline-block">
              //   <button
              //     type="button"
              //     onClick={() => setShowCourses((prev) => !prev)}
              //     className="flex items-center space-x-1 text-white hover:text-yellow-200 focus:outline-none"
              //   >
              //     <span>{link.label}</span>
              //     <FaChevronDown
              //       className={`transition-transform duration-300 ${showCourses ? 'rotate-180' : ''}`}
              //       size={12}
              //     />
              //   </button>
              //   {showCourses && (
              //     <div className="absolute top-full left-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md z-50">
              //       {courseList.map((course) => (
              //         <NavLink
              //           key={course.to}
              //           to={course.to}
              //           className="block px-4 py-2 "
              //           onClick={() => setShowCourses(false)}
              //         >
              //           {course.label}
              //         </NavLink>
              //       ))}
              //     </div>
              //   )}
              // </div>
            ) : (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            )
          )}

          {/* for the user drop down */}

                        <div className="relative">
                  <button
                    onClick={() => setShowUserMenu((prev) => !prev)}
                    className="flex items-center  text-white hover:text-yellow-200 focus:outline-none"
                  >
                    <FaUserCircle className="text-2xl" />
                    <FaChevronDown
                      className={`ml-1 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`}
                      size={12}
                    />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-40 bg-white text-black shadow-lg rounded-md z-50">
                      {user ? (
                        <>
                          <div className="px-4 py-2 border-b border-gray-200 font-semibold">{user.name}</div>
                          
                          <button
                            onClick={() => {
                              logout();
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </>
                      ) : (
                        <NavLink
                          to="user/login"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Login
                        </NavLink>
                      )}
                    </div>
                  )}
                </div>
        </nav>
      </header>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <nav className={`
      md:hidden bg-primary text-white px-6 pb-4 space-y-2
      transform transition-all duration-300 ease-in-out
      animate-fade-slide-down
    `}>
          {navLinks.map((link) =>
            link.label === 'Courses' ? (
              <div key={link.to}>
                <button
                  onClick={() => setShowCourses((prev) => !prev)}
                  className="flex items-center w-full justify-between text-left text-white hover:text-yellow-200"
                >
                  <span>{link.label}</span>
                  <FaChevronDown
                    className={`transition-transform duration-300 ${showCourses ? 'rotate-180' : ''}`}
                    size={12}
                  />
                </button>
                {/* {showCourses && (
                  <div className="pl-4 mt-1 space-y-1">
                    {courseList.map((course) => (
                      <NavLink
                        key={course.to}
                        to={course.to}
                        className="block hover:text-yellow-200"
                        onClick={toggleMobileMenu}
                      >
                        {course.label}
                      </NavLink>
                    ))}
                  </div>
                )} */}
              </div>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                className="block hover:text-yellow-200"
                onClick={toggleMobileMenu}
              >
                {link.label}
              </NavLink>
            )
          )}

       <div className="relative">
  <button
    onClick={() => setShowUserMenu((prev) => !prev)}
    className="flex items-center text-yellow-300 hover:text-yellow-200 focus:outline-none"
  >
    <FaUserCircle className="text-2xl text-white" />
    <FaChevronDown
      className={`ml-1 transition-transform text-white duration-300 ${showUserMenu ? 'rotate-180' : ''}`}
      size={12}
    />
  </button>

  {showUserMenu && (
    <div className="absolute right-0 mt-2 w-40 bg-white text-black shadow-lg rounded-md z-50">
      {user ? (
        <>
          <div className="px-4 py-2 border-b border-gray-200 font-semibold">{user.name}</div>
          <button
            onClick={() => {
              logout();
              setShowUserMenu(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Logout
          </button>
        </>
      ) : (
        <NavLink
          to="user/login"
          onClick={() => setShowUserMenu(false)}
          className="block px-4 py-2 hover:bg-gray-100"
        >
          Login
        </NavLink>
      )}
    </div>
  )}
</div>




        </nav>
      )}

      {/* Main Content */}
      <div className="flex flex-1">
        <main className="flex-1 pt-0 px-4 pb-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; {new Date().getFullYear()} YourWebsite. All rights reserved.
      </footer>
    </div>
  );
};

export default HomeLayout;
