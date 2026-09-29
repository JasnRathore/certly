"use client";
/* eslint-disable shadcn/no-inline-styles, shadcn/no-arbitrary-values */

import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

export interface MotionAccordionItem {
  question: React.ReactNode;
  answer: React.ReactNode;
}

export interface MotionAccordionProps {
  items: MotionAccordionItem[];
  gap?: number;
  className?: string;
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
  itemId,
  panelId,
}: {
  item: MotionAccordionItem;
  isOpen: boolean;
  onToggle: () => void;
  itemId: string;
  panelId: string;
}) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = React.useState(0);

  React.useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      setContentHeight(element.scrollHeight);
    });

    resizeObserver.observe(element);
    setContentHeight(element.scrollHeight);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <motion.div
      layout
      initial={false}
      animate={{ scale: isOpen ? 1 : 0.985 }}
      transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.9 }}
      className="overflow-hidden rounded-[24px] border border-white/[0.12] bg-[#141416] text-[#ededf0] shadow-[0_12px_35px_rgba(0,0,0,0.18)]"
      style={{ originX: 0.5, originY: 0 }}
    >
      <button
        id={itemId}
        type="button"
        aria-controls={panelId}
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex w-full cursor-pointer select-none items-center justify-between gap-4 px-6 py-5 text-left sm:px-7"
      >
        <span className="text-base font-medium leading-snug sm:text-lg">
          {item.question}
        </span>
        <motion.span
          aria-hidden="true"
          initial={false}
          animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 480, damping: 28 }}
          className="inline-flex size-10 shrink-0 items-center justify-center text-[#ededf0]"
        >
          {isOpen ? (
            <svg width="14" height="14" viewBox="0 0 14 2" fill="none">
              <path d="M1 1h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          )}
        </motion.span>
      </button>

      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={itemId}
        initial={false}
        animate={{ height: isOpen ? contentHeight : 0, opacity: isOpen ? 1 : 0 }}
        transition={{
          height: { type: "spring", stiffness: 340, damping: 34, mass: 0.9 },
          opacity: { duration: 0.2, ease: "easeOut" },
        }}
        style={{ overflow: "hidden" }}
      >
        <motion.div
          ref={contentRef}
          animate={{ y: isOpen ? 0 : -8 }}
          transition={{ type: "spring", stiffness: 360, damping: 30, mass: 0.8 }}
          className="px-6 pb-6 sm:px-7 sm:pb-7"
        >
          <p className="text-sm leading-7 text-[#a7a7b0] sm:text-base">
            {item.answer}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function MotionAccordion({
  items,
  gap = 10,
  className,
}: MotionAccordionProps) {
  const rawId = React.useId();
  const baseId = `accordion-${rawId.replace(/:/g, "")}`;
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col" style={{ gap }}>
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex((previous) => (previous === index ? null : index))}
            itemId={`${baseId}-trigger-${index}`}
            panelId={`${baseId}-panel-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
