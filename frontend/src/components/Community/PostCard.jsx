import React, { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Bookmark, Flag, MessageCircle, MoreHorizontal } from "lucide-react";
import { voteOnPost, toggleBookmarkPost, reportPost, fetchUserProfile, addCommentToPost, upvoteCommentOnPost } from "../../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../../services/firebase";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const UserProfilePopup = ({ userId, anchorRef }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  React.useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const data = await fetchUserProfile(userId);
      setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [userId]);
  if (loading) return <div className="p-4">Loading...</div>;
  if (!profile) return <div className="p-4">User not found</div>;
  return (
    <div
      className="absolute z-50 bg-white rounded-xl shadow-2xl p-5 border border-green-100 w-72 left-1/2 -translate-x-1/2 mt-3 animate-fade-in"
      style={{ minWidth: 260 }}
      onMouseEnter={anchorRef.onPopupHover}
      onMouseLeave={anchorRef.onPopupLeave}
    >
      {/* Arrow */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-green-100 rotate-45 shadow-sm"></div>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xl">
          {profile.displayName?.charAt(0) || "U"}
        </div>
        <div>
          <div className="font-semibold text-gray-900 text-lg">{profile.displayName}</div>
          <div className="text-xs text-gray-500">{profile.reputation} pts</div>
        </div>
      </div>
      {/* Badges */}
      {profile.badges && profile.badges.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {profile.badges.map((badge) => (
            <span key={badge} className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold border border-green-300">{badge}</span>
          ))}
        </div>
      )}
      <div className="text-gray-700 text-sm mb-2 whitespace-pre-line">{profile.bio || "No bio yet."}</div>
    </div>
  );
};
UserProfilePopup.propTypes = {
  userId: PropTypes.string.isRequired,
  anchorRef: PropTypes.object.isRequired,
};

// Helper to update upvotes in nested comments
function updateCommentUpvotes(comments, commentId, userId) {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      const hasUpvoted = (comment.upvotedBy || []).includes(userId);
      return {
        ...comment,
        upvotes: hasUpvoted ? (comment.upvotes || 1) - 1 : (comment.upvotes || 0) + 1,
        upvotedBy: hasUpvoted
          ? (comment.upvotedBy || []).filter((id) => id !== userId)
          : [...(comment.upvotedBy || []), userId],
      };
    } else if (comment.replies && comment.replies.length > 0) {
      return { ...comment, replies: updateCommentUpvotes(comment.replies, commentId, userId) };
    }
    return comment;
  });
}

const CommentThread = ({ comments, postId, currentUser, level = 0, onUpvote }) => {
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReply = async (parentCommentId) => {
    if (!currentUser) return alert("Please log in to reply.");
    if (!replyText.trim()) return;
    setLoading(true);
    await addCommentToPost({
      postId,
      userId: currentUser.uid,
      userName: currentUser.displayName || currentUser.email || "Anonymous",
      userProfilePic: currentUser.photoURL || "",
      text: replyText,
      parentCommentId,
    });
    setReplyText("");
    setReplyingTo(null);
    setLoading(false);
  };

  return (
    <div className={level > 0 ? "ml-6 border-l-2 border-green-100 pl-4" : ""}>
      {comments && comments.map((comment) => {
        const hasUpvoted = (comment.upvotedBy || []).includes(currentUser?.uid);
        return (
          <div key={comment.id} className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                {comment.userName?.charAt(0) || "U"}
              </div>
              <div className="font-medium text-gray-800 text-sm">{comment.userName}</div>
              <div className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</div>
              <button
                className={`ml-auto text-xs px-2 py-1 rounded ${hasUpvoted ? "bg-green-200 text-green-800 font-bold" : "text-green-600 hover:bg-green-100"}`}
                onClick={() => onUpvote(comment.id)}
                disabled={!currentUser}
                title={hasUpvoted ? "Remove upvote" : "Upvote"}
              >▲ {comment.upvotes || 0}</button>
            </div>
            <div className="text-gray-700 text-sm mb-1">{comment.text}</div>
            <div className="flex gap-2 text-xs">
              <button className="text-green-600 hover:underline" onClick={() => setReplyingTo(comment.id)}>Reply</button>
            </div>
            {replyingTo === comment.id && (
              <form
                className="mt-2 flex gap-2"
                onSubmit={e => {
                  e.preventDefault();
                  handleReply(comment.id);
                }}
              >
                <input
                  className="flex-1 border rounded px-2 py-1 text-sm"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  disabled={loading}
                />
                <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded" disabled={loading}>
                  {loading ? "Posting..." : "Reply"}
                </button>
                <button type="button" className="text-gray-400" onClick={() => setReplyingTo(null)}>Cancel</button>
              </form>
            )}
            {/* Nested replies */}
            {comment.replies && comment.replies.length > 0 && (
              <CommentThread comments={comment.replies} postId={postId} currentUser={currentUser} level={level + 1} onUpvote={onUpvote} />
            )}
          </div>
        );
      })}
    </div>
  );
};
CommentThread.propTypes = {
  comments: PropTypes.array.isRequired,
  postId: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
  level: PropTypes.number,
  onUpvote: PropTypes.func.isRequired,
};

