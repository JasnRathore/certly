"use client";

import { motion, type MotionProps } from "motion/react";

type ScrollRevealProps = MotionProps & {
  children: React.ReactNode;
  className?: string;
};

export function ScrollReveal({
  children,
  className,
  ...motionProps
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      {...motionProps}
      className={className}
    >
      {children}
    </motion.div>
  );
}
