"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimationControls, useInView, useReducedMotion } from "motion/react";

const pathVariants = {
  hidden: { pathLength: 0 },
  visible: { pathLength: 1 },
};

export function MutedLinePattern() {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { amount: 0.15 });
  const controls = useAnimationControls();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      controls.set("visible");
    } else if (isInView) {
      void controls.start("visible");
    } else {
      controls.set("hidden");
    }
  }, [controls, isInView, prefersReducedMotion]);

  return (
    <motion.svg
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full text-[#b7c9c7] opacity-[0.025]"
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      initial="hidden"
      animate={controls}
    >
      <motion.g
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="26"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.35 } },
        }}
      >
        <motion.path
          d="M90 -80C80 70 245 145 390 92C540 38 498 -95 390 -112C266 -132 205 14 258 155C317 312 501 319 594 217C681 121 630 -12 542 -10C452 -8 413 104 473 218C555 376 737 422 839 322C938 224 908 82 809 41C715 2 649 79 688 192C747 364 951 457 1101 369C1203 309 1228 177 1161 95"
          variants={pathVariants}
          transition={{ duration: prefersReducedMotion ? 0 : 2.4, ease: "easeInOut" }}
        />
        <motion.path
          d="M-92 310C30 193 153 166 225 237C299 311 219 440 107 452C-15 465 -45 583 40 658C143 750 333 674 362 553C394 418 263 334 155 368C47 402 -22 510 18 607C64 719 209 775 328 731"
          variants={pathVariants}
          transition={{ duration: prefersReducedMotion ? 0 : 2.4, ease: "easeInOut" }}
        />
        <motion.path
          d="M410 742C489 625 625 566 699 462C771 361 733 278 654 279C571 280 526 362 564 452C618 580 779 616 886 535C1019 434 1017 299 943 264C864 226 803 300 830 404C868 552 1020 637 1148 586C1246 547 1285 443 1254 370"
          variants={pathVariants}
          transition={{ duration: prefersReducedMotion ? 0 : 2.4, ease: "easeInOut" }}
        />
      </motion.g>
    </motion.svg>
  );
}
