'use client';
import { useState, Suspense } from 'react';
import { verifyOtp } from '@/app/actions/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CertlyLogo } from '@/components/certly-logo';
import { MatrixBackground } from '@/components/matrix';

function VerifyForm() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const next = searchParams.get('next') || '/dashboard';
  const loginNext = next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');
    try {
      const res = await verifyOtp(email, code);
      if (res?.error) {
        setError(res.error);
      } else {
        router.push(`/login?email=${encodeURIComponent(email)}&next=${encodeURIComponent(loginNext)}`);
      }
    } catch {
      setError('We could not verify your code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section className="relative z-10 w-full max-w-md rounded-3xl border border-white/[0.12] bg-[#111113]/95 p-2 shadow-2xl backdrop-blur-xl">
      <div className="rounded-[22px] px-6 py-8 sm:px-9 sm:py-10">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <CertlyLogo className="h-10 w-10 rounded-lg" priority />
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-white">Verify your email</h1>
            <p className="mt-2 text-sm text-[#8f8f98]">
              Enter the 6-digit code sent to {email || 'your email address'}.
            </p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#d6d6d9]" htmlFor="verification-code">
              Verification code
            </label>
            <input
              id="verification-code"
              type="text"
              value={code}
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, '').slice(0, 6));
                setError('');
              }}
              placeholder="123456"
              autoComplete="one-time-code"
              inputMode="numeric"
              pattern="\d{6}"
              required
              className="h-11 w-full rounded-xl border border-white/[0.14] bg-black/30 px-3 text-center font-mono text-lg tracking-[0.35em] text-white outline-none transition-colors placeholder:text-[#62626a] focus:border-white/[0.4]"
              maxLength={6}
            />
          </div>
          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={isVerifying || code.length !== 6}
            className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-white text-sm font-medium text-black transition-colors hover:bg-[#e7e7e9] disabled:cursor-wait disabled:opacity-60"
          >
            {isVerifying ? 'Verifying...' : 'Verify email'}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-[#8f8f98]">
          <Link
            href={`/login?email=${encodeURIComponent(email)}&next=${encodeURIComponent(loginNext)}`}
            className="font-medium text-white underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </section>
  );
}

export default function VerifyPage() {
  return (
    <MatrixBackground className="flex min-h-screen items-center justify-center bg-[#09090a] px-4 py-10 text-[#ededed]">
      <Suspense
        fallback={
          <section className="relative z-10 w-full max-w-md rounded-3xl border border-white/[0.12] bg-[#111113]/95 p-10 text-center text-sm text-[#8f8f98] shadow-2xl backdrop-blur-xl">
            Loading verification...
          </section>
        }
      >
        <VerifyForm />
      </Suspense>
    </MatrixBackground>
  );
}
