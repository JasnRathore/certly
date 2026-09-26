import type { Metadata } from "next";
import Link from "next/link";
import { FileUp, Mail, Users } from "lucide-react";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "CertGen — Certificates, generated and sent",
  description: "Upload a template, add your recipients, and email every certificate from one place.",
};

function Mark() {
  return (
    <svg className="h-5 w-5 text-white" viewBox="0 0 76 65" fill="currentColor" aria-hidden="true">
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}

const features = [
  {
    icon: FileUp,
    title: "One template",
    body: "Upload the certificate PDF and place the name where it should print.",
  },
  {
    icon: Users,
    title: "A whole guest list",
    body: "Bring in names and emails from a spreadsheet, or add people one at a time.",
  },
  {
    icon: Mail,
    title: "Sent from your org",
    body: "Generate every file and email it with the Gmail account your team already uses.",
  },
];

const steps = [
  "Create an event and upload the certificate design.",
  "Add the people who should receive one.",
  "Generate the PDFs and send them in one pass.",
];

export default async function HomePage() {
  const session = await auth();
  const signedIn = Boolean(session?.user);
  const primaryHref = signedIn ? "/dashboard" : "/register";
  const primaryLabel = signedIn ? "Open dashboard" : "Get started";

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium">
          <Mark />
          CertGen
        </Link>
        <nav className="flex items-center gap-2">
          {signedIn ? (
            <Link
              href="/dashboard"
              className="inline-flex h-8 items-center rounded-md bg-white px-3 text-[13px] font-medium text-black hover:bg-[#eaeaea]"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-8 items-center rounded-md px-3 text-[13px] text-[#ededed] hover:bg-[#111]"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="inline-flex h-8 items-center rounded-md bg-white px-3 text-[13px] font-medium text-black hover:bg-[#eaeaea]"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-20">
        <section className="max-w-2xl py-16 sm:py-24">
          <p className="text-xs text-[#888]">For schools, events, and teams</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Certificates, generated and sent.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#888]">
            Upload the design once. Add every name. CertGen fills in the certificates and emails them for you.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Link
              href={primaryHref}
              className="inline-flex h-9 items-center rounded-md bg-white px-4 text-sm font-medium text-black hover:bg-[#eaeaea]"
            >
              {primaryLabel}
            </Link>
            {!signedIn && (
              <Link
                href="/login"
                className="inline-flex h-9 items-center rounded-md border border-[#333] px-4 text-sm text-white hover:bg-[#111]"
              >
                Log in
              </Link>
            )}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-lg border border-[#262626] bg-[#0a0a0a] p-4">
                <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-md border border-[#2a2a2a] bg-[#111]">
                  <Icon className="h-4 w-4 text-[#888]" />
                </div>
                <h2 className="text-sm font-medium">{feature.title}</h2>
                <p className="mt-1 text-[13px] leading-relaxed text-[#888]">{feature.body}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-4 overflow-hidden rounded-lg border border-[#262626] bg-[#0a0a0a]">
          <div className="border-b border-[#262626] px-4 py-3">
            <h2 className="text-sm font-medium">How it works</h2>
          </div>
          <ol className="divide-y divide-[#262626]">
            {steps.map((step, index) => (
              <li key={step} className="flex items-center gap-3 px-4 py-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[#2a2a2a] bg-[#111] font-mono text-[11px] text-[#888]">
                  {index + 1}
                </span>
                <span className="text-sm text-[#ededed]">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-4 flex flex-col gap-4 rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-sm font-medium">Ready for the next event?</h2>
            <p className="mt-1 text-[13px] text-[#888]">
              Create an account, then invite the people who help you run it.
            </p>
          </div>
          <Link
            href={primaryHref}
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-md bg-white px-3 text-[13px] font-medium text-black hover:bg-[#eaeaea]"
          >
            {primaryLabel}
          </Link>
        </section>
      </main>
    </div>
  );
}
