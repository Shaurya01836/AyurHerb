import React, { useState, useEffect } from "react";
import { firestore } from "../services/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
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
  const [visitCount, setVisitCount] = useState(0);
  const [postCount, setPostCount] = useState(0); // New state for post count
  const [activeSection, setActiveSection] = useState("stats");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch registered users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://herb-sphere-server.onrender.com/api/users"
        );
        const data = await response.json();
        setRegisteredUsers(data.users);
        setTotalUsers(data.totalUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch community posts
  useEffect(() => {
    const unsubscribePosts = onSnapshot(
      collection(firestore, "posts"),
      (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCommunityPosts(posts); // Set posts
        setPostCount(posts.length); // Set post count
      },
      (error) => {
        console.error("Error fetching posts:", error);
      }
    );

    return () => unsubscribePosts();
  }, []);

  // Fetch visit count
  useEffect(() => {
    const fetchVisitData = async () => {
      try {
        const response = await fetch(
          "https://herb-sphere-server.onrender.com/api/visit-count"
        );
        const data = await response.json();
        setVisitCount(data.visitCount || 0);
      } catch (error) {
        console.error("Error fetching visit count:", error);
      }
    };

    fetchVisitData();
  }, []);

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

    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, "herbs"), {
        ...newHerb,
        createdAt: new Date().toISOString(),
      });
      alert("Herb added successfully!");
      resetHerbForm();
    } catch (error) {
      console.error("Error adding herb:", error);
      alert("Failed to add herb.");
    } finally {
      setIsSubmitting(false);
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
      alert("Failed to delete post.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "w-64" : "w-20"
          } bg-green-800 text-white h-screen fixed transition-width duration-300 flex flex-col`}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-4 focus:outline-none hover:bg-green-700"
          >
            {isSidebarOpen ? "<" : ">"}
          </button>
          <nav className="flex flex-col space-y-4 mt-6">
            {[
              { id: "stats", label: "Stats" },
              { id: "users", label: "Registered Users" },
              { id: "posts", label: "Community Posts" },
              { id: "add-herb", label: "Add New Herb" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`hover:bg-green-700 p-3 rounded ${
                  activeSection === id ? "bg-green-600" : ""
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-6 md:p-12 bg-gray-100 min-h-screen flex flex-col space-y-8 mt-16">
          <h1 className="text-5xl font-extrabold text-center text-green-600">
            Admin Panel
          </h1>

          {/* Active Section */}
          {activeSection === "stats" && (
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-green-600 text-white p-6 rounded-lg text-center">
                <h2 className="text-3xl">Total Users</h2>
                <p className="text-4xl font-bold">{totalUsers}</p>
              </div>
              <div className="bg-blue-600 text-white p-6 rounded-lg text-center">
                <h2 className="text-3xl">Visit Count</h2>
                <p className="text-4xl font-bold">{visitCount}</p>
              </div>
              <div className="bg-purple-600 text-white p-6 rounded-lg text-center">
                <h2 className="text-3xl">Community Posts</h2>
                <p className="text-4xl font-bold">{postCount}</p>
              </div>
            </section>
          )}

          {activeSection === "users" && (
            <section className="bg-white shadow p-6 rounded-lg">
              <h2 className="text-3xl mb-4">Registered Users</h2>
              {registeredUsers.map((user, index) => (
                <p key={index} className="border-b py-2">
                  {user.email || "Anonymous"}
                </p>
              ))}
            </section>
          )}

          {activeSection === "posts" && (
            <section className="bg-white shadow p-6 rounded-lg">
              <h2 className="text-3xl mb-4">Community Posts</h2>
              {communityPosts.map((post) => (
                <div key={post.id} className="p-4 border rounded mb-4">
                  <p>{post.content}</p>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded mt-2"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </section>
          )}

          {activeSection === "add-herb" && (
            <section className="bg-white shadow p-6 rounded-lg">
              <h2 className="text-3xl mb-4">Add New Herb</h2>
              <form onSubmit={handleHerbSubmit}>
                <input
                  type="text"
                  placeholder="Name"
                  value={newHerb.name}
                  onChange={(e) =>
                    setNewHerb({ ...newHerb, name: e.target.value })
                  }
                  className="p-2 border rounded w-full mb-4"
                />
                <textarea
                  placeholder="Description"
                  value={newHerb.description}
                  onChange={(e) =>
                    setNewHerb({ ...newHerb, description: e.target.value })
                  }
                  className="p-2 border rounded w-full mb-4"
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded"
                >
                  {isSubmitting ? "Adding..." : "Add Herb"}
                </button>
              </form>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
