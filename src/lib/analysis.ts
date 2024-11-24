import { openai } from './openai';

export async function analyzeVideo(transcript: string) {
  try {
    const analysis = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Analyze this daily progress update and extract:
          1. Accomplishments and misses
          2. Top 2 tasks for tomorrow
          3. Hours committed (default to 2)
          4. Patterns in productivity
          5. Actionable recommendations
          
          Format as a structured JSON response.`
        },
        {
          role: "user",
          content: transcript
        }
      ],
      response_format: { type: "json_object" }
    });

    return analysis.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing video:', error);
    throw error;
  }
} 