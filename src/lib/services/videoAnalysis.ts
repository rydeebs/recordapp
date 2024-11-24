import { openai } from '../openai';  // You'll need to set up this import
import { AnalysisData } from '../types';

export async function analyzeVideo(videoBlob: Blob): Promise<AnalysisData> {
  try {
    // 1. Transcribe video
    const transcript = await openai.audio.transcriptions.create({
      file: videoBlob,
      model: "whisper-1"
    });

    // 2. Extract time commitment
    const hoursMatch = transcript.text.match(/(\d+(?:\.\d+)?)\s*hours?/);
    const hoursCommitted = hoursMatch ? parseFloat(hoursMatch[1]) : 2;

    // 3. Analyze with GPT-4
    const analysis = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Analyze this daily progress update and extract:
          
          1. Today's Progress:
          - Accomplishments (completed tasks)
          - Misses (incomplete tasks)
          
          2. Tomorrow's Plans:
          - Top 2 priority tasks
          
          3. Patterns:
          - Most productive time periods
          - Best performing days
          - Time management patterns
          
          4. Recommendations:
          - Actionable suggestions based on patterns
          - Specific improvements with percentages
          
          Format response as JSON matching the existing data structure.`
        },
        {
          role: "user",
          content: transcript.text
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse and return the analysis
    return JSON.parse(analysis.choices[0].message.content);
  } catch (error) {
    console.error('Error analyzing video:', error);
    throw error;
  }
} 