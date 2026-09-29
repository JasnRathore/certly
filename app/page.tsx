import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image"
import { CertlyHeader } from "@/components/certly-header";
import { TiltCard, type TiltCardProps } from "@/components/unlumen-ui/tilt-card";
import { WorkspacePreview } from "@/components/workspace-preview";
import { AuroraBars } from "@/components/aurora-bars";
import { ScrollReveal } from "@/components/scroll-reveal";
import { MotionAccordion } from "@/components/motion-accordion";
import { Testimonials } from "@/components/testimonials";
import { Mascot2 } from "@/components/mascot";
import { CertlyLogo } from "@/components/certly-logo";
import { auth } from "@/auth";
import { ChevronRight, Mail, ShieldCheck, UsersRound } from 'lucide-react';
export const metadata: Metadata = {
  title: "Certly Certificates, generated and sent",
  description: "Upload a template, add your recipients, and email every certificate from one place.",
};

function FeatureCard({
  eyebrow,
  title,
  description,
  imageSrc,
  badgeVariant = "success",
}: {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  badgeVariant?: NonNullable<TiltCardProps["badgeVariant"]>;
}) {
  return (
    <TiltCard
      title={title}
      description={description}
      price="Free"
      badgeLabel={eyebrow}
      badgeVariant={badgeVariant}
      imageSrc={imageSrc}
      imageAlt={`${title} Certly preview`}
      href="#how-it-works"
      tiltProps={{ rotationFactor: 9 }}
      className="bg-[#131316] text-[#ededf0] shadow-[0_18px_45px_rgba(0,0,0,0.2)]"
    />
  );
}

