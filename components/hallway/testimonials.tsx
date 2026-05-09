import { Quote } from "lucide-react"

type Testimonial = {
  quote: string
  name: string
  role: string
  initials: string
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Found my hackathon team on Hallway in two nights. We just shipped our first project and I'm flying to Bangalore next month to meet them IRL.",
    name: "Aanya Mehta",
    role: "CSE · IIT Delhi",
    initials: "AM",
  },
  {
    quote:
      "First-year hostel life was rough. Hallway helped me find seniors from my own course who actually answered my dumb questions. Genuine seniors, not LinkedIn ones.",
    name: "Kabir Rao",
    role: "BBA · Christ University",
    initials: "KR",
  },
  {
    quote:
      "Met my study buddy for GATE prep here. We're four months in, both up 20+ percentile, and we&apos;ve never even been in the same city.",
    name: "Sneha Iyer",
    role: "ECE · NIT Trichy",
    initials: "SI",
  },
]

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative scroll-mt-24 border-y border-border/60 bg-card/30 py-20 md:py-28"
      aria-label="Student testimonials"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
            Real students, real stories
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Why students love Hallway
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="relative flex h-full flex-col gap-6 rounded-2xl border border-border/60 bg-background/50 p-6 backdrop-blur md:p-7">
      <Quote
        className="size-6 text-primary/70"
        aria-hidden
      />
      <blockquote className="flex-1">
        <p
          className="text-pretty text-base leading-relaxed text-foreground"
          dangerouslySetInnerHTML={{ __html: testimonial.quote }}
        />
      </blockquote>
      <figcaption className="flex items-center gap-3 border-t border-border/60 pt-5">
        <span
          className="inline-flex size-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/20"
          aria-hidden
        >
          {testimonial.initials}
        </span>
        <div>
          <p className="text-sm font-medium text-foreground">
            {testimonial.name}
          </p>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
        </div>
      </figcaption>
    </figure>
  )
}
