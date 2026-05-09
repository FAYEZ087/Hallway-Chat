import Link from "next/link"
import { ArrowRight, ShieldCheck, Sparkles, Mic, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" aria-hidden />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Social proof badge */}
          <div className="mx-auto inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
              <ShieldCheck className="size-3" />
              Verified students only
            </span>
            <span className="hidden h-3 w-px bg-border sm:inline-block" />
            <span className="font-medium text-foreground">
              Join 1,200+ verified students
            </span>
          </div>

          <h1 className="font-display mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Meet students who share{" "}
            <span className="text-primary">your vibe.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Random 1-on-1 video chats made for college life. Find friends,
            study buddies, and your next hackathon teammate — across 50+ Indian
            universities.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              onClick={onStart}
              size="lg"
              className="group h-12 rounded-full bg-primary px-7 text-base text-primary-foreground shadow-[0_8px_30px_-8px_rgba(0,200,150,0.6)] transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02] hover:shadow-[0_12px_40px_-8px_rgba(0,200,150,0.7)] cursor-pointer"
            >
              Start Chatting Free
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-12 rounded-full px-5 text-base text-foreground transition-all duration-300 hover:bg-card hover:scale-[1.02]"
            >
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Free to start · College email required · No screenshots, ever
          </p>
        </div>

        {/* Hero visual */}
        <HeroVisual />
      </div>
    </section>
  )
}

function HeroVisual() {
  return (
    <div className="relative mx-auto mt-16 max-w-5xl">
      <div className="relative rounded-2xl border border-border/60 bg-card/40 p-2 shadow-2xl backdrop-blur-md sm:p-3">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <VideoTile
            name="Aanya · IIT Delhi"
            tag="CS · Year 2"
            image="/images/aanya.png"
            tone="from-primary/30 via-primary/10 to-transparent"
            self
          />
          <VideoTile
            name="Rohan · BITS Pilani"
            tag="EEE · Year 3"
            image="/images/rohan.jpg"
            tone="from-[#3b6ea8]/40 via-[#3b6ea8]/10 to-transparent"
          />
        </div>

        {/* Bottom control bar */}
        <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 sm:mt-3 sm:px-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="hidden sm:inline">Connected · 02:14</span>
            <span className="sm:hidden">02:14</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ControlButton label="Mute">
              <Mic className="size-4" />
            </ControlButton>
            <ControlButton label="Camera">
              <Video className="size-4" />
            </ControlButton>
            <ControlButton label="Skip" variant="primary">
              <span className="text-xs font-medium">Next</span>
              <ArrowRight className="size-3.5" />
            </ControlButton>
          </div>
        </div>
      </div>

      {/* Floating chip */}
      <div className="absolute -bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-xs shadow-lg sm:inline-flex">
        <Sparkles className="size-3.5 text-primary" />
        <span className="text-muted-foreground">
          Matched on{" "}
          <span className="text-foreground">shared interests:</span>{" "}
          design · startups · F1
        </span>
      </div>
    </div>
  )
}

function VideoTile({
  name,
  tag,
  tone,
  image,
  self = false,
  objectPosition = "center",
}: {
  name: string
  tag: string
  tone: string
  image?: string
  self?: boolean
  objectPosition?: string
}) {
  return (
    <div className={cn(
      "relative aspect-[4/3] overflow-hidden rounded-xl border bg-secondary sm:aspect-video transition-all duration-500",
      !self && "ring-2 ring-primary ring-offset-2 ring-offset-background animate-pulse-subtle"
    )}
    style={{ borderColor: "rgba(255,255,255,0.08)" }}
    >
      {image ? (
        <img 
          src={image} 
          alt={name} 
          style={{ objectPosition }}
          className={cn("absolute inset-0 h-full w-full object-cover", self && "scale-x-[-1]")}
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${tone}`}
          aria-hidden
        />
      )}
      
      {/* Speaking indicator for remote user */}
      {!self && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm">
          <div className="flex items-center gap-0.5">
            <div className="h-2 w-0.5 animate-bounce bg-primary" style={{ animationDelay: '0ms' }} />
            <div className="h-3 w-0.5 animate-bounce bg-primary" style={{ animationDelay: '150ms' }} />
            <div className="h-2 w-0.5 animate-bounce bg-primary" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08), transparent 45%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.05), transparent 50%)",
        }}
        aria-hidden
      />
      <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/70 px-2 py-1 text-[10px] font-medium text-foreground backdrop-blur">
        {self ? (
          <>
            <span className="size-1.5 rounded-full bg-primary" />
            You
          </>
        ) : (
          <>
            <ShieldCheck className="size-3 text-primary" />
            Verified
          </>
        )}
      </div>
      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
        <div className="rounded-md bg-background/70 px-2 py-1 text-[11px] text-foreground backdrop-blur">
          <p className="font-medium leading-none">{name}</p>
          <p className="mt-0.5 text-[10px] leading-none text-muted-foreground">
            {tag}
          </p>
        </div>
      </div>
    </div>
  )
}

function ControlButton({
  children,
  label,
  variant = "ghost",
}: {
  children: React.ReactNode
  label: string
  variant?: "ghost" | "primary"
}) {
  const base =
    "inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-3 text-sm transition-all duration-300 hover:scale-105"
  const variants = {
    ghost: "border border-border/60 text-foreground hover:bg-card hover:border-primary/20",
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_14px_-4px_rgba(0,200,150,0.5)] hover:shadow-[0_6px_20px_-4px_rgba(0,200,150,0.6)]",
  }
  return (
    <button
      type="button"
      aria-label={label}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  )
}
