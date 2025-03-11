import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB4qgy96fWe4-DPbUIC0howCAvlnfj5TNU",
  authDomain: "xiimbaldemo.firebaseapp.com",
  projectId: "xiimbaldemo",
  storageBucket: "xiimbaldemo.firebasestorage.app",
  messagingSenderId: "334208639650",
  appId: "1:334208639650:web:ba5ea4165d85c209e7adfb",
  measurementId: "G-Q0ZM0CRZTX",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
