"use client"

import { useState } from 'react';
import { ProgressTracker } from '@/components/progress/ProgressTracker';
import { analyzeVideo } from '@/lib/analysis';
import { AnalysisData } from '@/lib/types';

export default function ProgressPage() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const handleVideoComplete = async (blob: Blob) => {
    try {
      // Convert video to transcript (you'll need to implement this)
      const transcript = await videoToTranscript(blob);
      
      // Analyze the transcript
      const analysis = await analyzeVideo(transcript);
      
      // Update state with analysis results
      setAnalysisData(analysis);
    } catch (error) {
      console.error('Error processing video:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <ProgressTracker 
        analysisData={analysisData} 
        onVideoComplete={handleVideoComplete}
      />
    </div>
  );
} 