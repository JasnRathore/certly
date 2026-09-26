"use client";
/* eslint-disable shadcn/no-arbitrary-values */

import Link from "next/link";
import {
  Dock,
  DockIcon,
  DockLink,
} from "@/components/dock";

function HomeIcon() {
  return (
    <svg
      className="text-white group-hover:text-black"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.25 8H6.75V19.5H17.25V8H18.75V18.75C18.75 19.99 17.74 21 16.5 21H7.5C6.26 21 5.25 19.99 5.25 18.75L5.25 8Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.72 3.73C11.49 3.19 12.51 3.19 13.28 3.73L22.04 9.81L21.19 11.04L12 4.66L2.81 11.04L1.96 9.81L10.72 3.73Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CertlyHeader({ signedIn }: { signedIn: boolean }) {
  return (
    <header className="relative z-50">
      <Dock placement="top" activePage="/">
        <DockIcon icon={<HomeIcon />} href="/" />
        <DockLink label="How it works" href="#how-it-works" />
        <DockLink label="Features" href="#features" />
        <DockLink label="FAQ" href="#faq" />
        <DockLink
          label={signedIn ? "Dashboard" : "Log in"}
          href={signedIn ? "/dashboard" : "/login"}
        />
        <DockLink
          label={signedIn ? "Account" : "Get started"}
          href={signedIn ? "/settings" : "/register"}
        />
      </Dock>
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:hidden">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium">
          <span className="grid h-5 w-5 place-items-center rounded bg-[#D9A404] text-[10px] font-bold text-[#1A1400]">C</span>
          Certly
        </Link>
        <Link href={signedIn ? "/dashboard" : "/register"} className="text-xs text-[#EDEDEF]">
          {signedIn ? "Dashboard" : "Get started"}
        </Link>
      </div>
    </header>
  );
}
