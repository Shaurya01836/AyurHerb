import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Bookmark, Share2 } from "lucide-react";

const PlantCard = ({
  imageSrc,
  name,
  type,
  onLearnMore = () => {},
  onBookmark = () => {},
  isBookmarked = false,
  plantId,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (plantId) {
      navigate(`/plant/${plantId}`);
    } else {
      onLearnMore();
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden group transform hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={imageSrc || "placeholder-image-url.jpg"}
          alt={name || "Plant"}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <h3 className="text-lg font-bold text-white">{name}</h3>
          <p className="text-sm text-gray-200">{type}</p>
        </div>
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
            className={`p-2 rounded-full backdrop-blur-sm bg-white/20 text-white hover:bg-white/30 transition-colors duration-200 ${
              isBookmarked ? "text-yellow-400" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onBookmark();
            }}
          >
            <Bookmark size={18} className={isBookmarked ? "fill-current" : ""} />
          </button>
          <button
            aria-label="Share"
            className="p-2 rounded-full backdrop-blur-sm bg-white/20 text-white hover:bg-white/30 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              // Add share functionality here
            }}
          >
            <Share2 size={18} />
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
  onLearnMore: PropTypes.func,
  onBookmark: PropTypes.func,
  isBookmarked: PropTypes.bool,
  plantId: PropTypes.string,
};

export default PlantCard;