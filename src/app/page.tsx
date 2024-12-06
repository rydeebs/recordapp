"use client"

import * as React from "react"
import { Camera } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function HomePage() {
  // Recording states
  const [recording, setRecording] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const chunksRef = React.useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'video/mp4' })
        stream.getTracks().forEach(track => track.stop())
        if (videoRef.current) {
          videoRef.current.srcObject = null
        }
      }

      mediaRecorder.start()
      setRecording(true)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main Recording Section */}
        <div className="flex flex-col items-center space-y-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
            Record Your Progress
          </h1>

          {/* Video Preview */}
          <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center space-y-4">
            <Button
              onClick={recording ? stopRecording : startRecording}
              size="lg"
              className={`
                rounded-full w-16 h-16 flex items-center justify-center
                transition-all duration-300
                ${recording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-blue-500 hover:bg-blue-600'}
              `}
            >
              <Camera className="w-8 h-8 text-white" />
            </Button>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {recording ? 'Stop Recording' : 'Start Recording'}
            </span>
          </div>

          {/* Error Display */}
          {error && (
            <div className="w-full max-w-md bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 p-4 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Record your daily progress to track your journey
          </p>
        </div>
      </div>
    </div>
  )
}