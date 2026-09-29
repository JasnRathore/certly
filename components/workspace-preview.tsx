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
      <div className="workspace-carousel relative aspect-[1203/728] [perspective:1600px]" aria-live="polite">
        {previews.map((preview, index) => {
          const offset = (index - activeIndex + previews.length) % previews.length;
          const position = offset === 0 ? "center" : offset === 1 ? "right" : "left";

          return (
            <button
              type="button"
              key={preview.imageSrc}
              aria-label={`Show ${preview.label}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={`workspace-carousel-card workspace-carousel-${position} ${
                position === "center" ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <Safari url={preview.url} imageSrc={preview.imageSrc} />
            </button>
          );
        })}
      </div>
      <style jsx>{`
        .workspace-carousel-card {
          position: absolute;
          left: 50%;
          top: 0;
          width: 100%;
          transform-origin: center center;
          transition:
            transform 800ms cubic-bezier(0.22, 0.8, 0.24, 1),
            opacity 800ms ease,
            filter 800ms ease;
        }

        .workspace-carousel-center {
          z-index: 3;
          opacity: 1;
          transform: translateX(-50%) translateZ(40px) scale(1);
          filter: none;
        }

        .workspace-carousel-left,
        .workspace-carousel-right {
          z-index: 1;
          opacity: 0.62;
          filter: saturate(0.75) brightness(0.72);
        }

        .workspace-carousel-left {
          transform: translateX(-89%) translateZ(-80px) rotateY(7deg) scale(0.76);
        }

        .workspace-carousel-right {
          transform: translateX(-11%) translateZ(-80px) rotateY(-7deg) scale(0.76);
        }

        @media (prefers-reduced-motion: reduce) {
          .workspace-carousel-card {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
