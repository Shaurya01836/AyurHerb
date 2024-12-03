import React, { useEffect, useState } from "react";
import { auth } from "../services/firebase"; // Ensure to import auth from your Firebase setup
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  FaLeaf,
  FaSearch,
  FaSeedling,
  FaComments,
  FaHome,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { firestore } from "../services/firebase"; // Import Firestore
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore"; // Firestore functions
import axios from "axios"; // Import Axios for API calls

const Dashboard = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("User");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [communityPosts, setCommunityPosts] = useState([]); // State to hold community posts
  const [newsArticles, setNewsArticles] = useState([]); // State to hold news articles
  const [loadingNews, setLoadingNews] = useState(true); // Loading state for news
  const [errorNews, setErrorNews] = useState(null); // Error state for news

  const apiKey = "58bc5f44b1b04122864e443678d1b781"; // Replace with your Google News API Key

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const email = currentUser.email.split("@")[0]; // Extract the part before '@'
      setUserEmail(email);
    }
    fetchCommunityPosts(); // Fetch posts on component mount
    fetchNewsArticles(); // Fetch news articles on component mount
  }, []);

  const fetchCommunityPosts = async () => {
    const postsRef = collection(firestore, "posts"); // Use the correct Firestore collection
    const q = query(postsRef, orderBy("createdAt", "desc"), limit(3)); // Adjust to your timestamp field and desired limit
    try {
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCommunityPosts(posts); // Set the fetched posts to state
    } catch (error) {
      console.error("Error fetching posts: ", error);
      toast.error("Failed to fetch community posts");
    }
  };

  // Function to fetch news articles
  const fetchNewsArticles = async () => {
    setLoadingNews(true);
    setErrorNews(null); // Reset error state
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=ayurveda OR herb&apiKey=${apiKey}&pageSize=5` // Updated query for filtering
      );
      if (response.data.articles) {
        setNewsArticles(response.data.articles); // Set the filtered articles to state
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
      case "View My Herbs":
        navigate("/myherbs");
        break;
      case "Explore New Herbs":
        navigate("/");
        break;
      case "Gardening Tips":
        navigate("/gardening-tips");
        break;
      case "Community Forum":
        navigate("/community");
        break;
      default:
        break;
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleExpandedPost = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
    toast.info(
      `You ${expandedPost === postId ? "collapsed" : "expanded"} a post.`
    );
  };

  return (
    <div
      className={`flex min-h-screen transition-colors duration-700 ${
        darkMode ? "bg-gray-900" : "bg-gradient-to-b from-green-50 to-green-100"
      }`}
    >
      <div
        className={`fixed inset-y-0 left-0 ${
          sidebarCollapsed ? "w-20" : "w-64"
        } bg-green-900 text-white transition-all duration-500 p-4 shadow-lg flex flex-col justify-between backdrop-blur-md `}
      >
        <div>
          <div className="flex items-center justify-between">
            <h2
              className={`text-3xl font-bold ${
                sidebarCollapsed ? "hidden" : "block"
              } transition-all duration-500`}
            >
              Ayurherb
            </h2>
          </div>
          <nav className="mt-8 flex flex-col space-y-4">
            {[
              { label: "Home", icon: <FaHome />, action: "Home" },
              { label: "My Herbs", icon: <FaLeaf />, action: "View My Herbs" },
              {
                label: "Explore Herbs",
                icon: <FaSearch />,
                action: "Explore New Herbs",
              },
              {
                label: "Gardening Tips",
                icon: <FaSeedling />,
                action: "Gardening Tips",
              },
              {
                label: "Community Forum",
                icon: <FaComments />,
                action: "Community Forum",
              },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleCardClick(item.action)}
                className="flex items-center space-x-3 hover:bg-sub-color hover:bg-opacity-60 p-2 rounded-lg transition-all duration-300"
              >
                <span className="text-xl">{item.icon}</span>
                <span
                  className={`text-lg ${sidebarCollapsed ? "hidden" : "block"}`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 w-full py-2 rounded shadow-md"
          >
            Logout
          </button>
        </div>
      </div>

      <main className="flex-1 p-6 ml-20 sm:ml-64 bg-sec-color">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-main-color">
            Welcome, {userEmail}!
          </h1>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "View My Herbs",
              icon: <FaLeaf />,
              desc: "Check out your saved herbs and their details.",
            },
            {
              title: "Explore New Herbs",
              icon: <FaSearch />,
              desc: "Discover new herbs and their benefits.",
            },
            {
              title: "Gardening Tips",
              icon: <FaSeedling />,
              desc: "Learn tips and tricks for herb gardening.",
            },
            {
              title: "Community Forum",
              icon: <FaComments />,
              desc: "Join discussions with fellow herb enthusiasts.",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              onClick={() => handleCardClick(card.title)}
              className="bg-green-200 bg-opacity-80 backdrop-blur-lg p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-2xl transition-transform transform hover:scale-105 hover:bg-opacity-100"
            >
              <div className="text-5xl mb-4 text-green-900">{card.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-main-color">
                {card.title}
              </h3>
              <p className="text-gray-500">{card.desc}</p>
            </div>
          ))}
        </div>

        <section className="mt-12 bg-green-200 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-main-color">
            Community Forum
          </h2>
          <div className="flex flex-col space-y-4">
            {communityPosts.length > 0 ? (
              communityPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 bg-white rounded-lg shadow-inner cursor-pointer"
                  onClick={() => toggleExpandedPost(post.id)}
                >
                  <h3 className="text-lg font-semibold text-gray-600">
                    {post.content}
                  </h3>
                  <p className="text-gray-600">
                    Started by {post.userName} - {post.replies.length} replies
                  </p>
                  {expandedPost === post.id && (
                    <p className="text-gray-600 mt-2">
                      {post.replies
                        .map((reply) => reply.replyContent)
                        .join(", ")}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600">No posts available.</p>
            )}
            <button
              className="self-end text-green-600 hover:text-green-800"
              onClick={() => navigate("/community")}
            >
              View All Discussions
            </button>
          </div>
        </section>

        {/* News Articles Section */}
        <section className="mt-12 bg-green-200 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-main-color">
            Latest News
          </h2>
          {loadingNews ? (
            <p>Loading news articles...</p>
          ) : errorNews ? (
            <p className="text-red-500">{errorNews}</p>
          ) : newsArticles.length > 0 ? (
            newsArticles.map((article, index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-white rounded-lg shadow-md"
              >
                <h3 className="font-semibold text-lg">{article.title}</h3>
                <p className="text-gray-600">{article.description}</p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  Read more
                </a>
              </div>
            ))
          ) : (
            <p>No news articles available.</p>
          )}
        </section>

        <ToastContainer />
      </main>
    </div>
  );
};

export default Dashboard;
