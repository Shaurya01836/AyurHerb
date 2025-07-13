import React from "react";
import PlantCard from "./PlantCard";

const PlantCardsSection = ({
  plants,
  onLearnMore,
  onBookmark,
  bookmarkedPlants,
  itemsPerPage,
}) => {
  // Show all plants since we're not using pagination on home page
  const visiblePlants = plants;

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
          plantId={plant._id}
          sketchfabModelUrl={plant.sketchfabModelUrl}
        />
      ))}
    </div>
  );
};

export default PlantCardsSection;
