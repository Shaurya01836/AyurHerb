// components/HomeNavbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const HomeNavbar = ({ searchTerm, onSearchChange, onToggleFilter, onToggleQuiz, isOpen, toggleMenu }) => {
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-30">
      <div className="container mx-auto flex items-center justify-between py-4 px-5 sm:px-8">
        <div className="flex-shrink-0 text-black text-2xl font-semibold">
          <img src="/images/AYURB.png" alt="AYURB Logo" className="h-10" />
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="focus:outline-none">
            <span className="material-icons">{isOpen ? "close" : "menu"}</span>
          </button>
        </div>

        <div className={`flex-grow flex-col md:flex md:flex-row md:justify-center md:space-x-8 md:items-center ${isOpen ? "flex" : "hidden"} md:flex md:space-x-8 transition-all duration-300 ease-in-out`}>
          {[
            { to: "/", label: "Home" },
            { to: "/login", label: "Login" },
            { to: "/health-wellness", label: "Health" },
            { to: "/community", label: "Community" },
            { to: "/dashboard", label: "Dashboard" },
          ].map((link, idx) => (
            <Link key={idx} to={link.to} className="pb-1 text-navbar-text border-b-2 border-transparent hover:border-sub-color hover:text-sub-color transition-colors duration-200">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center w-80">
            <span className="material-icons text-main-color ml-2 mr-3">search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={onSearchChange}
              className="flex-grow p-2 border rounded-xl border-main-color bg-sec-color placeholder:text-gray-400"
              placeholder="Search for plants..."
            />
          </div>

          <button onClick={onToggleFilter} className="flex items-center px-4 py-2 border border-main-color text-main-color rounded-xl bg-sec-color hover:bg-main-color hover:text-white transition-colors duration-200">
            <i className="fa-solid fa-filter mr-2"></i>Filter
          </button>

          <button onClick={onToggleQuiz} className="px-4 py-2 border border-main-color text-main-color rounded-xl bg-sec-color hover:bg-main-color hover:text-white transition-colors duration-200">
            <i className="fa-solid fa-question-circle mr-2"></i>Quiz
          </button>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
