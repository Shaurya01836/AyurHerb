import React from "react";

const FilterPanel = ({
  isFilterOpen,
  filterRegion,
  filterType,
  handleRegionChange,
  handleTypeChange
}) => {
  return (
    <div
      className={`fixed top-16 z-20 w-full bg-white bg-opacity-80 backdrop-blur-md shadow-lg transform transition-transform duration-300 ease-in-out ${
        isFilterOpen ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex flex-wrap px-8 py-4">
        {/* Filter by Region */}
        <div className="flex-1 mb-2 mr-5 mt-3">
          <label className="block text-gray-700">Filter by Region:</label>
          <select
            value={filterRegion}
            onChange={handleRegionChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option>All Regions</option>
            <option>Tropical</option>
            <option>Arid</option>
            <option>Mediterranean</option>
            <option>Temperate</option>
            <option>North America</option>
          </select>
        </div>

        {/* Filter by Type */}
        <div className="flex-1 mb-2 mr-5 mt-3">
          <label className="block text-gray-700">Filter by Type:</label>
          <select
            value={filterType}
            onChange={handleTypeChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option>All Types</option>
            <option>Herb</option>
            <option>Succulent</option>
            <option>Shrub</option>
            <option>Flowering Plant</option>
          </select>
        </div>

        {/* Placeholder for future filter (like Medicinal Uses) */}
        <div className="flex-1 mb-2 mt-3">
          <label className="block text-gray-700">Filter by Medicinal Uses:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Search by Ayush, Naturopathy, etc."
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
