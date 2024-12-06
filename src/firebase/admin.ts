import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';

const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}');

initializeApp({
  credential: credential.cert(serviceAccount),
  storageBucket: 'day2mrw.firebasestorage.app'
}); 