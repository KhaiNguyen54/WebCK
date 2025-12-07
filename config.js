import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getDatabase, ref, set, get, update, onValue, push, child, remove } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBK3sTclETQlN4RM_VQdg5XAxCX2G-rqm4",
  authDomain: "shopacchaykhangoi-3618.firebaseapp.com",
  databaseURL: "https://shopacchaykhangoi-3618-default-rtdb.firebaseio.com", 
  projectId: "shopacchaykhangoi-3618",
  storageBucket: "shopacchaykhangoi-3618.firebasestorage.app",
  messagingSenderId: "311814226436",
  appId: "1:311814226436:web:fe25b77e5045e302f2ab51",
  measurementId: "G-Y8XX0VM54V"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app); 

export { db, auth, ref, get, set, update, onValue, push, child, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, remove };