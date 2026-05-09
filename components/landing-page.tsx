"use client"

import { Navbar } from "@/components/hallway/navbar"
import { Hero } from "@/components/hallway/hero"
import { Stats } from "@/components/hallway/stats"
import { Features } from "@/components/hallway/features"
import { HowItWorks } from "@/components/hallway/how-it-works"
import { Testimonials } from "@/components/hallway/testimonials"
import { WhoFor } from "@/components/hallway/who-for"
import { Safety } from "@/components/hallway/safety"
import { Faq } from "@/components/hallway/faq"
import { Cta } from "@/components/hallway/cta"
import { Footer } from "@/components/hallway/footer"

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar onStart={onGetStarted} />
      <Hero onStart={onGetStarted} />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <WhoFor />
      <Safety />
      <Faq />
      <Cta onStart={onGetStarted} />
      <Footer />
    </main>
  )
}
