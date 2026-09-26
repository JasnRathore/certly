"use client";
/* eslint-disable shadcn/no-unknown-classes, shadcn/no-inline-styles */

import { useEffect, useState } from "react";
import { Safari } from "@/components/ui/safari";

const previews = [
  { label: "Certificate design", url: "certly.app/events/techfest/design", imageSrc: "/design.png" },
  { label: "Recipient list", url: "certly.app/events/techfest/recipients", imageSrc: "/recipients.png" },
  { label: "Send status", url: "certly.app/events/techfest/send", imageSrc: "/overview.png" },
];

export function WorkspacePreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePreview = previews[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % previews.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto mt-16 w-full max-w-[1120px] text-left">
      <div className="relative [perspective:1600px]">
        <div
          key={activePreview.imageSrc}
          className="workspace-preview-flip shadow-[0_35px_120px_rgba(0,0,0,0.7)]"
          aria-live="polite"
        >
          <Safari url={activePreview.url} imageSrc={activePreview.imageSrc} />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4 px-1">
        <p className="text-xs text-[#8f8f98]">
          <span className="text-[#ededf0]">{activePreview.label}</span>
          {" · "}Certly workspace
        </p>
        <div className="flex items-center gap-2">
          {previews.map((preview, index) => (
            <button
              type="button"
              key={preview.label}
              aria-label={`Show ${preview.label}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === activeIndex ? "w-8 bg-[#D9A404]" : "w-1.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
      <style jsx>{`
        .workspace-preview-flip {
          animation: workspace-flip 700ms cubic-bezier(0.22, 0.8, 0.24, 1) both;
          transform-origin: center center;
          backface-visibility: hidden;
        }

        @keyframes workspace-flip {
          0% {
            opacity: 0;
            transform: rotateY(-75deg) scale(0.94);
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: rotateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .workspace-preview-flip {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
