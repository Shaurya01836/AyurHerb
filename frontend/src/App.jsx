import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HealthWellness from "./pages/HealthWellness";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute"; // Component for protected routes
import "./styles/global.css";
import GardeningTips from "./pages/GardeningTips"; // Import the Gardening Tips component
import Home from "./pages/Home";
import CommunityForum from "./pages/Community";
import MyHerbs from "./pages/MyHerbs";
import AdminPanel from "./pages/AdminPanel";
import DiseaseRecommendation from "./components/DiseaseRecommendation";
import AllPlants from "./pages/AllPlants";
import PlantDetail from "./pages/PlantDetail";
import UserProfile from "./pages/UserProfile";
import AddHerb from "./pages/AddHerb";

const App = () => {
  return (
    <Router>
      <div>
  
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} /> {/* About Page */}
          <Route path="/all-plants" element={<AllPlants />} />
          <Route path="/plant/:id" element={<PlantDetail />} />
          <Route path="/health-wellness" element={<HealthWellness />} />
          <Route path="/gardening-tips" element={<GardeningTips />} />
          <Route path="/myherbs" element={<MyHerbs />} />
          <Route path="/disease" element={<DiseaseRecommendation />} />
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/add-herb" element={<AddHerb />} />
          {/* Authentication routes */}
          <Route path="/login" element={<Login />} /> {/* Login Page */}
          <Route path="/register" element={<Register />} />{" "}
          {/* Register Page */}
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                {" "}
                {/* Only accessible if logged in */}
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/community"
            element={
              <PrivateRoute>
                {" "}
                {/* Only accessible if logged in */}
                <CommunityForum />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                {" "}
                {/* Only accessible if logged in */}
                <AdminPanel />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
