import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.VITE_FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
