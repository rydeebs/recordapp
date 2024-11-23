import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "2DAY // 2MRW",
  description: "Daily and tomorrow planning app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
