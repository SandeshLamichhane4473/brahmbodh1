import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeLayout from '../pages/user/HomeLayout';
import Blog from '../pages/user/Blog';
import FAQ from '../pages/user/FAQ';
import Yoga from '../pages/user/Yoga';
import Vedant from '../pages/user/Vedant';
import About from '../pages/user/About';
import Home from '../pages/user/Home';
const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<Home />} />           {/* 👈 This makes Home the index */}
        <Route path="blog" element={<Blog />} />
         
        <Route path="about" element={<About />} />
       
        {/* <Route path="faq" element={<FAQ />} />
        <Route path="yoga" element={<Yoga />} />
        <Route path="vedant" element={<Vedant />} />
        <Route path="about" element={<About />} />   */}
      </Route>
    </Routes>
  );
};

export default UserRoutes;
