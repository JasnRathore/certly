"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { looks } from "@/lib/landing";

export function LooksSwitcher({ tone = "dark" }: { tone?: "dark" | "light" | "ink" }) {
  const pathname = usePathname();
  const palettes = {
    dark: {
      bar: "border-white/15 bg-black/70 text-white",
      active: "bg-white/15 font-semibold",
    },
    light: {
      bar: "border-black/10 bg-white/80 text-black",
      active: "bg-black/10 font-semibold",
    },
    ink: {
      bar: "border-[#1a1208]/15 bg-[#f4ead7]/90 text-[#1a1208]",
      active: "bg-[#1a1208]/10 font-semibold",
    },
  } as const;

  return (
    <nav
      aria-label="Homepage looks"
      className={`fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border px-1.5 py-1.5 text-[11px] shadow-lg backdrop-blur-md sm:bottom-6 ${palettes[tone].bar}`}
    >
      {looks.map((look) => {
        const active = pathname === look.href;
        return (
          <Link
            key={look.href}
            href={look.href}
            className={`rounded-full px-2.5 py-1.5 transition-colors sm:px-3 ${
              active ? palettes[tone].active : "opacity-70 hover:opacity-100"
            }`}
          >
            <span className="font-mono">{look.label}</span>
            <span className="ml-1 hidden sm:inline">{look.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
