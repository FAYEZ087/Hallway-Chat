import { cn } from "@/lib/utils"

export function HallwayLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline font-display text-xl font-normal tracking-tight",
        className,
      )}
      aria-label="Hallway"
    >
      <span className="text-foreground">h</span>
      <span className="text-primary">allway</span>
    </span>
  )
}
