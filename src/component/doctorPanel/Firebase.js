// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
 
import { getFirestore } from "firebase/firestore";
 
const firebaseConfig = {
  apiKey: "AIzaSyDo6M6nxQUsRmzlpp0H4tY4zNPopkFmqOA",
  authDomain: "awpl-d2745.firebaseapp.com",
  projectId: "awpl-d2745",
  storageBucket: "awpl-d2745.firebasestorage.app",
  messagingSenderId: "70994480464",
  appId: "1:70994480464:web:2fc753f18b87c92a0b3055",
  measurementId: "G-5S9W471V4H",
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
 
const db = getFirestore(app);
 
export { db };