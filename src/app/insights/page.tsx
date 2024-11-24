"use client"

import * as React from "react"
import { Home, BarChart2, Goal, Settings, Flame, ArrowUp, ArrowDown, Clock, Calendar, FileText, PlusCircle, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts"

export default function InsightsPage() {
  const { setTheme, theme } = useTheme()

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
                <SelectItem value="new" className="text-primary">
                  <div className="flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>New Goal</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        <main className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">Momentum Tracking</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Flame className="mr-2 h-5 w-5 text-orange-500" />
                    Current Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">7 days</div>
                  <div className="flex items-center text-sm text-green-500">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    <span>3 days longer than your average</span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Keep up the great work!
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                    Consistency Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">8.5/10</div>
                  <Progress value={85} className="mb-2" />
                  <div className="text-sm text-muted-foreground">
                    Based on your daily goal completions
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart2 className="mr-2 h-5 w-5 text-green-500" />
                    Completion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">78%</div>
                  <Progress value={78} className="mb-2" />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="font-semibold">Goals Completed</div>
                      <div className="text-green-500">39/50</div>
                    </div>
                    <div>
                      <div className="font-semibold">In Progress</div>
                      <div className="text-yellow-500">11</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Actionable Recommendations</h2>
            <Card>
              <CardHeader>
                <CardTitle>Suggested Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Clock className="mr-2 h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-semibold">Optimize your morning routine</p>
                      <p className="text-sm text-gray-600">You're 30% more productive before noon. Try to schedule important tasks earlier in the day.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Calendar className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-semibold">Increase workout frequency</p>
                      <p className="text-sm text-gray-600">You've been consistently hitting your workout goals. Consider adding one more session per week.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FileText className="mr-2 h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-semibold">Focus on content quality</p>
                      <p className="text-sm text-gray-600">Your content engagement has increased by 15%. Spend an extra 30 minutes on research to further improve quality.</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Pattern Recognition</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-blue-500" />
                    Most Productive Time Periods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full">
                    <BarChart
                      width={300}
                      height={200}
                      data={[
                        { time: '6-9 AM', productivity: 80 },
                        { time: '9-12 PM', productivity: 100 },
                        { time: '12-3 PM', productivity: 60 },
                        { time: '3-6 PM', productivity: 75 },
                        { time: '6-9 PM', productivity: 85 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="productivity" fill="#8884d8" />
                    </BarChart>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-green-500" />
                    Best Performing Days
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full">
                    <BarChart
                      width={300}
                      height={200}
                      data={[
                        { day: 'Mon', performance: 85 },
                        { day: 'Tue', performance: 90 },
                        { day: 'Wed', performance: 75 },
                        { day: 'Thu', performance: 88 },
                        { day: 'Fri', performance: 80 },
                        { day: 'Sat', performance: 70 },
                        { day: 'Sun', performance: 65 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="performance" fill="#82ca9d" />
                    </BarChart>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>

        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-5xl">
          <nav className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-4 rounded-lg shadow-lg">
            <div className="flex justify-around">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex flex-col items-center">
                  <Home className="h-7 w-7 mb-1" />
                  <span className="text-sm">Home</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="flex flex-col items-center">
                <BarChart2 className="h-7 w-7 mb-1" />
                <span className="text-sm">Insights</span>
              </Button>
              <Link href="/goals">
                <Button variant="ghost" size="sm" className="flex flex-col items-center">
                  <Goal className="h-7 w-7 mb-1" />
                  <span className="text-sm">Goals</span>
                </Button>
              </Link>
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