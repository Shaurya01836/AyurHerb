import { useState, useEffect } from "react";
import { fetchHerbs, toggleBookmarkHerb } from "../services/api";
import Navbar from "../components/Navbar";
import PlantCardsSection from "../components/PlantCardsSection";
import PlantPopup from "../components/PlantPopup";
import { Link } from "react-router-dom";
import { auth } from "../services/firebase";
import { fetchUserProfile } from "../services/api";
import { onAuthStateChanged } from "firebase/auth";
import { Filter } from "lucide-react";

const AllPlants = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [bookmarkedHerbIds, setBookmarkedHerbIds] = useState([]);
  const [notes, setNotes] = useState("");
  const [toggleSection, setToggleSection] = useState("authentic");
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const getPlants = async () => {
      try {
        const herbs = await fetchHerbs();
        setPlants(Array.isArray(herbs) ? herbs : []);
      } catch (err) {
        console.error("Error fetching plants:", err);
        setError("Failed to fetch plants");
      } finally {
        setLoading(false);
      }
    };
    getPlants();
  }, []);

  // Sync bookmarks with auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await fetchUserProfile(user.uid);
        setBookmarkedHerbIds(profile?.bookmarkedHerbs || []);
      } else {
        setBookmarkedHerbIds([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Refetch bookmarks when page regains focus
  useEffect(() => {
    const handleVisibility = async () => {
      if (document.visibilityState === "visible") {
        const user = auth.currentUser;
        if (user) {
          const profile = await fetchUserProfile(user.uid);
          setBookmarkedHerbIds(profile?.bookmarkedHerbs || []);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Get unique types for filter dropdown
  const plantTypes = [
    "All",
    ...Array.from(new Set((plants || []).map((plant) => plant.type).filter(Boolean)))
  ];

  // Search and filter logic
  const filteredPlants = (plants || []).filter((plant) => {
    const matchesSearch = plant.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || plant.type === filterType;
    return matchesSearch && matchesType;
  });

  // Filter herbs by postedBy/isAdmin
  const authenticHerbs = filteredPlants.filter((plant) => plant.isAdmin || plant.postedBy === "admin");
  const publicHerbs = filteredPlants.filter((plant) => !plant.isAdmin && plant.postedBy !== "admin");

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

  const handleBookmark = async (plant) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to bookmark herbs.");
      return;
    }
    await toggleBookmarkHerb(plant.id, user.uid);
    // Refetch bookmarks after toggling
    const profile = await fetchUserProfile(user.uid);
    setBookmarkedHerbIds(profile?.bookmarkedHerbs || []);
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
      <div className="max-w-7xl mx-auto py-10">
        <div className="flex items-center justify-center gap-4 mb-8 relative">
          <div className="flex flex-grow px-10">
            <input
              type="text"
              placeholder="Search plants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-2 border border-r-0 border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-green-400 z-10"
            />
            <button
              className="px-5 py-2 border border-gray-300 bg-gray-50 rounded-r-full hover:bg-gray-100"
              onClick={() => setShowFilter(!showFilter)}
            >
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          {showFilter && (
            <div className="absolute top-14 right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setShowFilter(false);
                }}
                className="w-full px-4 py-2 border-none rounded-lg focus:outline-none"
                size={plantTypes.length > 5 ? 6 : plantTypes.length}
              >
                {plantTypes.map((type) => (
                  <option key={type} value={type} className="py-1">
                    {type}
                  </option>
                ))}
              </select>
            </div>
          )}
          <Link
            to="/add-herb"
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition text-center flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            <span>Add Herb</span>
          </Link>
        </div>
        {/* Toggle Section */}
        <div className="flex justify-start mb-6 pl-10">
          <button
            className={`px-4 py-2 rounded-l-lg border ${toggleSection === "authentic" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setToggleSection("authentic")}
          >
            Authentic Herbs
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg border ${toggleSection === "public" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setToggleSection("public")}
          >
            Public Herbs
          </button>
        </div>
        {/* Herbs Section */}
        <div>
          <PlantCardsSection
            plants={toggleSection === "authentic" ? authenticHerbs : publicHerbs}
            onLearnMore={openPopup}
            onBookmark={handleBookmark}
            bookmarkedPlants={bookmarkedHerbIds}
            currentPage={1}
            itemsPerPage={8}
          />
        </div>
        {(toggleSection === "authentic" ? authenticHerbs : publicHerbs).length === 0 && (
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