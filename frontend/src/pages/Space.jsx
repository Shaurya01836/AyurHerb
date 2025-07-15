import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchSpaces, joinSpace, leaveSpace, fetchCommunityPosts } from "../services/firebase";
import Navbar from "../components/Navbar";
import PostCard from "../components/Community/PostCard";
import CreatePostModal from "../components/Community/CreatePostModal";

const Space = () => {
  const { spaceId } = useParams();
  const [space, setSpace] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({ uid: "demo-user", displayName: "Demo User", email: "demo@example.com" }); // Replace with real auth

  useEffect(() => {
    const getSpaceAndPosts = async () => {
      setLoading(true);
      const allSpaces = await fetchSpaces();
      const found = allSpaces.find((s) => s.id === spaceId);
      setSpace(found);
      if (found) {
        const postsInSpace = await fetchCommunityPosts({ spaceId: found.id });
        setPosts(postsInSpace);
      }
      setLoading(false);
    };
    getSpaceAndPosts();
  }, [spaceId, showCreateModal]);

  const handleJoin = async () => {
    await joinSpace(space.id, currentUser.uid);
    setSpace((prev) => ({ ...prev, members: [...(prev.members || []), currentUser.uid] }));
  };
  const handleLeave = async () => {
    await leaveSpace(space.id, currentUser.uid);
    setSpace((prev) => ({ ...prev, members: (prev.members || []).filter(id => id !== currentUser.uid) }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-solid"></div>
        </div>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-6xl mb-4">🌱</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Space not found</h2>
          <p className="text-gray-600">This space does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link to="/spaces" className="text-green-600 hover:underline text-sm mb-4 inline-block">&larr; Back to Spaces</Link>
        {/* Space Info */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 mb-8 flex flex-col gap-3">
          {space.coverImage && (
            <img src={space.coverImage} alt={space.name} className="w-full h-40 object-cover rounded-xl mb-2" />
          )}
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900 flex-1 truncate">{space.name}</h1>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">{(space.members || []).length} members</span>
          </div>
          <div className="text-gray-700 text-sm mb-2">{space.description}</div>
          {(space.members || []).includes(currentUser.uid) ? (
            <button
              className="w-full bg-red-100 text-red-700 font-semibold py-2 rounded-xl hover:bg-red-200 transition"
              onClick={handleLeave}
            >
              Leave Space
            </button>
          ) : (
            <button
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 rounded-xl hover:from-green-600 hover:to-emerald-700 transition"
              onClick={handleJoin}
            >
              Join Space
            </button>
          )}
        </div>
        {/* Posts in Space */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Posts in {space.name}</h2>
            <button
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-5 py-2 rounded-xl shadow hover:from-green-600 hover:to-emerald-700 transition-all"
              onClick={() => setShowCreateModal(true)}
            >
              + Create Post
            </button>
          </div>
          {posts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No posts yet in this space.</div>
          ) : (
            <div className="flex flex-col gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} currentUser={currentUser} />
              ))}
            </div>
          )}
        </div>
        {showCreateModal && (
          <CreatePostModal
            onClose={() => setShowCreateModal(false)}
            currentUser={currentUser}
            spaceId={space.id}
          />
        )}
      </div>
    </div>
  );
};

export default Space; 