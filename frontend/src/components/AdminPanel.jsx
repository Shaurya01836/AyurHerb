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

  // Fetch users from custom server
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

  // Fetch community posts from Firestore
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

    return () => unsubscribePosts();
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

        {/* Registered Users Section */}
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
                      {user.email || "Anonymous"}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>

        {/* Community Posts Section */}
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
      </div>
    </>
  );
};

export default AdminPanel;
