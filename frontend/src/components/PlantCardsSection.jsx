import React from "react";
import PlantCard from "./PlantCard";

const PlantCardsSection = ({ plants, onLearnMore, onBookmark, bookmarkedPlants }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4 overflow-hidden text-ellipsis whitespace-nowrap">
      {plants.map((plant) => (
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
