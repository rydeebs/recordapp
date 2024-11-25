export interface Goal {
  id: string;
  title: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  goals?: Goal[];
} 