export default async function MainStagePage() {
  const session = await auth();
  return (
    <main className="min-h-screen overflow-hidden bg-[#080809] text-[#ededed] [font-family:Arial,Helvetica,sans-serif]">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-60">
        <AuroraBars
          barCount={24}
          colors={["#ffd6df", "#ff9aa8", "#ff5c70", "#ef233c", "#150307"]}
          speed={1.2}
          gap={2}
          blur={0.6}
        />
      </div>
      <CertlyHeader signedIn={Boolean(session?.user)} />

      <section className="relative z-10 px-6 pb-8 pt-20 text-center lg:pt-28">
        <h1 className="mx-auto max-w-6xl text-5xl font-medium leading-[1.02] tracking-[-0.065em] text-[#f5f5f6] sm:text-7xl lg:text-[92px]">
          <span className="block">Every certificate from</span>
          <span className="block">
            your event, in every{" "}
            <span className="whitespace-nowrap">inb <Mascot2 />x</span>
          </span>
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-base leading-7 text-[#95959e] sm:text-lg">
          Upload your design, import a guest list, and send polished certificates from your club Gmail in minutes.
        </p>
        <div className="mt-9 flex justify-center gap-3">
          <Link className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-[#171719] hover:bg-[#e7e7e9]" href="/register">Create certificates</Link>
          <Link className="rounded-lg border border-white/[0.16] px-5 py-3 text-sm font-medium text-[#d4d4d8] hover:bg-white/[0.06]" href="#how-it-works">See how it works</Link>
        </div>
        <WorkspacePreview />
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-6xl px-6 py-32 text-center">
        <ScrollReveal>
          <p className="text-sm text-[#8b7cf6]">Made for college and school clubs</p>
          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-medium tracking-[-0.04em] text-[#e8e8eb] sm:text-5xl">The fastest way to finish the certificate backlog.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#8f8f98]">
            No mail merge, no late-night PDF exports, and no per-certificate charge. Certly handles the repetitive work so your team can run the event.
          </p>
          <div className="mx-auto mt-16 grid w-full max-w-6xl gap-6 text-left md:grid-cols-2">
            <ScrollReveal transition={{ duration: 0.65, delay: 0.05 }} className="w-full"><FeatureCard eyebrow="Upload once" title="Use the design you already made" description="Drop in your club&apos;s certificate artwork and place the name, event, and date fields without learning a design tool." imageSrc="/design2.png" /></ScrollReveal>
            <ScrollReveal transition={{ duration: 0.65, delay: 0.15 }} className="w-full"><FeatureCard eyebrow="Import a list" title="Bring names and emails together" description="Upload a spreadsheet, match the columns, and check your recipients before anything is sent." imageSrc="/recipients.png" /></ScrollReveal>
            <ScrollReveal transition={{ duration: 0.65, delay: 0.25 }} className="w-full md:col-span-2 md:mx-auto md:w-1/2"><FeatureCard eyebrow="Send in one pass" title="PDFs in every inbox" description="Generate personalised PDFs and send them from your organisation&apos;s Gmail with clear sent and queued status." imageSrc="/overview.png" /></ScrollReveal>
          </div>
        </ScrollReveal>
      </section>

      <section id="how-it-works" className="relative z-10 border-y border-white/[0.08] bg-[#0d0d0f] px-6 py-28">
        <ScrollReveal className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-[#8b7cf6]">01 · Upload your design</p>
            <h2 className="mt-5 text-4xl font-medium tracking-[-0.05em] text-[#ededf0] sm:text-6xl">Start with the certificate your club already loves.</h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#8f8f98]">Upload a PNG or PDF, then tell Certly where the recipient name belongs. Your event branding stays yours.</p>
            <Link className="mt-8 flex flex-row items-center gap-2 text-sm font-medium text-[#a69dff] hover:text-white underline" href="/register">Create a free account  <ChevronRight /> <span aria-hidden> </span></Link>
          </div>
          <ScrollReveal className="rounded-2xl border border-white/[0.1] bg-[#18181b] overflow-hidden shadow-2xl">
            <Image src="/design2.png" alt="overview.png" width={1280} height={720}></Image>
          </ScrollReveal>
        </ScrollReveal>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-32">
        <ScrollReveal className="grid gap-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-[#8b7cf6]">02 · Import the list</p>
            <h2 className="mt-5 text-4xl font-medium tracking-[-0.05em] text-[#ededf0] sm:text-6xl">One spreadsheet. Every participant.</h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#8f8f98]">Names and email addresses line up before the send. Catch duplicates, verify the count, and keep the event team in control.</p>
          </div>
          <ScrollReveal className="rounded-2xl border border-white/[0.1] bg-[#141416] overflow-hidden">
            <Image src="/recipients2.png" alt="overview.png" width={965} height={447}></Image>
          </ScrollReveal>
        </ScrollReveal>
      </section>

      <section className="relative z-10 border-y border-white/[0.08] bg-[#0d0d0f] px-6 py-32 text-center">
        <ScrollReveal>
          <p className="text-sm font-medium text-[#8b7cf6]">03 · Send without the all-nighter</p>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-medium tracking-[-0.05em] text-[#ededf0] sm:text-6xl">Certificates delivered while the event is still fresh.</h2>
          <div className="mx-auto mt-14 grid w-full max-w-6xl gap-6 text-left md:grid-cols-2">
            <ScrollReveal transition={{ duration: 0.65, delay: 0.05 }} className="w-full"><FeatureCard eyebrow="Live status" title="Know what went out" description="See every recipient move from queued to sent instead of watching one mystery spinner." imageSrc="/recipients.png" /></ScrollReveal>
            <ScrollReveal transition={{ duration: 0.65, delay: 0.15 }} className="w-full"><FeatureCard eyebrow="Club Gmail" title="Send from an address people trust" description="Connect the organisation&apos;s Gmail so certificates arrive from the account participants recognise." imageSrc="/design.png" /></ScrollReveal>
            <ScrollReveal transition={{ duration: 0.65, delay: 0.25 }} className="w-full md:col-span-2 md:mx-auto md:w-1/2"><FeatureCard eyebrow="No per-certificate fee" title="Free for every club" description="Run a 20-person workshop or a 2,000-person fest without watching a usage meter." imageSrc="/overview.png" badgeVariant="warning" /></ScrollReveal>
          </div>
        </ScrollReveal>
      </section>

      <section id="team" className="relative z-10 border-b border-white/[0.08] px-6 py-28">
        <ScrollReveal className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-[#8b7cf6]">04 · Bring your team along</p>
            <h2 className="mt-5 max-w-xl text-4xl font-medium tracking-[-0.05em] text-[#ededf0] sm:text-6xl">
              Your club, organised around one shared workspace.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#8f8f98]">
              Create an organisation for your club, invite teammates by email, and keep your people and events together even when the committee changes.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#111113] shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
            <Image
              src="/members2.png"
              alt="Certly organisation members page showing team roles and email invitations"
              width={1920}
              height={1080}
              className="h-auto w-full"
            />
          </div>
        </ScrollReveal>
      </section>

      <Testimonials />

      <section id="faq" className="relative z-10 w-full border-y border-white/[0.08] px-6 py-28">
        <ScrollReveal>
          <p className="text-center text-sm font-medium text-[#8b7cf6]">Questions, answered</p>
          <MotionAccordion
            className="mx-auto mt-10 max-w-3xl"
            items={[
              {
                question: "Is Certly free?",
                answer: "Yes. There is no card, trial, yearly fee, or per-certificate charge for clubs.",
              },
              {
                question: "What do I need to get started?",
                answer: "Your certificate design and a spreadsheet containing each recipient's name and email address.",
              },
              {
                question: "Can I send from our club Gmail?",
                answer: "Yes. Connect your organisation's Gmail and certificates are delivered from an address participants recognise.",
              },
            ]}
          />
        </ScrollReveal>
      </section>

      <footer className="relative z-10 w-full border-t border-white/[0.1] bg-[#0d0d0f]">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CertlyLogo className="h-7 w-7 rounded-md" />
            <span className="text-sm font-semibold text-[#ededf0]">Certly</span>
            <span className="hidden text-sm text-[#62626a] sm:inline">Certificates, generated and sent.</span>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#8f8f98]" aria-label="Footer navigation">
            <Link href="#how-it-works" className="transition-colors hover:text-white">How it works</Link>
            <Link href="#features" className="transition-colors hover:text-white">Features</Link>
            <Link href="#faq" className="transition-colors hover:text-white">FAQ</Link>
            <Link href="/login" className="transition-colors hover:text-white">Log in</Link>
            <Link href="/register" className="transition-colors hover:text-white">Get started</Link>
          </nav>
        </div>
        <p className="border-t border-white/[0.06] px-6 py-4 text-center text-xs text-[#62626a]">© 2026 Certly. Free for college and school clubs.</p>
      </footer>
    </main>
  );
}
