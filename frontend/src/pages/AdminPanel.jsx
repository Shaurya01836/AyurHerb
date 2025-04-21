import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { fetchHerbs, createHerb, deleteHerb } from "../services/api"; // Import the fetchHerbs, createHerb, and deleteHerb functions
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { onSnapshot, collection, doc, deleteDoc } from "firebase/firestore"; // Import onSnapshot, collection, doc, deleteDoc from firebase/firestore
import { firestore } from "../services/firebase"; // Import firestore from your Firebase configuration file

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminPanel = () => {
  const [newHerb, setNewHerb] = useState({
    imageSrc: "",
    multimedia1: "",
    multimedia2: "",
    multimedia3: "",
    multimedia4: "",
    name: "",
    region: "",
    type: "",
    habitat: "",
    description: "",
    sketchfabModelUrl: "",
    audioSrc: "",
    botanicalName: "",
    commonNames: "",
    medicinalUses: "",
    methodsOfCultivation: "",
  });

  const [communityPosts, setCommunityPosts] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [visitCount, setVisitCount] = useState(0);
  const [postCount, setPostCount] = useState(0); // New state for post count
  const [herbs, setHerbs] = useState([]); // State to hold fetched herbs
  const [herbCount, setHerbCount] = useState(0); // State to hold the number of herbs
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

  // Fetch herbs data
  useEffect(() => {
    const getHerbs = async () => {
      try {
        const response = await fetchHerbs();
        setHerbs(response.data);
        setHerbCount(response.data.length); // Set the number of herbs
      } catch (error) {
        console.error("Error fetching herbs:", error);
      }
    };

    getHerbs();
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
      await createHerb(newHerb);
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
      imageSrc: "",
      multimedia1: "",
      multimedia2: "",
      multimedia3: "",
      multimedia4: "",
      name: "",
      region: "",
      type: "",
      habitat: "",
      description: "",
      sketchfabModelUrl: "",
      audioSrc: "",
      botanicalName: "",
      commonNames: "",
      medicinalUses: "",
      methodsOfCultivation: "",
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

  const handleDeleteHerb = async (herbId) => {
    if (!window.confirm("Are you sure you want to delete this herb?")) return;

    try {
      await deleteHerb(herbId);
      alert("Herb deleted successfully!");
      setHerbs(herbs.filter((herb) => herb._id !== herbId)); // Update the herbs state
    } catch (error) {
      console.error("Error deleting herb:", error);
      alert("Failed to delete herb.");
    }
  };

  // Data for the comparison bar chart
  const comparisonChartData = {
    labels: ["Total Users", "Visit Count"],
    datasets: [
      {
        label: "Count",
        data: [totalUsers, visitCount],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
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
              { id: "manage-herbs", label: "Manage Herbs" }, // New section for managing herbs
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
              <div className="bg-red-600 text-white p-6 rounded-lg text-center">
                <h2 className="text-3xl">Total Herbs</h2>
                <p className="text-4xl font-bold">{herbCount}</p>
              </div>
              <div className="col-span-1 sm:col-span-2 md:col-span-3">
                <Bar data={comparisonChartData} />
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
              <form
                onSubmit={handleHerbSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <input
                  type="text"
                  placeholder="Image Source"
                  value={newHerb.imageSrc}
                  onChange={(e) =>
                    setNewHerb({ ...newHerb, imageSrc: e.target.value })
                  }
                  className="p-2 border rounded w-full mb-4"
                />
                <input
                  type="text"
                  placeholder="Multimedia 1"
                  value={newHerb.multimedia1}
                  onChange={(e) =>
                    setNewHerb({ ...newHerb, multimedia1: e.target.value })
                  }
                  className="p-2 border rounded w-full mb-4"
                />
                <input
                  type="text"
                  placeholder="Multimedia 2"
                  value={newHerb.multimedia2}
                  onChange={(e) =>
                    setNewHerb({ ...newHerb, multimedia2: e.target.value })
                  }
                  className="p-2 border rounded w-full mb-4"
                />
                <input
                  type="text"
                  placeholder="Multimedia 3"
                  value={newHerb.multimedia3}
                  onChange={(e) =>
                    setNewHerb({ ...newHerb, multimedia3: e.target.value })
                  }
                  className="p-2 border rounded w-full mb-4"
                />
                <input
                  type="text"
                  placeholder="Multimedia 4"
                  value={newHerb.multimedia4}
                  onChange={(e) =>
                    setNewHerb({ ...newHerb, multimedia4: e.target.value })
                  }
                  className="p-2 border rounded w-full mb-4"
                />
                <input
                  type="text"
                  placeholder="Name"
                  value={newHerb.name}
                  onChange={(e) =>
                    setNewHerb({ ...newHerb, name: e.target.value })
                  }
                  className="p-2 border rounded w-full mb-4"
                />
                <input
                  type="text"
                  placeholder="Region"
                  value={newHerb.region}
                  onChange={(e) =>
                    setNewHerb({ ...newHerb, region: e.target.value })
                  }
                  className="p-2 border rounded w-full mb-4"
                />
                <input
                  type="text"
                  placeholder="Type"
                  value={newHerb.type}
                  onChange={(e) =>
                    setNewHerb({ ...newHerb, type: e.target.value })
                  }
                  className="p-2 border rounded w-full mb-4"
                />
                <textarea
                  placeholder="Habitat"
                  value={newHerb.habitat}
                  onChange={(e) =>
                    setNewHerb({ ...newHerb, habitat: e.target.value })
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
                <input
                  type="text"
                  placeholder="Sketchfab Model URL"
                  value={newHerb.sketchfabModelUrl}
                  onChange={(e) =>
                    setNewHerb({
                      ...newHerb,
                      sketchfabModelUrl: e.target.value,
                    })
                  }
                  className="p-2 border rounded w-full mb-4"
                />
                <input
                  type="text"
                  placeholder="Audio Source"
                  value={newHerb.audioSrc}
                  onChange={(e) =>
                    setNewHerb({ ...newHerb, audioSrc: e.target.value })
                  }
                  className="p-2 border rounded w-full mb-4"
                />
                <input
                  type="text"
                  placeholder="Botanical Name"
                  value={newHerb.botanicalName}
                  onChange={(e) =>
                    setNewHerb({ ...newHerb, botanicalName: e.target.value })
                  }
                  className="p-2 border rounded w-full mb-4"
                />
                <textarea
                  placeholder="Common Names"
                  value={newHerb.commonNames}
                  onChange={(e) =>
                    setNewHerb({ ...newHerb, commonNames: e.target.value })
                  }
                  className="p-2 border rounded w-full mb-4"
                />
                <textarea
                  placeholder="Medicinal Uses"
                  value={newHerb.medicinalUses}
                  onChange={(e) =>
                    setNewHerb({ ...newHerb, medicinalUses: e.target.value })
                  }
                  className="p-2 border rounded w-full mb-4"
                />
                <textarea
                  placeholder="Methods of Cultivation"
                  value={newHerb.methodsOfCultivation}
                  onChange={(e) =>
                    setNewHerb({
                      ...newHerb,
                      methodsOfCultivation: e.target.value,
                    })
                  }
                  className="p-2 border rounded w-full mb-4"
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded col-span-1 md:col-span-2"
                >
                  {isSubmitting ? "Adding..." : "Add Herb"}
                </button>
              </form>
            </section>
          )}

          {activeSection === "manage-herbs" && (
            <section className="bg-white shadow p-6 rounded-lg">
              <h2 className="text-3xl mb-4">Manage Herbs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {herbs.map((herb) => (
                  <div
                    key={herb._id}
                    className="bg-white border rounded-lg shadow-md overflow-hidden"
                  >
                    <img
                      src={herb.imageSrc}
                      alt={herb.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-2">{herb.name}</h3>
                      <p className="text-gray-700 mb-4">{herb.description}</p>
                      <a
                        href={herb.sketchfabModelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View 3D Model
                      </a>
                      <button
                        onClick={() => handleDeleteHerb(herb._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded mt-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminPanel;