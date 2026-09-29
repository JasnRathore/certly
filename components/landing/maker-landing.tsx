"use client";

import Link from "next/link";
import { landingFaq, type LandingCta } from "@/lib/landing";
import { LandFaq } from "./land-faq";
import { LandReveal } from "./land-reveal";
import { LooksSwitcher } from "./looks-switcher";
import { MagneticLink } from "./magnetic-link";
import { MakerCertificate, MakerStudio } from "./maker-studio";
import { TiltCard } from "./tilt-card";
import { CertlyLogo } from "@/components/certly-logo";

function Mark({ className = "h-6 w-6 text-[#1a1a1a]" }: { className?: string }) {
  return <CertlyLogo className={className} />;
}

const pillars = [
  {
    title: "High Quality Templates",
    body: "Use the certificate your design team already made, or start from a classic look. Names, dates and seals stay sharp in the PDF.",
  },
  {
    title: "No Design Skills Needed",
    body: "Mark where the name goes once. Certly fills every certificate on the list — no Canva all-nighter before prize distribution.",
  },
  {
    title: "Send the Whole List",
    body: "Import a spreadsheet and email every PDF from your club Gmail. ₹100 once, for this fest and every one after.",
  },
];

const features = [
  {
    title: "Email based",
    body: "Certificates leave from your org Gmail, so they look like they came from the club — not a random tool.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-12 w-12 text-[#5a3a48]" aria-hidden="true">
        <rect x="6" y="12" width="36" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 14 L24 26 L40 14" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    title: "Bulk, any size",
    body: "Twenty names or two thousand. One pass, same ₹100. Built for fests, workshops and orientation week.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-12 w-12 text-[#5a3a48]" aria-hidden="true">
        <rect x="8" y="10" width="20" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <rect x="16" y="16" width="20" height="22" rx="2" fill="#fde7f0" stroke="currentColor" strokeWidth="1.8" />
        <path d="M20 24 h12 M20 30 h8" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    title: "Your own Gmail",
    body: "Send as the chapter account your faculty already trusts. Recipients open it. Parents screenshot it.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-12 w-12 text-[#5a3a48]" aria-hidden="true">
        <circle cx="24" cy="24" r="14" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M18 24 a6 10 0 0 0 12 0 a6 10 0 0 0 -12 0" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 24 h28 M24 10 v28" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    title: "Reimbursable",
    body: "A receipt for the treasurer or faculty advisor. No subscription to explain at the next general body meeting.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-12 w-12 text-[#5a3a48]" aria-hidden="true">
        <rect x="12" y="8" width="24" height="32" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M18 16 h12 M18 22 h12 M18 28 h8" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
];

function Mascot() {
  return (
    <svg viewBox="0 0 280 200" className="h-auto w-full max-w-sm" aria-hidden="true">
      <ellipse cx="140" cy="178" rx="70" ry="10" fill="#e8b800" />
      <rect x="96" y="78" width="88" height="92" rx="28" fill="#f5c518" stroke="#1a1a1a" strokeWidth="3" />
      <circle cx="140" cy="58" r="36" fill="#ffd54a" stroke="#1a1a1a" strokeWidth="3" />
      <circle cx="118" cy="36" r="12" fill="#ffd54a" stroke="#1a1a1a" strokeWidth="3" />
      <circle cx="162" cy="36" r="12" fill="#ffd54a" stroke="#1a1a1a" strokeWidth="3" />
      <circle cx="128" cy="56" r="4" fill="#1a1a1a" />
      <circle cx="152" cy="56" r="4" fill="#1a1a1a" />
      <path d="M132 70 q8 8 16 0" fill="none" stroke="#1a1a1a" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="168" y="96" width="72" height="52" rx="6" fill="#fffdf6" stroke="#1a1a1a" strokeWidth="2.5" transform="rotate(12 204 122)" />
      <path d="M176 112 h48 M184 124 h32" stroke="#c9a227" strokeWidth="2" transform="rotate(12 204 122)" />
      <circle cx="228" cy="132" r="7" fill="#22c55e" transform="rotate(12 204 122)" />
      <g className="land-float">
        <rect x="48" y="42" width="14" height="14" rx="2" fill="#22c55e" transform="rotate(18 55 49)" />
        <rect x="220" y="28" width="12" height="18" rx="2" fill="#f472b6" transform="rotate(-12 226 37)" />
        <circle cx="64" cy="118" r="6" fill="#60a5fa" />
      </g>
    </svg>
  );
}

export function MakerLanding({ cta }: { cta: LandingCta }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#1a1a1a] antialiased [font-family:var(--font-geist-sans),ui-sans-serif,system-ui] selection:bg-[#ffd000] selection:text-[#1a1a1a]">
      <LooksSwitcher tone="light" />

      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-[15px] font-semibold">
            <Mark />
            Certly
          </Link>
          <nav className="flex items-center gap-1 text-sm sm:gap-3">
            <a href="#how" className="hidden rounded-md px-2 py-1.5 text-[#3d3d44] hover:bg-[#f6f4ee] sm:inline">
              How it works
            </a>
            <a href="#maker" className="hidden rounded-md px-2 py-1.5 text-[#3d3d44] hover:bg-[#f6f4ee] md:inline">
              Templates
            </a>
            <a href="#pricing" className="hidden rounded-md px-2 py-1.5 text-[#3d3d44] hover:bg-[#f6f4ee] sm:inline">
              Pricing
            </a>
            {cta.signedIn ? (
              <Link
                href="/dashboard"
                className="maker-btn inline-flex h-9 items-center rounded-md bg-[#22c55e] px-4 text-sm font-semibold text-white"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="rounded-md px-3 py-1.5 text-[#3d3d44] hover:bg-[#f6f4ee]">
                  Login
                </Link>
                <MagneticLink
                  href={cta.primaryHref}
                  className="maker-btn inline-flex h-9 items-center rounded-md bg-[#22c55e] px-4 text-sm font-semibold text-white"
                >
                  Create an event
                </MagneticLink>
              </>
            )}
          </nav>
        </div>
      </header>

      <section className="maker-wash relative overflow-hidden">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:py-28">
          <h1 className="land-rise text-4xl font-extrabold tracking-tight sm:text-6xl">Online Certificate Maker</h1>
          <p className="land-rise mx-auto mt-4 max-w-xl text-base text-[#3d3d18]/80 sm:text-lg" style={{ animationDelay: "90ms" }}>
            Generate beautiful certificates and email the whole guest list — for college fests, hackathons and school clubs.
          </p>
          <div className="land-rise mt-8 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "160ms" }}>
            <MagneticLink
              href={cta.primaryHref}
              className="maker-btn inline-flex h-11 items-center rounded-md bg-[#22c55e] px-6 text-sm font-semibold text-white"
            >
              {cta.signedIn ? "Open dashboard" : "Create an event"}
            </MagneticLink>
          </div>
          <p className="land-rise mt-3 text-sm text-[#3d3d18]/70" style={{ animationDelay: "220ms" }}>
            or{" "}
            <a href="#maker" className="underline decoration-[#1a1a1a]/30 underline-offset-4 hover:decoration-[#1a1a1a]">
              try a template below
            </a>
          </p>
        </div>
      </section>

      <section id="how" className="maker-wash relative scroll-mt-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
          <LandReveal>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Create Certificates
              <br />
              Online or Auto Send
              <br />
              the Whole List
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#3d3d18]/80">
              Upload a certificate once, drop in names and emails, then Certly fills every PDF and mails it from your
              club Gmail — before the WhatsApp group starts asking where theirs is.
            </p>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#3d3d18]/80">
              Pay ₹100 once. Unlimited recipients, this year and after the handover.
            </p>
            <Link
              href={cta.primaryHref}
              className="maker-btn mt-8 inline-flex h-11 items-center rounded-md bg-[#22c55e] px-6 text-sm font-semibold text-white"
            >
              {cta.signedIn ? "Open dashboard" : "Create an event"}
            </Link>
          </LandReveal>
          <LandReveal delay={120} className="flex justify-center">
            <div className="maker-bob w-full max-w-md">
            <TiltCard className="relative w-full">
              <div className="relative overflow-hidden rounded-lg shadow-[0_24px_50px_-18px_rgba(80,60,0,0.45)]">
                <MakerCertificate
                  template="verdant"
                  name="Aditi Rao"
                  award="TechFest 2026 · Winner"
                  date="26 September 2026"
                  sign="IEEE SJEC"
                  className="h-auto w-full bg-[#f3fbf6]"
                />
                <span className="maker-shine" />
              </div>
            </TiltCard>
            </div>
          </LandReveal>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-3 md:py-20">
          {pillars.map((item, i) => (
            <LandReveal key={item.title} delay={i * 90}>
              <h3 className="text-xl font-extrabold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5a5a62]">{item.body}</p>
            </LandReveal>
          ))}
        </div>
      </section>

      <section className="bg-[#f4a3c4]">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-14 sm:px-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, i) => (
            <LandReveal key={item.title} delay={i * 80}>
              <article className="maker-card-in h-full rounded-lg bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5a5a62]">{item.body}</p>
              </article>
            </LandReveal>
          ))}
        </div>
      </section>

      <section id="maker" className="scroll-mt-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <LandReveal>
            <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">Create Your Certificate</h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm text-[#5a5a62]">
              Pick a look, type a name, and watch the preview update. Then send the real list from the dashboard.
            </p>
          </LandReveal>
          <div className="mt-10">
            <MakerStudio cta={cta} />
          </div>
        </div>
      </section>

      <section id="pricing" className="maker-wash scroll-mt-16">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-20">
          <LandReveal>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Need to Auto Generate Certificates?</h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] text-[#3d3d18]/80">
              Join the clubs sending 20 or 2,000 names from one spreadsheet. ₹100, once, for life.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={cta.primaryHref}
                className="maker-btn inline-flex h-11 items-center rounded-md bg-[#1a1a1a] px-6 text-sm font-semibold text-white"
              >
                {cta.signedIn ? "Open dashboard" : "Get started · ₹100"}
              </Link>
              <a
                href="#faq"
                className="inline-flex h-11 items-center rounded-md border border-[#1a1a1a]/20 bg-white/50 px-6 text-sm font-semibold text-[#1a1a1a] hover:bg-white"
              >
                Read the FAQ
              </a>
            </div>
          </LandReveal>
        </div>
      </section>

      <section id="faq" className="scroll-mt-16 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <LandReveal>
            <LandFaq
              items={landingFaq}
              buttonClassName="text-left text-[15px] font-medium text-[#1a1a1a]"
              bodyClassName="text-[#5a5a62]"
            />
          </LandReveal>
        </div>
      </section>

      <section className="maker-wash">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:px-6 md:grid-cols-2">
          <LandReveal>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Start with ₹100</h2>
            <p className="mt-3 max-w-md text-[15px] text-[#3d3d18]/80">
              One payment from the event fund. Then invite the rest of core and send every certificate this fest needs.
            </p>
            <Link
              href={cta.primaryHref}
              className="maker-btn mt-8 inline-flex h-11 items-center rounded-md bg-[#22c55e] px-6 text-sm font-semibold text-white"
            >
              {cta.signedIn ? "Open dashboard" : "Get started"}
            </Link>
          </LandReveal>
          <LandReveal delay={100} className="flex justify-center md:justify-end">
            <Mascot />
          </LandReveal>
        </div>
      </section>

      <footer className="bg-[#1c1c1c] text-[#bdbdbd]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
          <div>
            <p className="flex items-center gap-2 text-white">
              <Mark className="h-6 w-6 text-white" />
              <span className="text-sm font-semibold">Certly</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed">
              Certificates, generated and sent — for college and school clubs.
            </p>
            <p className="mt-6 text-xs">© {new Date().getFullYear()} Certly</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white">Product</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#maker" className="hover:text-white">
                  Templates
                </a>
              </li>
              <li>
                <a href="#how" className="hover:text-white">
                  How it works
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white">Looks</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white">
                  Studio
                </Link>
              </li>
              <li>
                <Link href="/1" className="hover:text-white">
                  Carnival
                </Link>
              </li>
              <li>
                <Link href="/3" className="hover:text-white">
                  Main stage
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white">Help</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#faq" className="hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="mailto:hello@certly.app" className="hover:text-white">
                  hello@certly.app
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-white">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
