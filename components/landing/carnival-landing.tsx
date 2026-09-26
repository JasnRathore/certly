"use client";

import Link from "next/link";
import { landingFaq, steps, useCases, type LandingCta } from "@/lib/landing";
import { FestCtaCluster, FestStickyConvert } from "./fest-cta";
import { CarnivalBg, FestSealSvg, FestTicketSvg } from "./fest-motion";
import { FestReviews } from "./fest-reviews";
import { LandFaq } from "./land-faq";
import { LandReveal } from "./land-reveal";
import { LooksSwitcher } from "./looks-switcher";
import { Marquee } from "./marquee";
import { TiltCard } from "./tilt-card";

const stickers = [
  { label: "₹100 forever", rotate: "-12deg", bg: "#ffd166", top: "10%", left: "3%" },
  { label: "No Canva all-nighter", rotate: "8deg", bg: "#ff6b9d", top: "16%", left: "74%" },
  { label: "Treasurer loves this", rotate: "-6deg", bg: "#7bf1a8", top: "58%", left: "6%" },
  { label: "Sports · Tech · Cultural", rotate: "10deg", bg: "#c4b5fd", top: "64%", left: "70%" },
];

export function CarnivalLanding({ cta }: { cta: LandingCta }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-[#1b1020] selection:bg-[#1b1020] selection:text-[#ffd166] [font-family:var(--font-outfit),ui-sans-serif,system-ui]">
      <CarnivalBg />
      <LooksSwitcher tone="light" />
      <FestStickyConvert cta={cta} />

      <header className="relative z-20 flex items-center justify-between px-4 py-5 sm:px-8">
        <Link href="/" className="text-lg font-black uppercase tracking-tight">
          Certly
        </Link>
        <div className="flex items-center gap-3 text-sm font-bold">
          {cta.signedIn ? (
            <Link href="/dashboard">Dashboard</Link>
          ) : (
            <>
              <Link href="/login">Log in</Link>
              <Link href={cta.primaryHref} className="rounded-full bg-[#1b1020] px-4 py-2 text-[#ffd166]">
                Claim the stall
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="relative z-10 px-4 pb-12 pt-6 sm:px-8">
        {stickers.map((s) => (
          <span
            key={s.label}
            className="land-wobble pointer-events-none absolute hidden rounded-xl px-3 py-2 text-xs font-black uppercase shadow-md sm:block"
            style={{ top: s.top, left: s.left, rotate: s.rotate, background: s.bg }}
          >
            {s.label}
          </span>
        ))}
        <p className="land-rise text-center text-xs font-black uppercase tracking-[0.4em]">College fest carnival</p>
        <h1
          className="land-rise mx-auto mt-4 max-w-5xl text-center text-5xl font-black uppercase leading-[0.85] tracking-[-0.05em] sm:text-7xl md:text-8xl [font-family:var(--font-archivo),Impact,sans-serif]"
          style={{ animationDelay: "80ms" }}
        >
          Certificates
          <span className="block text-[#fff4d6] [text-shadow:4px_4px_0_#1b1020]">before the afterparty.</span>
        </h1>
        <p className="land-rise mx-auto mt-6 max-w-lg text-center text-base font-medium" style={{ animationDelay: "140ms" }}>
          Upload the design, drop the fest list, hit send. Every name gets a real PDF from the club Gmail
          while the crowd is still in the quad.
        </p>
        <div className="land-rise relative mt-8" style={{ animationDelay: "200ms" }}>
          <FestCtaCluster
            cta={cta}
            primaryClassName="rounded-full bg-[#1b1020] px-8 py-4 text-lg font-black uppercase text-[#ffd166]"
            ghostClassName="rounded-full border-4 border-[#1b1020] bg-[#fff4d6] px-6 py-4 text-base font-black uppercase"
          />
        </div>
        <div className="mt-10 flex justify-center gap-8">
          <FestTicketSvg className="fest-bob h-24 w-44" />
          <FestSealSvg className="land-spin-slow hidden h-24 w-24 sm:block" />
        </div>
      </section>

      <Marquee items={useCases} className="relative z-10 bg-[#1b1020] py-4" itemClassName="text-2xl font-black uppercase text-[#ffd166]" />

      <section className="relative z-10 grid gap-4 bg-[#fff4d6]/90 px-4 py-16 sm:px-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <LandReveal key={step.n} delay={i * 80}>
            <TiltCard className="h-full">
              <article className="h-full rounded-3xl border-4 border-[#1b1020] bg-white p-6 shadow-[8px_8px_0_#1b1020]">
                <p className="text-5xl font-black">{step.n}</p>
                <h2 className="mt-4 text-2xl font-black uppercase">{step.title}</h2>
                <p className="mt-2 text-sm font-medium leading-relaxed">{step.body}</p>
              </article>
            </TiltCard>
          </LandReveal>
        ))}
      </section>

      <div className="relative z-10 bg-[#fff4d6]">
        <FestReviews heading="X posts and Google reviews from fest cores" />
      </div>

      <section className="relative z-10 bg-[#7b5cff] px-4 py-16 text-[#fff4d6] sm:px-8">
        <LandReveal>
          <h2 className="text-center text-5xl font-black uppercase sm:text-7xl [font-family:var(--font-archivo),Impact,sans-serif]">
            ₹100. That’s the stall fee.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-center font-medium">
            Pay once from the event fund. Unlimited certificates this year, next year, every core-team handover.
          </p>
        </LandReveal>
        <div className="mx-auto mt-10 max-w-2xl">
          <LandFaq items={landingFaq} buttonClassName="text-left text-lg font-bold" />
        </div>
        <div className="mt-10">
          <FestCtaCluster
            cta={cta}
            primaryClassName="rounded-full bg-[#ffd166] px-8 py-4 text-lg font-black uppercase text-[#1b1020]"
            ghostClassName="rounded-full border-4 border-[#1b1020] bg-transparent px-6 py-4 text-base font-black uppercase text-[#fff4d6]"
          />
        </div>
      </section>

      <footer className="relative z-10 bg-[#1b1020] px-4 py-10 pb-36 text-center text-xs font-bold uppercase tracking-[0.3em] text-[#ffd166]">
        © {new Date().getFullYear()} Certly · carnival look
      </footer>
    </div>
  );
}
