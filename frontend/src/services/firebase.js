// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Auth SDK
import { getDatabase } from "firebase/database"; // Import Realtime Database SDK
import { getFirestore, doc, updateDoc, increment, getDoc } from "firebase/firestore"; // Import Firestore SDK

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
export const updateUserActivity = async (uid) => {
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
export const incrementVisitCount = async () => {
  const visitRef = doc(firestore, "stats", "visitCount");
  await updateDoc(visitRef, {
    count: increment(1),
  });
};

// Function to get the current visit count
export const getVisitCount = async () => {
  const visitRef = doc(firestore, "stats", "visitCount");
  const visitDoc = await getDoc(visitRef);
  return visitDoc.exists() ? visitDoc.data().count : 0;
};
