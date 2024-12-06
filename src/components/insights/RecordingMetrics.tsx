"use client"

import { Recording } from '@/lib/schema'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { Card } from "@/components/ui/card"
import { useState } from 'react'

interface RecordingMetricsProps {
  recordings: Recording[]
}

export function RecordingMetrics({ recordings }: RecordingMetricsProps) {
  const [activeMetrics, setActiveMetrics] = useState({
    confidence: true,
    clarity: true,
    pace: true,
    engagement: true
  })

  const data = recordings
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map(recording => ({
      date: format(recording.createdAt, 'MMM d'),
      confidence: recording.metrics.confidence,
      clarity: recording.metrics.clarity,
      pace: recording.metrics.pace,
      engagement: recording.metrics.engagement,
    }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any) => (
            <p key={entry.name} style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="w-full h-[500px] bg-white dark:bg-gray-800/70 p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Progress Over Time
        </h3>
        <div className="flex space-x-4">
          {Object.entries(activeMetrics).map(([metric, active]) => (
            <button
              key={metric}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                active 
                  ? 'bg-gray-200 dark:bg-gray-700' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}
              onClick={() => setActiveMetrics(prev => ({
                ...prev,
                [metric]: !prev[metric]
              }))}
            >
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280"
            tick={{ fill: '#6B7280' }}
          />
          <YAxis 
            stroke="#6B7280"
            tick={{ fill: '#6B7280' }}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {activeMetrics.confidence && (
            <Line 
              type="monotone" 
              dataKey="confidence" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
          {activeMetrics.clarity && (
            <Line 
              type="monotone" 
              dataKey="clarity" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
          {activeMetrics.pace && (
            <Line 
              type="monotone" 
              dataKey="pace" 
              stroke="#F59E0B" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
          {activeMetrics.engagement && (
            <Line 
              type="monotone" 
              dataKey="engagement" 
              stroke="#EF4444" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
} 