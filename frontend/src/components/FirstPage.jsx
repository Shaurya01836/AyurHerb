import { FaLeaf, FaHeart, FaShieldAlt, FaArrowRight } from "react-icons/fa";

const FirstPage = ({ onGetStartedClick }) => {
  return (
    <div className="relative min-h-screen overflow-hidden pt-16">
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Section */}
            <div className="text-center lg:text-left space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <FaLeaf className="mr-2 text-green-600" />
                Discover Natural Healing
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Step Into Nature&apos;s
                  <span className="block text-green-600">Pharmacy</span>
                </h1>
                <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                  Your virtual herbal haven where ancient wisdom meets modern
                  wellness. Explore the healing power of medicinal plants.
                </p>
              </div>

              {/* Features */}
              <div className="grid sm:grid-cols-3 gap-6 pt-4">
                <div className="flex flex-col items-center lg:items-start space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaLeaf className="text-green-600 text-xl" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Curated Collection
                  </h3>
                  <p className="text-sm text-gray-600 text-center lg:text-left">
                    Carefully selected medicinal plants
                  </p>
                </div>
                <div className="flex flex-col items-center lg:items-start space-y-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaHeart className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Traditional Wisdom
                  </h3>
                  <p className="text-sm text-gray-600 text-center lg:text-left">
                    Ancient AYUSH knowledge
                  </p>
                </div>
                <div className="flex flex-col items-center lg:items-start space-y-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FaShieldAlt className="text-purple-600 text-xl" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Natural Wellness
                  </h3>
                  <p className="text-sm text-gray-600 text-center lg:text-left">
                    Holistic health approach
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-6">
                <button
                  onClick={onGetStartedClick}
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Get Started
                  <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>

              {/* Trust indicators */}
              <div className="pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3">
                  Trusted by herbal enthusiasts worldwide
                </p>
                <div className="flex justify-center lg:justify-start space-x-6 text-xs text-gray-400">
                  <span>✓ 1000+ Plants</span>
                  <span>✓ Expert Verified</span>
                  <span>✓ Free Access</span>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Main image with shadow */}
                <div className="relative z-10">
                  <img
                    src="https://ideogram.ai/assets/progressive-image/balanced/response/MPzxFxIQQKGFnUkV9IatOA"
                    alt="Medicinal plants and herbs"
                    className="w-80 h-80 lg:w-96 lg:h-96 rounded-2xl object-cover shadow-2xl"
                  />
                </div>

                {/* Background circle */}
                <div className="absolute inset-0 w-80 h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-green-200 to-blue-200 rounded-2xl transform rotate-6 opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstPage;
