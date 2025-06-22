// services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Add Firestore or Storage if needed

const firebaseConfig = {
  apiKey: "AIzaSyBUWhQanjGhJ-0_kFTEKpluqzyRN234ZOM",
  authDomain: "pocket-tracker-e4803.firebaseapp.com",
  projectId: "pocket-tracker-e4803",
  storageBucket: "pocket-tracker-e4803.appspot.com", // ✅ fixed
  messagingSenderId: "913423980789",
  appId: "1:913423980789:web:30d6098087bb9ceda30dbc",
  measurementId: "G-FQQ31FKKH0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
