import React, { useState } from "react";
import { auth, firestore } from "../services/firebase"; // Import Firebase auth and firestore
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom"; // Import Link from react-router-dom
import { doc, getDoc } from "firebase/firestore"; // Import getDoc from firestore
import Navbar from "./Navbar";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Show success alert
      window.alert("Login successful! Redirecting to your dashboard.");
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } catch (error) {
      // Show error alert
      window.alert(`Error logging in: ${error.message}`);
      console.error("Error logging in:", error.message);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const adminDoc = await getDoc(doc(firestore, "admins", email));
      if (adminDoc.exists()) {
        const adminData = adminDoc.data();
        if (adminData.password === password) {
          await signInWithEmailAndPassword(auth, email, password);

          // Show success alert
          window.alert("Admin login successful! Redirecting to admin panel.");
          navigate("/admin"); // Redirect to admin panel after successful login
        } else {
          // Show error alert
          window.alert("Error logging in: Incorrect password.");
        }
      } else {
        // Show error alert
        window.alert("Error logging in: Admin email not found.");
      }
    } catch (error) {
      // Show error alert
      window.alert(`Error logging in: ${error.message}`);
      console.error("Error logging in:", error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-green-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center text-green-600">
            Login
          </h2>
          <form onSubmit={handleLogin} className="mt-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded w-full mb-4"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border rounded w-full mb-4"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              Login
            </button>
          </form>
          <button
            onClick={handleAdminLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-4"
          >
            Login as Admin
          </button>
          <div className="mt-4 text-center">
            <Link to="/register" className="text-blue-500 hover:underline">
              Don't have an account? Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;