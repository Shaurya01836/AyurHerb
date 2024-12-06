import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Handle escaped newlines
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Home route: Increment visit count each time the API is accessed
app.get("/", async (req, res) => {
  try {
    const visitRef = admin.firestore().collection("stats").doc("visitCount");
    const visitDoc = await visitRef.get();

    if (!visitDoc.exists) {
      // If visit count document doesn't exist, create it
      await visitRef.set({ count: 1 });
    } else {
      // If document exists, increment the count
      await visitRef.update({ count: admin.firestore.FieldValue.increment(1) });
    }

    res.send("API of the Virtual Herbal Garden");
  } catch (error) {
    console.error("Error incrementing visit count:", error);
    res.status(500).json({ error: "Failed to increment visit count" });
  }
});

// Fetch visit count
app.get("/api/visit-count", async (req, res) => {
  try {
    const visitRef = admin.firestore().collection("stats").doc("visitCount");
    const visitDoc = await visitRef.get();

    if (!visitDoc.exists) {
      res.status(200).json({ visitCount: 0 });
    } else {
      res.status(200).json({ visitCount: visitDoc.data().count });
    }
  } catch (error) {
    console.error("Error fetching visit count:", error);
    res.status(500).json({ error: "Failed to fetch visit count" });
  }
});

// API endpoint to fetch users
app.get("/api/users", async (req, res) => {
  try {
    const listUsers = await admin.auth().listUsers();
    const users = listUsers.users.map((user) => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "Anonymous",
    }));
    res.status(200).json({ totalUsers: users.length, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Fetch active users (logged in within the last 5 minutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
