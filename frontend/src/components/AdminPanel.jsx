import React, { useState, useEffect } from "react";
import { auth, firestore } from "../services/firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { getAnalytics, logEvent } from "firebase/analytics";
import Navbar from "./Navbar";

const AdminPanel = () => {
  const [newHerb, setNewHerb] = useState({
    name: "",
    description: "",
    youtubeLink: "",
    multimediaLinks: "",
    audioLink: "",
    modelLink: "",
  });

  const [communityPosts, setCommunityPosts] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [visitCount, setVisitCount] = useState(0); // State for visit count
  const [loadingVisitCount, setLoadingVisitCount] = useState(true); // Loading state
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for herb submission

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://herb-sphere-server.onrender.com/api/users");
        const data = await response.json();
        setRegisteredUsers(data.users);
        setTotalUsers(data.totalUsers);
      } catch (error) {
        console.error("Error fetching users from server:", error);
      } finally {
        setFetchingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const unsubscribePosts = onSnapshot(
      collection(firestore, "posts"),
      (snapshot) => {
        setCommunityPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setFetchingPosts(false);
      },
      (error) => {
        console.error("Error fetching posts:", error);
        setFetchingPosts(false);
      }
    );

    return () => unsubscribePosts();
  }, []);

  useEffect(() => {
    fetchVisitData();
  }, []);

  const fetchVisitData = async () => {
    try {
      const count = await getVisitCount();
      setVisitCount(count); // Update the state with the visit count
    } catch (error) {
      console.error("Failed to fetch visit count:", error);
    } finally {
      setLoadingVisitCount(false); // Loading complete
    }
  };

  const validateHerbDetails = () => {
    const { name, description } = newHerb;
    if (!name.trim() || !description.trim()) {
      alert("Name and Description are required fields.");
      return false;
    }
    return true;
  };

  const handleHerbSubmit = async (e) => {
    e.preventDefault();
    if (!validateHerbDetails()) return;

    setLoading(true);
    try {
      await addDoc(collection(firestore, "herbs"), {
        ...newHerb,
        createdAt: new Date().toISOString(),
      });
      alert("Herb added successfully!");
      resetHerbForm();
    } catch (error) {
      console.error("Error adding herb:", error);
      alert("Failed to add herb details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetHerbForm = () => {
    setNewHerb({
      name: "",
      description: "",
      youtubeLink: "",
      multimediaLinks: "",
      audioLink: "",
      modelLink: "",
    });
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await deleteDoc(doc(firestore, "posts", postId));
      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete the post.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 md:p-12 bg-gray-100 min-h-screen flex flex-col space-y-8 mt-16">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700">
          Admin Panel
        </h1>

        {/* Stats Card for Total Users and Daily Visits */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-indigo-600 text-white p-6 rounded-lg shadow-xl text-center">
            <h2 className="text-3xl font-semibold">Total Users</h2>
            <p className="text-4xl font-bold">{totalUsers}</p>
          </div>
          <div className="bg-indigo-600 text-white p-6 rounded-lg shadow-xl text-center">
            <h2 className="text-3xl font-semibold">Visit Count</h2>
            {loadingVisitCount ? (
              <p className="text-lg">Loading...</p>
            ) : (
              <p className="text-4xl font-bold">{visitCount}</p>
            )}
          </div>
        </section>

        {/* Registered Users Section */}
        <section className="bg-white shadow-xl rounded-lg p-8">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6">
            Registered Users
          </h2>
          {fetchingUsers ? (
            <p className="text-lg text-gray-500">Loading users...</p>
          ) : (
            <>
              <p className="text-xl text-gray-600">
                Total Registered Users: {totalUsers}
              </p>
              {registeredUsers
                .slice(0, showAllUsers ? registeredUsers.length : 5)
                .map((user, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 border rounded-lg shadow-sm mb-4"
                  >
                    <p className="text-lg text-gray-800">
                      {user.email || "Anonymous"}
                    </p>
                  </div>
                ))}
              {!showAllUsers && registeredUsers.length > 5 && (
                <button
                  onClick={() => setShowAllUsers(true)}
                  className="mt-4 text-indigo-600 hover:text-indigo-800"
                >
                  See More
                </button>
              )}
            </>
          )}
        </section>

        {/* Community Posts Section */}
        <section className="bg-white shadow-xl rounded-lg p-8">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6">
            Manage Community Posts
          </h2>
          {fetchingPosts ? (
            <p className="text-lg text-gray-500">Loading posts...</p>
          ) : communityPosts.length === 0 ? (
            <p className="text-lg text-gray-500">No posts available.</p>
          ) : (
            communityPosts
              .slice(0, showAllPosts ? communityPosts.length : 5)
              .map((post) => (
                <div
                  key={post.id}
                  className="p-6 bg-gray-50 border rounded-lg shadow-sm mb-6"
                >
                  <p className="text-lg font-semibold text-indigo-600">
                    {post.userName}
                  </p>
                  <p className="text-gray-700 mt-2">{post.content}</p>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="mt-4 bg-red-500 text-white hover:bg-red-600 py-2 px-6 rounded-lg focus:outline-none"
                  >
                    Delete Post
                  </button>
                </div>
              ))
          )}
          {!showAllPosts && communityPosts.length > 5 && (
            <button
              onClick={() => setShowAllPosts(true)}
              className="mt-4 text-indigo-600 hover:text-indigo-800"
            >
              See More
            </button>
          )}
        </section>
      </div>
    </>
  );
};

export default AdminPanel;
