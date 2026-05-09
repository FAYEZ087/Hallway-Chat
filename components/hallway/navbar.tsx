"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HallwayLogo } from "./logo"
import { cn } from "@/lib/utils"

import { useLiveStats } from "@/hooks/useLiveStats"

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#testimonials", label: "Students" },
  { href: "#safety", label: "Safety" },
  { href: "#faq", label: "FAQ" },
]

export function Navbar({ onStart }: { onStart: () => void }) {
  const { stats, isConnected } = useLiveStats()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/70 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="#" className="flex items-center gap-2" aria-label="Hallway home">
          <HallwayLogo />
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div
            className="hidden items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1.5 text-xs text-muted-foreground sm:flex"
            aria-live="polite"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="font-medium text-foreground">{stats.onlineNow}</span>
            <span>online now</span>
          </div>

          <Button
            onClick={onStart}
            size="sm"
            className="hidden bg-primary text-primary-foreground hover:bg-primary/90 md:inline-flex cursor-pointer"
          >
            Start chatting
          </Button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border/60 text-foreground md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur md:hidden">
          <nav
            className="flex flex-col gap-1 px-4 py-4"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Button
              asChild
              className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="#cta" onClick={() => setOpen(false)}>
                Start chatting free
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
