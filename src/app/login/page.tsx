"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Flower, Github, Twitter } from "lucide-react"
import { supabase } from "@/lib/supabase"
import toast from "react-hot-toast"

// Create a persistent log function for client-side
const persistentLog = (message: string, data?: unknown) => {
  if (typeof window !== 'undefined') {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] ${message}`
    console.log(logMessage, data || '')
    // Store in localStorage for persistence
    const logs = JSON.parse(localStorage.getItem('auth-logs') || '[]')
    logs.push({ timestamp, message, data })
    localStorage.setItem('auth-logs', JSON.stringify(logs))
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Clear logs on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-logs')
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      persistentLog('Starting login process...')
      setIsLoading(true)
      
      persistentLog('Attempting to sign in with password...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        persistentLog('Login error details:', error)
        throw error
      }

      persistentLog('Sign in successful, checking session...')
      if (!data.session) {
        persistentLog('No session in sign in response')
        throw new Error('No session returned after login')
      }

      persistentLog('Session verified, attempting redirect...')
      // Use window.location for a hard redirect to ensure fresh state
      window.location.href = '/dashboard'
    } catch (error: any) {
      persistentLog('Login process failed:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      toast.error(error.message || 'Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSignUp(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      // First, sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: name,
          }
        },
      })

      if (authError) {
        console.error('Auth error details:', authError)
        throw authError
      }

      if (!authData.user) {
        throw new Error('No user data returned after signup')
      }

      // Create profile using the API route
      const response = await fetch('/api/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: authData.user.id,
          email: email,
          name: name || email.split('@')[0],
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Profile creation error:', result.error)
        // If profile creation fails, we should clean up the auth user
        await supabase.auth.signOut()
        throw new Error(result.error)
      }

      toast.success("Please check your email to confirm your account!")
      // Clear the form
      setEmail("")
      setPassword("")
      setName("")
      
    } catch (error: any) {
      console.error('Detailed error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      
      // More user-friendly error messages
      if (error.message?.includes('unique constraint')) {
        toast.error("This email is already registered")
      } else if (error.message?.includes('password')) {
        toast.error("Password must be at least 6 characters")
      } else if (error.message?.includes('email')) {
        toast.error("Please enter a valid email address")
      } else {
        toast.error(error.message || "Failed to create account")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#1e1e1e]">
      {/* Header */}
      <header className="w-full border-b border-gray-800 bg-[#1e1e1e]/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Flower className="h-6 w-6 text-white" />
            <span className="text-xl font-serif font-bold text-white">Tattoo</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800/30">
              <TabsTrigger value="login" className="data-[state=active]:bg-black">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-black">
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <Card className="border-gray-800 bg-[#1e1e1e]/80 backdrop-blur-md text-white">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-serif font-bold">Welcome back</CardTitle>
                  <CardDescription className="text-gray-400">
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">
                          Email
                        </Label>
                        <Input
                          id="email"
                          placeholder="name@example.com"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-white">
                            Password
                          </Label>
                          <Link href="/forgot-password" className="text-sm text-gray-400 hover:text-white">
                            Forgot password?
                          </Link>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          className="border-gray-700 data-[state=checked]:bg-white data-[state=checked]:border-white"
                        />
                        <Label htmlFor="remember" className="text-sm text-gray-300">
                          Remember me
                        </Label>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-white hover:bg-gray-100 text-black"
                        disabled={isLoading}
                      >
                        {isLoading ? "Logging in..." : "Login"}
                      </Button>
                    </div>
                  </form>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-[#1e1e1e] px-2 text-gray-400">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                    <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                      <Twitter className="mr-2 h-4 w-4" />
                      Twitter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="register">
              <Card className="border-gray-800 bg-[#1e1e1e]/80 backdrop-blur-md text-white">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-serif font-bold">Create an account</CardTitle>
                  <CardDescription className="text-gray-400">
                    Enter your information to create an account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignUp}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">
                          Name
                        </Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email-signup" className="text-white">
                          Email
                        </Label>
                        <Input
                          id="email-signup"
                          placeholder="name@example.com"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-signup" className="text-white">
                          Password
                        </Label>
                        <Input
                          id="password-signup"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          required
                          className="border-gray-700 data-[state=checked]:bg-white data-[state=checked]:border-white"
                        />
                        <Label htmlFor="terms" className="text-sm text-gray-300">
                          I agree to the{" "}
                          <Link href="/terms" className="text-gray-400 hover:text-white">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-gray-400 hover:text-white">
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-white hover:bg-gray-100 text-black"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating account..." : "Create Account"}
                      </Button>
                    </div>
                  </form>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-[#1e1e1e] px-2 text-gray-400">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                    <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                      <Twitter className="mr-2 h-4 w-4" />
                      Twitter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="py-6 border-t border-gray-800 bg-[#1e1e1e]">
        <div className="container flex flex-col items-center justify-center gap-4 text-center md:flex-row md:justify-between">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Tattoo. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-gray-400 hover:text-white">
              Terms
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              Privacy
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
