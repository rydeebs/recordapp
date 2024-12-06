"use client"

import { GoalProvider } from '@/context/GoalContext'
import Header from '@/components/Header'
import { Navigation } from '@/components/Navigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white">
        <GoalProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Navigation />
          </div>
        </GoalProvider>
      </body>
    </html>
  )
}
