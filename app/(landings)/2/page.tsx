import type { Metadata } from "next";
import { auth } from "@/auth";
import { MakerLanding } from "@/components/landing/maker-landing";

export const metadata: Metadata = {
  title: "Certly — Online Certificate Maker",
  description:
    "Generate beautiful certificates and email the whole guest list. ₹100 once, for college fests, hackathons and school clubs.",
};

export default async function MakerPage() {
  const session = await auth();
  const signedIn = Boolean(session?.user);

  return (
    <MakerLanding
      cta={{
        signedIn,
        primaryHref: signedIn ? "/dashboard" : "/register",
        primaryLabel: signedIn ? "Open dashboard" : "Create an event",
      }}
    />
  );
}
