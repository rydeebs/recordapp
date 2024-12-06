"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthContext } from "@/components/AuthProvider";
import { useGoal } from '@/context/GoalContext';

interface CreateGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGoalDialog({ isOpen, onClose }: CreateGoalDialogProps) {
  const { user } = useAuthContext();
  const { setSelectedGoal } = useGoal();
  const [goalData, setGoalData] = useState({
    name: '',
    endDate: '',
    mainObjective: '',
    targetNumber: '',
    unit: '',
    updateFrequency: '',
    reminderDays: [] as string[],
    reminderTime: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGoalData(prev => ({ ...prev, [name]: value }));
  };

  const handleReminderDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;
    setGoalData(prev => ({
      ...prev,
      reminderDays: checked
        ? [...prev.reminderDays, value]
        : prev.reminderDays.filter(day => day !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    try {
      const docRef = await addDoc(collection(db, 'goals'), {
        ...goalData,
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        progress: 0
      });

      const newGoal = {
        id: docRef.id,
        ...goalData
      };
      setSelectedGoal(newGoal);
      
      onClose();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-raimond text-2xl">Create New Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Goal Info Section */}
          <div className="space-y-4">
            <h3 className="font-raimond text-xl font-semibold">Basic Goal Info</h3>
            <div>
              <Label htmlFor="name">Name</Label>
              <div className="text-sm text-gray-500 mb-1">What you want to achieve</div>
              <Input id="name" name="name" value={goalData.name} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <div className="text-sm text-gray-500 mb-1">When you want to achieve it by</div>
              <Input id="endDate" name="endDate" type="date" value={goalData.endDate} onChange={handleInputChange} required />
            </div>
          </div>

          {/* Success Metrics Section */}
          <div className="space-y-4">
            <h3 className="font-raimond text-xl font-semibold">Success Metrics</h3>
            <div>
              <Label htmlFor="mainObjective">Main Objective</Label>
              <div className="text-sm text-gray-500 mb-1">Clear, measurable outcome</div>
              <Input id="mainObjective" name="mainObjective" value={goalData.mainObjective} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="targetNumber">Target Number</Label>
              <div className="text-sm text-gray-500 mb-1">Quantifiable goal</div>
              <Input id="targetNumber" name="targetNumber" type="number" value={goalData.targetNumber} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <div className="text-sm text-gray-500 mb-1">How to measure</div>
              <select id="unit" name="unit" value={goalData.unit} onChange={handleInputChange} required>
                <option value="">Select a unit</option>
                <option value="hours">Hours</option>
                <option value="projects">Projects</option>
                <option value="tasks">Tasks</option>
                <option value="dollars">Dollars</option>
              </select>
            </div>
          </div>

          {/* Check-in Schedule Section */}
          <div className="space-y-4">
            <h3 className="font-raimond text-xl font-semibold">Check-in Schedule</h3>
            <div>
              <Label htmlFor="updateFrequency">Update Frequency</Label>
              <div className="text-sm text-gray-500 mb-1">How often to record progress</div>
              <select id="updateFrequency" name="updateFrequency" value={goalData.updateFrequency} onChange={handleInputChange} required>
                <option value="">Select frequency</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <Label>Reminder Days</Label>
              <div className="text-sm text-gray-500 mb-1">When to get notifications</div>
              <div className="grid grid-cols-2 gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <label key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="reminderDays"
                      value={day}
                      checked={goalData.reminderDays.includes(day)}
                      onChange={handleReminderDaysChange}
                      className="rounded"
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="reminderTime">Reminder Time</Label>
              <Input id="reminderTime" name="reminderTime" type="time" value={goalData.reminderTime} onChange={handleInputChange} required />
            </div>
          </div>

          <Button type="submit" className="w-full">Create Goal</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 