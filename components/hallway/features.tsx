import { ShieldCheck, Sparkles, Video, MessageCircle } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Feature = {
  icon: LucideIcon
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: ShieldCheck,
    title: "Verified Students Only",
    description:
      "Every account is gated behind a college email and ID check. No bots, no creeps, no randos — just real students.",
  },
  {
    icon: Sparkles,
    title: "Interest-Based Matching",
    description:
      "Pick what you're into — startups, anime, NEET prep, indie music — and we'll match you with people who actually get it.",
  },
  {
    icon: Video,
    title: "HD Video Chat",
    description:
      "Crisp 1080p video and crystal-clear audio, even on hostel Wi-Fi. Built for the way Indian campuses actually connect.",
  },
  {
    icon: MessageCircle,
    title: "Real-time Messaging",
    description:
      "Hit it off? Keep the convo going with private DMs, shared playlists, and study rooms after the call ends.",
  },
]

export function Features() {
  return (
    <section
      id="features"
      className="relative scroll-mt-24 py-20 md:py-28"
      aria-label="Features"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
            Features
          </p>
          <h2 className="font-display mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Designed for the student experience
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Hallway isn&apos;t Omegle with a coat of paint. Every feature is
            built around how college students in India actually meet, study,
            and hang out.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  feature,
  index,
}: {
  feature: Feature
  index: number
}) {
  const Icon = feature.icon
  return (
    <article className="group relative flex h-full flex-col gap-4 rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card/70 hover:shadow-xl hover:shadow-primary/5">
      <div className="flex items-center justify-between">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-inset ring-primary/20 transition-transform group-hover:scale-105">
          <Icon className="size-5" aria-hidden />
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          0{index + 1}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {feature.description}
        </p>
      </div>
    </article>
  )
}
