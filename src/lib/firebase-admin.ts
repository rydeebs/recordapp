import { initializeApp, cert } from 'firebase-admin/app';

const admin = initializeApp({
  credential: cert({...}),
  storageBucket: 'day2mrw.firebasestorage.app'
}); 