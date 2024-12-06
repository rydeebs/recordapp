import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA1Qem-0S-Oi2ASaLd06VGJejdgXSMz5Hs",
  authDomain: "day2mrw.firebaseapp.com",
  projectId: "day2mrw",
  storageBucket: "day2mrw.firebasestorage.app",
  messagingSenderId: "801351267374",
  appId: "1:801351267374:web:ca956980d041d9e06a1bbf"
};

// Add debug logging
console.log('Firebase Config:', firebaseConfig);

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Add debug logging for storage
console.log('Storage bucket after initialization:', storage.app.options.storageBucket);

export const auth = getAuth(app);
export const db = getFirestore(app);
export { storage };

export default app; 