"use client"

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/components/AuthProvider';
import { transcribeVideo, analyzeTranscript } from '@/lib/services/openai';
import { uploadRecording, saveProgressData, subscribeToProgress } from '@/lib/services/firebase';
import { 
  Camera, Play, Square, BarChart, Calendar, Clock, Target, 
  ArrowUp, Zap, Check, X, Hourglass, Calendar as CalendarIcon 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function ProgressTracker() {
  const { user } = useAuthContext();
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToProgress(user.uid, (progress) => {
        // Update UI with progress data
        setAnalysisData(progress[0]); // Most recent progress
      });
      return () => unsubscribe();
    }
  }, [user]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        await processRecording(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordedChunks([]);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const processRecording = async (blob: Blob) => {
    try {
      // 1. Upload to Firebase Storage
      const url = await uploadRecording(user!.uid, blob);

      // 2. Transcribe with Whisper
      const transcript = await transcribeVideo(blob);

      // 3. Analyze with GPT-4
      const analysis = await analyzeTranscript(transcript);

      // 4. Save to Firestore
      await saveProgressData(user!.uid, {
        recordingUrl: url,
        transcript,
        analysis,
      });

    } catch (error) {
      console.error('Error processing recording:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Video Recording Section */}
      <Card className="bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Daily Update</span>
            <span className="text-sm text-gray-400">
              {new Date().toLocaleDateString()}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-center space-x-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600"
                >
                  <Camera className="w-6 h-6" />
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-800"
                >
                  <Square className="w-6 h-6" />
                </button>
              )}
            </div>
            {isRecording && (
              <div className="text-center text-red-400">
                Recording: {Math.floor(recordingTime / 60)}:{String(recordingTime % 60).padStart(2, '0')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Today's Progress */}
      <Card className="bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Accomplishments */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-green-400">Accomplishments</h3>
            <ul className="space-y-2">
              {analysisData.dailyProgress.today.accomplishments.map((item, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Misses */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-red-400">Misses</h3>
            <ul className="space-y-2">
              {analysisData.dailyProgress.today.misses.map((item, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <X className="w-5 h-5 text-red-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tomorrow's Tasks */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-blue-400">Tomorrow's Top Tasks</h3>
            <ul className="space-y-2">
              {analysisData.dailyProgress.tomorrow.topTasks.map((task, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                    {index + 1}
                  </div>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours Committed */}
          <div className="flex items-center justify-between bg-gray-700/50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-purple-400" />
              <span>Hours Committed</span>
            </div>
            <span className="text-2xl font-bold">{analysisData.dailyProgress.hoursCommitted}h</span>
          </div>
        </CardContent>
      </Card>

      {/* Momentum Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-blue-400">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{analysisData.momentum.currentStreak} days</div>
            <p className="text-gray-400">Consistency Score: {analysisData.momentum.consistencyScore}%</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-green-400">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{analysisData.momentum.completionRate}%</div>
            <p className="text-gray-400">
              {analysisData.momentum.goals.completed}/{analysisData.momentum.goals.total} goals
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-purple-400">Goals in Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{analysisData.momentum.goals.inProgress}</div>
            <p className="text-gray-400">Active goals</p>
          </CardContent>
        </Card>
      </div>

      {/* Pattern Recognition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle>Productivity by Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <RechartsBarChart
                width={500}
                height={250}
                data={analysisData.timePerformance}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timeSlot" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="productivity" fill="#3b82f6" />
              </RechartsBarChart>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle>Best Performing Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <RechartsBarChart
                width={500}
                height={250}
                data={analysisData.dayPerformance}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="productivity" fill="#10b981" />
              </RechartsBarChart>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="bg-gray-800">
        <CardHeader>
          <CardTitle>Actionable Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {analysisData.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-4 bg-gray-700/50 p-4 rounded-lg">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <rec.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium flex items-center">
                    {rec.title}
                    <span className="ml-2 text-green-400 text-sm">{rec.improvement}</span>
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProgressTracker;