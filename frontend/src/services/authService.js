// services/authService.js
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

// ✅ Register User
export const register = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

// ✅ Login User
export const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// ✅ Logout User
export const logout = () => signOut(auth);

// ✅ Auth State Listener
export const onAuthChange = (callback) =>
  onAuthStateChanged(auth, callback);
