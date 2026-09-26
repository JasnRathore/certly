"use client";

import { useEffect, useRef } from "react";
import { CertificateSeal } from "./certificate-seal";

function RibbonSwirl({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 600" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M40 460 C160 320, 260 560, 400 400 C500 290, 420 120, 560 60"
        stroke="#B3121B"
        strokeWidth="90"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function ScrollBackdrop() {
  const sealRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let raf = 0;

    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;

      if (sealRef.current) {
        sealRef.current.style.transform = `translate3d(0, ${progress * -140}px, 0) rotate(${progress * 90}deg) scale(${1 + progress * 0.15})`;
      }
      if (ribbonRef.current) {
        ribbonRef.current.style.transform = `translate3d(${progress * 70}px, ${progress * 240 - 60}px, 0) rotate(${-progress * 35}deg)`;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div ref={sealRef} className="absolute -right-32 top-16 opacity-[0.08]">
        <CertificateSeal className="h-[420px] w-[420px]" />
      </div>
      <div ref={ribbonRef} className="absolute -left-40 top-1/3 opacity-[0.07]">
        <RibbonSwirl className="h-[520px] w-[520px]" />
      </div>
    </div>
  );
}
