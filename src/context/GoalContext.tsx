"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface Goal {
  id: string;
  title: string;
  category: string;
  // add other goal properties
}

type GoalContextType = {
  selectedGoal: Goal | null;
  setSelectedGoal: (goal: Goal | null) => void;
};

const GoalContext = createContext<GoalContextType>({
  selectedGoal: null,
  setSelectedGoal: () => {}, // Provide a default no-op function
});

export function GoalProvider({ children }: { children: ReactNode }) {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  return (
    <GoalContext.Provider value={{ selectedGoal, setSelectedGoal }}>
      {children}
    </GoalContext.Provider>
  );
}

export function useGoal() {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error('useGoal must be used within a GoalProvider');
  }
  return context;
} 