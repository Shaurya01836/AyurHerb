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

// Home route
app.get("/", (req, res) => {
  res.send("API of the Virtual Herbal Garden");
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
app.get("/api/active-users", async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const usersRef = admin.firestore().collection("users");
    const snapshot = await usersRef.where("lastActive", ">", fiveMinutesAgo).get();

    const activeUsers = snapshot.docs.map((doc) => doc.data());
    res.status(200).json({ activeUsersCount: activeUsers.length, activeUsers });
  } catch (error) {
    console.error("Error fetching active users:", error);
    res.status(500).json({ error: "Failed to fetch active users" });
  }
});

// Fetch daily active users
app.get("/api/daily-active-users", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const usersRef = admin.firestore().collection("users");
    const snapshot = await usersRef.where("lastActiveDate", "==", today).get();

    const dailyActiveUsers = snapshot.docs.map((doc) => doc.data());
    res.status(200).json({ dailyActiveUsersCount: dailyActiveUsers.length, dailyActiveUsers });
  } catch (error) {
    console.error("Error fetching daily active users:", error);
    res.status(500).json({ error: "Failed to fetch daily active users" });
  }
});

// Fetch monthly active users
app.get("/api/monthly-active-users", async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const usersRef = admin.firestore().collection("users");
    const snapshot = await usersRef.where("lastActiveMonth", "==", currentMonth).get();

    const monthlyActiveUsers = snapshot.docs.map((doc) => doc.data());
    res.status(200).json({ monthlyActiveUsersCount: monthlyActiveUsers.length, monthlyActiveUsers });
  } catch (error) {
    console.error("Error fetching monthly active users:", error);
    res.status(500).json({ error: "Failed to fetch monthly active users" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
