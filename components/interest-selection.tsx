"use client"

import { useState, useEffect } from "react"
import {
  ArrowRight,  Code2, Music, Gamepad2, Film, Palette,
  Globe, BookOpen, Camera, HeartPulse, Utensils, Telescope, Mic,
  GraduationCap, Sparkles, LogOut,
  HeartHandshake, Lock, X, Shield, Zap, Users, CheckCircle,
  ShieldCheck, Cookie, Scale, HelpCircle, Mail, Flag, AlertTriangle,
  MessageCircle, Instagram, Pencil, UserPlus
} from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { useTheme } from "next-themes"
import { ModeToggle } from "@/components/mode-toggle"

const INTERESTS = [
  { label: "Computer Science", icon: Code2, color: "#3b82f6" },
  { label: "Music", icon: Music, color: "#a855f7" },
  { label: "Gaming", icon: Gamepad2, color: "#ef4444" },
  { label: "Movies & TV", icon: Film, color: "#f59e0b" },
  { label: "Art & Design", icon: Palette, color: "#ec4899" },
  { label: "Travel", icon: Globe, color: "#06b6d4" },
  { label: "Study Buddies", icon: BookOpen, color: "#00c896" },
  { label: "Photography", icon: Camera, color: "#8b5cf6" },
  { label: "Mental Health", icon: HeartPulse, color: "#ef4444" },
  { label: "Foodie", icon: Utensils, color: "#eab308" },
  { label: "Astronomy", icon: Telescope, color: "#6366f1" },
]

/* ─── Footer Modal Content ─── */
const MODAL_CONTENT: Record<string, { title: string; icon: React.ElementType; body: React.ReactNode }> = {
  social: {
    title: "Follow Us",
    icon: MessageCircle,
    body: (
      <div className="space-y-6 text-foreground/80 text-[15px] leading-relaxed text-center">
        <div className="rounded-2xl border border-border/50 bg-secondary/20 p-8">
          <MessageCircle className="h-12 w-12 text-[#00c896] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-3">Stay Connected</h3>
          <p>Follow us for product updates and community news.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a href="https://twitter.com/hallway_chat_" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-black/10 border border-foreground/20 px-6 py-3 text-foreground font-semibold hover:bg-black/20 transition-colors cursor-pointer">
              <span className="text-foreground font-bold">𝕏</span> 
            </a>
            <a href="https://www.instagram.com/hallwaychat_online" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-pink-500/10 border border-pink-500/30 px-6 py-3 text-pink-500 font-semibold hover:bg-pink-500/20 transition-colors cursor-pointer">
              <Instagram className="h-4 w-4" />Instagram
            </a>
          </div>
          <p className="mt-6 text-sm text-foreground/40">DM us for quick support or just to say hii!</p>
        </div>
      </div>
    ),
  },
}

/* ─── Modal Component ─── */
function FooterModal({ id, onClose }: { id: string; onClose: () => void }) {
  const content = MODAL_CONTENT[id]
  if (!content) return null
  const Icon = content.icon

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    document.body.style.overflow = "hidden"
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = "" }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-2xl max-h-[85vh] rounded-3xl border border-border/60 bg-card shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-card/95 backdrop-blur-md px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">{content.title}</h2>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer">
            <X className="h-5 w-5 text-foreground/70" />
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(85vh-72px)] px-6 py-6 text-foreground">
          {content.body}
        </div>
      </div>
    </div>
  )
}

