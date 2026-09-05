import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID

const isFirebaseConfigured = Boolean(apiKey && appId)

// Aviso de diagnóstico em caso de ausência de credenciais em produção
if (!isFirebaseConfigured && process.env.NODE_ENV === "production" && typeof window !== "undefined") {
  console.warn(
    "[Segurança/Firebase] Variáveis de ambiente NEXT_PUBLIC_FIREBASE_API_KEY ou NEXT_PUBLIC_FIREBASE_APP_ID não configuradas. Operando com dataset local em memória."
  )
}

const firebaseConfig = {
  apiKey: apiKey || "AIzaSyDummyKeyForVouDeVanAlagoas",
  authDomain: "voudevan-al.firebaseapp.com",
  projectId: "voudevan-al",
  storageBucket: "voudevan-al.firebasestorage.app",
  messagingSenderId: "1010312753781",
  appId: appId || "1:1010312753781:web:voudevan",
}

// Inicializa o Firebase de forma segura e idempotente
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const db: Firestore = getFirestore(app)

export { app, db, isFirebaseConfigured }
