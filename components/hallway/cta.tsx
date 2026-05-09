import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Cta({ onStart }: { onStart: () => void }) {
  return (
    <section
      id="cta"
      aria-label="Get started with Hallway"
      className="relative scroll-mt-24 py-20 md:py-28"
    >
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card/60 p-10 text-center backdrop-blur md:p-16">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[120%] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]"
            aria-hidden
          />
          <div className="relative">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" />
              Verified students only
            </div>
            <h2 className="font-display mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              The next great friend you make is <br className="hidden sm:block" />
              <span className="text-primary">one match away.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-md text-pretty text-muted-foreground">
              Sign up with your college email. Be on a call in under a minute.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                onClick={onStart}
                size="lg"
                className="group relative z-10 h-12 rounded-full bg-primary px-8 text-base text-primary-foreground shadow-[0_10px_40px_-10px_rgba(0,200,150,0.5)] transition-all duration-300 hover:shadow-[0_15px_50px_-10px_rgba(0,200,150,0.6)] hover:scale-[1.02] cursor-pointer"
              >
                Start Chatting Free
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <p className="text-xs text-muted-foreground">
                No credit card · No app store · Works on phone &amp; laptop
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
