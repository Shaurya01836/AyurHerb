import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-sec-color text-main-color py-16 px-6 md:px-12 lg:px-16 shadow-xl border-t-2 border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-4">
              <img src="/images/AYURB.png" alt="AyurHerb Logo" className="h-14 w-auto" />
            </div>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Your virtual herbal haven where ancient wisdom meets modern wellness. 
              Discover the healing power of medicinal plants and traditional healing systems.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="text-gray-500 hover:text-sub-color transition-all duration-300 transform hover:scale-110">
                <FaGithub className="text-2xl" />
              </a>
              <a href="#" className="text-gray-500 hover:text-sub-color transition-all duration-300 transform hover:scale-110">
                <FaLinkedin className="text-2xl" />
              </a>
              <a href="#" className="text-gray-500 hover:text-sub-color transition-all duration-300 transform hover:scale-110">
                <FaTwitter className="text-2xl" />
              </a>
              <a href="#" className="text-gray-500 hover:text-sub-color transition-all duration-300 transform hover:scale-110">
                <FaInstagram className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-main-color border-b-2 border-sub-color pb-3 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="/" className="text-gray-600 hover:text-sub-color transition-colors duration-300 text-sm md:text-base flex items-center group">
                  <span className="w-2 h-2 bg-sub-color rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Home
                </a>
              </li>
              <li>
                <a href="/health-wellness" className="text-gray-600 hover:text-sub-color transition-colors duration-300 text-sm md:text-base flex items-center group">
                  <span className="w-2 h-2 bg-sub-color rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Health & Wellness
                </a>
              </li>
              <li>
                <a href="/community" className="text-gray-600 hover:text-sub-color transition-colors duration-300 text-sm md:text-base flex items-center group">
                  <span className="w-2 h-2 bg-sub-color rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Community
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-gray-600 hover:text-sub-color transition-colors duration-300 text-sm md:text-base flex items-center group">
                  <span className="w-2 h-2 bg-sub-color rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-600 hover:text-sub-color transition-colors duration-300 text-sm md:text-base flex items-center group">
                  <span className="w-2 h-2 bg-sub-color rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-main-color border-b-2 border-sub-color pb-3 inline-block">
              Contact Us
            </h3>
            <div className="space-y-5">
              <div className="flex items-start space-x-4 group">
                <div className="bg-main-color/10 p-2 rounded-full group-hover:bg-main-color/20 transition-colors duration-300">
                  <FaMapMarkerAlt className="text-main-color text-lg" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    Poornima College of Engineering,<br />
                    Jaipur, 302022 (Rajasthan)
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 group">
                <div className="bg-main-color/10 p-2 rounded-full group-hover:bg-main-color/20 transition-colors duration-300">
                  <FaEnvelope className="text-main-color text-lg" />
                </div>
                <a href="mailto:ayurherb@gmail.com" className="text-gray-600 hover:text-sub-color transition-colors duration-300 text-sm md:text-base">
                  ayurherb@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-4 group">
                <div className="bg-main-color/10 p-2 rounded-full group-hover:bg-main-color/20 transition-colors duration-300">
                  <FaPhone className="text-main-color text-lg" />
                </div>
                <a href="tel:+91-XXXXXXXXXX" className="text-gray-600 hover:text-sub-color transition-colors duration-300 text-sm md:text-base">
                  +91-XXXXXXXXXX
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter/Additional Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-main-color border-b-2 border-sub-color pb-3 inline-block">
              Stay Connected
            </h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Join our community of herbal enthusiasts and stay updated with the latest wellness tips and herbal remedies.
            </p>
            <div className="space-y-3">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-sub-color focus:border-transparent"
                />
                <button className="px-6 py-3 bg-sub-color text-white text-sm font-medium rounded-r-lg hover:bg-main-color transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t-2 border-gray-200 mt-16 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-600 text-sm text-center md:text-left">
            © 2024 AyurHerb. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-sub-color transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-sub-color transition-colors duration-300">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 hover:text-sub-color transition-colors duration-300">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
