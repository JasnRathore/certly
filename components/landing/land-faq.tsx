"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function LandFaq({
  items,
  className = "",
  buttonClassName = "",
  bodyClassName = "",
}: {
  items: { question: string; answer: string }[];
  className?: string;
  buttonClassName?: string;
  bodyClassName?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={className}>
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.question} className="border-b border-current/15">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : index)}
              className={`flex w-full items-center justify-between gap-4 py-4 text-left ${buttonClassName}`}
            >
              {item.question}
              <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className={`pb-4 text-sm leading-relaxed opacity-70 ${bodyClassName}`}>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
