"use client";

import { useEffect, useState } from "react";
import { CertificateDoc } from "./certificate-doc";

const recipients = [
  { name: "Aditi Rao", email: "aditi.rao@college.edu" },
  { name: "Rohan Mehta", email: "rohan.mehta@college.edu" },
  { name: "Fatima Sheikh", email: "fatima.sheikh@college.edu" },
];

const screens = ["upload", "recipients", "sending"] as const;
type Screen = (typeof screens)[number];

export function ProductPreview() {
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(0);
  const current: Screen = screens[step];

  useEffect(() => {
    const cycle = setInterval(() => {
      setStep((s) => (s + 1) % screens.length);
    }, 3800);
    return () => clearInterval(cycle);
  }, []);

  useEffect(() => {
    if (current !== "sending") {
      setSent(0);
      return;
    }
    setSent(0);
    const tick = setInterval(() => {
      setSent((n) => (n < recipients.length ? n + 1 : n));
    }, 650);
    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <div className="relative">
      <style>{`
        @keyframes certgenStepIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes certgenRowIn { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes certgenToastIn { from { opacity: 0; transform: translateY(-6px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes certgenDropChip {
          0%   { transform: translate(76px, -64px) rotate(9deg); opacity: 1; }
          60%  { transform: translate(6px, 4px) rotate(-3deg); opacity: 1; }
          78%  { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
        }
        @keyframes certgenDropPulse {
          0%, 55% { box-shadow: 0 0 0 0 rgba(217,164,4,0); border-color: rgba(217,164,4,0.4); }
          72%     { box-shadow: 0 0 0 6px rgba(217,164,4,0.15); border-color: rgba(217,164,4,1); }
          100%    { box-shadow: 0 0 0 0 rgba(217,164,4,0); border-color: rgba(217,164,4,0.4); }
        }
        @keyframes certgenLabelIn {
          0%, 72% { opacity: 0; transform: translateY(4px); }
          100%    { opacity: 1; transform: translateY(0); }
        }
        .certgen-stepIn { animation: certgenStepIn 420ms ease-out both; }
        .certgen-rowIn { animation: certgenRowIn 380ms ease-out both; }
        .certgen-toastIn { animation: certgenToastIn 320ms ease-out both; }
        .certgen-dropchip { animation: certgenDropChip 1050ms cubic-bezier(0.22,1,0.36,1) both; }
        .certgen-droppulse { animation: certgenDropPulse 1050ms ease-out both; }
        .certgen-labelin { animation: certgenLabelIn 1050ms ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .certgen-stepIn, .certgen-rowIn, .certgen-toastIn,
          .certgen-dropchip, .certgen-droppulse, .certgen-labelin {
            animation: none !important; opacity: 1 !important; transform: none !important; border-color: rgba(217,164,4,0.4) !important;
          }
        }
      `}</style>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#131316] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)]">
        <div className="flex items-center gap-2 border-b border-white/10 bg-[#18181B] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="ml-2 truncate rounded-md border border-white/10 bg-[#0F0F12] px-2.5 py-1 font-mono text-[11px] text-[#8B8B93]">
            certly.app/techfest-2026
          </span>
        </div>

        <div className="relative h-[280px] px-6 py-6 sm:h-[300px]">
          {current === "upload" && (
            <div key="upload" className="certgen-stepIn flex h-full items-center gap-6">
              <div className="certgen-droppulse relative flex h-full flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#D9A404]/40 bg-[#17140A]">
                <span className="certgen-labelin flex flex-col items-center">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="mb-2 text-[#D9A404]">
                    <path
                      d="M12 16V4M12 4l-4 4M12 4l4 4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[13px] text-[#9C9AA0]">techfest-certificate.pdf</span>
                </span>

                <div className="certgen-dropchip pointer-events-none absolute left-1/2 top-1/2 z-10 -ml-[70px] -mt-[14px] flex w-[140px] items-center gap-1.5 rounded-md border border-white/10 bg-[#1E1E22] px-2 py-1.5 text-[11px] text-[#EDEDEF] shadow-md">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#8B8B93]">
                    <path
                      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                  <span className="truncate">techfest-certificate.pdf</span>
                </div>
              </div>
              <div className="hidden shrink-0 sm:block">
                <CertificateDoc className="h-24 w-32" />
              </div>
            </div>
          )}

          {current === "recipients" && (
            <div key="recipients" className="certgen-stepIn flex h-full flex-col justify-center">
              <div className="flex items-center justify-between border-b border-white/10 px-2 pb-2 text-[12px] text-[#8B8B93]">
                <span>Name</span>
                <span>Email</span>
              </div>
              <div className="divide-y divide-white/10">
                {recipients.map((r, i) => (
                  <div
                    key={r.email}
                    className="certgen-rowIn flex items-center justify-between px-2 py-2.5 text-[13px] text-[#EDEDEF]"
                    style={{ animationDelay: `${i * 140}ms` }}
                  >
                    <span>{r.name}</span>
                    <span className="text-[#8B8B93]">{r.email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {current === "sending" && (
            <div key="sending" className="certgen-stepIn flex h-full flex-col justify-center">
              <div className="divide-y divide-white/10">
                {recipients.map((r, i) => {
                  const done = i < sent;
                  return (
                    <div key={r.email} className="flex items-center justify-between px-2 py-2.5 text-[13px]">
                      <span className={done ? "text-[#EDEDEF]" : "text-[#5C5A62]"}>{r.name}</span>
                      <span
                        className={`flex items-center gap-1.5 text-[12px] ${
                          done ? "text-[#2FBE6F]" : "text-[#5C5A62]"
                        }`}
                      >
                        {done ? "Sent" : "Queued"}
                        {done && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M5 13l4 4L19 7"
                              stroke="currentColor"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 px-2 text-[12px] text-[#8B8B93]">
                {sent} of {recipients.length} sent
              </div>
            </div>
          )}
        </div>
      </div>

      {current === "sending" && sent > 0 && (
        <div
          key={`toast-${sent}`}
          className="certgen-toastIn pointer-events-none absolute -right-3 -top-3 hidden rounded-lg border border-white/10 bg-[#1E1E22] px-3 py-2 text-[12px] text-[#EDEDEF] shadow-lg sm:block"
        >
          <span className="text-[#2FBE6F]">✓</span> Sent to{" "}
          {recipients[Math.min(sent, recipients.length) - 1].name.split(" ")[0]}
        </div>
      )}

      <div className="mt-3 flex justify-center gap-1.5">
        {screens.map((s, i) => (
          <button
            key={s}
            type="button"
            aria-label={`Show ${s} step`}
            onClick={() => setStep(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === step ? "w-5 bg-white" : "w-1.5 bg-white/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
