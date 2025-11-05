// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvuEnXCYQv932xndni7goNx1fFcPzGV7E",
  authDomain: "chostito69-6053c.firebaseapp.com",
  projectId: "chostito69-6053c",
  storageBucket: "chostito69-6053c.firebasestorage.app",
  messagingSenderId: "481861362793",
  appId: "1:481861362793:web:13dc7960fbf528b11beef8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;