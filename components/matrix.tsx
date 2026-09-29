"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Frame = number[][];

interface MatrixProps extends React.HTMLAttributes<HTMLDivElement> {
  rows: number;
  cols: number;
  frames?: Frame[];
  fps?: number;
  size?: number;
  gap?: number;
  brightness?: number;
  palette?: {
    on: string;
    off: string;
  };
}

function clamp(value: number) {
  const clamped = Math.max(0, Math.min(1, value));
  return Math.round(clamped * 10000) / 10000;
}

function createPatternFrames(
  rows: number,
  cols: number,
  count: number,
  timeStep = 0.025,
): Frame[] {
  return Array.from({ length: count }, (_, frameIndex) =>
    Array.from({ length: rows }, (_, row) =>
      Array.from({ length: cols }, (_, col) => {
        const x = col / Math.max(cols - 1, 1);
        const y = row / Math.max(rows - 1, 1);
        const time = frameIndex * timeStep;

        const diagonal =
          Math.exp(-Math.abs(y - ((x + time * 0.16) % 1)) * 34) * 0.9;
        const reverseDiagonal =
          Math.exp(-Math.abs(y - (1 - ((x - time * 0.11 + 1) % 1))) * 42) * 0.7;

        const centerX = 0.5 + Math.sin(time * 1.3) * 0.28;
        const centerY = 0.5 + Math.cos(time * 0.9) * 0.2;
        const distance = Math.hypot(x - centerX, y - centerY);
        const ring = Math.exp(-Math.abs(distance - (0.16 + (time * 0.08) % 0.3)) * 55) * 0.85;

        const shimmer =
          (Math.sin(x * 42 + y * 19 + time * 4) + 1) / 2 * 0.18;
        const edgeFade = 0.45 + (1 - Math.abs(y - 0.5) * 1.4) * 0.55;

        return clamp((diagonal + reverseDiagonal + ring + shimmer) * edgeFade);
      }),
    ),
  );
}

function useMatrixFrame(frames: Frame[], fps: number) {
  const [frameIndex, setFrameIndex] = useState(0);
  useEffect(() => {
    const interval = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % frames.length);
    }, 1000 / fps);

    return () => window.clearInterval(interval);
  }, [frames.length, fps]);

  return frames[frameIndex] ?? frames[0];
}

export function Matrix({
  rows,
  cols,
  frames,
  fps = 24,
  size = 8,
  gap = 5,
  brightness = 1.35,
  palette = {
    on: "rgba(255, 92, 112, 0.95)",
    off: "rgba(255, 255, 255, 0.22)",
  },
  className,
  ...props
}: MatrixProps) {
  const resolvedFrames = useMemo(
    () => frames ?? createPatternFrames(rows, cols, 240),
    [cols, frames, rows],
  );
  const frame = useMatrixFrame(resolvedFrames, fps);
  const width = cols * (size + gap) - gap;
  const height = rows * (size + gap) - gap;

  const cells = useMemo(
    () =>
      frame.flatMap((row, rowIndex) =>
        row.map((value, colIndex) => ({
          value: clamp(value * brightness),
          x: colIndex * (size + gap) + size / 2,
          y: rowIndex * (size + gap) + size / 2,
        })),
      ),
    [brightness, frame, gap, size],
  );

  return (
    <div
      aria-hidden="true"
      className={cn("relative block h-full w-full", className)}
      {...props}
    >
      <svg
        className="block h-full w-full"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        {cells.map((cell, index) => (
          <circle
            key={index}
            cx={cell.x}
            cy={cell.y}
            r={size * 0.38}
            fill={cell.value > 0.02 ? palette.on : palette.off}
            opacity={cell.value > 0.02 ? cell.value : 0.55}
          />
        ))}
      </svg>
    </div>
  );
}

export function MatrixBackground({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative isolate min-h-screen w-full overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-0 bg-[#09090a]">
        <Matrix rows={24} cols={48} className="absolute inset-0 opacity-100" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_46%,#09090a_70%)]" />
      </div>
      {children}
    </div>
  );
}
