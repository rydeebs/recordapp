"use client"

import * as React from "react"
import { Moon, Sun, Home, BarChart2, UserCircle, Settings, PlusCircle, ChevronDown, Goal } from 'lucide-react'
import { useTheme } from "next-themes"
import Image from 'next/image'
import Link from 'next/link'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProfilePage() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [questions, setQuestions] = React.useState({
    daily1: "Accomplishments",
    daily2: "Misses",
    plan1: "Top 2 Tasks",
  })
  const [editingQuestion, setEditingQuestion] = React.useState("")
  const [selectedGoal, setSelectedGoal] = React.useState("App Development")

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleQuestionChange = (key: string, value: string) => {
    setQuestions(prev => ({ ...prev, [key]: value }))
    setEditingQuestion("")
  }

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const contributions = Array.from({ length: 365 }, (_, i) => i + 1)

  return (
    <div className="min-h-screen p-4 pb-24 bg-gradient-to-b from-background to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <style jsx global>{`
        body {
          font-family: Georgia, serif;
        }
        h1, h2 {
          color: #164E98;
        }
        h3, h4, h5, h6, p, span, div {
          color: black;
        }
        .dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6, .dark p, .dark span, .dark div {
          color: white;
        }
        [role="combobox"], [role="option"] {
          color: black;
        }
        .dark [role="combobox"], .dark [role="option"] {
          color: white;
        }
      `}</style>
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-4 rounded-lg shadow-md">
          <div className="h-12 relative w-40">
            <Image 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MERiCADO__3_-removebg-preview%20(1)-7Awc9U6qGZffuh9K9tusvjUIV0gcCj.png" 
              alt="2DAY // 2MRW" 
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="flex items-center space-x-2 bg-gray-100/70 dark:bg-gray-700/70 backdrop-blur-md p-1 rounded-full">
            <Sun className="h-4 w-4 text-yellow-500" />
            <Switch
              checked={theme === "dark"}
              onCheckedChange={() => setTheme(theme === "light" ? "dark" : "light")}
            />
            <Moon className="h-4 w-4 text-blue-500" />
          </div>
          <div className="w-[180px]">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="App Development">App Development</SelectItem>
                <SelectItem value="Workout">Workout</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Personal Goal">Personal Goal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md">
          <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">
            <div>
              <CardHeader className="bg-blue-50/70 dark:bg-blue-900/70 rounded-tl-lg py-2">
                <CardTitle className="text-lg font-bold text-blue-800 dark:text-blue-200">Today</CardTitle>
              </CardHeader>
              <CardContent className="p-2 space-y-1">
                {Object.entries(questions).slice(0, 2).map(([key, question]) => (
                  <div key={key} className="mb-1">
                    <div className="flex items-center justify-between mb-1">
                      {editingQuestion === key ? (
                        <Input
                          value={question}
                          onChange={(e) => handleQuestionChange(key, e.target.value)}
                          onBlur={() => setEditingQuestion("")}
                          className="text-sm font-semibold text-blue-700 dark:text-blue-300"
                        />
                      ) : (
                        <h2 className="text-sm font-semibold text-blue-700 dark:text-blue-300">{question}</h2>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingQuestion(key)}
                        className="p-0 h-6 w-6"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="relative">
                      <div className="absolute top-2 left-2 text-gray-400">•</div>
                      <textarea
                        className="w-full min-h-[24px] pl-6 pr-2 py-1 resize-none focus:ring-0 border-none bg-transparent text-sm"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </div>
            <div>
              <CardHeader className="bg-green-50/70 dark:bg-green-900/70 rounded-tr-lg py-2">
                <CardTitle className="text-lg font-bold text-green-800 dark:text-green-200">Tomorrow</CardTitle>
              </CardHeader>
              <CardContent className="p-2 space-y-1">
                {Object.entries(questions).slice(2).map(([key, question]) => (
                  <div key={key} className="mb-1">
                    <div className="flex items-center justify-between mb-1">
                      {editingQuestion === key ? (
                        <Input
                          value={question}
                          onChange={(e) => handleQuestionChange(key, e.target.value)}
                          onBlur={() => setEditingQuestion("")}
                          className="text-sm font-semibold text-green-700 dark:text-green-300"
                        />
                      ) : (
                        <h2 className="text-sm font-semibold text-green-700 dark:text-green-300">{question}</h2>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingQuestion(key)}
                        className="p-0 h-6 w-6"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="relative">
                      <div className="absolute top-2 left-2 text-gray-400">•</div>
                      <textarea
                        className="w-full min-h-[24px] pl-6 pr-2 py-1 resize-none focus:ring-0 border-none bg-transparent text-sm"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </div>
          </div>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 w-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-md mt-4">
          <CardHeader className="bg-purple-50/70 dark:bg-purple-900/70 rounded-t-lg py-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold text-purple-800 dark:text-purple-200">
                Contribution Tracker
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 overflow-x-auto">
            <div className="flex">
              <div className="flex flex-col mr-2 space-y-2">
                {days.map(day => (
                  <div key={day} className="text-xs text-right pr-2 h-4 flex items-center justify-end">
                    {day}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex mb-2 space-x-2">
                  {months.map(month => (
                    <div key={month} className="text-xs w-8 text-center">
                      {month}
                    </div>
                  ))}
                </div>
                <div className="grid grid-rows-7 gap-1">
                  {days.map((_, dayIndex) => (
                    <div key={dayIndex} className="flex space-x-1">
                      {Array.from({ length: 52 }, (_, weekIndex) => {
                        const contributionIndex = weekIndex * 7 + dayIndex
                        const hasContribution = contributions[contributionIndex]
                        return (
                          <div
                            key={`${weekIndex}-${dayIndex}`}
                            className={cn(
                              "w-4 h-4 rounded-sm",
                              hasContribution
                                ? "bg-green-500 dark:bg-green-600"
                                : "bg-gray-100 dark:bg-gray-800"
                            )}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md">
          <CardHeader className="bg-yellow-50/70 dark:bg-yellow-900/70 rounded-t-lg py-2">
            <CardTitle className="text-lg font-bold text-yellow-800 dark:text-yellow-200">Hours Committed</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
            <div className="text-3xl font-bold">Total: 120 hours</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Last updated: 11/23/2024</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md relative mb-16">
          <CardHeader className="bg-orange-50/70 dark:bg-orange-900/70 rounded-t-lg py-2">
            <CardTitle className="text-xl font-bold text-orange-800 dark:text-orange-200">Recent Updates</CardTitle>
          </CardHeader>
          <CardContent className="p-2 pb-16">
            <div className="space-y-2">
              {[
                { title: "Added user authentication", date: "11/18/2024", category: "Feature" },
                { title: "Implemented dark mode", date: "11/17/2024", category: "UI" },
                { title: "Fixed mobile responsiveness", date: "11/16/2024", category: "Bug Fix" },
              ].map((update, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-orange-100 dark:bg-orange-800 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-700 transition-colors duration-300">
                  <div className="space-y-1">
                    <div className="font-semibold text-orange-800 dark:text-orange-200">{update.title}</div>
                    <Badge variant="secondary" className="text-xs">{update.category}</Badge>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-orange-600 dark:text-orange-400 mr-2">{update.date}</span>
                    <Settings className="w-4 w-4 text-orange-500" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <Button
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-700 text-white shadow-md px-4 py-2 rounded-full"
          >
            View All
          </Button>
        </Card>

        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-5xl">
          <nav className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-4 rounded-lg shadow-lg">
            <div className="flex justify-around">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex flex-col items-center">
                  <Home className="h-7 w-7 mb-1" />
                  <span className="text-sm">Home</span>
                </Button>
              </Link>
              <Link href="/insights">
                <Button variant="ghost" size="sm" className="flex flex-col items-center">
                  <BarChart2 className="h-7 w-7 mb-1" />
                  <span className="text-sm">Insights</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="flex flex-col items-center">
                <Goal className="h-7 w-7 mb-1" />
                <span className="text-sm">Goals</span>
              </Button>
              <Link href="/settings">
                <Button variant="ghost" size="sm" className="flex flex-col items-center">
                  <Settings className="h-7 w-7 mb-1" />
                  <span className="text-sm">Settings</span>
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}