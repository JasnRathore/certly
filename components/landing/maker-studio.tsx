"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LandingCta } from "@/lib/landing";

export const makerTemplates = [
  { id: "classic", label: "Classic gold" },
  { id: "verdant", label: "Verdant" },
  { id: "navy", label: "Navy honor" },
  { id: "fest", label: "Fest night" },
] as const;

export type MakerTemplateId = (typeof makerTemplates)[number]["id"];

const palettes: Record<
  MakerTemplateId,
  { paper: string; border: string; ink: string; mute: string; accent: string; ribbon: string }
> = {
  classic: {
    paper: "#fffdf6",
    border: "#c9a227",
    ink: "#1a2744",
    mute: "#6b6456",
    accent: "#c9a227",
    ribbon: "#b3121b",
  },
  verdant: {
    paper: "#f3fbf6",
    border: "#2d6a4f",
    ink: "#14352a",
    mute: "#4d6b60",
    accent: "#40916c",
    ribbon: "#2d6a4f",
  },
  navy: {
    paper: "#f5f8fc",
    border: "#1b365d",
    ink: "#12233f",
    mute: "#5b6b80",
    accent: "#2b6cb0",
    ribbon: "#1b365d",
  },
  fest: {
    paper: "#fff8f1",
    border: "#c05621",
    ink: "#7b2d12",
    mute: "#8a5a3c",
    accent: "#dd6b20",
    ribbon: "#c53030",
  },
};

export function MakerCertificate({
  template,
  name,
  award,
  date,
  sign,
  className = "",
}: {
  template: MakerTemplateId;
  name: string;
  award: string;
  date: string;
  sign: string;
  className?: string;
}) {
  const p = palettes[template];
  const displayName = name.trim() || "Your name";
  const displayAward = award.trim() || "Participation";
  const displayDate = date.trim() || "26 September 2026";
  const displaySign = sign.trim() || "Club core";

  return (
    <svg viewBox="0 0 480 340" className={className} role="img" aria-label="Certificate preview">
      <rect x="2" y="2" width="476" height="336" rx="8" fill={p.paper} stroke={p.border} strokeWidth="4" />
      <rect x="14" y="14" width="452" height="312" rx="4" fill="none" stroke={p.border} strokeWidth="1.4" opacity="0.7" />
      <rect x="22" y="22" width="436" height="296" rx="2" fill="none" stroke={p.accent} strokeWidth="0.8" opacity="0.45" />
      <path d="M36 36 h28 v2 h-26 v26 h-2 z" fill={p.accent} />
      <path d="M444 36 h-28 v2 h26 v26 h2 z" fill={p.accent} />
      <path d="M36 304 h28 v-2 h-26 v-26 h-2 z" fill={p.accent} />
      <path d="M444 304 h-28 v-2 h26 v-26 h2 z" fill={p.accent} />
      <text x="240" y="64" textAnchor="middle" fill={p.mute} fontSize="11" letterSpacing="3.4" fontFamily="ui-sans-serif, system-ui">
        CERTIFICATE OF
      </text>
      <text
        x="240"
        y="92"
        textAnchor="middle"
        fill={p.ink}
        fontSize="22"
        fontWeight="700"
        letterSpacing="2"
        fontFamily="ui-serif, Georgia, serif"
      >
        ACHIEVEMENT
      </text>
      <path d="M168 104 H312" stroke={p.accent} strokeWidth="1.2" />
      <text x="240" y="128" textAnchor="middle" fill={p.mute} fontSize="11" fontFamily="ui-sans-serif, system-ui">
        This is proudly presented to
      </text>
      <text
        key={displayName}
        className="maker-pop"
        x="240"
        y="168"
        textAnchor="middle"
        fill={p.ink}
        fontSize="28"
        fontFamily="ui-serif, Georgia, serif"
      >
        {displayName}
      </text>
      <path d="M130 178 H350" stroke={p.border} strokeWidth="0.8" opacity="0.5" />
      <text x="240" y="204" textAnchor="middle" fill={p.mute} fontSize="12" fontFamily="ui-sans-serif, system-ui">
        for {displayAward}
      </text>
      <circle cx="400" cy="268" r="28" fill={p.ribbon} />
      <circle cx="400" cy="268" r="18" fill={p.accent} />
      <path d="M392 288 l8 18 8 -18" fill={p.ribbon} />
      <text x="400" y="273" textAnchor="middle" fill="#fffdf6" fontSize="10" fontWeight="700" fontFamily="ui-sans-serif">
        CG
      </text>
      <text x="90" y="268" fill={p.mute} fontSize="10" fontFamily="ui-sans-serif">
        Date
      </text>
      <text x="90" y="286" fill={p.ink} fontSize="12" fontFamily="ui-serif, Georgia, serif">
        {displayDate}
      </text>
      <text x="230" y="268" fill={p.mute} fontSize="10" fontFamily="ui-sans-serif">
        Signed
      </text>
      <text x="230" y="286" fill={p.ink} fontSize="13" fontFamily="ui-serif, Georgia, serif">
        {displaySign}
      </text>
    </svg>
  );
}

