interface Recording {
  userId: string;
  goalId: string;
  videoUrl: string;
  createdAt: Timestamp;
  duration: number;
  fileName: string;
  title: string;
  insights: string[] | null;
  status: 'processing' | 'completed' | 'failed';
}

interface Goal {
  userId: string;
  title: string;
  description: string;
  createdAt: Timestamp;
  lastRecordingDate: Timestamp | null;
  insights: string[];
} 