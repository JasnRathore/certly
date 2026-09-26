"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-white/10 overflow-hidden rounded-lg border border-white/10 bg-[#131316]">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm text-[#EDEDEF] hover:bg-white/5"
            >
              {item.question}
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-[#8B8B93] transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 text-[13px] leading-relaxed text-[#9C9AA0]">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
