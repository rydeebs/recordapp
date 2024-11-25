"use client"

import { useState, useEffect } from 'react';
import { useAuthContext } from './AuthProvider';
import { Button } from "@/components/ui/button"
import { PlusCircle, ChevronDown } from 'lucide-react'
import { LoginPopup } from './login-popup'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { EditGoalDialog } from './EditGoalDialog'

interface Goal {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}

export function GoalSelector() {
  const { user } = useAuthContext();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  useEffect(() => {
    if (user) {
      fetchUserGoals();
    }
  }, [user]);

  const fetchUserGoals = async () => {
    try {
      const goalsRef = collection(db, 'goals');
      const q = query(goalsRef, where('userId', '==', user?.uid));
      const querySnapshot = await getDocs(q);
      
      const fetchedGoals = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Goal[];
      
      setGoals(fetchedGoals);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalUpdate = (updatedGoal: Goal) => {
    setGoals(prev => prev.map(goal => 
      goal.id === updatedGoal.id ? updatedGoal : goal
    ))
  }

  if (!user) {
    return (
      <>
        <Button
          variant="ghost"
          onClick={() => setShowLoginDialog(true)}
          className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Login to Create a Goal
        </Button>
        <LoginPopup isOpen={showLoginDialog} onClose={() => setShowLoginDialog(false)} />
      </>
    );
  }

  return (
    <div className="w-full max-w-xs">
      <Select onValueChange={(value) => {
        const goal = goals.find(g => g.id === value)
        if (goal) setSelectedGoal(goal)
      }}>
        <SelectTrigger>
          <SelectValue placeholder="Select a goal" />
        </SelectTrigger>
        <SelectContent>
          {goals.map((goal) => (
            <SelectItem key={goal.id} value={goal.id}>
              {goal.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedGoal && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowEditDialog(true)}
          className="mt-2"
        >
          Edit Goal
        </Button>
      )}

      {showEditDialog && selectedGoal && (
        <EditGoalDialog
          goal={selectedGoal}
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          onGoalUpdated={handleGoalUpdate}
        />
      )}
    </div>
  );
} 