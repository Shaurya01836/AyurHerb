import { useState, useEffect } from "react";
import PlantCard from "../components/PlantCard";
import Navbar from "../components/Navbar";
import { fetchUserProfile, fetchHerbs } from "../services/api";
import { auth } from "../services/firebase";

const MyHerbs = () => {
  const [bookmarkedPlants, setBookmarkedPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookmarkedPlants = async () => {
      const user = auth.currentUser;
      if (!user) {
        setBookmarkedPlants([]);
        setLoading(false);
        return;
      }
      const profile = await fetchUserProfile(user.uid);
      const allHerbs = await fetchHerbs();
      console.log("bookmarkedHerbs from profile:", profile.bookmarkedHerbs);
      console.log("allHerbs ids:", allHerbs.map(h => h.id || h._id));
      const bookmarked = allHerbs.filter((herb) => {
        const herbId = herb.id || herb._id;
        const isBookmarked = (profile.bookmarkedHerbs || []).includes(herbId);
        console.log('Checking herb:', `[${herbId}]`, 'bookmarkedHerbs:', (profile.bookmarkedHerbs || []).map(id => `[${id}]`), 'isBookmarked:', isBookmarked);
        return isBookmarked;
      });
      setBookmarkedPlants(bookmarked);
      setLoading(false);
    };
    loadBookmarkedPlants();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-white">Loading...</div>;
  }

  if (bookmarkedPlants.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen px-4 sm:px-8 pt-20 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-6 text-center">My Bookmarked Herbs</h2>
          <div className="text-gray-500 text-lg">No bookmarked plants yet!</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen px-4 sm:px-8 pt-20">
        <h2 className="text-2xl font-bold mb-6 text-center">My Bookmarked Herbs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bookmarkedPlants.map((plant) => (
            <PlantCard
              key={plant.id || plant._id}
              imageSrc={plant.imageSrc || plant.image || "default-image-url"}
              name={plant.name || "Unknown Plant"}
              type={plant.type || "Unknown Type"}
              onLearnMore={() => {}}
              isBookmarked={true}
              plantId={plant.id || plant._id}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default MyHerbs;
