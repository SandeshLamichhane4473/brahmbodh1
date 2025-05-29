import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';
 
import { ImOpt } from 'react-icons/im';
import UserLogin from './pages/user/UserLogin';
import AdminLogin from './pages/admin/AdminLogin';
import UserRoutes from './routes/UserRoutes';
function App() {
  return (
   
      <Routes>

          {/* Public route */}

           
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* User-facing site with layout */}
          <Route path="/*" element={<UserRoutes />} />
           {/* Protected admin routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="*" element={<h1>Not found</h1> } />
        {/* Admin section */}
       
      </Routes>
    
  );
}

export default App;
