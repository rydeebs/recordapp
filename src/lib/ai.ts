import { openai } from './openai';
import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface AnalyzeVideoParams {
  videoUrl: string;
  recordingId: string;
  userId: string;
  goalId: string;
}

export async function analyzeVideo({
  videoUrl,
  recordingId,
  userId,
  goalId
}: AnalyzeVideoParams) {
  try {
    // Analyze with OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: `You are an AI coach analyzing progress videos. 
          Provide 3-5 specific, actionable insights in this format:
          1. Observation: [what you see]
          - Suggestion: [actionable improvement]
          2. Observation: [what you see]
          - Suggestion: [actionable improvement]
          ...`
        },
        {
          role: "user",
          content: [
            { type: "image", url: videoUrl },
            { type: "text", content: "Analyze this progress video and provide insights on technique and suggestions for improvement." }
          ]
        }
      ],
      max_tokens: 500
    });

    const insights = response.choices[0].message.content;
    
    // Parse insights into an array
    const insightsArray = insights.split('\n').filter(line => line.trim());

    // Update Firestore
    await updateDoc(doc(db, 'recordings', recordingId), {
      insights: insightsArray,
      status: 'completed',
      analyzedAt: new Date()
    });

    return insightsArray;
  } catch (error) {
    console.error('AI analysis error:', error);
    // Update status to failed
    await updateDoc(doc(db, 'recordings', recordingId), {
      status: 'failed',
      error: error.message
    });
    throw error;
  }
} 