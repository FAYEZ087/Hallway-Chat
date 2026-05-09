import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "Is Hallway really free?",
    a: "Yes. The core 1-on-1 video matching is free forever for verified students. We&apos;ll launch optional Pro features (longer DMs history, advanced filters, themed rooms) later — and they&apos;re always optional.",
  },
  {
    q: "Which colleges are supported?",
    a: "Any college in India that issues an .ac.in or .edu institutional email — that&apos;s 50+ universities and growing daily, including IITs, NITs, BITS, IIITs, IIMs, Christ, Manipal, VIT, SRM, DU, JNU, Ashoka and more.",
  },
  {
    q: "How do you verify I'm actually a student?",
    a: "Two-step check: we send a one-time link to your college email, and you upload a quick photo of your student ID. Manual review takes under 30 seconds during business hours. We never store your ID after verification.",
  },
  {
    q: "Are calls recorded?",
    a: "Never. Calls are peer-to-peer encrypted and we have no servers in between. We can&apos;t record them even if we wanted to.",
  },
  {
    q: "What if someone misbehaves on a call?",
    a: "Tap the report button — the call ends instantly and a human moderator reviews the report within 4 hours. Repeat offenders are permanently banned and reported to their college if necessary.",
  },
  {
    q: "Can I use Hallway if I&apos;m a graduate or working professional?",
    a: "Not yet. Hallway is exclusively for current college students in India. We may open an alumni hallway in the future — drop your email at signup to get notified.",
  },
]

export function Faq() {
  return (
    <section
      id="faq"
      className="relative scroll-mt-24 py-20 md:py-28"
      aria-label="Frequently asked questions"
    >
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
            FAQ
          </p>
          <h2 className="font-display mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Questions, answered.
          </h2>
        </div>

        <div className="mt-12 rounded-2xl border border-border/60 bg-card/40 p-2 backdrop-blur sm:p-3">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-border/60 px-3 last:border-b-0 sm:px-4"
              >
                <AccordionTrigger className="py-5 text-left text-base font-medium text-foreground hover:no-underline data-[state=open]:text-primary">
                  <span dangerouslySetInnerHTML={{ __html: item.q }} />
                </AccordionTrigger>
                <AccordionContent className="pb-5 pr-4 text-sm leading-relaxed text-muted-foreground">
                  <span dangerouslySetInnerHTML={{ __html: item.a }} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
