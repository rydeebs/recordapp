"use client";

import * as React from "react";
import {
  Camera,
  Moon,
  Sun,
  Home,
  BarChart2,
  UserCircle,
  Settings,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Header() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [recordText] = React.useState("Daily");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleNewGoal = () => {
    // Logic to create a new goal
    console.log("Creating a new goal");
  };

  return (
    <div>
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
            onCheckedChange={() =>
              setTheme(theme === "light" ? "dark" : "light")
            }
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
                <div className="flex items-center" onClick={handleNewGoal}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>New Goal</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
        <Button
          size="lg"
          className="w-60 h-60 rounded-full lava-lamp text-white font-bold text-3xl shadow-lg hover:shadow-xl transition-all duration-300 mb-8"
        >
          <Camera className="w-24 h-24 mb-4" />
          <span>Record</span>
        </Button>
        <p className="mt-4 text-lg italic text-gray-500 dark:text-gray-400 mb-8">
          Record{" "}
          <span key={recordText} className="flip-text inline-block">
            {recordText}
          </span>{" "}
          Updates Here
        </p>
        <Button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md px-8 py-3 rounded-full text-lg">
          Save
        </Button>
      </div>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-5xl">
        <nav className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-4 rounded-lg shadow-lg">
          <div className="flex justify-around">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center"
            >
              <Home className="h-7 w-7 mb-1" />
              <span className="text-sm">Home</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center"
            >
              <BarChart2 className="h-7 w-7 mb-1" />
              <span className="text-sm">Insights</span>
            </Button>
            <Link href="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center"
              >
                <UserCircle className="h-7 w-7 mb-1" />
                <span className="text-sm">Profile</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center"
            >
              <Settings className="h-7 w-7 mb-1" />
              <span className="text-sm">Settings</span>
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
}
