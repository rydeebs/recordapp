export interface Goal {
  id?: string;
  userId: string;
  title: string;
  category: string;
  description?: string;
  targetDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'completed' | 'archived';
  progress: number;
  recordings: string[];  // Array of recording IDs
  milestones?: {
    title: string;
    completed: boolean;
    dueDate?: Date;
  }[];
  metrics?: {
    consistency: number;
    progress: number;
    lastUpdate: Date;
  };
  tags?: string[];
} 