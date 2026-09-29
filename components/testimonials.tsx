"use client";
/* eslint-disable shadcn/no-inline-styles, shadcn/no-arbitrary-values, shadcn/no-raw-colors */

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { MutedLinePattern } from "@/components/muted-line-pattern";

type Testimonial = {
  site: string;
  siteMark: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  pfpUrl?: string;
};

const testimonials: Testimonial[] = [
  {
    site: "Google",
    siteMark: "google",
    quote:
      "Certly turned our post-event certificate work from an evening of copying and pasting into a quick, simple workflow.",
    name: "Aarav Mehta",
    role: "Events Lead · University Club",
    initials: "AM",
    color: "#8b7cf6",
    pfpUrl: "https://api.dicebear.com/10.x/notionists/svg?seed=Ryan%20Christen"
  },
  {
    site: "X.com",
    siteMark: "x",
    quote:
      "We uploaded our design, matched the spreadsheet, and had every certificate ready to send in minutes. It is exactly what our team needed.",
    name: "Maya Shah",
    role: "Operations Lead · Student Society",
    initials: "MS",
    color: "#ff7a9e",
    pfpUrl: "https://i.pinimg.com/736x/d0/38/bd/d038bd46cae04f359697c9d657fb38db.jpg"
  },
  {
    site: "Google",
    siteMark: "google",
    quote:
      "The live send status gives us confidence that every participant receives the right certificate from our club account.",
    name: "Rohan Kapoor",
    role: "Secretary · College Club",
    initials: "RK",
    color: "#53c7bd",
    pfpUrl: "https://api.dicebear.com/10.x/gaze/svg?backgroundColor=16161a&seed=1vqlm7co"
  },
  {
    site: "X.com",
    siteMark: "x",
    quote:
      "Our volunteers can use Certly without a long handoff. The whole process feels clear from the first upload to the final email.",
    name: "Zoya Khan",
    role: "Community Manager · Student Network",
    initials: "ZK",
    color: "#f2b84b",
    pfpUrl: "https://api.dicebear.com/10.x/adventurer/svg?seed=synftg2k"
  },
];

function SiteMark({ type }: { type: string }) {
  if (type === "x") {
    return (
      <svg width="190" height="190" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.964 6.817H1.684l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
      </svg>
    );
  }

  return (
    <svg width="190" height="190" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.26Z" />
      <path fill="#34A853" d="M12 21.75c2.63 0 4.84-.87 6.45-2.37l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.75Z" />
      <path fill="#FBBC05" d="M6.54 13.83a5.86 5.86 0 0 1 0-3.66V7.64H3.3a9.75 9.75 0 0 0 0 8.72l3.24-2.53Z" />
      <path fill="#EA4335" d="M12 6.14c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.22 14.63 2.25 12 2.25a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53C7.31 7.86 9.46 6.14 12 6.14Z" />
    </svg>
  );
}

export function Testimonials() {
  const [startIndex, setStartIndex] = React.useState(0);

  const move = (direction: 1 | -1) => {
    setStartIndex((current) => (current + direction + testimonials.length) % testimonials.length);
  };

  const visibleTestimonials = [0, 1, 2].map(
    (offset) => testimonials[(startIndex + offset) % testimonials.length],
  );

  return (
    <section className="relative z-10 border-y border-white/[0.08] bg-[#0d0d0f] px-6 py-24 sm:py-28">
      <MutedLinePattern />
      <div className="relative mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-[#a9a2ff]">Testimonials</p>
            <h2 className="mt-6 text-4xl font-medium tracking-[-0.05em] text-[#f2f2f3] sm:text-6xl">
              People love us, you know.
            </h2>
          </div>
          <div className="hidden shrink-0 gap-3 sm:flex">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => move(-1)}
              className="grid size-12 place-items-center rounded-full border border-white/[0.18] text-2xl text-[#ededf0] transition-colors hover:bg-white hover:text-black"
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => move(1)}
              className="grid size-12 place-items-center rounded-full border border-white/[0.18] text-2xl text-[#ededf0] transition-colors hover:bg-white hover:text-black"
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </div>

        <div className="relative mt-14 min-h-[1090px] md:min-h-[360px]">
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={startIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 top-0 grid gap-4 md:grid-cols-3"
            >
              {visibleTestimonials.map((testimonial, index) => (
                <motion.article
                  key={testimonial.name}
                  initial={{
                    opacity: 0,
                    y: 20 + index * 4,
                    filter: "blur(8px)",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    y: 20 + index * 4,
                    filter: "blur(8px)",
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  }}
                  className="relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.12] bg-[#171718] p-7 shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
                >
                  <div>
                    <div
                      className="pointer-events-none absolute -bottom-12 -right-10 z-0 rotate-12 grayscale"
                      style={{ opacity: 0.025 }}
                      aria-hidden="true"
                    >
                      <SiteMark type={testimonial.siteMark} />
                    </div>
                    <p className="relative z-10 text-2xl leading-[1.35] tracking-[-0.025em] text-[#d6d6d9]">
                      {testimonial.quote}
                    </p>
                  </div>
                  <div className="mt-12 flex items-center gap-3">
                    <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full text-xs font-semibold text-black">
                      {testimonial.pfpUrl ? (
                        <span
                          className="grid size-full place-items-center"
                          style={{ background: testimonial.color }}
                        >
                        <Image
                          src={testimonial.pfpUrl}
                          alt={`${testimonial.name} profile picture`}
                          fill
                          unoptimized
                          sizes="40px"
                          className="object-cover"
                        />
                        </span>
                      ) : (
                        <span
                          className="grid size-full place-items-center"
                          style={{ background: testimonial.color }}
                        >
                          {testimonial.initials}
                        </span>
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#ededf0]">{testimonial.name}</p>
                      <p className="mt-0.5 text-sm text-[#8f8f98]">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex justify-end gap-3 sm:hidden">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => move(-1)}
            className="grid size-11 place-items-center rounded-full border border-white/[0.18] text-2xl text-[#ededf0] transition-colors hover:bg-white hover:text-black"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => move(1)}
            className="grid size-11 place-items-center rounded-full border border-white/[0.18] text-2xl text-[#ededf0] transition-colors hover:bg-white hover:text-black"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>
    </section>
  );
}
