import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  fetchHerbs,
  createHerb,
  deleteHerb,
} from "../services/api";
import {
  onSnapshot,
  collection,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "../services/firebase";
import { Shield, Users, FileText, Plus, Settings, BarChart3, Menu, X } from "lucide-react";

import AdminSidebar from "../components/Admin.Module/AdminSidebar";
import AdminStats from "../components/Admin.Module/AdminStats";
import UserList from "../components/Admin.Module/UserList";
import PostList from "../components/Admin.Module/PostList";
import AddHerbForm from "../components/Admin.Module/AddHerbForm";
import ManageHerbs from "../components/Admin.Module/ManageHerbs";

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
  const [postCount, setPostCount] = useState(0);
  const [herbs, setHerbs] = useState([]);
  const [herbCount, setHerbCount] = useState(0);
  const [activeSection, setActiveSection] = useState("stats");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Fetch registered users
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

  // ✅ Fetch community posts from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "posts"),
      (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCommunityPosts(posts);
        setPostCount(posts.length);
      },
      (error) => {
        console.error("Error fetching posts:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // ✅ Fetch visit count
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

  // ✅ Fetch all herbs
  useEffect(() => {
    const getHerbs = async () => {
      try {
        const response = await fetchHerbs();
        setHerbs(response.data);
        setHerbCount(response.data.length);
      } catch (error) {
        console.error("Error fetching herbs:", error);
      }
    };

    getHerbs();
  }, []);

  // ✅ Herb form submission
  const handleHerbSubmit = async (e) => {
    e.preventDefault();
    if (!newHerb.name.trim() || !newHerb.description.trim()) {
      alert("Name and Description are required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createHerb(newHerb);
      alert("Herb added successfully!");
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
    } catch (error) {
      alert("Failed to add herb.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Delete post
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await deleteDoc(doc(firestore, "posts", postId));
    } catch (error) {
      alert("Failed to delete post.");
    }
  };

  // ✅ Delete herb
  const handleDeleteHerb = async (herbId) => {
    if (!window.confirm("Are you sure you want to delete this herb?")) return;

    try {
      await deleteHerb(herbId);
      setHerbs((prev) => prev.filter((herb) => herb._id !== herbId));
    } catch (error) {
      alert("Failed to delete herb.");
    }
  };

  const getSectionTitle = () => {
    const titles = {
      stats: "Dashboard Overview",
      users: "User Management",
      posts: "Community Posts",
      "add-herb": "Add New Herb",
      "manage-herbs": "Manage Herbs"
    };
    return titles[activeSection] || "Admin Panel";
  };

  const getSectionIcon = () => {
    const icons = {
      stats: BarChart3,
      users: Users,
      posts: FileText,
      "add-herb": Plus,
      "manage-herbs": Settings
    };
    return icons[activeSection] || Shield;
  };

  const IconComponent = getSectionIcon();

  return (
    <>
      <Navbar />

      {/* Main Content */}
      <div className="flex bg-gradient-to-br from-green-50 via-white to-emerald-50 min-h-screen pt-20">
        {/* Sidebar */}
        <AdminSidebar
          isOpen={isSidebarOpen}
          toggle={() => setIsSidebarOpen(!isSidebarOpen)}
          active={activeSection}
          setActive={setActiveSection}
        />

        {/* Main Content Area */}
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-6 lg:p-8">
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200  transition-all duration-200"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                <span className="font-medium text-gray-700">Menu</span>
              </button>
            </div>

            {/* Section Header */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl  border border-green-100 p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">{getSectionTitle()}</h2>
                  <p className="text-gray-600 mt-1">
                    {activeSection === 'stats' && 'Monitor platform statistics and user activity'}
                    {activeSection === 'users' && 'View and manage registered users'}
                    {activeSection === 'posts' && 'Moderate community posts and discussions'}
                    {activeSection === 'add-herb' && 'Add new herbs to the database'}
                    {activeSection === 'manage-herbs' && 'Edit, update, or remove existing herbs'}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              {activeSection === "stats" && (
                <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-green-100 p-8">
                  <AdminStats
                    totalUsers={totalUsers}
                    visitCount={visitCount}
                    postCount={postCount}
                    herbCount={herbCount}
                  />
                </div>
              )}

              {activeSection === "users" && (
                <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-green-100 p-8">
                  <UserList users={registeredUsers} />
                </div>
              )}

              {activeSection === "posts" && (
                <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-green-100 p-8">
                  <PostList posts={communityPosts} onDelete={handleDeletePost} />
                </div>
              )}

              {activeSection === "add-herb" && (
                <div className="bg-white/80 backdrop-blur-md rounded-3xl  border border-green-100 p-8">
                  <AddHerbForm
                    herb={newHerb}
                    setHerb={setNewHerb}
                    isSubmitting={isSubmitting}
                    onSubmit={handleHerbSubmit}
                  />
                </div>
              )}

              {activeSection === "manage-herbs" && (
                <div className="bg-white/80 backdrop-blur-md rounded-3xl  border border-green-100 p-8">
                  <ManageHerbs herbs={herbs} onDelete={handleDeleteHerb} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
