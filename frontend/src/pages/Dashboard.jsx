import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  FaLeaf,
  FaSeedling,
  FaHome,
  FaUser,
  FaBookmark,
  FaNewspaper,
  FaSignOutAlt,
  FaCog,
  FaHeart,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { firestore } from "../services/firebase";
import { collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import axios from "axios";
import { fetchUserProfile } from "../services/firebase";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("User");
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [communityPosts, setCommunityPosts] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [errorNews, setErrorNews] = useState(null);
  const [bookmarkedPlants, setBookmarkedPlants] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [userPostsCount, setUserPostsCount] = useState(0);
  const [userCommentsCount, setUserCommentsCount] = useState(0);

  const apiKey = "58bc5f44b1b04122864e443678d1b781";

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const email = currentUser.email.split("@")[0];
      setUserEmail(email);
      setUser(currentUser);
      // Fetch user profile from Firestore
      fetchUserProfile(currentUser.uid).then(setUserProfile);
      // Fetch user posts count
      const postsRef = collection(firestore, "posts");
      const q = query(postsRef, where("userId", "==", currentUser.uid));
      getDocs(q).then((snapshot) => {
        setUserPostsCount(snapshot.size);
        // Count comments made by user
        let commentCount = 0;
        snapshot.docs.forEach((doc) => {
          const post = doc.data();
          function countUserComments(comments) {
            if (!comments) return 0;
            return comments.reduce((acc, c) => acc + (c.userId === currentUser.uid ? 1 : 0) + countUserComments(c.replies), 0);
          }
          commentCount += countUserComments(post.comments);
        });
        setUserCommentsCount(commentCount);
      });
    }
    fetchCommunityPosts();
    fetchNewsArticles();
    loadBookmarkedPlants();
  }, []);

  const loadBookmarkedPlants = () => {
    const savedBookmarks = localStorage.getItem("bookmarkedPlants");
    if (savedBookmarks) {
      setBookmarkedPlants(JSON.parse(savedBookmarks));
    }
  };

  const fetchCommunityPosts = async () => {
    const postsRef = collection(firestore, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"), limit(3));
    try {
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCommunityPosts(posts);
    } catch (error) {
      console.error("Error fetching posts: ", error);
      toast.error("Failed to fetch community posts");
    }
  };

  const fetchNewsArticles = async () => {
    setLoadingNews(true);
    setErrorNews(null);
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=ayurveda OR herb&apiKey=${apiKey}&pageSize=3`
      );
      if (response.data.articles) {
        setNewsArticles(response.data.articles);
      } else {
        setErrorNews("No news articles found.");
      }
    } catch (error) {
      console.error("Error fetching news articles:", error);
      setErrorNews("Failed to fetch news articles. Please try again later.");
    } finally {
      setLoadingNews(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("You have successfully logged out!", {
      position: toast.POSITION.TOP_CENTER,
    });
    navigate("/login");
  };

  const handleCardClick = (action) => {
    switch (action) {
      case "Home":
        navigate("/");
        break;
      case "My Herbs":
        navigate("/myherbs");
        break;
      case "Gardening Tips":
        navigate("/gardening-tips");
        break;
      case "Community":
        navigate("/community");
        break;
      default:
        break;
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, {userEmail}! 🌿</h2>
            <p className="text-green-100 text-lg">Ready to explore the world of herbal medicine?</p>
          </div>
          <div className="text-6xl">🌱</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "My Herbs",
            icon: <FaBookmark className="text-2xl" />,
            desc: "View your saved herbs",
            action: "My Herbs",
            color: "from-green-400 to-green-600",
          },
          {
            title: "Gardening Tips",
            icon: <FaSeedling className="text-2xl" />,
            desc: "Learn herb cultivation",
            action: "Gardening Tips",
            color: "from-blue-400 to-blue-600",
          },
          {
            title: "Community",
            icon: <FaHeart className="text-2xl" />,
            desc: "Join discussions",
            action: "Community",
            color: "from-purple-400 to-purple-600",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            onClick={() => handleCardClick(card.action)}
            className={`bg-gradient-to-r ${card.color} p-6 rounded-xl text-white cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-4">
              {card.icon}
              <span className="text-4xl">→</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p className="text-white/80">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Bookmarked Herbs</p>
              <p className="text-2xl font-bold text-gray-900">{bookmarkedPlants.length}</p>
            </div>
            <div className="text-green-500 text-2xl">
              <FaBookmark />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Community Posts</p>
              <p className="text-2xl font-bold text-gray-900">{communityPosts.length}</p>
            </div>
            <div className="text-blue-500 text-2xl">
              <FaHeart />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">News Articles</p>
              <p className="text-2xl font-bold text-gray-900">{newsArticles.length}</p>
            </div>
            <div className="text-purple-500 text-2xl">
              <FaNewspaper />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Days Active</p>
              <p className="text-2xl font-bold text-gray-900">7</p>
            </div>
            <div className="text-orange-500 text-2xl">
              <FaLeaf />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Community Posts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">Recent Community Posts</h3>
        </div>
        <div className="p-6">
          {communityPosts.length > 0 ? (
            <div className="space-y-4">
              {communityPosts.slice(0, 3).map((post) => (
                <div key={post.id} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 line-clamp-2">{post.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    by {post.userName} • {post.replies?.length || 0} replies
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent posts</p>
          )}
          <button
            onClick={() => navigate("/community")}
            className="mt-4 text-green-600 hover:text-green-700 font-medium"
          >
            View All Posts →
          </button>
        </div>
      </div>

      {/* Latest News */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">Latest News</h3>
        </div>
        <div className="p-6">
          {loadingNews ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-green-500 border-solid mx-auto"></div>
            </div>
          ) : errorNews ? (
            <p className="text-red-500 text-center py-4">{errorNews}</p>
          ) : newsArticles.length > 0 ? (
            <div className="space-y-4">
              {newsArticles.map((article, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h4>
                  <p className="text-gray-600 text-sm line-clamp-2">{article.description}</p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 text-sm font-medium mt-2 inline-block"
                  >
                    Read more →
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No news available</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{userEmail}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-green-600 font-semibold text-lg mt-2">{userProfile ? `${userProfile.reputation || 0} pts` : "..."}</p>
            <p className="text-sm text-gray-500">Member since {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Recently'}</p>
          </div>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{bookmarkedPlants.length}</div>
          <div className="text-gray-600">Bookmarked Herbs</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{userPostsCount}</div>
          <div className="text-gray-600">Posts Created</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{userCommentsCount}</div>
          <div className="text-gray-600">Comments Made</div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">Account Settings</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaCog className="text-gray-500" />
              <span className="text-gray-700">Account Preferences</span>
            </div>
            <button className="text-green-600 hover:text-green-700">Edit</button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaBookmark className="text-gray-500" />
              <span className="text-gray-700">Manage Bookmarks</span>
            </div>
            <button 
              onClick={() => navigate("/myherbs")}
              className="text-green-600 hover:text-green-700"
            >
              View
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaSignOutAlt className="text-gray-500" />
              <span className="text-gray-700">Sign Out</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Manage your herbal journey</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors duration-200"
          >
            <FaHome className="inline mr-2" />
            Back to Home
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-8">
          {[
            { id: "overview", label: "Overview", icon: <FaHome /> },
            { id: "profile", label: "Profile", icon: <FaUser /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "overview" && renderOverview()}
        {activeTab === "profile" && renderProfile()}

        <ToastContainer />
      </div>
    </div>
  );
};

export default Dashboard;
