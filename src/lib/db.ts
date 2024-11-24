import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { Goal, Record } from './types';

// Goals
export const createGoal = async (userId: string, goal: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
  return addDoc(collection(db, 'goals'), {
    ...goal,
    userId,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

export const getUserGoals = async (userId: string) => {
  const q = query(collection(db, 'goals'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Records
export const createRecord = async (userId: string, record: Omit<Record, 'id' | 'userId' | 'createdAt'>) => {
  return addDoc(collection(db, 'records'), {
    ...record,
    userId,
    createdAt: new Date()
  });
};

export const getGoalRecords = async (goalId: string) => {
  const q = query(collection(db, 'records'), where('goalId', '==', goalId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}; 