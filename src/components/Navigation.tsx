"use client"

import * as React from "react"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Home, BarChart2, Settings, Target } from 'lucide-react'

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: Home
    },
    {
      href: "/insights",
      label: "Insights",
      icon: BarChart2
    },
    {
      href: "/goals",
      label: "Goals",
      icon: Target
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings
    }
  ]

  return (
    <div className="sticky bottom-0 w-full bg-white dark:bg-gray-800/70 backdrop-blur-md shadow-lg">
      <nav className="max-w-5xl mx-auto p-4">
        <div className="flex justify-around">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="w-full">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`
                  flex flex-col items-center 
                  hover:scale-110 
                  hover:bg-blue-50 dark:hover:bg-gray-700 
                  transition-all duration-300 
                  w-full
                  ${pathname === href ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-white'}
                `}
              >
                <Icon className="h-7 w-7 mb-1" />
                <span className="text-sm">{label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
} 