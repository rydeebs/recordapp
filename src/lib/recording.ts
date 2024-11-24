import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export const saveRecording = async (
  userId: string,
  goalId: string,
  blob: Blob,
  metadata: { title: string; description?: string }
) => {
  // Create a unique filename
  const filename = `${userId}_${Date.now()}.webm`;
  const storageRef = ref(storage, `recordings/${userId}/${filename}`);

  // Upload the recording
  await uploadBytes(storageRef, blob);
  const url = await getDownloadURL(storageRef);

  // Save metadata to Firestore
  const recordingDoc = await addDoc(collection(db, 'recordings'), {
    userId,
    goalId,
    url,
    title: metadata.title,
    description: metadata.description,
    createdAt: new Date(),
  });

  return recordingDoc.id;
};

export const getRecordings = async (userId: string, goalId?: string) => {
  const recordingsRef = collection(db, 'recordings');
  const q = goalId 
    ? query(recordingsRef, where('userId', '==', userId), where('goalId', '==', goalId))
    : query(recordingsRef, where('userId', '==', userId));
    
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}; 