import React from 'react';

const FirstPage = ({ onGetStartedClick }) => {
    return (
        <div className="flex justify-center items-center min-h-screen px-4 py-8 bg-white">
            <div className="bg-sec-color p-6 md:p-10 shadow-lg rounded-lg w-full max-w-7xl flex flex-col-reverse md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">
                
                {/* Text Section */}
                <div className="w-full md:w-6/12 text-center md:text-left">
                    <h1 className="text-3xl md:text-5xl font-bold text-main-color mb-4">
                        Step Into Nature's Pharmacy: Your Virtual Herbal Haven
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl">
                        Explore a world of traditional healing with our curated collection of medicinal plants.
                        Unveil the ancient wisdom of AYUSH and embrace the natural way to well-being.
                    </p>
                    <button
                        className="bg-main-color text-white px-6 py-2 text-lg rounded-lg mt-6 w-full md:w-48
                        transition-transform transform hover:scale-105 hover:bg-green-600 hover:shadow-lg hover:text-gray-100 duration-300"
                        onClick={onGetStartedClick}
                    >
                        Get Started
                    </button>
                </div>

                {/* Image Section */}
                <div className="w-full md:w-5/12 flex justify-center">
                    <img
                        src="/images/firstpage.png"
                        alt="Nature"
                        className="w-52 h-52 md:w-80 md:h-80 rounded-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default FirstPage;
