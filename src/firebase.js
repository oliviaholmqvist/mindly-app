import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAKgR6sEpozxQ81dD6TfaFKVSJn9aNPhOA",
  authDomain: "mindlyappen.firebaseapp.com",
  projectId: "mindlyappen",
  storageBucket: "mindlyappen.firebasestorage.app",
  messagingSenderId: "1018688180278",
  appId: "1:1018688180278:web:4e0b5e6734fd6804e44897",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
