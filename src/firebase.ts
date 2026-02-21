import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD0vrUVA74JPqVb9uVZrlxNVBr7tke-xLk",
  authDomain: "discord-clone-udemy-37fcf.firebaseapp.com",
  projectId: "discord-clone-udemy-37fcf",
  storageBucket: "discord-clone-udemy-37fcf.firebasestorage.app",
  messagingSenderId: "457298878654",
  appId: "1:457298878654:web:d26367b59c9a7a6dfbbeef"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider, db};
