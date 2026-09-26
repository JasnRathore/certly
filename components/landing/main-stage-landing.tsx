"use client";

import Link from "next/link";
import { landingFaq, steps, useCases, type LandingCta } from "@/lib/landing";
import { FestCtaCluster, FestStickyConvert } from "./fest-cta";
import { FestBunting, FestSealSvg, FestTicketSvg, MainStageBg } from "./fest-motion";
import { FestReviews } from "./fest-reviews";
import { LandFaq } from "./land-faq";
import { LandReveal } from "./land-reveal";
import { LooksSwitcher } from "./looks-switcher";
import { Marquee } from "./marquee";
import { TiltCard } from "./tilt-card";

export function MainStageLanding({ cta }: { cta: LandingCta }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-[#1b1020] selection:bg-[#7b5cff] selection:text-[#ffd166] [font-family:var(--font-outfit),ui-sans-serif,system-ui]">
      <MainStageBg />
      <LooksSwitcher tone="light" />
      <FestStickyConvert cta={cta} />

      <div className="relative z-20 h-20 overflow-hidden">
        <FestBunting />
      </div>

      <header className="relative z-20 flex items-center justify-between px-4 py-3 sm:px-8">
        <Link href="/" className="text-lg font-black uppercase tracking-tight">
          Certly
        </Link>
        <div className="flex items-center gap-3 text-sm font-bold">
          {cta.signedIn ? (
            <Link href="/dashboard">Dashboard</Link>
          ) : (
            <>
              <Link href="/login">Log in</Link>
              <Link href={cta.primaryHref} className="rounded-full bg-[#7b5cff] px-4 py-2 text-[#fff4d6]">
                Get on stage
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="relative z-10 px-4 py-8 sm:px-8">
        <p className="land-rise text-center text-xs font-black uppercase tracking-[0.4em]">Main stage · college fests</p>
        <h1
          className="land-rise mx-auto mt-4 max-w-6xl text-center text-6xl font-black uppercase leading-[0.8] tracking-[-0.06em] sm:text-8xl md:text-9xl [font-family:var(--font-archivo),Impact,sans-serif]"
          style={{ animationDelay: "80ms" }}
        >
          Headliner
          <span className="block">certificates.</span>
        </h1>
        <p className="land-rise mx-auto mt-6 max-w-xl text-center text-lg font-semibold" style={{ animationDelay: "140ms" }}>
          The same energy as the fest poster — except every participant actually gets the paper in their inbox.
        </p>
        <div className="land-rise mt-8" style={{ animationDelay: "200ms" }}>
          <FestCtaCluster
            cta={cta}
            primaryClassName="rounded-full bg-[#1b1020] px-8 py-4 text-lg font-black uppercase text-[#ffd166]"
            ghostClassName="rounded-full border-4 border-[#1b1020] bg-white px-6 py-4 text-base font-black uppercase"
          />
        </div>
        <div className="mt-8 flex justify-center gap-6">
          <FestTicketSvg className="fest-bob h-20 w-40" />
          <div className="fest-bob" style={{ animationDelay: "-1.2s" }}>
            <FestSealSvg className="h-20 w-20" />
          </div>
        </div>
      </section>

      <Marquee
        items={useCases}
        fast
        className="relative z-10 border-y-4 border-[#1b1020] bg-[#7b5cff] py-4"
        itemClassName="text-2xl font-black uppercase text-[#ffd166]"
      />

      <div className="relative z-10 bg-white/80">
        <FestReviews heading="Reviews from the people who ran the fest" />
      </div>

      <section className="relative z-10 grid gap-4 px-4 py-16 sm:px-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <LandReveal key={step.n} delay={i * 80}>
            <TiltCard className="h-full">
              <article className="h-full rounded-[2rem] border-4 border-[#1b1020] bg-[#fff4d6] p-6 shadow-[10px_10px_0_#1b1020]">
                <p className="text-5xl font-black text-[#7b5cff]">{step.n}</p>
                <h2 className="mt-4 text-2xl font-black uppercase">{step.title}</h2>
                <p className="mt-2 text-sm font-medium leading-relaxed">{step.body}</p>
              </article>
            </TiltCard>
          </LandReveal>
        ))}
      </section>

      <section className="relative z-10 bg-[#1b1020] px-4 py-16 text-[#ffd166] sm:px-8">
        <LandReveal>
          <h2 className="text-center text-5xl font-black uppercase sm:text-7xl [font-family:var(--font-archivo),Impact,sans-serif]">
            Ticket: ₹100.
            <span className="block text-[#ff7a45]">Lifetime backstage.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-center font-medium text-[#fff4d6]">
            One stall fee. Unlimited sends. Hand the login to next year’s core without another invoice.
          </p>
        </LandReveal>
        <div className="mx-auto mt-10 max-w-2xl">
          <LandFaq items={landingFaq} buttonClassName="text-left text-lg font-bold" />
        </div>
        <div className="mt-10">
          <FestCtaCluster
            cta={cta}
            primaryClassName="rounded-full bg-[#ff7a45] px-8 py-4 text-lg font-black uppercase text-[#1b1020]"
            ghostClassName="rounded-full border-4 border-[#ffd166] px-6 py-4 text-base font-black uppercase text-[#ffd166]"
          />
        </div>
      </section>

      <footer className="relative z-10 bg-[#ff7a45] px-4 py-10 pb-36 text-center text-xs font-bold uppercase tracking-[0.3em] text-[#1b1020]">
        © {new Date().getFullYear()} Certly · main stage look
      </footer>
    </div>
  );
}
