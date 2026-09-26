import type { Metadata } from "next";
import { Archivo_Black, Outfit } from "next/font/google";
import { auth } from "@/auth";
import { FestLanding } from "@/components/landing/fest-landing";

const display = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-archivo" });
const body = Outfit({ subsets: ["latin"], weight: ["400", "600", "800"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Certly — Fest",
  description: "Loud, sticker-covered homepage for college fests and cultural clubs.",
};

export default async function FestPage() {
  const session = await auth();
  const signedIn = Boolean(session?.user);

  return (
    <div className={`${body.variable} ${display.variable}`}>
      <FestLanding
        cta={{
          signedIn,
          primaryHref: signedIn ? "/dashboard" : "/register",
          primaryLabel: signedIn ? "Open dashboard" : "Get started — ₹100",
        }}
      />
    </div>
  );
}
