import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-sec-color text-main-color py-12 px-4 md:px-10 shadow-xl border-t-2 border">
      <div className="flex flex-col md:flex-row justify-between">
        {/* Left Section: Logo */}
        <div className="mb-8 md:mb-0 md:w-1/3 flex justify-center md:justify-start">
          <img src="/images/AYURB.png" alt="AyurHerb Logo" className="h-20" />
        </div>

        {/* Center Section: Address, Email, and Company Name */}
        <div className="md:w-1/3 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start mb-4">
            <i className="fa-solid fa-location-dot text-main-color text-2xl mr-4"></i>
            <p className="text-lg">
              <span className="block">Poornima College of Engineering,</span>
              Jaipur, 302022 (Rajasthan)
            </p>
          </div>
          <div className="flex items-center justify-center md:justify-start mb-4">
            <i className="fa-solid fa-envelope text-main-color text-2xl mr-4"></i>
            <p className="text-lg">ayurherb@gmail.com</p>
          </div>
        </div>

        {/* Right Section: About the Website and Social Icons */}
        <div className="md:w-1/4 text-center md:text-left">
          <span className="text-xl font-bold">Technology Stack Used:</span>
          <div className="flex justify-center md:justify-start mt-6 space-x-4">
            <a href="https://www.instagram.com/sidxwal/" target="_blank" rel="noopener noreferrer" className="text-3xl hover:text-sub-color">
              <i className="fab fa-react text-4xl text-blue-500"></i>
            </a>
            <a href="https://www.linkedin.com/in/siddhant-khandelwal/" target="_blank" rel="noopener noreferrer" className="text-3xl hover:text-sub-color">
              <i className="fab fa-node-js text-4xl text-green-500"></i>
            </a>
            <a href="https://twitter.com/sidxwal" target="_blank" rel="noopener noreferrer" className="text-3xl hover:text-sub-color">
              <i className="fas fa-database text-4xl text-yellow-500"></i>
            </a>
            <a href="https://twitter.com/sidxwal" target="_blank" rel="noopener noreferrer" className="text-3xl hover:text-sub-color">
              <i className="fas fa-vr-cardboard text-4xl text-purple-500"></i>
            </a>
            <a href="https://twitter.com/sidxwal" target="_blank" rel="noopener noreferrer" className="text-3xl hover:text-sub-color">
              <i className="fab fa-css3-alt text-4xl text-blue-600"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom Text */}
      <h3 className="text-center mt-16 pb-0 text-lm font-medium border-t-2 border-gray-300 pt-4">
        © Copyright 2024 AyurHerb - All Rights Reserved. Designed and Developed by Team AyurHerb
      </h3>
    </footer>
  );
};

export default Footer;
