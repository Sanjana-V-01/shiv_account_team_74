// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBM2-6z1885b9DRsCh_RmKaQmnzoEjgyrY",
  authDomain: "acct-hackathon.firebaseapp.com",
  projectId: "acct-hackathon",
  storageBucket: "acct-hackathon.firebasestorage.app",
  messagingSenderId: "1009987944877",
  appId: "1:1009987944877:web:5026a252c6efd325aa6124",
  measurementId: "G-PZDTHD8T32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };