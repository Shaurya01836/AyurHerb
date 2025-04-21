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

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar
          isOpen={isSidebarOpen}
          toggle={() => setIsSidebarOpen(!isSidebarOpen)}
          active={activeSection}
          setActive={setActiveSection}
        />

        <div className="ml-64 flex-1 p-6 md:p-12 bg-gray-100 min-h-screen flex flex-col space-y-8 mt-16">
          <h1 className="text-5xl font-extrabold text-center text-green-600">
            Admin Panel
          </h1>

          {activeSection === "stats" && (
            <AdminStats
              totalUsers={totalUsers}
              visitCount={visitCount}
              postCount={postCount}
              herbCount={herbCount}
            />
          )}

          {activeSection === "users" && (
            <UserList users={registeredUsers} />
          )}

          {activeSection === "posts" && (
            <PostList posts={communityPosts} onDelete={handleDeletePost} />
          )}

          {activeSection === "add-herb" && (
            <AddHerbForm
              herb={newHerb}
              setHerb={setNewHerb}
              isSubmitting={isSubmitting}
              onSubmit={handleHerbSubmit}
            />
          )}

          {activeSection === "manage-herbs" && (
            <ManageHerbs herbs={herbs} onDelete={handleDeleteHerb} />
          )}
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
