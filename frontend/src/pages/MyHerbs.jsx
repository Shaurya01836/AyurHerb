import React, { useState, useEffect } from "react";
import PlantCard from "../components/PlantCard";
import Navbar from "../components/Navbar";

const MyHerbs = () => {
  const [bookmarkedPlants, setBookmarkedPlants] = useState([]);

  useEffect(() => {
    // Load bookmarked plants from localStorage
    const savedBookmarks = localStorage.getItem("bookmarkedPlants");
    if (savedBookmarks) {
      setBookmarkedPlants(JSON.parse(savedBookmarks));
    }
  }, []);

  if (bookmarkedPlants.length === 0) {
    return <div>No bookmarked plants yet!</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen px-4 sm:px-8 py-10">
        <h2 className="text-2xl font-bold mb-6 text-center">My Bookmarked Herbs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bookmarkedPlants.map((plant) => (
            <PlantCard
              key={plant._id}
              imageSrc={plant.imageSrc || "default-image-url"}
              name={plant.name || "Unknown Plant"}
              type={plant.type || "Unknown Type"}
              onLearnMore={() => console.log("Learn more clicked!")}
              isBookmarked={true} // Already bookmarked
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default MyHerbs;
