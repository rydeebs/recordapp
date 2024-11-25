import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import type { Goal } from '@/types/user';

export async function createGoal(userId: string, goalData: Partial<Goal>) {
  try {
    const goal = {
      ...goalData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'users', userId, 'goals'), goal);
    return {
      id: docRef.id,
      ...goal,
    };
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
}

export async function getUserGoals(userId: string) {
  try {
    const goalsRef = collection(db, 'users', userId, 'goals');
    const goalsSnap = await getDocs(goalsRef);
    
    return goalsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Goal[];
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
} 