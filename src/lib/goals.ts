import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  orderBy 
} from 'firebase/firestore';

export const createGoal = async (userId: string, data: { 
  title: string; 
  category: string; 
  description?: string;
}) => {
  return addDoc(collection(db, 'goals'), {
    ...data,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const updateGoal = async (goalId: string, data: Partial<{
  title: string;
  category: string;
  description: string;
}>) => {
  const goalRef = doc(db, 'goals', goalId);
  return updateDoc(goalRef, {
    ...data,
    updatedAt: new Date(),
  });
};

export const deleteGoal = async (goalId: string) => {
  const goalRef = doc(db, 'goals', goalId);
  return deleteDoc(goalRef);
};

export const getGoals = async (userId: string) => {
  const q = query(
    collection(db, 'goals'), 
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}; 