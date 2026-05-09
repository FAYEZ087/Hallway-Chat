"use client"

import { useLiveStats } from "@/hooks/useLiveStats"

export function Stats() {
  const { stats: liveStats } = useLiveStats()

  const statsList = [
    { value: liveStats.totalConnections.toLocaleString() + "+", label: "Total Students" },
    { value: "50+", label: "Universities" },
    { value: liveStats.totalMatches.toLocaleString() + "+", label: "Total Matches" },
  ]

  return (
    <section
      aria-label="Hallway by the numbers"
      className="relative border-y border-border/60 bg-card/40"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-border/60 px-4 md:px-8">
        {statsList.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center justify-center gap-1 py-8 text-center sm:gap-2 sm:py-10"
          >
            <p className="font-mono text-2xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {s.value}
            </p>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground sm:text-xs">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
