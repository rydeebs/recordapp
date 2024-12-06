"use client"

import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import type { Goal } from "@/types/schema"

export function GoalDropdown() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])

  // Fetch user's goals when logged in
  useEffect(() => {
    if (user) {
      const fetchGoals = async () => {
        const q = query(
          collection(db, "goals"),
          where("userId", "==", user.uid)
        )
        const querySnapshot = await getDocs(q)
        const goalsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Goal[]
        setGoals(goalsData)
      }
      fetchGoals()
    }
  }, [user])

  if (!user) {
    return (
      <Button variant="ghost">
        Login to create a goal
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          My Goals
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Your Goals</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {goals.map((goal) => (
            <DropdownMenuItem key={goal.id}>
              {goal.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Create New Goal
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 