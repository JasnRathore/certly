"use client";

/* eslint-disable shadcn/no-inline-styles, shadcn/no-arbitrary-values */

import * as React from "react";
import { motion, useAnimationFrame } from "motion/react";
import { cn } from "@/lib/utils";

export interface AuroraBarsProps {
  barCount?: number;
  colors?: string[];
  maxHeightRatio?: number;
  minHeightRatio?: number;
  speed?: number;
  gap?: number;
  blur?: number;
  background?: string;
  className?: string;
}

function barHeight(
  index: number,
  total: number,
  time: number,
  minHeight: number,
  maxHeight: number,
) {
  const normalized = index / (total - 1);
  const arch = Math.sin(normalized * Math.PI);
  const phaseOne = (index / total) * Math.PI * 2;
  const phaseTwo = (index / total) * Math.PI * 5.3;
  const wave =
    0.5 +
    0.25 * Math.sin(time * 1.1 + phaseOne) +
    0.25 * Math.sin(time * 0.7 + phaseTwo);

  return minHeight + (arch * 0.65 + wave * 0.35) * (maxHeight - minHeight);
}

export function AuroraBars({
  barCount = 24,
  colors = ["#ffd6df", "#ff9aa8", "#ff5c70", "#ef233c", "#150307"],
  maxHeightRatio = 0.92,
  minHeightRatio = 0.18,
  speed = 0.5,
  gap = 0,
  blur = 0,
  background = "#080809",
  className,
}: AuroraBarsProps) {
  const [heights, setHeights] = React.useState<number[]>(() =>
    Array.from({ length: barCount }, (_, index) =>
      barHeight(index, barCount, 0, minHeightRatio, maxHeightRatio),
    ),
  );
  const timeRef = React.useRef(0);
  const gradient = `linear-gradient(to top, ${colors
    .map((color, index) => `${color} ${Math.round((index / (colors.length - 1)) * 100)}%`)
    .join(", ")})`;

  useAnimationFrame((_, delta) => {
    timeRef.current += (delta / 1000) * speed;
    setHeights(
      Array.from({ length: barCount }, (_, index) =>
        barHeight(index, barCount, timeRef.current, minHeightRatio, maxHeightRatio),
      ),
    );
  });

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)} style={{ background }}>
      <div className="absolute inset-0 flex items-end">
        {heights.map((height, index) => (
          <div
            className="flex-1"
            key={index}
            style={{
              height: "100%",
              display: "flex",
              alignItems: "flex-end",
              padding: `0 ${gap / 2}px`,
            }}
          >
            <motion.div
                className="will-change-[height]"
              style={{
                width: "100%",
                height: `${height * 100}%`,
                background: gradient,
                borderRadius: "9999px 9999px 0 0",
                filter: `blur(${blur}px)`,
                opacity: 0.85,
              }}
            />
          </div>
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 100%, transparent 40%, #080809cc 100%)",
        }}
      />
    </div>
  );
}
