import { Mail, BadgeCheck, Video } from "lucide-react"

const steps = [
  {
    icon: Mail,
    title: "Enter your college email",
    description:
      "Sign up with your @yourcollege.ac.in or .edu email. We use it only to confirm you're a student.",
  },
  {
    icon: BadgeCheck,
    title: "Get verified",
    description:
      "Quick ID check (under 30 seconds) and you're in. Your verified badge tells everyone you're the real deal.",
  },
  {
    icon: Video,
    title: "Start chatting",
    description:
      "Pick your vibe, hit Match, and meet a new student in seconds. Skip anytime — no awkward goodbyes.",
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-24 py-20 md:py-28"
      aria-label="How Hallway works"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
            How it works
          </p>
          <h2 className="font-display mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            From signup to your first hello in 60 seconds
          </h2>
        </div>

        <div className="relative mt-14">
          <div
            className="pointer-events-none absolute left-1/2 top-10 hidden h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent md:block"
            aria-hidden
          />
          <ol className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <li
                  key={step.title}
                  className="group relative flex flex-col items-start gap-4 rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card/70 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-inset ring-primary/20">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Step 0{i + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
