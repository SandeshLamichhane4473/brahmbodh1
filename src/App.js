import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';



function App() {
  return (
    <Router>
      <Routes>
        {/* Admin section */}
        <Route path="/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
