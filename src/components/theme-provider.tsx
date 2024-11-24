"use client"

import * as React from 'react'
import { ThemeProvider as NextThemeProvider } from 'next-themes'

interface ThemeProviderProps {
  children: React.ReactNode;
  [key: string]: any;  // For any additional props
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
    >
      {children}
    </NextThemeProvider>
  )
}

const CustomThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  // ... component code ...
}

export default CustomThemeProvider;