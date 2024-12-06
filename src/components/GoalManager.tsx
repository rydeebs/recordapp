import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function GoalManager() {
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [goalData, setGoalData] = useState<any>(null);

  useEffect(() => {
    if (selectedGoalId) {
      const fetchGoalData = async () => {
        try {
          const goalDoc = await getDoc(doc(collection(db, 'goals'), selectedGoalId));
          if (goalDoc.exists()) {
            setGoalData(goalDoc.data());
          } else {
            console.error('Goal not found');
          }
        } catch (error) {
          console.error('Error fetching goal data:', error);
        }
      };
      fetchGoalData();
    }
  }, [selectedGoalId]);

  const handleGoalChange = (goalId: string) => {
    setSelectedGoalId(goalId);
  };

  return (
    <div>
      <GoalSelector onGoalChange={handleGoalChange} />
      {goalData && (
        <div>
          <h2>{goalData.name}</h2>
          <p>End Date: {goalData.endDate}</p>
          {/* Render other goal details */}
        </div>
      )}
    </div>
  );
}

function GoalSelector({ onGoalChange }: { onGoalChange: (goalId: string) => void }) {
  // Assume goals is an array of goal objects with id and name
  const goals = [
    { id: 'goal1', name: 'Goal 1' },
    { id: 'goal2', name: 'Goal 2' },
    // Add more goals as needed
  ];

  return (
    <select onChange={(e) => onGoalChange(e.target.value)}>
      <option value="">Select a goal</option>
      {goals.map(goal => (
        <option key={goal.id} value={goal.id}>{goal.name}</option>
      ))}
    </select>
  );
} 