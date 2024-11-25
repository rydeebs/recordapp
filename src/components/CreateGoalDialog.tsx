"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuthContext } from './AuthProvider'
import type { Goal } from '@/lib/schema'

interface CreateGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalCreated?: (goal: Goal) => void;
}

export function CreateGoalDialog({ isOpen, onClose, onGoalCreated }: CreateGoalDialogProps) {
  const { user } = useAuthContext()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const targetDate = formData.get("targetDate") as string

    try {
      const goalRef = await addDoc(collection(db, 'goals'), {
        userId: user.uid,
        title,
        description,
        targetDate: targetDate ? new Date(targetDate) : null,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      const newGoal = {
        id: goalRef.id,
        userId: user.uid,
        title,
        description,
        targetDate: targetDate ? new Date(targetDate) : undefined,
        status: 'active' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      onGoalCreated?.(newGoal)
      onClose()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create goal")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Goal Title
            </label>
            <Input
              name="title"
              placeholder="Enter your goal title"
              className="w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Description
            </label>
            <Textarea
              name="description"
              placeholder="Describe your goal"
              className="w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Target Date (Optional)
            </label>
            <Input
              name="targetDate"
              type="date"
              className="w-full"
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Goal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 