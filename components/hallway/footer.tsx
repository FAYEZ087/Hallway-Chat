import Link from "next/link"
import { Instagram, Twitter, HeartHandshake } from "lucide-react"
import { HallwayLogo } from "./logo"
import { Heart } from "lucide-react"


const links = { 
  Product: [
    { href: "/policies/features.html", label: "Features" },
    { href: "/policies/safety-guidelines.html", label: "Safety" },
    { href: "/policies/community.html", label: "Community" },
    { href: "/policies/premium.html", label: "Premium" },
  ],
  Legal: [
    { href: "/policies/privacy-policy.html", label: "Privacy" },
    { href: "/policies/terms-of-service.html", label: "Terms" },
    { href: "/policies/trust-and-safety.html", label: "Trust & Safety" },
    { href: "/policies/cookie-policy.html", label: "Cookie Policy" },
  ],
  Support: [
    { href: "/policies/help-center.html", label: "Help Center" },
    { href: "/policies/contact-us.html", label: "Contact Us" },
    { href: "/policies/report-an-issue.html", label: "Report an Issue" },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <HallwayLogo className="text-2xl" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Hallway is a private, verified-only video chat network for
              college students in India. Made with care in Bengaluru.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <SocialLink
                href="https://instagram.com/hallwaychat_online"
                label="Instagram @hallwaychat_online"
              >
                <Instagram className="size-4" />
              </SocialLink>
              <SocialLink
                href="https://twitter.com/hallway_chat_"
                label="Twitter @hallway_chat_"
              >
                <Twitter className="size-4" />
              </SocialLink>
            </div>
          </div>

          {Object.entries(links).map(([heading, items]) => (
            <div key={heading} className="md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                {heading}
              </p>
              <ul className="mt-4 space-y-3">
                {items.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-1">
            {/* Social column removed - icons kept in brand column */}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Hallway Technologies Pvt. Ltd. All
            rights reserved.
          </p>
          <div className="text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              Made with <HeartHandshake className="h-3 w-3 text-destructive" /> by <a href="https://github.com/FAYEZ087" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Fayez</a>
            </div>
            For verified college students in India.
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex size-9 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
    >
      {children}
    </Link>
  )
}
