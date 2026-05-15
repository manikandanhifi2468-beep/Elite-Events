import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Replace the following with your app's Firebase project configuration
// You can find this in your Firebase Console: Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDgWx6TGuQZohigm45VvcMK56Cn03VHArI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "elite-events-c2e4f.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "elite-events-c2e4f",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "elite-events-c2e4f.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "619203845116",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:619203845116:web:2a2e03b5887b71f52ff079"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
