import { storage, db } from '@/lib/firebase';  // Note: importing from your existing firebase.ts
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, onSnapshot, query, where, orderBy } from 'firebase/firestore';

export async function uploadRecording(userId: string, blob: Blob): Promise<string> {
  const filename = `recordings/${userId}/${Date.now()}.webm`;
  const storageRef = ref(storage, filename);
  
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
}

export async function saveProgressData(userId: string, data: any) {
  try {
    const docRef = await addDoc(collection(db, 'progress'), {
      userId,
      ...data,
      timestamp: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving progress:', error);
    throw error;
  }
}

export function subscribeToProgress(userId: string, callback: (data: any[]) => void) {
  const q = query(
    collection(db, 'progress'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const progress = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(progress);
  });
} 