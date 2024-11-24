"use client"

import * as React from "react"
import { Home, BarChart2, Goal, Settings, Sun, Moon, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function SettingsPage() {
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
            <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input type="text" id="fullName" placeholder="John Doe" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" id="email" placeholder="john@example.com" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="timezone">Time Zone</Label>
                  <Select>
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select your time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="utc+0">UTC</SelectItem>
                      <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                      <SelectItem value="utc+8">China Standard Time (UTC+8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Notification Preferences</h2>
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center space-x-2">
                  <Switch id="dailyReminders" />
                  <Label htmlFor="dailyReminders">Daily Reminders</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="weeklySummaries" />
                  <Label htmlFor="weeklySummaries">Weekly Summaries</Label>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="customAlertTime">Custom Alert Time</Label>
                  <Input type="time" id="customAlertTime" />
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Recording Preferences</h2>
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="videoQuality">Video Quality</Label>
                  <Select>
                    <SelectTrigger id="videoQuality">
                      <SelectValue placeholder="Select video quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720p">720p</SelectItem>
                      <SelectItem value="1080p">1080p</SelectItem>
                      <SelectItem value="4k">4K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="autoSave" />
                  <Label htmlFor="autoSave">Auto-save</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="aiAnalysis" />
                  <Label htmlFor="aiAnalysis">AI Analysis</Label>
                </div>
              </CardContent>
            </Card>
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
              <Link href="/insights">
                <Button variant="ghost" size="sm" className="flex flex-col items-center">
                  <BarChart2 className="h-7 w-7 mb-1" />
                  <span className="text-sm">Insights</span>
                </Button>
              </Link>
              <Link href="/goals">
                <Button variant="ghost" size="sm" className="flex flex-col items-center">
                  <Goal className="h-7 w-7 mb-1" />
                  <span className="text-sm">Goals</span>
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