const ICON_SIZE = 22;

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const PostCard = ({ post, currentUser }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [dislikes, setDislikes] = useState(post.dislikes || 0);
  const [bookmarked, setBookmarked] = useState(post.bookmarkedBy?.includes(currentUser?.uid));
  const [reported, setReported] = useState(post.reportedBy?.includes(currentUser?.uid));
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [authorProfile, setAuthorProfile] = useState(null);

  // Optimistic like/dislike state
  const [liked, setLiked] = useState(post.likedBy?.includes(currentUser?.uid));
  const [disliked, setDisliked] = useState(post.dislikedBy?.includes(currentUser?.uid));

  useEffect(() => {
    setLiked(post.likedBy?.includes(currentUser?.uid));
    setDisliked(post.dislikedBy?.includes(currentUser?.uid));
    setLikes(post.likes || 0);
    setDislikes(post.dislikes || 0);
  }, [post, currentUser]);

  // Real-time comments listener
  useEffect(() => {
    const postRef = doc(firestore, "posts", post.id);
    const unsubscribe = onSnapshot(postRef, (docSnap) => {
      if (docSnap.exists()) {
        setComments(docSnap.data().comments || []);
      }
    });
    return () => unsubscribe();
  }, [post.id]);

  useEffect(() => {
    let mounted = true;
    async function fetchProfile() {
      if (post.userId) {
        const profile = await fetchUserProfile(post.userId);
        if (mounted) setAuthorProfile(profile);
      }
    }
    fetchProfile();
    return () => { mounted = false; };
  }, [post.userId]);

  const handleVote = async (type) => {
    if (!currentUser) return alert("Please log in to vote.");
    setLoading(true);
    if (type === "upvote") {
      if (liked) {
        setLikes((prev) => prev - 1);
        setLiked(false);
      } else {
        setLikes((prev) => prev + 1);
        setLiked(true);
        if (disliked) {
          setDislikes((prev) => prev - 1);
          setDisliked(false);
        }
      }
    } else {
      if (disliked) {
        setDislikes((prev) => prev - 1);
        setDisliked(false);
      } else {
        setDislikes((prev) => prev + 1);
        setDisliked(true);
        if (liked) {
          setLikes((prev) => prev - 1);
          setLiked(false);
        }
      }
    }
    try {
      await voteOnPost(post.id, currentUser.uid, type);
    } catch (e) {
      alert("Failed to vote. Try again.");
    }
    setLoading(false);
  };

  const handleBookmark = async () => {
    if (!currentUser) return alert("Please log in to bookmark.");
    setLoading(true);
    try {
      await toggleBookmarkPost(post.id, currentUser.uid);
      setBookmarked((prev) => !prev);
    } catch (e) {
      alert("Failed to bookmark. Try again.");
    }
    setLoading(false);
  };

  const handleReport = async () => {
    if (!currentUser) return alert("Please log in to report.");
    setLoading(true);
    try {
      await reportPost(post.id, currentUser.uid);
      setReported(true);
      alert("Post reported. Thank you!");
    } catch (e) {
      alert("Failed to report. Try again.");
    }
    setLoading(false);
  };

  const handleAddComment = async () => {
    if (!currentUser) return alert("Please log in to comment.");
    if (!commentText.trim()) return;
    setCommentLoading(true);
    await addCommentToPost({
      postId: post.id,
      userId: currentUser.uid,
      userName: currentUser.displayName || currentUser.email || "Anonymous",
      userProfilePic: currentUser.photoURL || "",
      text: commentText,
    });
    setCommentText("");
    setCommentLoading(false);
    // Optimistically update UI (in real app, refetch post)
    setComments((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email || "Anonymous",
        userProfilePic: currentUser.photoURL || "",
        text: commentText,
        createdAt: new Date().toISOString(),
        upvotes: 0,
        upvotedBy: [],
        replies: [],
        parentCommentId: null,
      },
    ]);
  };

  // Upvote handler for comments
  const handleUpvoteComment = async (commentId) => {
    if (!currentUser) return alert("Please log in to upvote.");
    setComments((prev) => updateCommentUpvotes(prev, commentId, currentUser.uid));
    await upvoteCommentOnPost(post.id, commentId, currentUser.uid);
  };

  // Count comments (including nested)
  function countComments(comments) {
    if (!comments) return 0;
    return comments.reduce((acc, c) => acc + 1 + countComments(c.replies), 0);
  }

  // Avatar color based on userName
  function avatarColor(name) {
    const colors = ["bg-green-500", "bg-emerald-500", "bg-teal-500", "bg-lime-500", "bg-yellow-500"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
    return colors[hash % colors.length];
  }

  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const handleMenuClick = () => setShowMenu((v) => !v);
  const handleViewProfile = () => {
    setShowMenu(false);
    navigate(`/user/${post.userId}`);
  };

  return (
    <div className="bg-white/95 rounded-2xl shadow-sm border border-green-100 mb-6 px-0 sm:px-2 py-4 ">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pb-2 relative">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg shadow ${avatarColor(post.userName)}`}
          style={{ cursor: "pointer" }}
        >
          {post.userName?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 truncate max-w-[120px]">{post.userName}</span>
            {/* Show badges next to author name */}
            {authorProfile && authorProfile.badges && authorProfile.badges.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {authorProfile.badges.map((badge) => (
                  <span key={badge} className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">{badge}</span>
                ))}
              </div>
            )}
            <span className="ml-1 text-xs text-green-500 font-semibold">• {authorProfile ? `${authorProfile.reputation || 0} pts` : "..."}</span>
            <span className="ml-2 text-xs text-gray-400">{post.createdAt ? timeAgo(post.createdAt.toDate ? post.createdAt.toDate() : post.createdAt) : "now"}</span>
          </div>
        </div>
        <div className="relative">
          <button className="p-2 rounded-full hover:bg-gray-100 transition" title="More actions" onClick={handleMenuClick}>
            <MoreHorizontal size={20} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 transition-colors"
                onClick={handleViewProfile}
              >
                View Profile
              </button>
              {/* Add more options here if needed */}
            </div>
          )}
        </div>
      </div>
      {/* Post Type and Categories */}
      <div className="flex items-center gap-2 px-6 pb-1">
        {post.postType && (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
            {post.postType}
          </span>
        )}
        {post.categories && post.categories.map((cat) => (
          <span key={cat} className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 border border-green-200">#{cat}</span>
        ))}
      </div>
      {/* Content */}
      <div className="px-6 py-2 text-lg text-gray-800 leading-relaxed whitespace-pre-line break-words">
        {post.content}
      </div>
      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className="flex gap-2 px-6 py-2">
          {post.media.map((url, i) => (
            <img key={i} src={url} alt="media" className="w-28 h-28 object-cover rounded-xl border" />
          ))}
        </div>
      )}
      {/* Actions Row */}
      <div className="flex items-center gap-2 px-6 pt-2 pb-1 border-t border-green-100 mt-2">
        {/* Like/Upvote */}
        <button
          aria-label={liked ? "Remove like" : "Like"}
          title={liked ? "You liked this post" : "Like this post"}
          className={`group flex items-center gap-1 px-3 py-2 rounded-full transition-all duration-150 ${liked ? "bg-green-100 text-green-700" : "hover:bg-green-50 text-gray-500"} ${loading ? "opacity-60" : ""}`}
          onClick={() => handleVote("upvote")}
          disabled={loading}
        >
          <ThumbsUp size={ICON_SIZE} className={`transition-transform duration-150 ${liked ? "fill-green-500 text-green-700 scale-110" : "text-gray-400 group-hover:text-green-600"}`} fill={liked ? "#22c55e" : "none"} />
          <span className="font-medium text-sm">{likes}</span>
        </button>
        {/* Dislike/Downvote */}
        <button
          aria-label={disliked ? "Remove dislike" : "Dislike"}
          title={disliked ? "You disliked this post" : "Dislike this post"}
          className={`group flex items-center gap-1 px-3 py-2 rounded-full transition-all duration-150 ${disliked ? "bg-red-100 text-red-700" : "hover:bg-red-50 text-gray-500"} ${loading ? "opacity-60" : ""}`}
          onClick={() => handleVote("downvote")}
          disabled={loading}
        >
          <ThumbsDown size={ICON_SIZE} className={`transition-transform duration-150 ${disliked ? "fill-red-500 text-red-700 scale-110" : "text-gray-400 group-hover:text-red-600"}`} fill={disliked ? "#ef4444" : "none"} />
          <span className="font-medium text-sm">{dislikes}</span>
        </button>
        {/* Comment */}
        <button
          aria-label={showComments ? "Hide replies" : "View replies"}
          title={showComments ? "Hide replies" : "View replies"}
          className={`group flex items-center gap-1 px-3 py-2 rounded-full transition-all duration-150 hover:bg-blue-50 text-gray-500 ${showComments ? "bg-blue-100 text-blue-700" : ""}`}
          onClick={() => setShowComments((v) => !v)}
        >
          <MessageCircle size={ICON_SIZE} className={`transition-transform duration-150 ${showComments ? "fill-blue-500 text-blue-700 scale-110" : "text-gray-400 group-hover:text-blue-600"}`} fill={showComments ? "#3b82f6" : "none"} />
          <span className="font-medium text-sm">{countComments(comments)}</span>
        </button>
        {/* Bookmark */}
        <button
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
          title={bookmarked ? "Saved to your bookmarks" : "Save this post"}
          className={`group px-3 py-2 rounded-full transition-all duration-150 ${bookmarked ? "bg-yellow-100 text-yellow-700" : "hover:bg-yellow-50 text-gray-500"} ${loading ? "opacity-60" : ""}`}
          onClick={handleBookmark}
          disabled={loading}
        >
          <Bookmark size={ICON_SIZE} className={`transition-transform duration-150 ${bookmarked ? "fill-yellow-400 text-yellow-700 scale-110" : "text-gray-400 group-hover:text-yellow-600"}`} fill={bookmarked ? "#facc15" : "none"} />
        </button>
        {/* Report */}
        <button
          aria-label={reported ? "Reported" : "Report"}
          title={reported ? "You reported this post" : "Report this post"}
          className={`group px-3 py-2 rounded-full transition-all duration-150 ${reported ? "bg-gray-200 text-gray-700" : "hover:bg-gray-100 text-gray-400"} ${loading || reported ? "opacity-60" : ""}`}
          onClick={handleReport}
          disabled={loading || reported}
        >
          <Flag size={ICON_SIZE} className={`transition-transform duration-150 ${reported ? "fill-gray-400 text-gray-700 scale-110" : "text-gray-400 group-hover:text-gray-600"}`} fill={reported ? "#a3a3a3" : "none"} />
        </button>
      </div>
      {/* Comments Section */}
      {showComments && (
        <div className="px-2 sm:px-6">
          <div className="bg-green-50 rounded-xl p-4 mt-2">
            <h4 className="font-semibold text-gray-800 mb-2">Comments</h4>
            <form className="flex gap-2 mb-4" onSubmit={handleAddComment}>
              <input
                className="flex-1 border rounded px-2 py-1 text-sm"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                disabled={commentLoading}
              />
              <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded" disabled={commentLoading}>
                {commentLoading ? "Posting..." : "Comment"}
              </button>
            </form>
            <CommentThread comments={comments} postId={post.id} currentUser={currentUser} onUpvote={handleUpvoteComment} />
          </div>
        </div>
      )}
    </div>
  );
};
PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
};

export default PostCard; 
