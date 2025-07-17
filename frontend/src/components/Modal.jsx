import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="fixed inset-0 bg-black bg-opacity-60" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-xl transform transition-all w-11/12 md:w-1/3 lg:w-1/4 p-8 z-10 animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-3xl font-bold transform transition-transform hover:scale-110"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
