import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchHerbs } from "../services/api";
import { auth, firestore } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";
import Navbar from "../components/Navbar";
import PlantCard from "../components/PlantCard";

const PlantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [allPlants, setAllPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [bookmarkedPlants, setBookmarkedPlants] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    const getPlants = async () => {
      try {
        const response = await fetchHerbs();
        setAllPlants(response.data);
        const foundPlant = response.data.find(p => p._id === id);
        if (foundPlant) {
          setPlant(foundPlant);
        } else {
          setError("Plant not found");
        }
      } catch (err) {
        console.error("Error fetching plants:", err);
        setError("Failed to fetch plant details");
      } finally {
        setLoading(false);
      }
    };
    getPlants();
  }, [id]);

  // Load bookmarked plants from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarkedPlants");
    if (savedBookmarks) {
      setBookmarkedPlants(JSON.parse(savedBookmarks));
    }
  }, []);

  // Load comments from Firebase
  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const plantCommentsRef = collection(firestore, "comments");
        const q = query(plantCommentsRef, where("plantId", "==", id));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const commentsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          // Sort comments by timestamp in frontend
          commentsData.sort((a, b) => {
            const timeA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
            const timeB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
            return timeA - timeB;
          });
          console.log("Fetched comments:", commentsData); // Debug log
          setComments(commentsData);
        }, (error) => {
          console.error("Error in snapshot:", error);
        });
        
        return () => unsubscribe();
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments");
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [id]);

  // Load user from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleBookmark = (plantToBookmark) => {
    setBookmarkedPlants((prev) => {
      let updatedBookmarks;
      if (prev.some((p) => p._id === plantToBookmark._id)) {
        updatedBookmarks = prev.filter((p) => p._id !== plantToBookmark._id);
      } else {
        updatedBookmarks = [...prev, plantToBookmark];
      }
      localStorage.setItem("bookmarkedPlants", JSON.stringify(updatedBookmarks));
      return updatedBookmarks;
    });
  };

  const handleShare = () => {
    if (plant?.sketchfabModelUrl) {
      navigator.clipboard.writeText(plant.sketchfabModelUrl);
      alert("Sketchfab model link copied to clipboard!");
    }
  };

  const isBookmarked = bookmarkedPlants.some((p) => p._id === plant?._id);

  // Get related plants (same type, excluding current plant)
  // If no plants of same type, show random plants
  const relatedPlants = (() => {
    const sameTypePlants = allPlants.filter(p => p.type === plant?.type && p._id !== plant?._id);
    const otherPlants = allPlants.filter(p => p._id !== plant?._id);
    
    if (sameTypePlants.length > 0) {
      // Show 2 related plants and 2 random suggested plants
      const related = sameTypePlants.slice(0, 2);
      const suggested = otherPlants
        .filter(p => p.type !== plant?.type) // Exclude same type plants
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      return [...related, ...suggested];
    } else {
      // Show random plants if no same type plants
      return otherPlants.sort(() => Math.random() - 0.5).slice(0, 4);
    }
  })();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-solid"></div>
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Plant Not Found</h1>
            <button
              onClick={() => navigate("/all-plants")}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to All Plants
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "medicinal", label: "Medicinal Uses", icon: "🌿" },
    { id: "cultivation", label: "Cultivation", icon: "🌱" },
    { id: "multimedia", label: "Multimedia", icon: "🎥" },
    { id: "research", label: "Research", icon: "🔬" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Basic Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Botanical Name</p>
                  <p className="font-medium">{plant.botanicalName || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Common Names</p>
                  <p className="font-medium">{plant.commonNames || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium">{plant.type || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Region</p>
                  <p className="font-medium">{plant.region || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Habitat</p>
                  <p className="font-medium">{plant.habitat || "Not specified"}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Description</h3>
              <p className="text-gray-700 leading-relaxed">{plant.description || "No description available."}</p>
            </div>
          </div>
        );

      case "medicinal":
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Medicinal Uses</h3>
            <p className="text-gray-700 leading-relaxed">{plant.medicinalUses || "Medicinal uses information not available."}</p>
          </div>
        );

      case "cultivation":
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Methods of Cultivation</h3>
            <p className="text-gray-700 leading-relaxed">{plant.methodsOfCultivation || "Cultivation information not available."}</p>
          </div>
        );

      case "multimedia":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[plant.multimedia1, plant.multimedia2, plant.multimedia3, plant.multimedia4]
                  .filter(Boolean)
                  .map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`${plant.name} ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        setSelectedImage(url);
                        setShowImagePopup(true);
                      }}
                    />
                  ))}
              </div>
            </div>

            {plant.audioSrc && (
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Audio Guide</h3>
                <audio
                  src={plant.audioSrc}
                  controls
                  className="w-full bg-gray-100 rounded-lg"
                />
              </div>
            )}
          </div>
        );

      case "research":
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Research & Studies</h3>
            <p className="text-gray-700 leading-relaxed">
              Research information and scientific studies about this plant will be displayed here.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to leave a comment.");
      return;
    }
    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      console.log("Submitting comment for plant:", id); // Debug log
      const commentsRef = collection(firestore, "comments");
      const commentData = {
        plantId: id,
        text: newComment.trim(),
        userId: user.uid,
        username: user.displayName || user.email,
        timestamp: serverTimestamp(),
      };
      console.log("Comment data:", commentData); // Debug log
      
      const docRef = await addDoc(commentsRef, commentData);
      console.log("Comment added with ID:", docRef.id); // Debug log
      
      setNewComment("");
      alert("Comment added successfully!");
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Navbar />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Area (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Hero Section */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="relative">
                {plant.sketchfabModelUrl ? (
                  <div className="w-full h-64 md:h-80">
                    <iframe
                      title={plant.name}
                      src={plant.sketchfabModelUrl}
                      frameBorder="0"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <img
                    src={plant.imageSrc || "/images/placeholder.jpg"}
                    alt={plant.name}
                    className="w-full h-64 md:h-80 object-cover"
                  />
                )}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => handleBookmark(plant)}
                    className={`p-2 rounded-full bg-white/80 backdrop-blur-sm ${
                      isBookmarked ? "text-yellow-500" : "text-gray-600"
                    } hover:bg-white transition-colors`}
                  >
                    <i className={`fas ${isBookmarked ? "fa-check" : "fa-bookmark"}`}></i>
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white transition-colors"
                  >
                    <i className="fas fa-share-alt"></i>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{plant.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{plant.botanicalName}</p>
                <p className="text-gray-700">{plant.description?.substring(0, 200)}...</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? "border-green-500 text-green-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Comments</h3>
              {loadingComments ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-green-500 border-solid mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading comments...</p>
                </div>
              ) : comments.length === 0 ? (
                <p className="text-gray-600">No comments yet. Be the first to leave one!</p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-800">{comment.username}</p>
                      <p className="text-gray-700">{comment.text}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {comment.timestamp ? 
                          (comment.timestamp.toDate ? 
                            comment.timestamp.toDate().toLocaleDateString() : 
                            new Date(comment.timestamp).toLocaleDateString()
                          ) : 
                          'Just now'
                        }
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {user && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-2 text-gray-800">Leave a Comment</h4>
                  <form onSubmit={handleSubmitComment} className="flex space-x-2">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows="3"
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Write a comment..."
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Post Comment
                    </button>
                  </form>
                </div>
              )}
              {!user && (
                <p className="text-center text-gray-600 mt-4">
                  Please <a href="/login" className="text-green-600 hover:underline">log in</a> to leave a comment.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar (1/3 width) */}
          <div className="space-y-6">
            {/* Related Plants */}
            {relatedPlants.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Related Plants</h3>
                <div className="space-y-4">
                  {relatedPlants.map((relatedPlant) => (
                    <div
                      key={relatedPlant._id}
                      onClick={() => navigate(`/plant/${relatedPlant._id}`)}
                      className="cursor-pointer group"
                    >
                      <PlantCard
                        imageSrc={relatedPlant.imageSrc}
                        name={relatedPlant.name}
                        type={relatedPlant.type}
                        onLearnMore={() => {}}
                        onBookmark={() => handleBookmark(relatedPlant)}
                        isBookmarked={bookmarkedPlants.some((p) => p._id === relatedPlant._id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleBookmark(plant)}
                  className={`w-full py-2 px-4 rounded-lg border transition-colors ${
                    isBookmarked
                      ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <i className={`fas ${isBookmarked ? "fa-check" : "fa-bookmark"} mr-2`}></i>
                  {isBookmarked ? "Bookmarked" : "Add to Bookmarks"}
                </button>
                <button
                  onClick={handleShare}
                  className="w-full py-2 px-4 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <i className="fas fa-share-alt mr-2"></i>
                  Share Plant
                </button>
                <button
                  onClick={() => navigate("/all-plants")}
                  className="w-full py-2 px-4 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to All Plants
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      {/* Image Popup Modal */}
      {showImagePopup && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setShowImagePopup(false)}
              className="absolute -top-12 right-0 text-white text-3xl font-bold hover:text-gray-300 transition-colors z-10"
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Plant"
              className="w-96 h-96 object-cover rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantDetail; 