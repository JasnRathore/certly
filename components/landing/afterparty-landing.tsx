"use client";

import Link from "next/link";
import { landingFaq, steps, useCases, type LandingCta } from "@/lib/landing";
import { FestCtaCluster, FestStickyConvert } from "./fest-cta";
import { AfterpartyBg, FestMailSvg, FestStageSvg } from "./fest-motion";
import { FestReviews } from "./fest-reviews";
import { LandFaq } from "./land-faq";
import { LandReveal } from "./land-reveal";
import { LooksSwitcher } from "./looks-switcher";
import { Marquee } from "./marquee";

export function AfterpartyLanding({ cta }: { cta: LandingCta }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#1b1020] text-[#fff4d6] selection:bg-[#ffd166] selection:text-[#1b1020] [font-family:var(--font-outfit),ui-sans-serif,system-ui]">
      <AfterpartyBg />
      <LooksSwitcher tone="dark" />
      <FestStickyConvert cta={cta} />

      <header className="relative z-20 flex items-center justify-between px-4 py-5 sm:px-8">
        <Link href="/" className="text-lg font-black uppercase tracking-tight text-[#ffd166]">
          Certly
        </Link>
        <div className="flex items-center gap-3 text-sm font-bold">
          {cta.signedIn ? (
            <Link href="/dashboard">Dashboard</Link>
          ) : (
            <>
              <Link href="/login">Log in</Link>
              <Link href={cta.primaryHref} className="rounded-full bg-[#ffd166] px-4 py-2 text-[#1b1020]">
                Send before last song
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="relative z-10 grid items-center gap-10 px-4 py-10 sm:px-8 lg:grid-cols-2">
        <div>
          <p className="land-rise text-xs font-black uppercase tracking-[0.4em] text-[#ff6b9d]">Fest afterparty ops</p>
          <h1
            className="land-rise mt-4 text-5xl font-black uppercase leading-[0.85] tracking-[-0.05em] sm:text-7xl [font-family:var(--font-archivo),Impact,sans-serif]"
            style={{ animationDelay: "80ms" }}
          >
            Inbox hits
            <span className="block text-[#ffd166] [text-shadow:4px_4px_0_#ff4d6d]">while the lights are still on.</span>
          </h1>
          <p className="land-rise mt-6 max-w-md text-base font-medium text-[#fff4d6]/85" style={{ animationDelay: "140ms" }}>
            Winners, volunteers, every workshop. One Gmail pass from the core team laptop — not a zip file at 3am.
          </p>
          <div className="land-rise mt-8" style={{ animationDelay: "200ms" }}>
            <FestCtaCluster
              cta={cta}
              primaryClassName="rounded-full bg-[#ffd166] px-8 py-4 text-lg font-black uppercase text-[#1b1020]"
              ghostClassName="rounded-full border-4 border-[#ffd166] bg-transparent px-6 py-4 text-base font-black uppercase text-[#ffd166]"
            />
          </div>
        </div>
        <LandReveal className="relative">
          <FestStageSvg className="mx-auto h-auto w-full max-w-md drop-shadow-[8px_8px_0_#ff4d6d]" />
          <FestMailSvg className="absolute -bottom-4 -right-2 h-28 w-36 sm:right-8" />
        </LandReveal>
      </section>

      <Marquee
        items={useCases}
        reverse
        className="relative z-10 border-y-4 border-[#ffd166] bg-[#ff7a45] py-4"
        itemClassName="text-2xl font-black uppercase text-[#1b1020]"
      />

      <section className="relative z-10 grid gap-4 px-4 py-16 sm:px-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <LandReveal key={step.n} delay={i * 80}>
            <article className="h-full rounded-3xl border-4 border-[#ffd166] bg-[#1b1020]/70 p-6 backdrop-blur-sm">
              <p className="text-5xl font-black text-[#ff6b9d]">{step.n}</p>
              <h2 className="mt-4 text-2xl font-black uppercase text-[#ffd166]">{step.title}</h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-[#fff4d6]/80">{step.body}</p>
            </article>
          </LandReveal>
        ))}
      </section>

      <div className="relative z-10 bg-[#fff4d6] text-[#1b1020]">
        <FestReviews heading="They tweeted it. They reviewed it." />
      </div>

      <section className="relative z-10 px-4 py-16 sm:px-8">
        <LandReveal>
          <h2 className="text-center text-5xl font-black uppercase text-[#ffd166] sm:text-7xl [font-family:var(--font-archivo),Impact,sans-serif]">
            Last call: ₹100.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-center font-medium text-[#fff4d6]/80">
            Cheaper than the afterparty pizza order. Covers this fest and every fest after the handover.
          </p>
        </LandReveal>
        <div className="mx-auto mt-10 max-w-2xl text-[#fff4d6]">
          <LandFaq items={landingFaq} buttonClassName="text-left text-lg font-bold" />
        </div>
        <div className="mt-10">
          <FestCtaCluster
            cta={cta}
            primaryClassName="rounded-full bg-[#ff6b9d] px-8 py-4 text-lg font-black uppercase text-[#1b1020]"
            ghostClassName="rounded-full border-4 border-[#fff4d6] px-6 py-4 text-base font-black uppercase"
          />
        </div>
      </section>

      <footer className="relative z-10 px-4 py-10 pb-36 text-center text-xs font-bold uppercase tracking-[0.3em] text-[#ffd166]">
        © {new Date().getFullYear()} Certly · afterparty look
      </footer>
    </div>
  );
}
