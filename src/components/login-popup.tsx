"use client"

import * as React from "react"
import { useAuthContext } from "@/components/AuthProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import { X } from "lucide-react"
import { GoogleSignInButton } from "@/components/ui/google-sign-in-button"

interface LoginPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginPopup({ isOpen, onClose }: LoginPopupProps) {
  const { signIn, signUp } = useAuthContext()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  if (!isOpen) return null

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, isLogin: boolean) => {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
      onClose()
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="px-8 py-6 bg-white">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex justify-center mb-6">
            <div className="h-12 relative w-40">
              <Image 
                src="/logo-light.png"  // Make sure this path matches your logo file
                alt="2DAY // 2MRW" 
                layout="fill"
                objectFit="contain"
                priority
                className="drop-shadow-sm"
              />
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-1">
              Enter your email to sign in to your account
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="text-gray-900">Login</TabsTrigger>
              <TabsTrigger value="register" className="text-gray-900">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full text-gray-900 bg-white border-gray-200"
                    required
                  />
                </div>
                <div>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="w-full text-gray-900 bg-white border-gray-200"
                    required
                  />
                </div>
                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <GoogleSignInButton />
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full text-gray-900 bg-white border-gray-200"
                  required
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full text-gray-900 bg-white border-gray-200"
                  required
                />
                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <GoogleSignInButton />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}