"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Flower, Github, Twitter } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
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
                  <form onSubmit={onSubmit}>
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
                  <form onSubmit={onSubmit}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">
                          Name
                        </Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
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
                          required
                          className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-white">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          required
                          className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
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

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              By using our service, you agree to our{" "}
              <Link href="/terms" className="text-gray-400 hover:text-white">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
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
