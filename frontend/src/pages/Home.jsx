import React, { useState, useEffect, useRef } from "react";
import { fetchHerbs } from "../services/api";
import { incrementVisitCount, getVisitCount } from "../services/firebase";
import { jsPDF } from "jspdf";
import FirstPage from "../components/FirstPage";
import AyushCards from "../components/AyushCards";
import Footer from "../components/Footer";
import QuizPopup from "../components/QuizPopup";
import HomeNavbar from "../components/HomeNavbar";
import FilterPanel from "../components/FilterPanel";
import PlantCardsSection from "../components/PlantCardsSection";
import PlantPopup from "../components/PlantPopup";
import ChatbotButton from "../components/BotpressChatbot";


const itemsPerPage = 8;

const Home = () => {
  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRegion, setFilterRegion] = useState("All Regions");
  const [filterType, setFilterType] = useState("All Types");
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [bookmarkedPlants, setBookmarkedPlants] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const plantCardsRef = useRef(null);

  const filteredPlants = plants.filter(
    (plant) =>
      (filterRegion === "All Regions" || plant.region === filterRegion) &&
      (filterType === "All Types" || plant.type === filterType) &&
      plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPlants.length / itemsPerPage);

  useEffect(() => {
    const fetchVisitCountFunc = async () => {
      try {
        const count = await getVisitCount();
        console.log("Visit count:", count);
      } catch (err) {
        console.error("Failed to fetch visit count:", err);
      }
    };

    const incrementVisit = async () => {
      try {
        await incrementVisitCount();
      } catch (error) {
        console.error("Error incrementing visit count:", error);
      }
    };

    fetchVisitCountFunc();
    incrementVisit();
  }, []);

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

  // ⬇️ Auto scroll to plant cards when search or filter changes
  useEffect(() => {
    if (searchTerm || filterRegion !== "All Regions" || filterType !== "All Types") {
      scrollToPlantCards();
    }
  }, [searchTerm, filterRegion, filterType]);

  const handleDownloadNotes = () => {
    const doc = new jsPDF();
    doc.text(notes, 10, 10);
    doc.save("notes.pdf");
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

  const handleRegionChange = (e) => setFilterRegion(e.target.value);
  const handleTypeChange = (e) => setFilterType(e.target.value);
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const toggleQuiz = () => setIsQuizOpen(!isQuizOpen);
  const toggleChatbot = () => setShowChatbot(!showChatbot);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const toggleMenu = () => setIsOpen(!isOpen);

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

  const scrollToPlantCards = () => {
    if (plantCardsRef.current) {
      plantCardsRef.current.scrollIntoView({ behavior: "smooth" });
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
    <div className="font-poppins scrollbar-thin">
      <HomeNavbar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onToggleFilter={toggleFilter}
        onToggleQuiz={toggleQuiz}
        isOpen={isOpen}
        toggleMenu={toggleMenu}
      />

      <FirstPage onGetStartedClick={scrollToPlantCards} />

      <FilterPanel
        isFilterOpen={isFilterOpen}
        filterRegion={filterRegion}
        filterType={filterType}
        handleRegionChange={handleRegionChange}
        handleTypeChange={handleTypeChange}
      />

      {isQuizOpen && <QuizPopup isOpen={isQuizOpen} onClose={toggleQuiz} />}

      <ChatbotButton showChatbot={showChatbot} toggleChatbot={toggleChatbot} />

      <div
        ref={plantCardsRef}
        className="min-h-screen px-4 sm:px-6 py-6"
      >
        <PlantCardsSection
          plants={filteredPlants}
          onLearnMore={openPopup}
          onBookmark={handleBookmark}
          bookmarkedPlants={bookmarkedPlants}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          First
        </button>

        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded ${
                  page === currentPage ? "bg-green-500 text-white" : ""
                }`}
              >
                {page}
              </button>
            );
          } else if (page === currentPage - 2 || page === currentPage + 2) {
            return <span key={page}>...</span>;
          }
          return null;
        })}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>

        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Last
        </button>
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

      <AyushCards />
      <Footer />
    </div>
  );
};

export default Home;
