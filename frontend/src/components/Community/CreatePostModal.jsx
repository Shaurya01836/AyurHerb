import React, { useState, useEffect } from "react";
import { createCommunityPost, POST_TYPES, DEFAULT_CATEGORIES, fetchSpaces } from "../../services/firebase";

const CreatePostModal = ({ onClose, currentUser, spaceId: propSpaceId }) => {
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState(POST_TYPES[0]);
  const [categories, setCategories] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [spaces, setSpaces] = useState([]);
  const [spaceId, setSpaceId] = useState(propSpaceId || "main"); // default to 'main' for Main Community

  useEffect(() => {
    if (!propSpaceId) {
      fetchSpaces().then(setSpaces);
    }
  }, [propSpaceId]);

  const handleCategoryChange = (cat) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please log in to create a post.");
      return;
    }
    // No longer require spaceId, allow 'main' for Main Community
    setLoading(true);
    await createCommunityPost({
      content,
      postType,
      categories,
      media,
      userId: currentUser.uid,
      userName: currentUser.displayName || currentUser.email || "Anonymous",
      userProfilePic: currentUser.photoURL || "",
      spaceId: spaceId === "main" ? null : spaceId, // null for Main Community
    });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col"
        style={{ boxShadow: "0 8px 32px 0 rgba(34,197,94,0.15)" }}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold z-10"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Create a Post</h2>
        {currentUser && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
              {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || "U"}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{currentUser.displayName || currentUser.email || "Anonymous"}</div>
              <div className="text-xs text-gray-500">{currentUser.email}</div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Space selection */}
          <div>
            <label className="block font-medium mb-1">Post To</label>
            {propSpaceId ? (
              <div className="px-3 py-2 border rounded bg-gray-50 text-gray-700 font-semibold">
                {spaces.find(s => s.id === propSpaceId)?.name || "This Space"}
              </div>
            ) : (
              <select
                className="w-full border rounded px-3 py-2"
                value={spaceId}
                onChange={e => setSpaceId(e.target.value)}
              >
                <option value="main">Main Community</option>
                {spaces.map((space) => (
                  <option key={space.id} value={space.id}>{space.name}</option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Type</label>
            <select className="w-full border rounded px-3 py-2" value={postType} onChange={e => setPostType(e.target.value)}>
              {POST_TYPES.map((type) => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Categories</label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  className={`px-3 py-1 rounded-full border ${categories.includes(cat) ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700"}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Content</label>
            <textarea className="w-full border rounded px-3 py-2" rows={5} value={content} onChange={e => setContent(e.target.value)} required />
          </div>
          {/* Media upload placeholder */}
          <div>
            <label className="block font-medium mb-1">Media (optional)</label>
            <input type="file" multiple disabled className="w-full" />
            <div className="text-xs text-gray-400 mt-1">(Media upload coming soon)</div>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl mt-2 shadow hover:from-green-600 hover:to-emerald-700 transition-all" disabled={loading}>
            {loading ? "Posting..." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal; 