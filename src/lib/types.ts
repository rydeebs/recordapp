export interface AnalysisData {
  momentum: {
    currentStreak: number;
    consistencyScore: number;
    completionRate: number;
    goals: {
      completed: number;
      inProgress: number;
      total: number;
    };
  };
  timePerformance: Array<{
    timeSlot: string;
    productivity: number;
  }>;
  dayPerformance: Array<{
    day: string;
    productivity: number;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    icon: string;
    improvement: string;
  }>;
  dailyProgress: {
    date: string;
    today: {
      accomplishments: string[];
      misses: string[];
    };
    tomorrow: {
      topTasks: string[];
    };
    hoursCommitted: number;
  };
}

export interface ProgressAnalysis {
  dailyProgress: {
    accomplishments: string[];
    misses: string[];
    tomorrow: {
      topTasks: string[];
    };
    hoursCommitted: number;
  };
  patterns: {
    productiveTime: string[];
    bestDays: string[];
    timeManagement: string[];
  };
  recommendations: {
    title: string;
    description: string;
    improvement: string;
  }[];
}

export interface ProgressRecord {
  id: string;
  userId: string;
  recordingUrl: string;
  transcript: string;
  analysis: ProgressAnalysis;
  timestamp: Date;
} 