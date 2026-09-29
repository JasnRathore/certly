import Link from "next/link";
import { CertlyLogo } from "@/components/certly-logo";
import { MatrixBackground } from "@/components/matrix";
import { ResetPasswordForm } from "@/components/password-reset-forms";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";

  return (
    <MatrixBackground className="flex min-h-screen items-center justify-center bg-[#09090a] px-4 py-10 text-[#ededed]">
      <section className="relative z-10 w-full max-w-md rounded-3xl border border-white/[0.12] bg-[#111113]/95 p-2 shadow-2xl backdrop-blur-xl">
        <div className="rounded-[22px] px-6 py-8 sm:px-9 sm:py-10">
          <div className="mb-8 flex flex-col items-center gap-4 text-center">
            <CertlyLogo className="h-10 w-10 rounded-lg" priority />
            <div>
              <h1 className="text-3xl font-medium tracking-tight text-white">Choose a new password</h1>
              <p className="mt-2 text-sm text-[#8f8f98]">
                Use at least 8 characters for your new password.
              </p>
            </div>
          </div>

          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <div className="space-y-4">
              <p role="alert" className="text-center text-sm text-red-400">
                This reset link is missing or invalid. Request a new one to continue.
              </p>
              <Link
                href="/forgot-password"
                className="flex h-11 w-full items-center justify-center rounded-xl bg-white text-sm font-medium text-black transition-colors hover:bg-[#e7e7e9]"
              >
                Request a new link
              </Link>
            </div>
          )}
        </div>
      </section>
    </MatrixBackground>
  );
}
