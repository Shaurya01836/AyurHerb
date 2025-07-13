import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../services/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FaUser, FaSignOutAlt, FaTachometerAlt, FaCog } from "react-icons/fa";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [userName, setUserName] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (user) {
      const email = user.email.split("@")[0];
      setUserName(email);
      
      // Check if user is admin
      const checkAdminStatus = async () => {
        try {
          const adminDoc = await getDoc(doc(firestore, "admins", user.email));
          setIsAdmin(adminDoc.exists());
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      };
      
      checkAdminStatus();
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-white/50 fixed top-0 left-0 w-full z-30 border-b border-gray-100 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center py-3 px-8">
        {/* Logo */}
        <div className="flex-shrink-0 text-black text-2xl font-semibold">
          <Link
            to="/"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img src="/images/AYURB.png" alt="AYURB Logo" className="h-10" />
          </Link>
        </div>

        {/* Hamburger Icon (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-800 hover:text-green-600 focus:outline-none focus:text-green-600"
          >
            <i className={`fas ${isOpen ? "fa-times" : "fa-bars"} text-xl`}></i>
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {[
            { to: "/", label: "Home", icon: "🏠" },
            { to: "/all-plants", label: "All Plants", icon: "🌿" },
            { to: "/health-wellness", label: "Health", icon: "🌿" },
            { to: "/community", label: "Community", icon: "👥" },
          ].map((link, idx) => (
            <Link
              key={idx}
              to={link.to}
              className="flex items-center space-x-1 pb-1 text-gray-700 border-b-2 border-transparent hover:border-green-500 hover:text-green-600 transition-all duration-200 font-medium"
            >
              <span className="text-sm">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}

          {/* Auth Section Desktop */}
          {!loading && (
            <div className="flex items-center space-x-3">
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-full">
                      <FaUser className="text-sm" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden lg:block">
                      {userName}
                    </span>
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {userName}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <FaTachometerAlt className="mr-3 text-green-600" />
                        Dashboard
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <FaCog className="mr-3 text-blue-600" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <FaSignOutAlt className="mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium"
                >
                  <FaUser className="mr-2" />
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white px-8 pb-4 space-y-3 shadow-lg border-t border-gray-100">
          {/* Mobile Links */}
          {[
            { to: "/", label: "Home", icon: "🏠" },
            { to: "/all-plants", label: "All Plants", icon: "🌿" },
            { to: "/health-wellness", label: "Health", icon: "🌿" },
            { to: "/community", label: "Community", icon: "👥" },
          ].map((link, idx) => (
            <Link
              key={idx}
              to={link.to}
              className="flex items-center space-x-3 py-2 text-gray-700 border-b border-gray-100 hover:text-green-600 hover:bg-green-50 rounded-lg px-2 transition-all duration-200"
              onClick={toggleMenu}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}

          {/* Auth Section Mobile */}
          {!loading && (
            <div className="pt-2 border-t border-gray-200">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 py-2 px-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-full">
                      <FaUser className="text-sm" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">{userName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-3 py-2 px-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                    onClick={toggleMenu}
                  >
                    <FaTachometerAlt className="text-lg text-green-600" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-3 py-2 px-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                      onClick={toggleMenu}
                    >
                      <FaCog className="text-lg text-blue-600" />
                      <span className="font-medium">Admin Panel</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      toggleMenu();
                      handleLogout();
                    }}
                    className="flex items-center space-x-3 py-2 px-2 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <FaSignOutAlt className="text-lg" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-3 py-2 px-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
                  onClick={toggleMenu}
                >
                  <FaUser className="text-lg" />
                  <span className="font-medium">Login</span>
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
