// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Auth SDK
import { getDatabase } from "firebase/database"; // Import Realtime Database SDK
import {
  getFirestore,
  doc,
  updateDoc,
  increment,
  getDoc,
  setDoc,
  getDocs,
  collection,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  deleteDoc, // <-- add this import
} from "firebase/firestore"; // Import Firestore SDK
import { v4 as uuidv4 } from "uuid";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

let app;
try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  // console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

// Initialize Firebase services
const auth = getAuth(app); // Initialize Firebase Authentication
const database = getDatabase(app); // Initialize Firebase Realtime Database
const firestore = getFirestore(app); // Initialize Firestore

// Export Firebase services
export { app, auth, database, firestore };

// Optional: Default export for cleaner imports
export default { app, auth, database, firestore };

// Function to update user activity in Firestore
const updateUserActivity = async (uid) => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  try {
    const userRef = doc(firestore, "users", uid);
    await updateDoc(userRef, {
      lastActive: new Date().toISOString(),
      lastActiveDate: today,
      lastActiveMonth: currentMonth,
    });
    console.log("User activity updated");
  } catch (error) {
    console.error("Failed to update user activity:", error);
  }
};

// Function to increment the visit count
const incrementVisitCount = async () => {
  const visitRef = doc(firestore, "stats", "visitCount");
  await updateDoc(visitRef, {
    count: increment(1),
  });
};

// Function to get the current visit count
const getVisitCount = async () => {
  const visitRef = doc(firestore, "stats", "visitCount");
  const visitDoc = await getDoc(visitRef);
  return visitDoc.exists() ? visitDoc.data().count : 0;
};

// --- Community Forum Firestore Logic ---

// --- Post Types and Categories ---
export const POST_TYPES = [
  "question",
  "experience",
  "media",
  "tip",
];
export const DEFAULT_CATEGORIES = [
  "Digestion",
  "Immunity",
  "Haircare",
  "Skincare",
  "Stress",
  "DIY Remedies",
  "General",
  "Other",
];

// --- Reputation/Points System ---

// Helper to update user reputation
const updateUserReputation = async (uid, delta) => {
  const userRef = doc(firestore, "users", uid);
  await updateDoc(userRef, { reputation: increment(delta) });
};

