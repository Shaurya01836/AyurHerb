import React, { useEffect } from 'react';

const Modal = ({ category, closeModal }) => {
    // Lock scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="fixed inset-0 bg-black bg-opacity-60" onClick={closeModal}></div>

            <div className="relative bg-white rounded-2xl shadow-xl transform transition-all w-11/12 md:w-1/3 lg:w-1/4 p-8 z-10 animate-fadeIn">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-3xl font-bold transform transition-transform hover:scale-110"
                >
                    &times;
                </button>

                <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6">{category.name}</h2>

                <ul className="space-y-4">
                    {category.plants.map((plant, index) => (
                        <li key={index} className="text-lg font-medium text-gray-700 border-b border-gray-200 pb-2">
                            🌿 {plant}
                        </li>
                    ))}
                </ul>

                <button
                    onClick={closeModal}
                    className="mt-8 w-full py-3 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
