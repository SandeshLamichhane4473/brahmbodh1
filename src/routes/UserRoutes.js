import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeLayout from '../pages/user/HomeLayout';
import Blog from '../pages/user/Blog';
 
import About from '../pages/user/About';
import Home from '../pages/user/Home';
import Course from '../pages/user/Course';
import ViewCourse from '../pages/user/ViewCourse';
import ViewBlog from '../pages/user/ReadBlog';
const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<Home />} />           {/* 👈 This makes Home the index */}
        <Route path="home" element={<Home />} />
        <Route path="blog" element={<Blog />} />
        <Route  path="course" element={<Course />} />
        <Route path="about" element={<About />} />
        <Route path="/course/:courseId/:subtitleId?" element={<ViewCourse />} />  
        <Route path="/readblog/:id/*" element={<ViewBlog />} />

       {/* :subtitleId? means it's optional,  */}
        {/* <Route path="faq" element={<FAQ />} />
        <Route path="yoga" element={<Yoga />} />
        <Route path="vedant" element={<Vedant />} />
        <Route path="about" element={<About />} />   */}
      </Route>
    </Routes>
  );
};

export default UserRoutes;
