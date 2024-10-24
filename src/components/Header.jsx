import React from "react";

function Header() {
  return (
    <div className="p-4">
      {/* Filter Tags */}
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition">
          All
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition">
          Ayurveda
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition">
          Yoga
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition">
          Naturopathy
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition">
          Unani
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition">
          Siddha
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition">
          Homeopathy
        </button>
      </div>
    </div>
  );
}

export default Header;
