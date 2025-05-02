import React from "react";
import PlantCard from "./PlantCard";

const PlantCardsSection = ({
  plants,
  onLearnMore,
  onBookmark,
  bookmarkedPlants,
  currentPage,
  itemsPerPage,
}) => {
  const startIdx = (currentPage - 1) * itemsPerPage;
  const visiblePlants = plants.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-8">
      {visiblePlants.map((plant) => (
        <PlantCard
          key={plant._id}
          imageSrc={plant.imageSrc || "default-image-url"}
          name={plant.name || "Unknown Plant"}
          type={plant.type || "Unknown Type"}
          onLearnMore={() => onLearnMore(plant)}
          onBookmark={() => onBookmark(plant)}
          isBookmarked={bookmarkedPlants.some((p) => p._id === plant._id)}
        />
      ))}
    </div>
  );
};

export default PlantCardsSection;
