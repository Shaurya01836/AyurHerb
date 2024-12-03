import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-30">
      <div className="container mx-auto flex justify-between items-center py-4 px-8">
        {/* Logo */}
        <div className="flex-shrink-0 text-black text-2xl font-semibold">
          <img src="/images/AYURB.png" alt="AYURB Logo" className="h-10" />
        </div>

        {/* Hamburger Icon (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-800 hover:text-sub-color focus:outline-none focus:text-sub-color"
          >
            <i className={`fas ${isOpen ? "fa-times" : "fa-bars"} text-xl`}></i>
          </button>
        </div>

        {/* Links */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } w-full md:flex md:items-center md:justify-center md:space-x-8`}
        >
          <div className="flex flex-col md:flex-row md:space-x-8 items-center">
            <Link
              to="/"
              className="pb-1 text-navbar-text border-b-2 border-transparent hover:border-sub-color hover:text-sub-color transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="pb-1 text-navbar-text border-b-2 border-transparent hover:border-sub-color hover:text-sub-color transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/health-wellness"
              className="pb-1 text-navbar-text border-b-2 border-transparent hover:border-sub-color hover:text-sub-color transition-colors duration-200"
            >
              Health
            </Link>
            <Link
              to="/community"
              className="pb-1 text-navbar-text border-b-2 border-transparent hover:border-sub-color hover:text-sub-color transition-colors duration-200"
            >
              Community
            </Link>
            <Link
              to="/dashboard"
              className="pb-1 text-navbar-text border-b-2 border-transparent hover:border-sub-color hover:text-sub-color transition-colors duration-200"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
