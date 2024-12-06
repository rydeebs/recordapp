"use client"

import * as React from "react"
import { useAuthContext } from "@/components/AuthProvider"
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogOut, ChevronDown, Plus } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useGoal } from '@/context/GoalContext'

interface Goal {
  id: string;
  title: string;
  category: string;
}

export default function Header({ onLoginClick }: { onLoginClick?: () => void }) {
  const { user } = useAuthContext()
  const { selectedGoal, setSelectedGoal } = useGoal()
  const [goals, setGoals] = React.useState<Goal[]>([])
  const [isCreateGoalOpen, setIsCreateGoalOpen] = React.useState(false)
  const [newGoalTitle, setNewGoalTitle] = React.useState("")
  const [newGoalCategory, setNewGoalCategory] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    if (!user) return;

    const goalsQuery = query(
      collection(db, 'goals'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(goalsQuery, (snapshot) => {
      const goalsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Goal[];
      setGoals(goalsData);
      if (goalsData.length > 0 && !selectedGoal) {
        setSelectedGoal(goalsData[0]);
      }
    });

    return () => unsubscribe();
  }, [user, selectedGoal, setSelectedGoal]);

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    try {
      const docRef = await addDoc(collection(db, 'goals'), {
        userId: user.uid,
        title: newGoalTitle,
        category: newGoalCategory,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        progress: 0
      })

      setNewGoalTitle("")
      setNewGoalCategory("")
      setIsCreateGoalOpen(false)
    } catch (error) {
      console.error('Error creating goal:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoalSelect = (goal: Goal) => {
    setSelectedGoal(goal)
    router.push(`${router.pathname}?goalId=${goal.id}`, { shallow: true })
  }

  return (
    <header className="sticky top-0 w-full bg-white dark:bg-gray-800/70 backdrop-blur-md p-4">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="w-40 h-12 relative">
          <Image 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MERiCADO__3_-removebg-preview%20(1)-7Awc9U6qGZffuh9K9tusvjUIV0gcCj.png"
            alt="2DAY2MRW Logo"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Hi, {user.displayName || 'User'}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2 text-gray-900 dark:text-white"
                  >
                    <span>{selectedGoal ? selectedGoal.title : 'Create a Goal'}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
                >
                  {goals.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 dark:text-white">
                        Your Goals
                      </div>
                      {goals.map((goal) => (
                        <DropdownMenuItem 
                          key={goal.id}
                          onClick={() => handleGoalSelect(goal)}
                          className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          {goal.title}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                    </>
                  )}
                  <DropdownMenuItem 
                    onClick={() => setIsCreateGoalOpen(true)}
                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Goal
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLoginClick}
              className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Login to Create a Goal
            </Button>
          )}
        </div>
      </div>

      <Dialog open={isCreateGoalOpen} onOpenChange={setIsCreateGoalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Create New Goal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-900 dark:text-white">Goal Title</Label>
              <Input
                id="title"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="Enter your goal title"
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-900 dark:text-white">Category</Label>
              <select
                id="category"
                value={newGoalCategory}
                onChange={(e) => setNewGoalCategory(e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select a category</option>
                <option value="business">Business</option>
                <option value="personal">Personal</option>
                <option value="fitness">Fitness</option>
                <option value="education">Education</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateGoalOpen(false)}
                className="text-gray-900 dark:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? 'Creating...' : 'Create Goal'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  )
} 