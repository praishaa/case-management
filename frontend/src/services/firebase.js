import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjZbHTnuXJWRsreVFAXizmxlRjOJUWtEs",
  authDomain: "case-management-app-6ae51.firebaseapp.com",
  projectId: "case-management-app-6ae51",
  storageBucket: "case-management-app-6ae51.firebasestorage.app",
  messagingSenderId: "348140666777",
  appId: "1:348140666777:web:6500998ce078608f7b1d08",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
