// Database Types
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetDate?: Date;
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface Recording {
  id: string;
  userId: string;
  goalId: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  createdAt: Date;
  metrics: {
    confidence: number;
    clarity: number;
    pace: number;
    engagement: number;
  };
  feedback?: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: Date;
  settings: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
  };
} 