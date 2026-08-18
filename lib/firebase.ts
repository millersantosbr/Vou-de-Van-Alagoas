import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForVouDeVanAlagoas",
  authDomain: "voudevan-al.firebaseapp.com",
  projectId: "voudevan-al",
  storageBucket: "voudevan-al.firebasestorage.app",
  messagingSenderId: "1010312753781",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1010312753781:web:voudevan",
}

// Inicializa o Firebase apenas uma vez
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)

export { app, db }
