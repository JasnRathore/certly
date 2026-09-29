"use client";

import { LiveOrb } from "@/components/ui/live-orb";

export function Mascot() {
  return (
    <div className="absolute right-5 top-[28rem] z-20 sm:right-10 sm:top-[30rem] lg:right-16 lg:top-[27rem]">
      <LiveOrb
        size={72}
        interactive
        blink
      />
    </div>
  );
}


export function Mascot2() {
  return (
    <span
      className="relative inline-block h-[0.82em] w-[0.55em] align-middle"
      aria-label="Certly mascot"
    >
      <LiveOrb
        size={76}
        className="absolute left-1/2 top-1/2 -translate-x-4/7 -translate-y-[50%] scale-75 sm:scale-90"
        interactive
        blink
      />
    </span>
  );
}
