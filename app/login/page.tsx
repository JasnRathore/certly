import { login, googleSignIn } from "@/app/actions/auth";
import { safeNextPath } from "@/lib/safe-path";
import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; next?: string }>;
}) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : "";
  const nextPath = safeNextPath(params.next);
  const registerHref =
    nextPath === "/dashboard"
      ? "/register"
      : `/register?email=${encodeURIComponent(email)}&next=${encodeURIComponent(nextPath)}`;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-[350px]">
        {/* Top: Logo & Subtitle */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <svg
              className="w-9 h-9 text-white"
              viewBox="0 0 76 65"
              fill="currentColor"
            >
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">CertGen</h1>
          <p className="text-sm text-vercel-300 mt-1.5">Log in to CertGen</p>
        </div>

        {/* Google OAuth */}
        <form action={googleSignIn}>
          <input type="hidden" name="next" value={nextPath} />
          <button
            type="submit"
            className="w-full bg-black border border-vercel-700 text-white font-medium rounded-md h-10 hover:bg-vercel-900 transition flex items-center justify-center text-sm cursor-pointer gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-vercel-700" />
          <span className="text-xs text-vercel-400 uppercase">or</span>
          <div className="flex-1 h-px bg-vercel-700" />
        </div>

        {/* Form */}
        <form action={login as any} className="space-y-4">
          <input type="hidden" name="next" value={nextPath} />
          <div>
            <label className="text-vercel-300 text-sm mb-1.5 block" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="name@example.com"
              defaultValue={email}
              className="bg-black border border-vercel-700 rounded-md h-10 px-3 text-white text-sm focus:border-vercel-400 focus:outline-none w-full placeholder:text-vercel-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-vercel-300 text-sm mb-1.5 block" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="bg-black border border-vercel-700 rounded-md h-10 px-3 text-white text-sm focus:border-vercel-400 focus:outline-none w-full transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-white text-black font-medium rounded-md h-10 hover:bg-vercel-200 transition flex items-center justify-center text-sm cursor-pointer"
            >
              Log In
            </button>
          </div>
        </form>

        {/* Bottom link */}
        <p className="text-center text-sm text-[#888] mt-8">
          Don't have an account?{" "}
          <Link href={registerHref} className="text-white hover:underline transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
