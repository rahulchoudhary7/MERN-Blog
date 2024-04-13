// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "rahul-mern-blog.firebaseapp.com",
  projectId: "rahul-mern-blog",
  storageBucket: "rahul-mern-blog.appspot.com",
  messagingSenderId: "789309124866",
  appId: "1:789309124866:web:8e4e3be1d2a05fc94e921b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);