// --- Create a new community post ---
const createCommunityPost = async ({
  content,
  userId,
  userName,
  postType,
  categories = [],
  media = [],
  userProfilePic = "",
  spaceId,
}) => {
  const postId = uuidv4();
  const postData = {
    id: postId,
    content,
    userId,
    userName,
    userProfilePic,
    postType,
    categories,
    media,
    spaceId,
    createdAt: serverTimestamp(),
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
    bookmarkedBy: [],
    reportedBy: [],
    comments: [],
  };
  await setDoc(doc(firestore, "posts", postId), postData);
  // Award points for creating a post
  await updateUserReputation(userId, 10);

  // --- Badge logic ---
  const userRef = doc(firestore, "users", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const user = userSnap.data();
    let badges = user.badges || [];
    // Count total posts by user
    const q = query(collection(firestore, "posts"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const postCount = snapshot.size;
    let newBadges = [];
    if (postCount === 1 && !badges.includes("First Post")) newBadges.push("First Post");
    if (postCount === 10 && !badges.includes("10 Posts")) newBadges.push("10 Posts");
    if (newBadges.length > 0) {
      badges = [...badges, ...newBadges];
      await updateDoc(userRef, { badges });
    }
  }
  // --- End badge logic ---

  return postId;
};

// --- Upvote/Downvote a post ---
const voteOnPost = async (postId, userId, type = "upvote") => {
  const postRef = doc(firestore, "posts", postId);
  const postSnap = await getDoc(postRef);
  if (!postSnap.exists()) throw new Error("Post not found");
  const post = postSnap.data();
  let update = {};
  let repDelta = 0;
  if (type === "upvote") {
    if (post.likedBy?.includes(userId)) {
      // Remove upvote
      update = {
        likes: (post.likes || 1) - 1,
        likedBy: post.likedBy.filter((id) => id !== userId),
      };
      repDelta = -2; // Remove points from author
    } else {
      // Add upvote, remove downvote if present
      update = {
        likes: (post.likes || 0) + 1,
        likedBy: [...(post.likedBy || []), userId],
        // Remove from dislikedBy if present
        dislikes: post.dislikedBy?.includes(userId)
          ? (post.dislikes || 1) - 1
          : post.dislikes || 0,
        dislikedBy: (post.dislikedBy || []).filter((id) => id !== userId),
      };
      repDelta = 2; // Add points to author
      if (post.dislikedBy?.includes(userId)) repDelta += 1; // Remove -1 if switching from dislike
    }
  } else if (type === "downvote") {
    if (post.dislikedBy?.includes(userId)) {
      // Remove downvote
      update = {
        dislikes: (post.dislikes || 1) - 1,
        dislikedBy: post.dislikedBy.filter((id) => id !== userId),
      };
      repDelta = 1; // Remove penalty from author
    } else {
      // Add downvote, remove upvote if present
      update = {
        dislikes: (post.dislikes || 0) + 1,
        dislikedBy: [...(post.dislikedBy || []), userId],
        likes: post.likedBy?.includes(userId)
          ? (post.likes || 1) - 1
          : post.likes || 0,
        likedBy: (post.likedBy || []).filter((id) => id !== userId),
      };
      repDelta = -1; // Subtract points from author
      if (post.likedBy?.includes(userId)) repDelta -= 2; // Remove +2 if switching from like
    }
  }
  await updateDoc(postRef, update);
  if (repDelta !== 0) {
    await updateUserReputation(post.userId, repDelta);
  }
};

// --- Bookmark/Unbookmark a post ---
const toggleBookmarkPost = async (postId, userId) => {
  const postRef = doc(firestore, "posts", postId);
  const userRef = doc(firestore, "users", userId);
  const postSnap = await getDoc(postRef);
  const userSnap = await getDoc(userRef);
  if (!postSnap.exists() || !userSnap.exists()) throw new Error("Not found");
  const post = postSnap.data();
  const user = userSnap.data();
  let postUpdate = {};
  let userUpdate = {};
  if (post.bookmarkedBy?.includes(userId)) {
    postUpdate = { bookmarkedBy: post.bookmarkedBy.filter((id) => id !== userId) };
    userUpdate = { bookmarks: (user.bookmarks || []).filter((id) => id !== postId) };
  } else {
    postUpdate = { bookmarkedBy: [...(post.bookmarkedBy || []), userId] };
    userUpdate = { bookmarks: [...(user.bookmarks || []), postId] };
  }
  await updateDoc(postRef, postUpdate);
  await updateDoc(userRef, userUpdate);
};

// --- Report a post ---
const reportPost = async (postId, userId) => {
  const postRef = doc(firestore, "posts", postId);
  await updateDoc(postRef, {
    reportedBy: arrayUnion(userId),
  });
};

// --- Add a comment or reply (threaded) ---
const addCommentToPost = async ({ postId, userId, userName, text, parentCommentId = null, userProfilePic = "" }) => {
  const postRef = doc(firestore, "posts", postId);
  const postSnap = await getDoc(postRef);
  if (!postSnap.exists()) throw new Error("Post not found");
  const post = postSnap.data();
  const newComment = {
    id: Math.random().toString(36).substr(2, 9),
    userId,
    userName,
    userProfilePic,
    text,
    createdAt: new Date().toISOString(),
    upvotes: 0,
    upvotedBy: [],
    replies: [],
    parentCommentId,
  };
  let updatedComments = post.comments || [];
  if (parentCommentId) {
    // Find parent and add as reply
    const addReply = (comments) =>
      comments.map((c) =>
        c.id === parentCommentId
          ? { ...c, replies: [...(c.replies || []), newComment] }
          : { ...c, replies: addReply(c.replies || []) }
      );
    updatedComments = addReply(updatedComments);
  } else {
    updatedComments = [...updatedComments, newComment];
  }
  await updateDoc(postRef, { comments: updatedComments });
  // Award points for commenting
  await updateUserReputation(userId, 3);
};

// --- Upvote a comment (persist to Firestore) ---
const upvoteCommentOnPost = async (postId, commentId, userId) => {
  const postRef = doc(firestore, "posts", postId);
  const postSnap = await getDoc(postRef);
  if (!postSnap.exists()) throw new Error("Post not found");
  const post = postSnap.data();
  function updateUpvotes(comments) {
    return comments.map((comment) => {
      if (comment.id === commentId) {
        const hasUpvoted = (comment.upvotedBy || []).includes(userId);
        // Award points to comment author
        if (!hasUpvoted && comment.userId) {
          updateUserReputation(comment.userId, 1);
        } else if (hasUpvoted && comment.userId) {
          updateUserReputation(comment.userId, -1);
        }
        return {
          ...comment,
          upvotes: hasUpvoted ? (comment.upvotes || 1) - 1 : (comment.upvotes || 0) + 1,
          upvotedBy: hasUpvoted
            ? (comment.upvotedBy || []).filter((id) => id !== userId)
            : [...(comment.upvotedBy || []), userId],
        };
      } else if (comment.replies && comment.replies.length > 0) {
        return { ...comment, replies: updateUpvotes(comment.replies) };
      }
      return comment;
    });
  }
  const updatedComments = updateUpvotes(post.comments || []);
  await updateDoc(postRef, { comments: updatedComments });
};

// --- Fetch posts with optional filters ---
const fetchCommunityPosts = async ({ category = null, postType = null, spaceId = null, order = "desc" } = {}) => {
  let q = collection(firestore, "posts");
  let constraints = [];
  if (category) constraints.push(where("categories", "array-contains", category));
  if (postType) constraints.push(where("postType", "==", postType));
  if (spaceId) constraints.push(where("spaceId", "==", spaceId));
  constraints.push(orderBy("createdAt", order));
  q = query(q, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// --- Fetch user profile (badges, reputation, bio, bookmarks) ---
const fetchUserProfile = async (userId) => {
  const userRef = doc(firestore, "users", userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return null;
  const user = userSnap.data();
  return {
    id: userId,
    displayName: user.displayName || user.email || "Anonymous",
    profilePic: user.profilePic || "",
    badge: user.badge || "Beginner",
    reputation: user.reputation || 0,
    bio: user.bio || "",
    bookmarks: user.bookmarks || [],
    badges: user.badges || [],
    bookmarkedHerbs: user.bookmarkedHerbs || [], // Always include this field
  };
};

// --- Fetch leaderboard ---
const fetchLeaderboard = async (limitCount = 10) => {
  const q = query(collection(firestore, "users"), orderBy("reputation", "desc"), limit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- Spaces Firestore Logic ---

// Create a new space
const createSpace = async ({ name, description, coverImage = "", createdBy }) => {
  const spaceId = uuidv4();
  const spaceData = {
    id: spaceId,
    name,
    description,
    coverImage,
    createdBy,
    members: [createdBy],
    createdAt: serverTimestamp(),
  };
  await setDoc(doc(firestore, "spaces", spaceId), spaceData);
  return spaceId;
};

// Fetch all spaces
const fetchSpaces = async () => {
  const snapshot = await getDocs(collection(firestore, "spaces"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Join a space
const joinSpace = async (spaceId, userId) => {
  const spaceRef = doc(firestore, "spaces", spaceId);
  await updateDoc(spaceRef, { members: arrayUnion(userId) });
};

// Leave a space
const leaveSpace = async (spaceId, userId) => {
  const spaceRef = doc(firestore, "spaces", spaceId);
  await updateDoc(spaceRef, { members: arrayRemove(userId) });
};

// Herbs CRUD
const fetchHerbs = async () => {
  const snapshot = await getDocs(collection(firestore, "herbs"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const createHerb = async (herbData) => {
  const herbId = uuidv4();
  const herb = {
    id: herbId,
    ...herbData,
    createdAt: serverTimestamp(),
  };
  await setDoc(doc(firestore, "herbs", herbId), herb);
  return herbId;
};

const updateHerb = async (id, herbData) => {
  const herbRef = doc(firestore, "herbs", id);
  await updateDoc(herbRef, herbData);
};

const deleteHerb = async (id) => {
  const herbRef = doc(firestore, "herbs", id);
  await deleteDoc(herbRef);
};

// --- Bookmark/Unbookmark a herb ---
const toggleBookmarkHerb = async (herbId, userId) => {
  const herbRef = doc(firestore, "herbs", herbId);
  const userRef = doc(firestore, "users", userId);
  const herbSnap = await getDoc(herbRef);
  const userSnap = await getDoc(userRef);
  if (!herbSnap.exists() || !userSnap.exists()) throw new Error("Not found");
  const herb = herbSnap.data();
  const user = userSnap.data();
  let herbUpdate = {};
  let userUpdate = {};
  if (herb.bookmarkedBy?.includes(userId)) {
    herbUpdate = { bookmarkedBy: herb.bookmarkedBy.filter((id) => id !== userId) };
    userUpdate = { bookmarkedHerbs: (user.bookmarkedHerbs || []).filter((id) => id !== herbId) };
  } else {
    herbUpdate = { bookmarkedBy: [...(herb.bookmarkedBy || []), userId] };
    userUpdate = { bookmarkedHerbs: [...(user.bookmarkedHerbs || []), herbId] };
  }
  await updateDoc(herbRef, herbUpdate);
  await updateDoc(userRef, userUpdate);
};

export {
  // Herbs CRUD
  fetchHerbs,
  createHerb,
  updateHerb,
  deleteHerb,
  toggleBookmarkHerb,
  // Community
  createCommunityPost,
  fetchCommunityPosts,
  voteOnPost,
  addCommentToPost,
  upvoteCommentOnPost,
  toggleBookmarkPost,
  reportPost,
  // User
  fetchUserProfile,
  updateUserActivity,
  updateUserReputation,
  fetchLeaderboard,
  // Spaces
  createSpace,
  fetchSpaces,
  joinSpace,
  leaveSpace,
  // Stats
  incrementVisitCount,
  getVisitCount,
};
