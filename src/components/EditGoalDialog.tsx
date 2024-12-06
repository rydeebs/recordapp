"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { db } from '@/lib/firebase'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import type { Goal } from '@/lib/schema'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGoal } from '@/context/GoalContext'

interface EditGoalDialogProps {
  goal: Goal;
  isOpen: boolean;
  onClose: () => void;
  onGoalUpdated?: (updatedGoal: Goal) => void;
}

export function EditGoalDialog({ goal, isOpen, onClose, onGoalUpdated }: EditGoalDialogProps) {
  const { setSelectedGoal } = useGoal()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [formData, setFormData] = React.useState({
    title: goal.title,
    description: goal.description,
    targetDate: goal.targetDate ? new Date(goal.targetDate).toISOString().split('T')[0] : '',
    status: goal.status
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const goalRef = doc(db, 'goals', goal.id)
      const updates = {
        ...formData,
        targetDate: formData.targetDate ? new Date(formData.targetDate) : null,
        updatedAt: serverTimestamp(),
      }

      await updateDoc(goalRef, updates)

      const updatedGoal = {
        ...goal,
        ...updates,
        updatedAt: new Date(),
      }

      setSelectedGoal(updatedGoal)
      onGoalUpdated?.(updatedGoal)
      onClose()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update goal")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Goal Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Target Date
            </label>
            <Input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
              className="w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Status
            </label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "completed" | "archived") => setFormData(prev => ({ ...prev, status: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select goal status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 mr-2"></div>
              ) : (
                "Update Goal"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 