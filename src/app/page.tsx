"use client"

import * as React from "react"
import { Camera, Moon, Sun, Home, BarChart2, UserCircle, Settings, PlusCircle } from 'lucide-react'
import { useTheme } from "next-themes"
import Link from 'next/link'

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function HomePage() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [recordText, setRecordText] = React.useState("Business")
  const recordTexts = ["Business", "App Development", "Workout", "Personal Goal"]

  React.useEffect(() => {
    setMounted(true)
    let currentIndex = 0
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % recordTexts.length
      setRecordText(recordTexts[currentIndex])
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen p-4 pb-24 bg-gradient-to-b from-background to-blue-50 dark:from-gray-900 dark:to-gray-800 text-foreground">
      <style jsx global>{`
        body {
          font-family: Georgia, serif;
        }
        @keyframes lavaLamp {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .lava-lamp {
          background: linear-gradient(270deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
          background-size: 800% 800%;
          animation: lavaLamp 10s ease infinite;
        }
        @keyframes flipIn {
          0% { transform: rotateX(90deg); opacity: 0; }
          100% { transform: rotateX(0deg); opacity: 1; }
        }
        @keyframes flipOut {
          0% { transform: rotateX(0deg); opacity: 1; }
          100% { transform: rotateX(-90deg); opacity: 0; }
        }
        .flip-text {
          animation: flipOut 0.25s ease-out, flipIn 0.25s ease-in 0.25s;
        }
      `}</style>
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-4 rounded-lg shadow-md">
          <div className="h-12 relative w-40">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MERiCADO__3_-removebg-preview%20(1)-7Awc9U6qGZffuh9K9tusvjUIV0gcCj.png" 
              alt="2DAY // 2MRW" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <PlusCircle className="h-4 w-4" />
              <span>New Goal</span>
            </Button>
            <div className="flex items-center space-x-2 bg-gray-100/70 dark:bg-gray-700/70 backdrop-blur-md p-1 rounded-full">
              <Sun className="h-4 w-4 text-yellow-500" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={() => setTheme(theme === "light" ? "dark" : "light")}
              />
              <Moon className="h-4 w-4 text-blue-500" />
            </div>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center flex-grow">
          <Button
            size="lg"
            className="w-60 h-60 rounded-full lava-lamp text-white font-bold text-3xl shadow-lg hover:shadow-xl transition-all duration-300 mb-8"
          >
            <Camera className="w-24 h-24 mb-4" />
            <span>Record</span>
          </Button>
          <p className="mt-4 text-lg italic text-gray-500 dark:text-gray-400 mb-8">
            Record <span key={recordText} className="flip-text inline-block">{recordText}</span> Updates Here
          </p>
          <Button
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md px-8 py-3 rounded-full text-lg"
          >
            Save
          </Button>
        </div>

        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-5xl">
          <nav className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-4 rounded-lg shadow-lg">
            <div className="flex justify-around">
              <Button variant="ghost" size="sm" className="flex flex-col items-center">
                <Home className="h-7 w-7 mb-1" />
                <span className="text-sm">Home</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex flex-col items-center">
                <BarChart2 className="h-7 w-7 mb-1" />
                <span className="text-sm">Insights</span>
              </Button>
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="flex flex-col items-center">
                  <UserCircle className="h-7 w-7 mb-1" />
                  <span className="text-sm">Profile</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="flex flex-col items-center">
                <Settings className="h-7 w-7 mb-1" />
                <span className="text-sm">Settings</span>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}