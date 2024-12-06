"use client"

import { Recording } from '@/lib/schema'
import { formatDistanceToNow, format } from 'date-fns'
import { Video, Clock, TrendingUp, BarChart2 } from 'lucide-react'
import { Card } from "@/components/ui/card"

interface RecordingsListProps {
  recordings: Recording[]
  onSelect: (recording: Recording) => void
}

export function RecordingsList({ recordings, onSelect }: RecordingsListProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      {recordings.map((recording) => (
        <Card
          key={recording.id}
          className="bg-white dark:bg-gray-800/70 p-4 rounded-lg shadow hover:shadow-md transition-all duration-300 cursor-pointer"
          onClick={() => onSelect(recording)}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Video className="h-4 w-4 text-blue-500" />
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Recording {recording.id}
                </h4>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDuration(recording.duration)}
                </span>
                <span>
                  {format(recording.createdAt, 'MMM d, yyyy')}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <MetricBadge
                label="Confidence"
                value={recording.metrics.confidence}
                color="blue"
              />
              <MetricBadge
                label="Clarity"
                value={recording.metrics.clarity}
                color="green"
              />
              <MetricBadge
                label="Pace"
                value={recording.metrics.pace}
                color="yellow"
              />
              <MetricBadge
                label="Engagement"
                value={recording.metrics.engagement}
                color="red"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

interface MetricBadgeProps {
  label: string
  value: number
  color: 'blue' | 'green' | 'yellow' | 'red'
}

function MetricBadge({ label, value, color }: MetricBadgeProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]}`}>
      {label}: {value}%
    </span>
  )
} 