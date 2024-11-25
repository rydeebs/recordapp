import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function transcribeAudio(audioFile: Blob): Promise<string> {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1"
    });
    return transcription.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}

export async function analyzeContent(text: string): Promise<string> {
  try {
    const analysis = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Analyze the following goal update for confidence, clarity, pace, and engagement. Provide scores from 0-100 for each metric."
        },
        {
          role: "user",
          content: text
        }
      ]
    });
    return analysis.choices[0].message.content;
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
} 