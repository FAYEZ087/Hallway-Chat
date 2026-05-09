import { ShieldCheck, Flag, Eye, Lock } from "lucide-react"

const pillars = [
  {
    icon: ShieldCheck,
    title: "Verified-only network",
    description:
      "College email + government ID checks keep Hallway closed to students. No anonymous strangers, ever.",
  },
  {
    icon: Flag,
    title: "One-tap reporting",
    description:
      "Report or block in a single tap. Reports are reviewed by humans within 4 hours, 24/7.",
  },
  {
    icon: Eye,
    title: "Active moderation",
    description:
      "Trained moderators and AI work together to catch bad behavior before it reaches you.",
  },
  {
    icon: Lock,
    title: "Private by default",
    description:
      "We don't record calls, sell your data, or show your number. Your campus stays your business.",
  },
]

export function Safety() {
  return (
    <section
      id="safety"
      className="relative scroll-mt-24 py-20 md:py-28"
      aria-label="Safety on Hallway"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" />
              Trust &amp; Safety
            </div>
            <h2 className="font-display mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Your safety matters more than the next match.
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
              Hallway is built by students, for students — which means safety
              isn&apos;t an afterthought, it&apos;s the foundation. We screen
              every account, moderate every report, and end every session
              encrypted.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="/policies/safety-guidelines.html"
                className="inline-flex items-center justify-center rounded-full border border-border/60 bg-card/40 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-card"
              >
                Read safety guidelines
              </a>
              <a
                href="/policies/report-an-issue.html"
                className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Report a user →
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {pillars.map((p) => {
                const Icon = p.icon
                return (
                  <div
                    key={p.title}
                    className="rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur"
                  >
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-inset ring-primary/20">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <h3 className="font-display mt-4 text-base font-semibold text-foreground">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
