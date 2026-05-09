"use client"

import { useLiveStats } from "@/hooks/useLiveStats"

export function Stats() {
  const { stats: liveStats } = useLiveStats()

  const statsList = [
    { 
      value: Math.max(1200, liveStats.totalConnections).toLocaleString() + "+", 
      label: "verified students" 
    },
    { 
      value: "50+", 
      label: "colleges in India" 
    },
    { 
      value: Math.max(500, liveStats.totalMatches).toLocaleString() + "+", 
      label: "successful matches" 
    },
  ]

  return (
    <section
      aria-label="Hallway by the numbers"
      className="relative border-y border-border/60 bg-card/40 backdrop-blur-sm"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-border/60 px-4 md:px-8">
        {statsList.map((s) => (
          <div
            key={s.label}
            className="group flex flex-col items-center justify-center gap-1 py-10 text-center transition-all duration-300 hover:bg-primary/[0.02] sm:gap-2 sm:py-14"
          >
            <p className="font-display text-2xl font-bold tracking-tight text-foreground transition-transform duration-300 group-hover:scale-110 sm:text-4xl md:text-5xl">
              {s.value}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-300 group-hover:text-primary sm:text-xs">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
