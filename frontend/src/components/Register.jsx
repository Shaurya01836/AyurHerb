// src/components/Register.jsx
import React, { useState } from "react";
import { auth } from "../services/firebase"; // Ensure this is correct
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { firestore } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom"; // Import Link from react-router-dom
import Navbar from "./Navbar";
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const ensureUserProfile = async (user, name) => {
    const userRef = doc(firestore, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        displayName: name || user.displayName || user.email || "Anonymous",
        email: user.email,
        reputation: 0,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user data to Realtime Database
      const db = getDatabase();
      await set(ref(db, "users/" + user.uid), {
        name: name,
        email: email,
      });
      // Ensure user profile exists in Firestore
      await ensureUserProfile(user, name);

      // Show success alert
      window.alert(
        "Registration successful! You will be redirected to the dashboard."
      );
      navigate("/dashboard"); // Redirect to dashboard after successful registration
    } catch (error) {
      // Show error alert
      window.alert(`Error registering user: ${error.message}`);
      console.error("Error registering user:", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4 sm:p-8">
      <Navbar/>
      <div className="bg-white/90 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-green-100">
        <h2 className="text-3xl font-extrabold text-center text-green-700 mb-2 tracking-tight">Create Account</h2>
        <p className="text-center text-gray-500 mb-6">Join the Herbal Community</p>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl shadow hover:from-green-600 hover:to-emerald-700 transition-all text-lg mt-2"
          >
            Register
          </button>
        </form>
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-3 text-gray-400 text-sm">or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
        <div className="text-center">
          <span className="text-gray-600">Already a user? </span>
          <Link
            to="/login"
            className="text-green-600 font-bold hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