export function MakerStudio({ cta }: { cta: LandingCta }) {
  const [template, setTemplate] = useState<MakerTemplateId>("verdant");
  const [name, setName] = useState("Aditi Rao");
  const [award, setAward] = useState("TechFest 2026 · Participation");
  const [date, setDate] = useState("26 September 2026");
  const [sign, setSign] = useState("Cultural Core");
  const [status, setStatus] = useState<"idle" | "spin" | "done">("idle");

  useEffect(() => {
    if (status !== "spin") return;
    const t = window.setTimeout(() => setStatus("done"), 900);
    return () => window.clearTimeout(t);
  }, [status]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {makerTemplates.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTemplate(item.id);
              setStatus("idle");
            }}
            className={`w-[138px] overflow-hidden rounded-md border bg-white p-1.5 shadow-sm transition-all ${
              template === item.id
                ? "border-[#1a1a1a] ring-2 ring-[#ffd000] ring-offset-2"
                : "border-[#e7e4dc] hover:-translate-y-0.5 hover:shadow-md"
            }`}
            aria-pressed={template === item.id}
            aria-label={item.label}
          >
            <MakerCertificate
              template={item.id}
              name="A. Rao"
              award="Fest"
              date="2026"
              sign="Core"
              className="h-auto w-full"
            />
          </button>
        ))}
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setStatus("spin");
        }}
      >
        <label className="block text-[13px] text-[#4a4a52]">
          Name
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setStatus("idle");
            }}
            className="mt-1.5 h-11 w-full rounded-md border border-[#d8d4cc] bg-white px-3 text-sm text-[#1a1a1a] outline-none transition focus:border-[#ffd000] focus:ring-2 focus:ring-[#ffd000]/50"
          />
        </label>
        <label className="block text-[13px] text-[#4a4a52]">
          Award
          <input
            value={award}
            onChange={(e) => {
              setAward(e.target.value);
              setStatus("idle");
            }}
            className="mt-1.5 h-11 w-full rounded-md border border-[#d8d4cc] bg-white px-3 text-sm text-[#1a1a1a] outline-none transition focus:border-[#ffd000] focus:ring-2 focus:ring-[#ffd000]/50"
          />
        </label>
        <label className="block text-[13px] text-[#4a4a52]">
          Date
          <input
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setStatus("idle");
            }}
            className="mt-1.5 h-11 w-full rounded-md border border-[#d8d4cc] bg-white px-3 text-sm text-[#1a1a1a] outline-none transition focus:border-[#ffd000] focus:ring-2 focus:ring-[#ffd000]/50"
          />
        </label>
        <label className="block text-[13px] text-[#4a4a52]">
          Signature
          <input
            value={sign}
            onChange={(e) => {
              setSign(e.target.value);
              setStatus("idle");
            }}
            className="mt-1.5 h-11 w-full rounded-md border border-[#d8d4cc] bg-white px-3 text-sm text-[#1a1a1a] outline-none transition focus:border-[#ffd000] focus:ring-2 focus:ring-[#ffd000]/50"
          />
        </label>

        <div className="overflow-hidden rounded-lg border border-[#e7e4dc] bg-[#faf8f2] p-4 shadow-sm">
          <MakerCertificate template={template} name={name} award={award} date={date} sign={sign} className="h-auto w-full" />
        </div>

        {status === "done" ? (
          <div className="land-rise rounded-md border border-[#2d6a4f]/20 bg-[#f3fbf6] px-4 py-3 text-sm text-[#14352a]">
            Looks right. Upload this design in the dashboard and Certly will fill every name on your list.
            <div className="mt-3">
              <Link
                href={cta.primaryHref}
                className="maker-btn inline-flex h-11 items-center rounded-md bg-[#22c55e] px-5 text-sm font-semibold text-white"
              >
                {cta.signedIn ? "Open dashboard" : "Create an event"}
              </Link>
            </div>
          </div>
        ) : (
          <button
            type="submit"
            className="maker-btn inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#22c55e] text-sm font-semibold text-white sm:w-auto sm:px-8"
          >
            {status === "spin" ? (
              <>
                <span className="maker-spin inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white" />
                Creating…
              </>
            ) : (
              "Create"
            )}
          </button>
        )}
      </form>
    </div>
  );
}
