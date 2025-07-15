import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Community/Sidebar";
import CreatePostModal from "../components/Community/CreatePostModal";
import PostCard from "../components/Community/PostCard";
import CreateSpaceModal from "../components/Community/CreateSpaceModal";
import {
  fetchCommunityPosts,
  DEFAULT_CATEGORIES,
  POST_TYPES,
} from "../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";

const Community = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [postType, setPostType] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [user, userLoading] = useAuthState(auth);

  // Replace currentUser with the real user
  const currentUser = user;

  // Fetch posts for selected space
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const data = await fetchCommunityPosts({
        category: category || null,
        postType: postType || null,
        spaceId: selectedSpace ? selectedSpace.id : null,
      });
      setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, [category, postType, selectedSpace]);

  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(search.toLowerCase()) ||
      (post.categories || []).some((cat) =>
        cat.toLowerCase().includes(search.toLowerCase())
      )
  );

  // Sidebar handlers
  const handleSelectSpace = (space) => setSelectedSpace(space);
  const handleCreateSpace = () => setShowCreateModal("space");

  // Create Post modal handler
  const handleCreatePost = () => setShowCreateModal("post");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 flex gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <Sidebar
            selectedSpaceId={selectedSpace ? selectedSpace.id : null}
            onSelectSpace={handleSelectSpace}
            onCreateSpace={handleCreateSpace}
          />
        </div>
        {/* Main Content */}
        <div className="flex-1">
          {/* Space Info (if selected) */}
          {selectedSpace && (
            <div className="bg-white/80 rounded-xl border border-green-100 p-6 mb-6 flex flex-col gap-2">
              {selectedSpace.coverImage && (
                <img
                  src={selectedSpace.coverImage}
                  alt={selectedSpace.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
              )}
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-gray-900 flex-1 truncate">
                  {selectedSpace.name}
                </h2>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  {(selectedSpace.members || []).length} members
                </span>
              </div>
              <div className="text-gray-700 text-sm mb-2">
                {selectedSpace.description}
              </div>
            </div>
          )}
          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
            <input
              type="text"
              placeholder="Search posts, tags, or categories..."
              className="w-full md:w-1/2 px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-400"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {DEFAULT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              className="px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-400"
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
            >
              <option value="">All Types</option>
              {POST_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            <button
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:from-green-600 hover:to-emerald-700 transition-all"
              onClick={handleCreatePost}
            >
              + Create Post
            </button>
          </div>
          {/* Posts Feed */}
          <div className=" overflow-hidden">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-green-500 border-solid mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🌿</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  No Posts Found
                </h3>
                <p className="text-gray-600">
                  Try a different search or category.
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} currentUser={currentUser} />
              ))
            )}
          </div>
        </div>
      </div>
      {/* Create Post Modal */}
      {showCreateModal === "post" && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          currentUser={currentUser}
          spaceId={selectedSpace ? selectedSpace.id : undefined}
        />
      )}
      {showCreateModal === "space" && (
        <CreateSpaceModal
          onClose={() => setShowCreateModal(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default Community;
