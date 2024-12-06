"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Video, StopCircle, Clock, Save, RotateCcw } from 'lucide-react'
import { storage, auth, db } from '@/lib/firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { Progress } from "@/components/ui/progress"
import { User } from 'firebase/auth'
import { analyzeVideo } from '@/lib/ai'
import { useGoal } from '@/context/GoalContext'

interface VideoRecorderProps {
  onRecordingComplete?: (videoUrl: string) => void;
  onError?: (error: string) => void;
}

export function VideoRecorder({ onRecordingComplete, onError }: VideoRecorderProps) {
  const { selectedGoal } = useGoal()
  const [isRecording, setIsRecording] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string>("")
  const [user, setUser] = useState<User | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const timerInterval = useRef<NodeJS.Timeout>()
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [isReviewing, setIsReviewing] = useState(false)
  const [recordedVideoURL, setRecordedVideoURL] = useState<string | null>(null)

  // Auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  // Timer for recording duration
  useEffect(() => {
    if (isRecording) {
      timerInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      if (timerInterval.current) {
        clearInterval(timerInterval.current)
      }
    }
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current)
      }
    }
  }, [isRecording])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      setStream(mediaStream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }

      const mediaRecorder = new MediaRecorder(mediaStream)
      const chunks: BlobPart[] = []
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        setRecordedBlob(blob)
        setRecordedVideoURL(url)
        setIsReviewing(true)
        
        if (videoRef.current) {
          videoRef.current.srcObject = null
          videoRef.current.src = url
        }
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      setIsReviewing(false)
      setError("")
    } catch (err) {
      console.error('Failed to start recording:', err)
      setError("Failed to access camera/microphone")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      // Stop all tracks
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
        setStream(null)
      }
    }
  }

  const handleSaveVideo = async () => {
    if (!recordedBlob || !user || !selectedGoal) {
      alert("Please select a goal and login to save recordings");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create unique filename with timestamp and goalId
      const timestamp = new Date().getTime();
      const videoFileName = `recordings/${user.uid}/${selectedGoal.id}/${timestamp}.webm`;
      
      const storageRef = ref(storage, videoFileName);
      const metadata = {
        contentType: 'video/webm',
      };

      const uploadTask = uploadBytesResumable(storageRef, recordedBlob, metadata);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          console.error('Upload error:', error);
          setIsUploading(false);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Save recording document with reference to goal
            const recordingData = {
              userId: user.uid,
              goalId: selectedGoal.id,
              videoUrl: downloadURL,
              createdAt: serverTimestamp(),
              duration: recordingTime,
              fileName: videoFileName,
              status: 'processing',
              title: `Update - ${new Date().toLocaleDateString()}`
            };

            // Add to recordings collection
            const recordingRef = await addDoc(collection(db, 'recordings'), recordingData);

            // Update goal with reference to new recording
            await updateDoc(doc(db, 'goals', selectedGoal.id), {
              lastRecordingDate: serverTimestamp(),
              recordings: arrayUnion(recordingRef.id),
              recentUpdate: {
                type: 'recording',
                date: serverTimestamp(),
                recordingId: recordingRef.id,
                videoUrl: downloadURL
              }
            });

            console.log('Video saved successfully:', recordingRef.id);
            onRecordingComplete?.(downloadURL);
            setIsUploading(false);
            setUploadProgress(100);
          } catch (err) {
            console.error('Error saving to Firestore:', err);
            setIsUploading(false);
          }
        }
      );
    } catch (err) {
      console.error('Save video error:', err);
      setIsUploading(false);
    }
  };

  const handleDiscardVideo = () => {
    // Clean up the old video URL
    if (recordedVideoURL) {
      URL.revokeObjectURL(recordedVideoURL)
    }

    // Reset all states
    setRecordedBlob(null)
    setRecordedVideoURL(null)
    setIsReviewing(false)
    setRecordingTime(0)
    setError("")
    setIsUploading(false)
    setUploadProgress(0)
    
    // Clear the video element
    if (videoRef.current) {
      videoRef.current.src = ""
      videoRef.current.srcObject = null
    }

    // Stop any remaining tracks
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const handleRecordAgain = () => {
    handleDiscardVideo()
    startRecording()
  }

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={!isReviewing}
          className="w-full h-full"
          controls={isReviewing}
        />
        {isRecording && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <Clock className="h-4 w-4" />
            <span>{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {recordingTime > 0 && !isRecording && (
            <span>Duration: {formatTime(recordingTime)}</span>
          )}
        </div>
        
        <div className="flex space-x-4">
          {!isRecording && !isReviewing && (
            <Button
              onClick={startRecording}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isUploading}
            >
              <Video className="mr-2 h-4 w-4" />
              Start Recording
            </Button>
          )}
          
          {isRecording && (
            <Button
              onClick={stopRecording}
              variant="destructive"
              disabled={isUploading}
            >
              <StopCircle className="mr-2 h-4 w-4" />
              Stop Recording
            </Button>
          )}

          {isReviewing && !isUploading && (
            <>
              <Button
                onClick={handleSaveVideo}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Video
              </Button>
              <Button
                onClick={handleRecordAgain}
                variant="outline"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </>
          )}
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Uploading: {uploadProgress}%
          </p>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center mt-2">{error}</div>
      )}
    </div>
  )
} 