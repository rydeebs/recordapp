"use client"

import * as React from "react"
import { Camera } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function TestPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <Button
        size="lg"
        className="w-60 h-60 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-3xl shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Camera className="w-24 h-24 mb-4" />
        <span>Record</span>
      </Button>

      <p className="mt-8 text-lg italic text-gray-500">
        Record Business Updates Here
      </p>
    </div>
  )
} 