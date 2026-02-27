import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRrosmMFU9CBlF4r1yMg6nsd13xO5fFqA",
  authDomain: "merge-point-software.firebaseapp.com",
  projectId: "merge-point-software",
  storageBucket: "merge-point-software.firebasestorage.app",
  messagingSenderId: "63484322159",
  appId: "1:63484322159:web:1a491343c3c0b6b205889a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore database instance
export const db = getFirestore(app);