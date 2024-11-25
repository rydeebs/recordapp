"use client"

import { Recording } from '@/lib/schema'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface RecordingMetricsProps {
  recordings: Recording[]
}

export function RecordingMetrics({ recordings }: RecordingMetricsProps) {
  const data = recordings.map(recording => ({
    date: recording.createdAt.toLocaleDateString(),
    confidence: recording.metrics.confidence,
    clarity: recording.metrics.clarity,
    pace: recording.metrics.pace,
    engagement: recording.metrics.engagement,
  }))

  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="confidence" stroke="#2563eb" />
          <Line type="monotone" dataKey="clarity" stroke="#16a34a" />
          <Line type="monotone" dataKey="pace" stroke="#d97706" />
          <Line type="monotone" dataKey="engagement" stroke="#dc2626" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 