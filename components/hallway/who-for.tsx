import {
  GraduationCap,
  BedDouble,
  BookOpenCheck,
  Code2,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Persona = {
  icon: LucideIcon
  title: string
  description: string
}

const personas: Persona[] = [
  {
    icon: GraduationCap,
    title: "Freshers",
    description:
      "New campus, zero contacts. Find seniors in your branch and friends in your year before week one ends.",
  },
  {
    icon: BedDouble,
    title: "Hostel students",
    description:
      "Bored at 2am? Skip the loneliness — meet someone from another campus going through the exact same thing.",
  },
  {
    icon: BookOpenCheck,
    title: "Exam warriors",
    description:
      "GATE, CAT, NEET, UPSC. Find an accountability partner who actually shows up at 6am for revision calls.",
  },
  {
    icon: Code2,
    title: "Hackathon builders",
    description:
      "Need a designer, a backend dev, or a pitch partner? Match by stack and ship your next side project together.",
  },
]

export function WhoFor() {
  return (
    <section
      id="who-for"
      className="relative scroll-mt-24 py-20 md:py-28"
      aria-label="Who Hallway is for"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
            Built for you
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Who is Hallway for?
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Whether you&apos;re here to make friends, find a study buddy, or
            build the next big thing — there&apos;s a hallway for you.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {personas.map((p) => {
            const Icon = p.icon
            return (
              <article
                key={p.title}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur transition-colors hover:border-primary/40"
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-inset ring-primary/20">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-foreground">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
