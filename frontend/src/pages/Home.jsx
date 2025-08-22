import { useState, useEffect, useRef } from "react";
import { fetchHerbs } from "../services/api";
import { incrementVisitCount, getVisitCount } from "../services/firebase";
import { jsPDF } from "jspdf";
import FirstPage from "../components/FirstPage";
import AyushCards from "../components/AyushCards";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PlantCardsSection from "../components/PlantCardsSection";
import PlantPopup from "../components/PlantPopup";
import ChatbotButton from "../components/BotpressChatbot";

const itemsPerPage = 8;

const Home = () => {
  const [notes, setNotes] = useState("");
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [bookmarkedPlants, setBookmarkedPlants] = useState([]);

  const plantCardsRef = useRef(null);

  const filteredPlants = plants;

  // Show only a subset of plants on the Home page
  const homePlants = (filteredPlants || []).slice(0, 8);

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

  const toggleChatbot = () => setShowChatbot(!showChatbot);

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
    <div className="font-poppins scrollbar-thin bg-gradient-to-br from-green-50 via-white to-emerald-50 min-h-screen w-full">
      <Navbar />

      <FirstPage onGetStartedClick={scrollToPlantCards} />

      <ChatbotButton showChatbot={showChatbot} toggleChatbot={toggleChatbot} />

      <div ref={plantCardsRef} className="px-4 sm:px-20 py-6">
        <PlantCardsSection
          plants={homePlants}
          onLearnMore={openPopup}
          onBookmark={handleBookmark}
          bookmarkedPlants={bookmarkedPlants}
          itemsPerPage={itemsPerPage}
        />
      </div>
      <AyushCards />
      <Footer />
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

export default Home;
