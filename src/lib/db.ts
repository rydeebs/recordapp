import { db } from './firebase';
import { collection, doc, getDoc, updateDoc, arrayUnion, query, where, getDocs } from 'firebase/firestore';
import type { Recording, Goal } from '@/types/schema';

export async function getGoal(goalId: string) {
  const docRef = doc(db, 'goals', goalId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Goal : null;
}

export async function updateGoalInsights(goalId: string, newInsights: string[]) {
  const goalRef = doc(db, 'goals', goalId);
  await updateDoc(goalRef, {
    insights: arrayUnion(...newInsights),
    lastRecordingDate: new Date()
  });
}

export async function getUserRecordings(userId: string) {
  const q = query(collection(db, 'recordings'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Recording[];
}

export async function getGoalRecordings(goalId: string) {
  const q = query(collection(db, 'recordings'), where('goalId', '==', goalId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Recording[];
}

export async function getGoalWithRecentUpdates(goalId: string) {
  const goalDoc = await getDoc(doc(db, 'goals', goalId));
  if (!goalDoc.exists()) return null;

  const goal = { id: goalDoc.id, ...goalDoc.data() } as Goal;
  
  // Fetch associated recordings if they exist
  if (goal.recordings && goal.recordings.length > 0) {
    const recentRecordingIds = goal.recordings.slice(-5); // Get last 5 recordings
    const recordingsPromises = recentRecordingIds.map(id => 
      getDoc(doc(db, 'recordings', id))
    );
    const recordingDocs = await Promise.all(recordingsPromises);
    
    goal.recentRecordings = recordingDocs
      .filter(doc => doc.exists())
      .map(doc => ({ id: doc.id, ...doc.data() }));
  }

  return goal;
} 