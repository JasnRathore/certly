import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image"
import { CertlyHeader } from "@/components/certly-header";
import { TiltCard, type TiltCardProps } from "@/components/unlumen-ui/tilt-card";
import { Safari } from "@/components/ui/safari";
export const metadata: Metadata = {
  title: "Certly Certificates, generated and sent",
  description: "Upload a template, add your recipients, and email every certificate from one place.",
};

function WorkspacePreview() {
  return (
    <div className="mx-auto mt-16 w-full max-w-[1120px] text-left shadow-[0_35px_120px_rgba(0,0,0,0.7)]">
      <Safari url="certly.app/dashboard" imageSrc="/design.png" />
    </div>
  );
}

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

export default function MainStagePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080809] text-[#ededed] [font-family:Arial,Helvetica,sans-serif]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(94,106,210,0.13),transparent_34%)]" />
      <CertlyHeader signedIn={false} />

      <section className="relative z-10 px-6 pb-8 pt-20 text-center lg:pt-28">
        <p className="mb-7 text-sm font-medium text-[#8b7cf6]">Certificates, generated and sent</p>
        <h1 className="mx-auto max-w-4xl text-5xl font-medium leading-[1.02] tracking-[-0.065em] text-[#f5f5f6] sm:text-7xl lg:text-[92px]">
          Every certificate from your event, in every inbox
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

      <section id="features" className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center">
        <p className="text-sm text-[#8b7cf6]">Made for college and school clubs</p>
        <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-medium tracking-[-0.04em] text-[#e8e8eb] sm:text-5xl">The fastest way to finish the certificate backlog.</h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#8f8f98]">
          No mail merge, no late-night PDF exports, and no per-certificate charge. Certly handles the repetitive work so your team can run the event.
        </p>
        <div className="mx-auto mt-16 grid w-full max-w-3xl gap-6 text-left md:grid-cols-2">
          <div className="w-full"><FeatureCard eyebrow="Upload once" title="Use the design you already made" description="Drop in your club&apos;s certificate artwork and place the name, event, and date fields without learning a design tool." imageSrc="/design2.png" /></div>
          <div className="w-full"><FeatureCard eyebrow="Import a list" title="Bring names and emails together" description="Upload a spreadsheet, match the columns, and check your recipients before anything is sent." imageSrc="/recipients2.png" /></div>
          <div className="w-full md:col-span-2 md:mx-auto md:w-1/2"><FeatureCard eyebrow="Send in one pass" title="PDFs in every inbox" description="Generate personalised PDFs and send them from your organisation&apos;s Gmail with clear sent and queued status." imageSrc="/overview.png" /></div>
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 border-y border-white/[0.08] bg-[#0d0d0f] px-6 py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-[#8b7cf6]">01 · Upload your design</p>
            <h2 className="mt-5 text-4xl font-medium tracking-[-0.05em] text-[#ededf0] sm:text-6xl">Start with the certificate your club already loves.</h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#8f8f98]">Upload a PNG or PDF, then tell Certly where the recipient name belongs. Your event branding stays yours.</p>
            <Link className="mt-8 inline-block text-sm font-medium text-[#a69dff] hover:text-white" href="/register">Create a free account <span aria-hidden>→</span></Link>
          </div>
          <div className="rounded-2xl border border-white/[0.1] bg-[#18181b] overflow-hidden shadow-2xl">
            <Image src="/design2.png" alt="overview.png" width={1280} height={720}></Image>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-32">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-[#8b7cf6]">02 · Import the list</p>
            <h2 className="mt-5 text-4xl font-medium tracking-[-0.05em] text-[#ededf0] sm:text-6xl">One spreadsheet. Every participant.</h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#8f8f98]">Names and email addresses line up before the send. Catch duplicates, verify the count, and keep the event team in control.</p>
          </div>
          <div className="rounded-2xl border border-white/[0.1] bg-[#141416] overflow-hidden">
            <Image src="/recipients2.png" alt="overview.png" width={965} height={447}></Image>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-white/[0.08] bg-[#0d0d0f] px-6 py-32 text-center">
        <p className="text-sm font-medium text-[#8b7cf6]">03 · Send without the all-nighter</p>
        <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-medium tracking-[-0.05em] text-[#ededf0] sm:text-6xl">Certificates delivered while the event is still fresh.</h2>
        <div className="mx-auto mt-14 grid w-full max-w-3xl gap-6 text-left md:grid-cols-2">
          <div className="w-full"><FeatureCard eyebrow="Live status" title="Know what went out" description="See every recipient move from queued to sent instead of watching one mystery spinner." imageSrc="/recipients.png" /></div>
          <div className="w-full"><FeatureCard eyebrow="Club Gmail" title="Send from an address people trust" description="Connect the organisation&apos;s Gmail so certificates arrive from the account participants recognise." imageSrc="/design.png" /></div>
          <div className="w-full md:col-span-2 md:mx-auto md:w-1/2"><FeatureCard eyebrow="No per-certificate fee" title="Free for every club" description="Run a 20-person workshop or a 2,000-person fest without watching a usage meter." imageSrc="/overview.png" badgeVariant="warning" /></div>
        </div>
      </section>

      <section id="faq" className="relative z-10 mx-auto max-w-5xl px-6 py-28">
        <p className="text-center text-sm font-medium text-[#8b7cf6]">Questions, answered</p>
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-white/[0.1] rounded-2xl border border-white/[0.1] bg-white/[0.025] px-6">
          {[
            ["Is Certly free?", "Yes. There is no card, trial, yearly fee, or per-certificate charge for clubs."],
            ["What do I need to get started?", "Your certificate design and a spreadsheet containing each recipient's name and email address."],
            ["Can I send from our club Gmail?", "Yes. Connect your organisation's Gmail and certificates are delivered from an address participants recognise."],
          ].map(([question, answer]) => (
            <div className="py-6" key={question}>
              <h3 className="text-base font-medium text-[#ededf0]">{question}</h3>
              <p className="mt-2 text-sm leading-6 text-[#8f8f98]">{answer}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-16 pt-24">
        <div className="flex flex-col justify-between gap-10 border-b border-white/[0.1] pb-16 sm:flex-row">
          <div><div className="flex items-center gap-2 text-lg font-semibold"><span className="grid h-6 w-6 place-items-center rounded-[7px] bg-[#5e6ad2] text-xs text-white">C</span>Certly</div><p className="mt-4 max-w-xs text-sm leading-6 text-[#777780]">Certificates, generated and sent. Built for the people running the event.</p></div>
          <div className="grid grid-cols-2 gap-x-16 gap-y-3 text-sm text-[#8f8f98] sm:grid-cols-3"><Link href="#how-it-works">How it works</Link><Link href="#features">Features</Link><Link href="/dashboard">Dashboard</Link><Link href="/register">Get started</Link><Link href="/login">Log in</Link><Link href="#faq">FAQ</Link></div>
        </div>
        <p id="faq" className="pt-7 text-xs text-[#62626a]">© 2026 Certly. Free for college and school clubs.</p>
      </footer>
    </main>
  );
}
