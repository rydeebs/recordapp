"use client"

import * as React from "react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"

export default function InsightsPage() {
  return (
    <div className="min-h-screen p-4 pb-24 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto space-y-12">
        <Header />
        <div className="flex flex-col items-center justify-center flex-grow min-h-[calc(100vh-16rem)]">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">Insights</h1>
          {/* Insights content */}
        </div>
        {/* Navigation */}
      </div>
    </div>
  )
}