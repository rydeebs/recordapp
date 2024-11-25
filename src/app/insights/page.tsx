"use client"

import { useState } from 'react'
import { useRecordings } from '@/hooks/useRecordings'
import { RecordingMetrics } from '@/components/insights/RecordingMetrics'
import { RecordingsList } from '@/components/insights/RecordingsList'
import type { Recording } from '@/lib/schema'

export default function InsightsPage() {
  const [selectedGoalId, setSelectedGoalId] = useState<string | undefined>()
  const { recordings, loading, error } = useRecordings(selectedGoalId)
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null)

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Recordings</h2>
          <RecordingsList 
            recordings={recordings}
            onSelect={setSelectedRecording}
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Progress Metrics</h2>
          <RecordingMetrics recordings={recordings} />
        </div>
      </div>
      
      {selectedRecording && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recording Details</h2>
          {/* Add your recording details component here */}
        </div>
      )}
    </div>
  )
}