function HallwayIcon({ size = 32 }: { size?: number }) {
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

interface InterestSelectionProps {
  onStart: (interests: string[]) => void
  user?: User | null
  onSignOut?: () => void
}

export function InterestSelection({ onStart, user, onSignOut }: InterestSelectionProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const { theme } = useTheme()
  const dark = theme === "dark"

  function toggleInterest(label: string) {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    )
  }

  return (
    <div className="min-h-dvh bg-background text-foreground transition-colors duration-300 flex flex-col font-sans relative overflow-x-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" aria-hidden />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 px-6 py-4 backdrop-blur-md bg-background/70">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <HallwayIcon size={32} />
            <span className="text-lg tracking-tight font-display">
              <span className="text-foreground">hall</span><span className="text-primary">way</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ModeToggle />
            {user && onSignOut && (
              <div className="flex items-center gap-2">
                <span className="hidden text-xs sm:block text-muted-foreground">{user.email}</span>
                <button onClick={onSignOut}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/30 px-3 py-1.5 text-xs text-muted-foreground transition cursor-pointer hover:text-foreground">
                  <LogOut className="h-3 w-3" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16 flex flex-col flex-1 z-10 w-full">
        {/* Heading */}
        <div className="mb-12">
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight font-display">What are you into?</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Select your interests to find students who share your vibe. Matches are better when you have things in common.
          </p>
        </div>

        {/* Interest grid */}
        <div className="mb-12 flex flex-wrap gap-3">
          {INTERESTS.map(({ label, icon: Icon, color }) => {
            const isActive = selected.includes(label)
            return (
              <button key={label} onClick={() => toggleInterest(label)}
                className={`group flex items-center gap-2.5 rounded-2xl border px-5 py-3 text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  isActive 
                  ? "border-primary bg-primary/10 text-primary shadow-[0_8px_30px_rgba(0,200,150,0.15)] scale-[1.02]" 
                  : "border-border/60 bg-card/40 text-muted-foreground hover:border-primary/40 hover:bg-card/60 hover:text-foreground hover:-translate-y-0.5"
                }`}
              >
                <Icon className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
                {label}
              </button>
            )
          })}
        </div>

        {/* Count */}
        <div className="mb-10 flex items-center gap-3 rounded-2xl border border-border/40 bg-secondary/10 px-6 py-4 backdrop-blur-sm">
          <div className={`h-2 w-2 rounded-full animate-pulse ${selected.length > 0 ? "bg-primary" : "bg-muted-foreground"}`} />
          <p className="text-sm font-medium text-muted-foreground">
            {selected.length === 0
              ? "Pick at least one — or skip to chat randomly"
              : `Matched on ${selected.length} interests · ${selected.slice(0, 2).join(" & ")}${selected.length > 2 ? ` + ${selected.length - 2} more` : ""}`}
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <button onClick={() => onStart(selected)}
            className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl px-10 py-3.5 text-sm font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02] hover:shadow-primary/30 active:scale-95 cursor-pointer">
            Start Chatting
            <ArrowRight className="h-5 w-5" />
          </button>
          <button onClick={() => onStart([])}
            className="flex h-14 px-8 items-center justify-center gap-2 rounded-2xl border border-border/60 text-muted-foreground hover:bg-card hover:text-foreground hover:border-primary/40 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
            Skip — chat randomly
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/60 bg-card/30 pt-20 pb-12 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 lg:gap-8 mb-20">
            
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <HallwayIcon size={28} />
                <span className="text-xl tracking-tight font-display font-bold">
                  <span className="text-foreground">hall</span><span className="text-primary">way</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground mb-6">
                1-on-1 video chat for verified college students across India.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                <Lock className="h-3.5 w-3.5" />
                <span>Encrypted</span>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-foreground">Product</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><button onClick={() => setActiveModal("features")} className="hover:text-primary transition-colors cursor-pointer">Features</button></li>
                <li><a href="/policies/safety-guidelines.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors cursor-pointer block">Safety Guidelines</a></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-foreground">Legal</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="/policies/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors cursor-pointer block">Privacy Policy</a></li>
                <li><a href="/policies/terms-of-service.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors cursor-pointer block">Terms of Service</a></li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-foreground">Support</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="/policies/help-center.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors cursor-pointer block">Help Center</a></li>
                <li><button onClick={() => setActiveModal("social")} className="hover:text-primary transition-colors cursor-pointer">Social</button></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom Row */}
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-6 px-4 sm:flex-row sm:gap-12 text-[10px] font-medium text-muted-foreground uppercase tracking-widest text-center border-t border-border/20 pt-8">
          <p>© {new Date().getFullYear()} hallway. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <HeartHandshake className="h-3 w-3 text-destructive" /> by <a href="https://github.com/FAYEZ087" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium cursor-pointer">Fayez</a>
          </p>
        </div>
      </footer>

      {/* Footer Modal */}
      {activeModal && <FooterModal id={activeModal} onClose={() => setActiveModal(null)} />}
    </div>
  )
}
