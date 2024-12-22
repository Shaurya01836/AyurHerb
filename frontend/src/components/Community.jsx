import React, { useState, useEffect } from "react";
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
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import Navbar from "./Navbar";

const CommunityForum = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [newReply, setNewReply] = useState("");
  const [activePostId, setActivePostId] = useState(null);
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({}); // Store dislike counts

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
    if (newPost.trim()) {
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
    const newLikes = isLiked ? (likes[postId] || 0) - 1 : (likes[postId] || 0) + 1;

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

  return (
    <>
      <Navbar />
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6 mt-20 text-center text-green-700">
          Community Forum
        </h1>

        {user ? (
          <form
            onSubmit={handlePostSubmit}
            className="mb-10 bg-white p-4 md:p-6 rounded-lg shadow-md"
          >
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Ask a question or share your thoughts..."
              className="w-full h-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-200"
              required
            />
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-6 rounded-full hover:bg-green-700 transition duration-200"
              >
                Post
              </button>
            </div>
          </form>
        ) : (
          <p className="text-center text-red-500 mb-10 font-medium">
            Please log in to post or reply.
          </p>
        )}

        <div className="space-y-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-6 md:p-8 bg-white rounded-lg shadow-md transition transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center mb-4">
                <div className="bg-green-200 w-10 h-10 rounded-full flex items-center justify-center text-green-700 font-bold">
                  {post.userName.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-lg text-green-700">
                    {post.userName}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {new Date(post.createdAt?.toDate()).toLocaleString()}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{post.content}</p>

              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                  <button
                    className="flex items-center space-x-1 text-green-600 hover:text-green-800"
                    onClick={() => handleLike(post.id)}
                  >
                    <FiThumbsUp size={20} />
                    <span>{likes[post.id] || 0}</span>
                  </button>
                  <button
                    className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                    onClick={() => handleDislike(post.id)}
                  >
                    <FiThumbsDown size={20} />
                    <span>{dislikes[post.id] || 0}</span>
                  </button>
                </div>

                <button
                  className="text-blue-600 hover:underline font-medium"
                  onClick={() =>
                    setActivePostId(post.id === activePostId ? null : post.id)
                  }
                >
                  {activePostId === post.id ? "Hide Replies" : "View Replies"}
                </button>
              </div>

              {activePostId === post.id && (
                <div className="mt-4">
                  {post.replies.length > 0 ? (
                    post.replies.map((reply, index) => (
                      <div
                        key={index}
                        className="ml-6 mb-4 p-4 bg-gray-100 rounded-lg shadow-inner"
                      >
                        <div className="flex items-center mb-2">
                          <div className="bg-blue-200 w-8 h-8 rounded-full flex items-center justify-center text-blue-700 font-semibold">
                            {reply.userName.charAt(0).toUpperCase()}
                          </div>
                          <p className="ml-3 text-gray-800 font-medium">
                            {reply.userName}
                          </p>
                        </div>
                        <p className="text-gray-600">{reply.replyContent}</p>
                      </div>
                    ))
                  ) : (
                    <p className="ml-6 text-gray-500">No replies yet.</p>
                  )}

                  {user && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleReplySubmit(post.id);
                      }}
                      className="mt-4"
                    >
                      <textarea
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder="Reply to this post..."
                        className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                        required
                      />
                      <div className="flex justify-end mt-3">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition duration-200"
                        >
                          Reply
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CommunityForum;
