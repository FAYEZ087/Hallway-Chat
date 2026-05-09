"use client"

import { useState } from "react"
import { createClient, isCollegeEmail, getDomainError } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, CheckCircle, AlertCircle, Loader2, HeartHandshake, ShieldCheck, Lock } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

function HallwayIcon({ size = 64 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={size} height={size} fill="none">
      <defs>
        <radialGradient id="bgGradIS" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#0d0d0d" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" rx="50" fill="url(#bgGradIS)" />
      <polygon points="0,0 0,100 26,78 26,22" fill="#181818" />
      <polygon points="100,0 100,100 74,78 74,22" fill="#202020" />
      <polygon points="0,0 100,0 74,22 26,22" fill="#161616" />
      <polygon points="0,100 100,100 74,78 26,78" fill="#141414" />
      <rect x="26" y="22" width="48" height="56" fill="#111111" stroke="#2a2a2a" strokeWidth="1.2" />
      <line x1="0" y1="0" x2="50" y2="50" stroke="#00c896" strokeWidth="0.8" opacity="0.3" />
      <line x1="100" y1="0" x2="50" y2="50" stroke="#00c896" strokeWidth="0.8" opacity="0.3" />
      <line x1="0" y1="100" x2="50" y2="50" stroke="#00c896" strokeWidth="0.8" opacity="0.3" />
      <line x1="100" y1="100" x2="50" y2="50" stroke="#00c896" strokeWidth="0.8" opacity="0.3" />
      <ellipse cx="50" cy="50" rx="3.5" ry="4.5" fill="#00c896" opacity="0.6" />
      <ellipse cx="50" cy="50" rx="1.5" ry="2" fill="#00c896" />
      <circle cx="50" cy="43" r="3.5" fill="#00c896" />
      <rect x="47" y="47.5" width="6" height="10" rx="1.5" fill="#00c896" />
      <rect x="63" y="40" width="9" height="22" rx="1.5" fill="none" stroke="#00c896" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

type AuthState = "idle" | "loading" | "sent" | "error"

export function AuthScreen() {
  const [email, setEmail] = useState("")
  const [authState, setAuthState] = useState<AuthState>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit() {
    if (!email.trim()) return

    if (!isCollegeEmail(email)) {
      setErrorMsg(getDomainError(email))
      setAuthState("error")
      return
    }

    setAuthState("loading")
    setErrorMsg("")

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
      },
    })

    if (error) {
      setErrorMsg(error.message)
      setAuthState("error")
    } else {
      setAuthState("sent")
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12 relative overflow-hidden font-sans">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" aria-hidden />

      <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>

      <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-8 z-10">
        <div className="flex flex-col items-center gap-3">
          <HallwayIcon size={64} />
          <h1 className="font-display text-4xl font-bold tracking-tight mt-2 text-center leading-tight">
            Verified <span className="text-primary">Entry</span>
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            Sign in with your official college email
          </p>
        </div>

        {authState === "sent" ? (
          <div className="flex w-full flex-col items-center gap-6 rounded-3xl border border-border/60 bg-card/60 p-8 text-center backdrop-blur-md shadow-2xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground leading-tight">Check your email!</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                We sent a magic link to<br/>
                <span className="font-semibold text-primary">{email}</span>
              </p>
            </div>
            <button
              onClick={() => { setAuthState("idle"); setEmail("") }}
              className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
            >
              ← Use a different email
            </button>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-6 rounded-3xl border border-border/60 bg-card/60 p-8 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                College Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (authState === "error") setAuthState("idle")
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="you@university.ac.in"
                  className="w-full rounded-xl border border-border bg-background/50 pl-11 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all shadow-inner"
                />
              </div>
              <p className="text-[10px] font-medium text-muted-foreground/60 text-center">
                Supported: <span className="text-primary/70">.edu · .ac.in · .edu.in</span>
              </p>
            </div>

            {authState === "error" && (
              <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-destructive" />
                <p className="text-xs font-medium text-destructive leading-relaxed">{errorMsg}</p>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={authState === "loading" || !email.trim()}
              className="h-12 w-full gap-2 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
            >
              {authState === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </div>
        )}

        <div className="text-center space-y-4">
          <p className="text-[10px] font-medium text-muted-foreground/60 leading-relaxed uppercase tracking-wider">
            By continuing you agree to our<br/>
            <a href="/terms-of-service.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4">Terms</a>
            <span className="mx-2">·</span>
            <a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4">Privacy</a>
          </p>
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
            <Lock className="h-3 w-3" />
            End-to-End Encrypted
          </div>
        </div>

        <footer className="absolute bottom-0 w-full border-t border-border/40 bg-card/40 py-6 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 px-4 sm:flex-row sm:gap-12 text-[10px] font-medium text-muted-foreground uppercase tracking-widest text-center">
            <p>© {new Date().getFullYear()} hallway. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Made with <HeartHandshake className="h-3 w-3 text-destructive" /> by <a href="https://github.com/FAYEZ087" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Fayez</a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
