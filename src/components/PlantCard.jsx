import React from "react";

const PlantCard = ({
  imageSrc,
  name,
  type,
  onLearnMore,
  onBookmark,
  isBookmarked,
}) => {
  return (
    <div
      className="bg-sec-color shadow-lg rounded-lg overflow-hidden border border-gray-200 cursor-pointer pb-1 transition transform hover:scale-105 duration-500 ease-in-out w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto" // Centered with max-width for responsiveness
      onClick={onLearnMore} // Entire card is clickable for Learn More
    >
      {/* Image with reduced height */}
      <img
        src={imageSrc}
        alt={name}
        className="w-full h-60 sm:h-72 md:h-80 object-cover p-3 rounded-2xl" // Adjusting height based on screen size
      />

      {/* Plant Name and Type */}
      <div className="p-4 pt-1 bg-sec-color text-center">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 text-left">
          {name}
        </h3>
        <p className="text-xs text-gray-500 text-left">{type}</p>
      </div>

      {/* Card Footer with Icons */}
      <div className="relative -z-0">
        <div className="absolute bottom-2 right-2 flex space-x-2 sm:space-x-4 text-xl">
          {/* Bookmark Button */}
          <button
            className={`p-1.5 mb-2 hover:bg-gray-100 hover:border-none rounded-md transition-colors duration-200 ${
              isBookmarked
                ? "text-yellow-500"
                : "text-gray-600 hover:text-yellow-500"
            }`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering onLearnMore
              onBookmark(); // Trigger the bookmark event
            }}
          >
            <i
              className={isBookmarked ? "fas fa-check" : "fas fa-bookmark"}
            ></i>
          </button>

          {/* Share Button */}
          <button
            className="mb-2 text-gray-600 hover:text-green-500 p-1.5 hover:bg-gray-100 hover:border-none rounded-md transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering onLearnMore
              // Add share logic here
            }}
          >
            <i className="fas fa-share-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
