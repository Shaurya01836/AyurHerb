import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HealthWellness from './components/HealthWellness';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';  // Component for protected routes
import './styles/global.css';
import GardeningTips from './components/GardeningTips'; // Import the Gardening Tips component
import Home from './pages/Home';
import CommunityForum from './components/Community';
import MyHerbs from './components/MyHerbs';
import Admin from './components/AdminPanel';



const App = () => {
  return (
    <Router>
      <div>
        {/* Define your routes */}
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} /> {/* About Page */}
          <Route path="/health-wellness" element={<HealthWellness />} />
          <Route path="/gardening-tips" element={<GardeningTips />} /> 
          <Route path="/myherbs" element={<MyHerbs />} /> 
          <Route path="/admin" element={<Admin />} /> 
        
          {/* Authentication routes */}
          <Route path="/login" element={<Login />} />   {/* Login Page */}
          <Route path="/register" element={<Register />} />   {/* Register Page */}

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>  {/* Only accessible if logged in */}
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/community"
            element={
              <PrivateRoute>  {/* Only accessible if logged in */}
                <CommunityForum />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
