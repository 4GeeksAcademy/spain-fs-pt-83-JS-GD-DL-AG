// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseApikey = process.env.FIREBASE_API_KEY || ""

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: firebaseApikey,
  authDomain: "learnvault-d87c3.firebaseapp.com",
  projectId: "learnvault-d87c3",
  storageBucket: "learnvault-d87c3.firebasestorage.app",
  messagingSenderId: "936062320210",
  appId: "1:936062320210:web:5efa1637579e71ece3298b",
  measurementId: "G-MDVZ2FKSQ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = getAuth()
const db = getFirestore()
const storage = getStorage(app);
export {auth, db, storage}