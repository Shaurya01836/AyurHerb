import React, { useState } from "react";
import { auth, firestore } from "../services/firebase"; // Import Firebase auth and firestore
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom"; // Import Link from react-router-dom
import { doc, setDoc, getDoc } from "firebase/firestore"; // Import getDoc from firestore
import Navbar from "./Navbar";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const ensureUserProfile = async (user) => {
  const userRef = doc(firestore, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      displayName: user.displayName || user.email || "Anonymous",
      email: user.email,
      reputation: 0,
      createdAt: new Date().toISOString(),
    });
  }
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Ensure user profile exists in Firestore
      const user = auth.currentUser;
      if (user) await ensureUserProfile(user);

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
          // Ensure user profile exists in Firestore
          const user = auth.currentUser;
          if (user) await ensureUserProfile(user);

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">
        <div className="bg-white/90 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-green-100">
          <h2 className="text-3xl font-extrabold text-center text-green-700 mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-center text-gray-500 mb-6">Sign in to your Herbal Community account</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-lg text-gray-400 hover:text-green-600"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="text-right mt-1">
                <button type="button" className="text-xs text-green-500 hover:underline">Forgot password?</button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl shadow hover:from-green-600 hover:to-emerald-700 transition-all text-lg mt-2"
            >
              Login
            </button>
          </form>
          <button
            onClick={handleAdminLogin}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl mt-4 shadow hover:bg-blue-700 transition-all text-lg"
          >
            Login as Admin
          </button>
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-3 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          <div className="text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/register" className="text-green-600 font-bold hover:underline">
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;