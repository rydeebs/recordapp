"use client"

import { Recording } from '@/lib/schema'
import { formatDistanceToNow } from 'date-fns'

interface RecordingsListProps {
  recordings: Recording[]
  onSelect: (recording: Recording) => void
}

export function RecordingsList({ recordings, onSelect }: RecordingsListProps) {
  return (
    <div className="space-y-4">
      {recordings.map((recording) => (
        <div
          key={recording.id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onSelect(recording)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Recording {recording.id}</h4>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(recording.createdAt, { addSuffix: true })}
              </p>
            </div>
            <div className="flex space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Confidence: {recording.metrics.confidence}%
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Clarity: {recording.metrics.clarity}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 