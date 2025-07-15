import React, { useEffect, useState } from "react";
import { fetchSpaces, joinSpace, leaveSpace, createSpace } from "../services/firebase";
import Navbar from "../components/Navbar";

const Spaces = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({ uid: "demo-user" }); // Replace with real auth

  const getSpaces = async () => {
    setLoading(true);
    const data = await fetchSpaces();
    setSpaces(data);
    setLoading(false);
  };

  useEffect(() => {
    getSpaces();
    // eslint-disable-next-line
  }, []);

  const handleJoin = async (spaceId) => {
    await joinSpace(spaceId, currentUser.uid);
    setSpaces((prev) => prev.map(s => s.id === spaceId ? { ...s, members: [...(s.members || []), currentUser.uid] } : s));
  };
  const handleLeave = async (spaceId) => {
    await leaveSpace(spaceId, currentUser.uid);
    setSpaces((prev) => prev.map(s => s.id === spaceId ? { ...s, members: (s.members || []).filter(id => id !== currentUser.uid) } : s));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Spaces</h1>
          <button
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:from-green-600 hover:to-emerald-700 transition-all"
            onClick={() => setShowCreateModal(true)}
          >
            + Create Space
          </button>
        </div>
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-green-500 border-solid mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading spaces...</p>
          </div>
        ) : spaces.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Spaces Yet</h3>
            <p className="text-gray-600">Be the first to create a space for your favorite topic!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {spaces.map((space) => (
              <div key={space.id} className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 flex flex-col gap-3">
                {space.coverImage && (
                  <img src={space.coverImage} alt={space.name} className="w-full h-32 object-cover rounded-xl mb-2" />
                )}
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-gray-900 flex-1 truncate">{space.name}</h2>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">{(space.members || []).length} members</span>
                </div>
                <div className="text-gray-700 text-sm mb-2 line-clamp-2">{space.description}</div>
                {(space.members || []).includes(currentUser.uid) ? (
                  <button
                    className="w-full bg-red-100 text-red-700 font-semibold py-2 rounded-xl hover:bg-red-200 transition"
                    onClick={() => handleLeave(space.id)}
                  >
                    Leave Space
                  </button>
                ) : (
                  <button
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 rounded-xl hover:from-green-600 hover:to-emerald-700 transition"
                    onClick={() => handleJoin(space.id)}
                  >
                    Join Space
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {showCreateModal && <CreateSpaceModal onClose={() => { setShowCreateModal(false); getSpaces(); }} currentUser={currentUser} />}
      </div>
    </div>
  );
};

// CreateSpaceModal with logic
const CreateSpaceModal = ({ onClose, currentUser }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !description.trim()) {
      setError("Name and description are required.");
      return;
    }
    setLoading(true);
    try {
      await createSpace({ name: name.trim(), description: description.trim(), coverImage: coverImage.trim(), createdBy: currentUser.uid });
      setLoading(false);
      onClose();
    } catch (err) {
      setError("Failed to create space. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold z-10" onClick={onClose} aria-label="Close">&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-center">Create a Space</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input className="w-full border rounded px-3 py-2" placeholder="Space name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea className="w-full border rounded px-3 py-2" rows={3} placeholder="What is this space about?" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="block font-medium mb-1">Cover Image (URL)</label>
            <input className="w-full border rounded px-3 py-2" placeholder="https://..." value={coverImage} onChange={e => setCoverImage(e.target.value)} />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl mt-2 shadow hover:from-green-600 hover:to-emerald-700 transition-all" disabled={loading}>
            {loading ? "Creating..." : "Create Space"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Spaces; 