// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-F3zX0-uAkegBrcjwPaAj-fxXMthaCSI",
  authDomain: "pokevault-6b98c.firebaseapp.com",
  projectId: "pokevault-6b98c",
  storageBucket: "pokevault-6b98c.firebasestorage.app",
  messagingSenderId: "161160432710",
  appId: "1:161160432710:web:e4c43e3c30b210ace14e47",
  measurementId: "G-H92MP008JQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Providers (Google login)
export const googleProvider = new GoogleAuthProvider();