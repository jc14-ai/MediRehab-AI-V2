'use client'

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/medirehab/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, ArrowRight, Video, BarChart3 } from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const authenticate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (data.role === "admin") router.push(`/admin/${data.id}`)
      else if (data.role === "doctor") router.push(`/doctor/${data.id}`)
      else if (data.role === "patient") router.push(`/patient/${data.id}`)
      else setError("Invalid credentials. Please try again.")
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={authenticate} className="space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="h-11"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="h-11"
          required
        />
      </div>

      <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>

      <Button type="button" variant="link" className="w-full text-muted-foreground text-sm">
        Forgot your password?
      </Button>
    </form>
  )
}

const highlights = [
  {
    icon: Video,
    text: "AI-powered exercise tracking",
  },
  {
    icon: BarChart3,
    text: "Real-time progress analytics",
  },
  {
    icon: Activity,
    text: "Personalized recovery plans",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Header */}
      <header className="w-full px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <Logo size="md" />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left - Brief Description */}
            <div className="flex-1 text-center lg:text-left max-w-xl lg:max-w-none">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4 text-balance">
                Smarter Rehab, <span className="text-primary">Faster Recovery</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto lg:mx-0 text-pretty">
                Connect with your healthcare provider and track rehabilitation exercises with AI-powered motion
                analysis.
              </p>

              {/* Highlights */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-4 justify-center lg:justify-start">
                {highlights.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 justify-center lg:justify-start">
                    <div className="rounded-full bg-primary/10 p-2">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-foreground font-medium text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Auth Card (Highlighted) */}
            <div className="w-full max-w-md flex-shrink-0">
              <Card className="border-0 shadow-xl bg-card/80 backdrop-blur">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">Welcome</CardTitle>
                  <CardDescription>Sign in to your account to continue</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <LoginForm />
                </CardContent>
              </Card>

              <p className="text-center text-xs text-muted-foreground mt-4">
                By continuing, you agree to our{" "}
                <a href="#" className="underline hover:text-foreground">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="underline hover:text-foreground">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs text-muted-foreground">Trusted by healthcare professionals worldwide</p>
        </div>
      </footer>
    </div>
  )
}