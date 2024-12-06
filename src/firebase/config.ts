import { initializeApp, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyA1Qem-0S-Oi2ASaLd06VGJejdgXSMz5Hs",
  authDomain: "day2mrw.firebaseapp.com",
  projectId: "day2mrw",
  storageBucket: "day2mrw.firebasestorage.app",
  messagingSenderId: "801351267374",
  appId: "1:801351267374:web:ca956980d041d9e06a1bbf",
  measurementId: "G-0CKDLBWN2J"
}

let app;
try {
  app = getApp();
} catch {
  app = initializeApp(firebaseConfig);
}

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app) 