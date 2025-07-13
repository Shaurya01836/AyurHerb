import { useState, useEffect } from "react";
import { fetchHerbs } from "../services/api";
import Navbar from "../components/Navbar";
import PlantCardsSection from "../components/PlantCardsSection";
import PlantPopup from "../components/PlantPopup";

const AllPlants = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [bookmarkedPlants, setBookmarkedPlants] = useState([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const getPlants = async () => {
      try {
        const response = await fetchHerbs();
        setPlants(response.data);
      } catch (err) {
        console.error("Error fetching plants:", err);
        setError("Failed to fetch plants");
      } finally {
        setLoading(false);
      }
    };
    getPlants();
  }, []);

  // Get unique types for filter dropdown
  const plantTypes = [
    "All",
    ...Array.from(new Set(plants.map((plant) => plant.type).filter(Boolean)))
  ];

  // Search and filter logic
  const filteredPlants = plants.filter((plant) => {
    const matchesSearch = plant.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || plant.type === filterType;
    return matchesSearch && matchesType;
  });

  const openPopup = (plant) => {
    const multimedia = [
      plant.multimedia1,
      plant.multimedia2,
      plant.multimedia3,
      plant.multimedia4,
    ].filter(Boolean);
    setSelectedPlant({ ...plant, multimedia });
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedPlant(null);
  };

  const handleBookmark = (plant) => {
    setBookmarkedPlants((prev) => {
      let updatedBookmarks;
      if (prev.some((p) => p._id === plant._id)) {
        updatedBookmarks = prev.filter((p) => p._id !== plant._id);
      } else {
        updatedBookmarks = [...prev, plant];
      }
      localStorage.setItem(
        "bookmarkedPlants",
        JSON.stringify(updatedBookmarks)
      );
      return updatedBookmarks;
    });
  };

  const handleDownloadNotes = () => {
    // Optionally implement download notes for popup
  };

  const handleShare = () => {
    if (selectedPlant?.sketchfabModelUrl) {
      navigator.clipboard
        .writeText(selectedPlant.sketchfabModelUrl)
        .then(() => {
          alert("Sketchfab model link copied to clipboard!");
        });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-solid"></div>
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  return (
    <div className="font-poppins scrollbar-thin min-h-screen bg-white pt-20">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center text-green-700">All Plants</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by plant name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {plantTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <PlantCardsSection
            plants={filteredPlants}
            onLearnMore={openPopup}
            onBookmark={handleBookmark}
            bookmarkedPlants={bookmarkedPlants}
            currentPage={1}
            itemsPerPage={8}
          />
        </div>
        {filteredPlants.length === 0 && (
          <div className="text-center text-gray-500 py-8">No plants found.</div>
        )}
      </div>
      <PlantPopup
        isOpen={isPopupOpen}
        plant={selectedPlant}
        onClose={closePopup}
        notes={notes}
        setNotes={setNotes}
        handleDownloadNotes={handleDownloadNotes}
        handleShare={handleShare}
      />
    </div>
  );
};

export default AllPlants; 