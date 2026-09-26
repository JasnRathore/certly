'use client';
import { useState, Suspense } from 'react';
import { verifyOtp } from '@/app/actions/auth';
import { useRouter, useSearchParams } from 'next/navigation';

function VerifyForm() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const next = searchParams.get('next') || '/dashboard';
  const loginNext = next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await verifyOtp(email, code);
    if (res?.error) setError(res.error);
    else router.push(`/login?email=${encodeURIComponent(email)}&next=${encodeURIComponent(loginNext)}`);
  };

  return (
    <div className="w-full max-w-[350px]">
      <h1 className="text-2xl font-bold text-white mb-2 text-center">Verify Email</h1>
      <p className="text-[#888] text-sm text-center mb-6">Enter the 6-digit code sent to {email}</p>
      
      <form onSubmit={handleVerify} className="space-y-4">
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="123456"
          className="w-full bg-black border border-vercel-700 rounded-md h-10 px-3 text-white text-center tracking-widest font-mono focus:border-vercel-400 focus:outline-none"
          maxLength={6}
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button type="submit" className="w-full bg-white text-black font-medium h-10 rounded-md hover:bg-vercel-200">
          Verify
        </button>
      </form>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <VerifyForm />
      </Suspense>
    </div>
  );
}

