"use client"

import * as React from "react"
import { useState } from 'react'
import { Camera } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { VideoRecorder } from "@/components/VideoRecorder"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/components/AuthProvider"

export default function HomePage() {
  const [showRecorder, setShowRecorder] = useState(false)
  const { user } = useAuthContext()

  const handleRecordingComplete = (recordingUrl: string) => {
    setShowRecorder(false)
  }

  return (
    <main>
      {/* ... other content ... */}
      
      <Dialog open={showRecorder} onOpenChange={setShowRecorder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Video</DialogTitle>
          </DialogHeader>
          <VideoRecorder 
            goalId="default"
            onRecordingComplete={handleRecordingComplete}
          />
        </DialogContent>
      </Dialog>

      {/* ... other content ... */}
    </main>
  )
}