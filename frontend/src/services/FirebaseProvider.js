import React, { createContext, useEffect, useState } from "react";
import { auth, firestore } from "./firebase"; // Import from firebase.js
import { doc, setDoc, onSnapshot } from "firebase/firestore";

// Create context
export const FirebaseContext = createContext();

const FirebaseProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        const userSnapshot = await userRef.get();

        // Register new user in Firestore
        if (!userSnapshot.exists) {
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "Anonymous",
            registrationDate: new Date().toISOString(),
          });
        }

        // Update context state
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }

      setIsUserLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <FirebaseContext.Provider value={{ currentUser, isUserLoading }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
