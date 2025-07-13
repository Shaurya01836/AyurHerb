import { useState, useEffect } from "react";
import { auth, firestore } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  FiThumbsUp,
  FiThumbsDown,
  FiMessageCircle,
  FiClock,
  FiUser,
} from "react-icons/fi";
import Navbar from "../components/Navbar";

const CommunityForum = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [newReply, setNewReply] = useState("");
  const [activePostId, setActivePostId] = useState(null);
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch authenticated user
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Fetch posts from Firestore
    const q = query(
      collection(firestore, "posts"),
      orderBy("createdAt", "desc")
    );
    const unsubscribePosts = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);

      // Set initial likes and dislikes
      const initialLikes = postsData.reduce((acc, post) => {
        acc[post.id] = post.likes || 0;
        return acc;
      }, {});
      setLikes(initialLikes);

      const initialDislikes = postsData.reduce((acc, post) => {
        acc[post.id] = post.dislikes || 0;
        return acc;
      }, {});
      setDislikes(initialDislikes);
    });

    return () => {
      unsubscribe();
      unsubscribePosts();
    };
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (newPost.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await addDoc(collection(firestore, "posts"), {
          content: newPost,
          userId: user.uid,
          userName: user.displayName || user.email || "Anonymous",
          createdAt: serverTimestamp(),
          replies: [],
          likes: 0,
          dislikes: 0,
          likedBy: [],
          dislikedBy: [],
        });
        setNewPost("");
      } catch (error) {
        console.error("Error adding post: ", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleReplySubmit = async (postId) => {
    if (newReply.trim()) {
      const postRef = doc(firestore, "posts", postId);
      const post = posts.find((p) => p.id === postId);

      const updatedReplies = [
        ...post.replies,
        {
          replyContent: newReply,
          userId: user.uid,
          userName: user.displayName || user.email || "Anonymous",
          createdAt: new Date().toISOString(),
        },
      ];

      try {
        await updateDoc(postRef, { replies: updatedReplies });
        setNewReply("");
      } catch (error) {
        console.error("Error adding reply: ", error);
      }
    }
  };

  const handleLike = async (postId) => {
    const postRef = doc(firestore, "posts", postId);
    const post = posts.find((p) => p.id === postId);

    const isLiked = post.likedBy?.includes(user.uid);
    const newLikes = isLiked
      ? (likes[postId] || 0) - 1
      : (likes[postId] || 0) + 1;

    try {
      await updateDoc(postRef, {
        likes: newLikes,
        likedBy: isLiked
          ? post.likedBy.filter((id) => id !== user.uid)
          : [...(post.likedBy || []), user.uid],
      });
      setLikes({ ...likes, [postId]: newLikes });
    } catch (error) {
      console.error("Error updating likes: ", error);
    }
  };

  const handleDislike = async (postId) => {
    const postRef = doc(firestore, "posts", postId);
    const post = posts.find((p) => p.id === postId);

    const isDisliked = post.dislikedBy?.includes(user.uid);
    const newDislikes = isDisliked
      ? (dislikes[postId] || 0) - 1
      : (dislikes[postId] || 0) + 1;

    try {
      await updateDoc(postRef, {
        dislikes: newDislikes,
        dislikedBy: isDisliked
          ? post.dislikedBy.filter((id) => id !== user.uid)
          : [...(post.dislikedBy || []), user.uid],
      });
      setDislikes({ ...dislikes, [postId]: newDislikes });
    } catch (error) {
      console.error("Error updating dislikes: ", error);
    }
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Just now";
    const now = new Date();
    const postTime = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp);
    const diffInMinutes = Math.floor((now - postTime) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Community Forum
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with fellow herbal enthusiasts, share knowledge, and
            discover the healing power of plants together.
          </p>
        </div>

        {/* Create Post Section */}
        {user ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-12">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Create a Post</h3>
                <p className="text-sm text-gray-500">
                  Share your thoughts with the community
                </p>
              </div>
            </div>

            <form onSubmit={handlePostSubmit}>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind? Share your herbal knowledge, ask questions, or start a discussion..."
                className="w-full h-32 p-4 text-gray-700 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 resize-none"
                required
              />
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                  {newPost.length}/1000 characters
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !newPost.trim()}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? "Posting..." : "Create Post"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12 text-center border border-blue-100">
            <div className="text-blue-600 text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Join the Discussion
            </h3>
            <p className="text-gray-600 mb-6">
              Please log in to create posts and interact with the community.
            </p>
            <a
              href="/login"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200"
            >
              <FiUser className="mr-2" />
              Sign In
            </a>
          </div>
        )}

        {/* Posts Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🌿</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                No Posts Yet
              </h3>
              <p className="text-gray-600">
                Be the first to start a discussion in our community!
              </p>
            </div>
          ) : (
            posts.map((post, index) => (
              <div key={post.id}>
                {/* Post Content */}
                <div className="p-6">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {post.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold text-gray-900">
                          {post.userName}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <FiClock className="mr-1" />
                          {formatTimeAgo(post.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Text */}
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {post.content}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                          post.likedBy?.includes(user?.uid)
                            ? "bg-green-100 text-green-700"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                        onClick={() => handleLike(post.id)}
                      >
                        <FiThumbsUp size={18} />
                        <span className="font-medium">
                          {likes[post.id] || 0}
                        </span>
                      </button>

                      <button
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                          post.dislikedBy?.includes(user?.uid)
                            ? "bg-red-100 text-red-700"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                        onClick={() => handleDislike(post.id)}
                      >
                        <FiThumbsDown size={18} />
                        <span className="font-medium">
                          {dislikes[post.id] || 0}
                        </span>
                      </button>
                    </div>

                    <button
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                      onClick={() =>
                        setActivePostId(
                          post.id === activePostId ? null : post.id
                        )
                      }
                    >
                      <FiMessageCircle size={18} />
                      <span>
                        {activePostId === post.id
                          ? `Hide Replies (${post.replies?.length || 0})`
                          : `View Replies (${post.replies?.length || 0})`}
                      </span>
                    </button>
                  </div>

                  {/* Replies Section */}
                  {activePostId === post.id && (
                    <div className="mt-6 bg-gray-50 rounded-xl p-4">
                      <h5 className="font-semibold text-gray-900 mb-4">
                        Replies ({post.replies?.length || 0})
                      </h5>

                      {post.replies?.length > 0 ? (
                        <div className="space-y-4">
                          {post.replies.map((reply, replyIndex) => (
                            <div
                              key={replyIndex}
                              className="bg-white rounded-xl p-4 border border-gray-200"
                            >
                              <div className="flex items-center mb-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                  {reply.userName.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-3">
                                  <p className="font-medium text-gray-900">
                                    {reply.userName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatTimeAgo({
                                      toDate: () => new Date(reply.createdAt),
                                    })}
                                  </p>
                                </div>
                              </div>
                              <p className="text-gray-700">
                                {reply.replyContent}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">
                          No replies yet. Be the first to respond!
                        </p>
                      )}

                      {/* Reply Form */}
                      {user && (
                        <div className="mt-6">
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleReplySubmit(post.id);
                            }}
                          >
                            <textarea
                              value={newReply}
                              onChange={(e) => setNewReply(e.target.value)}
                              placeholder="Write a reply..."
                              className="w-full h-24 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
                              required
                            />
                            <div className="flex justify-end mt-3">
                              <button
                                type="submit"
                                className="bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
                              >
                                Reply
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Horizontal Border - Don't show for last post */}
                {index < posts.length - 1 && (
                  <div className="border-b border-gray-200"></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityForum;
