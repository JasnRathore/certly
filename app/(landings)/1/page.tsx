import type { Metadata } from "next";
import { Archivo_Black, Outfit } from "next/font/google";
import { auth } from "@/auth";
import { CarnivalLanding } from "@/components/landing/carnival-landing";

const display = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-archivo" });
const body = Outfit({ subsets: ["latin"], weight: ["400", "600", "800"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Certly — Carnival",
  description: "Fest-style homepage with an animated carnival backdrop for college clubs sending certificates.",
};

export default async function CarnivalPage() {
  const session = await auth();
  const signedIn = Boolean(session?.user);

  return (
    <div className={`${body.variable} ${display.variable}`}>
      <CarnivalLanding
        cta={{
          signedIn,
          primaryHref: signedIn ? "/dashboard" : "/register",
          primaryLabel: signedIn ? "Open dashboard" : "Pay ₹100 · send tonight",
        }}
      />
    </div>
  );
}
