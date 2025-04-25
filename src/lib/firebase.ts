// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyDdeOTZZ83Yj9eGn1xDZlGlUi9TT4Ncbao",
    authDomain: "quality-rating-prediction.firebaseapp.com",
    projectId: "quality-rating-prediction",
    storageBucket: "quality-rating-prediction.firebasestorage.app",
    messagingSenderId: "946214891389",
    appId: "1:946214891389:web:90afb943b6854b2474a614",
    measurementId: "G-DX74LL95Q2"
  };
  
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);