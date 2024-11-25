"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthContext } from './AuthProvider'
import { updateProfile } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export function ProfileSetup({ onComplete }: { onComplete: () => void }) {
  const { user } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const displayName = formData.get("displayName") as string

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName,
        })
        onComplete()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="px-8 py-6 bg-white">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
            <p className="text-gray-600 mt-1">
              Let's set up your profile to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Display Name
              </label>
              <Input
                name="displayName"
                placeholder="Enter your name"
                className="w-full text-gray-900 bg-white border-gray-200"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Complete Setup"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
} 