"use client";

import { useRef, type ReactNode } from "react";

export function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transformStyle: "preserve-3d", transition: "transform 200ms ease-out" }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `rotateY(${px * 14}deg) rotateX(${-py * 12}deg)`;
      }}
      onMouseLeave={() => {
        const el = ref.current;
        if (el) el.style.transform = "rotateY(0) rotateX(0)";
      }}
    >
      {children}
    </div>
  );
}
