"use client";

import Link from "next/link";
import type { LandingCta } from "@/lib/landing";
import { MagneticLink } from "./magnetic-link";

const proofs = ["₹100 once", "Unlimited names", "Club Gmail send", "Treasurer receipt"];

export function FestCtaCluster({
  cta,
  primaryClassName,
  ghostClassName = "rounded-full border-4 border-[#1b1020] bg-transparent px-6 py-4 text-base font-black uppercase",
}: {
  cta: LandingCta;
  primaryClassName: string;
  ghostClassName?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <MagneticLink href={cta.primaryHref} className={`${primaryClassName} fest-cta-pulse`}>
          {cta.signedIn ? "Open dashboard · send this fest" : "Pay ₹100 · send tonight"}
        </MagneticLink>
        {!cta.signedIn ? (
          <Link href="/login" className={ghostClassName}>
            I already have a stall
          </Link>
        ) : null}
      </div>
      <p className="max-w-md text-center text-sm font-semibold leading-relaxed">
        One payment from the event fund. Every participant, winner, and volunteer gets a PDF
        in their inbox — no Canva all-nighter, no yearly fee.
      </p>
      <ul className="flex flex-wrap justify-center gap-2">
        {proofs.map((item) => (
          <li
            key={item}
            className="rounded-full border-2 border-[#1b1020] bg-white px-3 py-1 text-[11px] font-black uppercase tracking-wide text-[#1b1020]"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FestStickyConvert({ cta }: { cta: LandingCta }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-16 z-40 flex justify-center px-3 sm:bottom-[4.75rem]">
      <div className="pointer-events-auto flex w-full max-w-xl items-center justify-between gap-3 rounded-full border-4 border-[#1b1020] bg-[#fff4d6] px-3 py-2 shadow-[6px_6px_0_#1b1020] sm:px-4">
        <p className="min-w-0 pl-1 text-[11px] font-black uppercase leading-tight tracking-wide sm:text-xs">
          Whole fest list · ₹100 forever
        </p>
        <Link
          href={cta.primaryHref}
          className="shrink-0 rounded-full bg-[#1b1020] px-4 py-2 text-xs font-black uppercase text-[#ffd166]"
        >
          {cta.signedIn ? "Dashboard" : "Start now"}
        </Link>
      </div>
    </div>
  );
}
