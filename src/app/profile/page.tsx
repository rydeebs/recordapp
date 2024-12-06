"use client"

import * as React from "react"
import { Header } from "@/components/Header"
import { useAuthContext } from "@/components/AuthProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const { user, updateProfile } = useAuthContext()
  const [isLoading, setIsLoading] = React.useState(false)
  const [message, setMessage] = React.useState("")

  if (!user) {
    return null // or redirect to login
  }

  return (
    <div className="min-h-screen p-4 pb-24 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto space-y-12">
        <Header />
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email Verification Status */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <Badge variant={user.emailVerified ? "success" : "warning"}>
                  {user.emailVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>

              {/* Display Name */}
              <div>
                <p className="font-medium">Display Name</p>
                <div className="flex gap-2">
                  <Input 
                    defaultValue={user.displayName || ""} 
                    placeholder="Enter your name"
                    onChange={(e) => setMessage("")}
                    ref={(input) => input && (window.displayNameInput = input)}
                  />
                  <Button 
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        await updateProfile({ displayName: window.displayNameInput.value });
                        setMessage("Display name updated successfully");
                      } catch (error) {
                        setMessage("Failed to update display name");
                      }
                      setIsLoading(false);
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update"}
                  </Button>
                </div>
              </div>

              {/* Account Created */}
              <div>
                <p className="font-medium">Member Since</p>
                <p className="text-sm text-gray-500">
                  {user.metadata.creationTime}
                </p>
              </div>

              {/* Connected Accounts */}
              <div>
                <p className="font-medium mb-2">Connected Accounts</p>
                <div className="space-y-2">
                  {user.providerData.map(provider => (
                    <Badge key={provider.providerId} variant="outline">
                      {provider.providerId}
                    </Badge>
                  ))}
                </div>
              </div>

              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-500">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">Delete Account</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 