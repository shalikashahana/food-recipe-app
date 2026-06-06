import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD6Q-eSQ0s0dUJz0cVPW9WAS8VckI6dukg",
  authDomain: "recipe-finder-20ecc.firebaseapp.com",
  projectId: "recipe-finder-20ecc",
  storageBucket: "recipe-finder-20ecc.firebasestorage.app",
  messagingSenderId: "620281001817",
  appId: "1:620281001817:web:015d6a6ca27c1185747e48",
  measurementId: "G-FPHXTEPNXD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);