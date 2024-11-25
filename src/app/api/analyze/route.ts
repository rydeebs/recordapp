import { NextResponse } from 'next/server'
import { openai, transcribeAudio, analyzeContent } from '@/lib/openai'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as Blob

    // Step 1: Transcribe the audio
    const transcription = await transcribeAudio(audioFile)

    // Step 2: Analyze the transcription
    const analysis = await analyzeContent(transcription)

    // Step 3: Parse the analysis results
    // This assumes the analysis returns a structured format
    const metrics = {
      confidence: 0,
      clarity: 0,
      pace: 0,
      engagement: 0,
      feedback: ''
    }

    try {
      const parsedAnalysis = JSON.parse(analysis)
      Object.assign(metrics, parsedAnalysis)
    } catch {
      // If parsing fails, use the raw analysis as feedback
      metrics.feedback = analysis
    }

    return NextResponse.json({
      success: true,
      transcription,
      metrics
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    )
  }
} 