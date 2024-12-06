import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, deleteDoc, getDoc, getDocs, query, where, serverTimestamp, arrayUnion } from 'firebase/firestore';
import type { Goal } from '@/lib/types/goal';

export const goalsCollection = collection(db, 'goals');

export const goalServices = {
  // Create a new goal
  async createGoal(userId: string, goalData: Partial<Goal>): Promise<string> {
    try {
      const newGoal = {
        userId,
        title: goalData.title,
        category: goalData.category,
        description: goalData.description || '',
        targetDate: goalData.targetDate || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active',
        progress: 0,
        recordings: [],
        milestones: goalData.milestones || [],
        metrics: {
          consistency: 0,
          progress: 0,
          lastUpdate: serverTimestamp(),
        },
        tags: goalData.tags || [],
      };

      const docRef = await addDoc(goalsCollection, newGoal);
      return docRef.id;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  },

  // Get all goals for a user
  async getUserGoals(userId: string) {
    try {
      const q = query(goalsCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Goal[];
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  },

  // Update a goal
  async updateGoal(goalId: string, updates: Partial<Goal>) {
    try {
      const goalRef = doc(db, 'goals', goalId);
      await updateDoc(goalRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  },

  // Delete a goal
  async deleteGoal(goalId: string) {
    try {
      await deleteDoc(doc(db, 'goals', goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  },

  // Add a recording to a goal
  async addRecordingToGoal(goalId: string, recordingId: string) {
    try {
      const goalRef = doc(db, 'goals', goalId);
      await updateDoc(goalRef, {
        recordings: arrayUnion(recordingId),
        updatedAt: serverTimestamp(),
        'metrics.lastUpdate': serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding recording to goal:', error);
      throw error;
    }
  },

  // Update goal progress
  async updateProgress(goalId: string, progress: number) {
    try {
      const goalRef = doc(db, 'goals', goalId);
      await updateDoc(goalRef, {
        progress,
        updatedAt: serverTimestamp(),
        'metrics.progress': progress,
      });
    } catch (error) {
      console.error('Error updating goal progress:', error);
      throw error;
    }
  },
}; 