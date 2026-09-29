"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const tabs = [
  { section: "settings", label: "General" },
  { section: "members", label: "Members" },
];

export function SettingsTabs() {
  const searchParams = useSearchParams();
  const activeSection = searchParams.get("section") ?? "settings";

  return (
    <div className="flex gap-1">
      {tabs.map((tab) => {
        const active = tab.section === activeSection;
        return (
          <Link
            key={tab.section}
            href={`/dashboard?section=${tab.section}`}
            className={`inline-flex h-8 items-center rounded-md px-3 text-[13px] transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
