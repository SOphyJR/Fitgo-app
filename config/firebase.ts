import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBLRGQZEY1oNPyw6OiFIea4JduXo49IAQA",
  authDomain: "fitgo-app-a9401.firebaseapp.com",
  projectId: "fitgo-app-a9401",
  storageBucket: "fitgo-app-a9401.firebasestorage.app",
  messagingSenderId: "626318771716",
  appId: "1:626318771716:web:cc05af23eae7bccf369751"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);