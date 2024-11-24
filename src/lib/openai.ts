import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function transcribeVideo(audioBlob: Blob): Promise<string> {
  try {
    const transcript = await openai.audio.transcriptions.create({
      file: audioBlob,
      model: "whisper-1"
    });
    return transcript.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}

export async function analyzeTranscript(transcript: string) {
  try {
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
          - Specific improvements with percentages`
        },
        {
          role: "user",
          content: transcript
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(analysis.choices[0].message.content);
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
} 