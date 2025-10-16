"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HardDrive, Layers, Cloud, Gauge, ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { requestHandler } from "@/lib/requestHandler"
import { applyToast } from "@/lib/toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export default function Login() {
  const router = useRouter()
  const { setUser } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [isResetLoading, setIsResetLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    console.log("[v0] Google sign-in clicked")
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsResetLoading(true)

    requestHandler({
      url: "/auth/password/request",
      method: "POST",
      body: { email: forgotEmail },
      action: ({ message }: any) => {
        applyToast("Success", message)
        setForgotOpen(false)
      },
    }).finally(() => setIsResetLoading(false))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!email || !password) {
      throw new Error("Fill up all fields")
    }

    requestHandler({
      url: "/auth/login",
      method: "POST",
      body: {
        email,
        password,
      },
      action: ({ user }: any) => {
        setUser(user)
        applyToast("Success", "Login Success !!")
        router.push("/dashboard")
      },
    }).finally(() => setIsLoading(false))
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-24 -left-10 size-56 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-24 right-0 size-72 rounded-full bg-primary/5 blur-3xl animate-pulse" />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-md bg-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">CinemaStudio</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">Versioning</span>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => {
              router.push("/signup")
            }}
            className="relative group border-border hover:border-primary/50 bg-transparent hover:bg-transparent transition-all duration-300"
          >
            <span className="relative z-10 group-hover:text-primary transition-colors">Sign Up</span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></div>
          </Button>
        </div>
      </header>

      {/* Content */}
      <section className="grid md:grid-cols-[1fr_1.2fr] gap-8 px-6 md:px-12 lg:px-20 pb-16">
        {/* Left: Sign In card */}
        <div className="w-full max-w-md mx-auto flex items-center">
          <Card className="w-full bg-card/80 backdrop-blur border-border/60 shadow-2xl">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to access your workspace</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Google Sign-In */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                className="group w-full h-12 border-border hover:border-primary/60 bg-transparent hover:bg-primary/5 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                <div className="relative z-10 flex items-center gap-3">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" aria-hidden>
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="font-medium text-google-label">Continue with Google</span>
                </div>
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or sign in with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input border-border focus:border-primary transition-colors hover:border-primary/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-input border-border focus:border-primary transition-colors hover:border-primary/50 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className="text-xs text-primary hover:underline cursor-pointer"
                    onClick={() => {
                      setForgotEmail(email) // prefill with current email if typed
                      setForgotOpen(true)
                    }}
                  >
                    Forgot password?
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 group relative overflow-hidden"
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right: Hero */}
        <div className="flex items-center justify-center">
          <div className="max-w-2xl space-y-6">
            <Badge className="bg-primary/10 text-primary border-primary/30">Video Versioning • Space Saving</Badge>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Version every edit. Save space. <span className="text-primary">Ship faster.</span>
            </h1>

            <p className="text-lg text-muted-foreground">
              CinemaStudio Versioning stores only the changes between edits using delta compression. Keep hundreds of
              revisions without blowing up your storage. Roll back instantly, branch experiments, and sync across
              devices with smart deduplication.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <FeatureCard icon={Layers} title="Delta Storage" desc="Save diffs, not duplicates" />
              <FeatureCard icon={HardDrive} title="80% Less Space" desc="Smart deduplication" />
              <FeatureCard icon={Cloud} title="Cloud Snapshots" desc="Branch & roll back" />
              <FeatureCard icon={Gauge} title="Instant Preview" desc="No re-exports needed" />
            </div>
          </div>
        </div>
      </section>

      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
            <DialogDescription>
              Enter the email associated with your account. We&apos;ll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email Address</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="you@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                className="bg-input border-border focus:border-primary transition-colors"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setForgotOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isResetLoading}>
                {isResetLoading ? "Sending..." : "Send reset link"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
}) {
  return (
    <div className="p-4 rounded-lg bg-card/60 border border-border/60 hover:border-primary/40 hover:bg-card/80 transition-colors">
      <Icon className="w-5 h-5 text-primary mb-2" />
      <div className="font-medium">{title}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </div>
  )
}
