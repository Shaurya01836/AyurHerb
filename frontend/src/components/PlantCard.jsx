import React from "react";
import PropTypes from "prop-types";

const PlantCard = ({
  imageSrc,
  name,
  type,
  onLearnMore = () => {},
  onBookmark = () => {},
  isBookmarked = false,
}) => {
  return (
    <div
  className="bg-sec-color shadow-md rounded-md overflow-hidden border border-gray-200 cursor-pointer pb-1 transition transform hover:scale-105 duration-500 ease-in-out w-full max-w-[300px] mx-auto"
  onClick={onLearnMore}
>
    <img
      src={imageSrc || "placeholder-image-url.jpg"}
      alt={name || "Plant"}
      className="w-full h-40 sm:h-44 md:h-48 object-cover p-2 rounded-xl"
      />
  <div className="p-4 pt-2 bg-sec-color text-center">
  <h3 className="text-lg font-semibold text-gray-800 text-left">
        {name}
      </h3>
      <p className="text-sm text-gray-500 text-left">{type}</p>
    </div>
    <div className="relative -z-0">
      <div className="absolute bottom-2 right-2 flex space-x-2 text-base">
        <button
          aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
          className={`p-1 hover:bg-gray-100 rounded-md transition-colors duration-200 ${
            isBookmarked ? "text-yellow-500" : "text-gray-600 hover:text-yellow-500"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onBookmark();
          }}
        >
          <i className={isBookmarked ? "fas fa-check" : "fas fa-bookmark"}></i>
        </button>
        <button
          aria-label="Share"
          className="text-gray-600 hover:text-green-500 p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <i className="fas fa-share-alt"></i>
        </button>
      </div>
    </div>
  </div>
  
  );
};

PlantCard.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onLearnMore: PropTypes.func.isRequired,
  onBookmark: PropTypes.func.isRequired,
  isBookmarked: PropTypes.bool.isRequired,
};

export default PlantCard;
