import { Timestamp } from 'firebase/firestore';

export interface Recording {
  id?: string;
  userId: string;
  goalId: string;
  videoUrl: string;
  createdAt: Timestamp;
  duration: number;
  fileName: string;
  title: string;
  insights: string[] | null;
  status: 'processing' | 'completed' | 'failed';
  analyzedAt?: Timestamp;
  error?: string;
}

interface RecentUpdate {
  type: 'recording' | 'insight';
  date: Timestamp;
  recordingId?: string;
  videoUrl?: string;
  insight?: string;
}

export interface Goal {
  id?: string;
  userId: string;
  title: string;
  description: string;
  createdAt: Timestamp;
  lastRecordingDate: Timestamp | null;
  insights: string[];
  category?: string;
  status: 'active' | 'completed' | 'archived';
  recordings: string[]; // Array of recording IDs
  recentUpdates: RecentUpdate[]; // Array of recent updates
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  goals?: string[]; // Array of goal IDs
  createdAt: Timestamp;
  lastActive: Timestamp;
} 