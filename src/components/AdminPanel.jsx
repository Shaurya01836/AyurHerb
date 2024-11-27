import React, { useState, useEffect } from "react";
import { auth, firestore } from "../services/firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";
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
  const [loading, setLoading] = useState(false);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [fetchingUsers, setFetchingUsers] = useState(true);

  // Fetch data from Firestore
  useEffect(() => {
    const unsubscribePosts = onSnapshot(
      collection(firestore, "posts"),
      (snapshot) => {
        setCommunityPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setFetchingPosts(false);
      },
      (error) => {
        console.error("Error fetching posts: ", error);
        setFetchingPosts(false);
      }
    );

    const unsubscribeUsers = onSnapshot(
      collection(firestore, "users"),
      (snapshot) => {
        const users = snapshot.docs.map((doc) => doc.data());
        setRegisteredUsers(users);
        setTotalUsers(users.length);
        setFetchingUsers(false);
      },
      (error) => {
        console.error("Error fetching users: ", error);
        setFetchingUsers(false);
      }
    );

    return () => {
      unsubscribePosts();
      unsubscribeUsers();
    };
  }, []);

  // Validate form inputs
  const validateHerbDetails = () => {
    const { name, description } = newHerb;
    if (!name.trim() || !description.trim()) {
      alert("Name and Description are required fields.");
      return false;
    }
    return true;
  };

  // Handle Herb Submission
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
      console.error("Error adding herb: ", error);
      alert("Failed to add herb details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset Herb Form
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

  // Handle Post Deletion
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await deleteDoc(doc(firestore, "posts", postId));
      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post: ", error);
      alert("Failed to delete the post.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-extrabold text-center mb-6">Admin Panel</h1>

        {/* Section 1: Add Herb Details */}
        <section className="mb-8 p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Add Herb Details</h2>
          <form onSubmit={handleHerbSubmit} className="space-y-4">
            {Object.entries(newHerb).map(([key, value]) => (
              <div key={key}>
                <input
                  type={key === "description" ? "textarea" : "text"}
                  placeholder={key.replace(/([A-Z])/g, " $1").toUpperCase()}
                  value={value}
                  onChange={(e) =>
                    setNewHerb((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  required={key === "name" || key === "description"}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
            <button
              type="submit"
              className={`py-2 px-4 rounded ${loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"} text-white`}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Herb"}
            </button>
          </form>
        </section>

        {/* Section 2: Manage Community Posts */}
        <section className="mb-8 p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Manage Community Posts</h2>
          {fetchingPosts ? (
            <p>Loading posts...</p>
          ) : communityPosts.length === 0 ? (
            <p>No posts available.</p>
          ) : (
            communityPosts.map((post) => (
              <div key={post.id} className="p-4 border rounded shadow mb-4">
                <p className="text-lg font-bold">{post.userName}</p>
                <p>{post.content}</p>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 mt-2 rounded"
                >
                  Delete Post
                </button>
              </div>
            ))
          )}
        </section>

        {/* Section 3: Registered Users */}
        <section className="p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Registered Users</h2>
          {fetchingUsers ? (
            <p>Loading users...</p>
          ) : (
            <>
              <p className="text-lg">Total Registered Users: {totalUsers}</p>
              {registeredUsers.length === 0 ? (
                <p>No registered users available.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {registeredUsers.map((user, index) => (
                    <li key={index} className="p-2 border rounded shadow">
                      {user.displayName || user.email || "Anonymous"}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default AdminPanel;
