// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCeUewe8Uqsk5d72Trb3SZ1p-9KGDlNxnE",
  authDomain: "kyrgystars-e0501.firebaseapp.com",
  projectId: "kyrgystars-e0501",
  storageBucket: "kyrgystars-e0501.firebasestorage.app",
  messagingSenderId: "159357397211",
  appId: "1:159357397211:web:f4e20a8c288aff9a26c4fe",
  measurementId: "G-MSKEF785CZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);