"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Video, StopCircle } from 'lucide-react'
import { storage, auth } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

interface VideoRecorderProps {
  goalId: string;
  onRecordingComplete?: (recordingUrl: string) => void;
}

export function VideoRecorder({ goalId, onRecordingComplete }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string>("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)
  const [user] = useState(auth.currentUser)

  // Add this effect to handle auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  // Initialize camera when component mounts
  useEffect(() => {
    initializeCamera()
    return () => {
      // Cleanup: stop all tracks when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const initializeCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      setStream(mediaStream)
      setHasPermission(true)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      setError("Failed to access camera/microphone. Please ensure you've granted permission.")
      console.error(err)
    }
  }

  const startRecording = async () => {
    if (!stream) {
      await initializeCamera()
      return
    }

    try {
      chunksRef.current = []
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      })
      
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        await saveRecording(blob)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      setError("Failed to start recording")
      console.error(err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const saveRecording = async (blob: Blob) => {
    if (!user) return
    setIsUploading(true)

    try {
      const videoFileName = `recordings/${user.uid}/${goalId}/${Date.now()}.webm`
      const storageRef = ref(storage, videoFileName)
      const uploadTask = uploadBytes(storageRef, blob)

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setUploadProgress(progress)
        },
        (error) => {
          console.error('Upload error:', error)
          setError("Failed to upload recording")
          setIsUploading(false)
        },
        async () => {
          const videoUrl = await getDownloadURL(uploadTask.snapshot.ref)
          
          const recordingData = {
            userId: user.uid,
            goalId,
            videoUrl,
            createdAt: serverTimestamp(),
            duration: 0,
            metrics: {
              confidence: 0,
              clarity: 0,
              pace: 0,
              engagement: 0
            }
          }

          const docRef = await addDoc(collection(db, 'recordings'), recordingData)
          onRecordingComplete?.(videoUrl)
          setIsUploading(false)
        }
      )
    } catch (err) {
      setError("Failed to save recording")
      console.error(err)
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full"
        />
      </div>

      <div className="flex justify-center space-x-4">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isUploading}
          >
            <Video className="mr-2 h-4 w-4" />
            Start Recording
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            variant="destructive"
            disabled={isUploading}
          >
            <StopCircle className="mr-2 h-4 w-4" />
            Stop Recording
          </Button>
        )}
      </div>

      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-sm text-gray-500 text-center">
            Uploading: {Math.round(uploadProgress)}%
          </p>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center">{error}</div>
      )}
    </div>
  )
} 