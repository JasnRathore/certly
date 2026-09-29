import Link from "next/link";
import { CertlyLogo } from "@/components/certly-logo";
import { MatrixBackground } from "@/components/matrix";
import { RequestPasswordResetForm } from "@/components/password-reset-forms";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : "";

  return (
    <MatrixBackground className="flex min-h-screen items-center justify-center bg-[#09090a] px-4 py-10 text-[#ededed]">
      <section className="relative z-10 w-full max-w-md rounded-3xl border border-white/[0.12] bg-[#111113]/95 p-2 shadow-2xl backdrop-blur-xl">
        <div className="rounded-[22px] px-6 py-8 sm:px-9 sm:py-10">
          <div className="mb-8 flex flex-col items-center gap-4 text-center">
            <CertlyLogo className="h-10 w-10 rounded-lg" priority />
            <div>
              <h1 className="text-3xl font-medium tracking-tight text-white">Reset your password</h1>
              <p className="mt-2 text-sm text-[#8f8f98]">
                Enter your account email and we&apos;ll send you a secure reset link.
              </p>
            </div>
          </div>

          <RequestPasswordResetForm email={email} />

          <p className="mt-7 text-center text-sm text-[#8f8f98]">
            Remembered your password?{" "}
            <Link
              href={`/login?email=${encodeURIComponent(email)}`}
              className="font-medium text-white underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </MatrixBackground>
  );
}
