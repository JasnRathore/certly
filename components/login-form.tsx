"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/actions/auth";

export function LoginForm({
  email,
  nextPath,
  registerHref,
}: {
  email: string;
  nextPath: string;
  registerHref: string;
}) {
  const [state, formAction, isPending] = useActionState(login, {});
  const forgotPasswordHref = `/forgot-password?email=${encodeURIComponent(email)}`;

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={nextPath} />
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#d6d6d9]" htmlFor="email">
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
          className="h-11 w-full rounded-xl border border-white/[0.14] bg-black/30 px-3 text-sm text-white outline-none transition-colors placeholder:text-[#62626a] focus:border-white/[0.4]"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[#d6d6d9]" htmlFor="password">
            Password
          </label>
          <Link href={registerHref} className="text-xs text-[#a9a2ff] hover:text-white">
            Need an account?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-11 w-full rounded-xl border border-white/[0.14] bg-black/30 px-3 text-sm text-white outline-none transition-colors focus:border-white/[0.4]"
        />
        <div className="flex justify-end">
          <Link href={forgotPasswordHref} className="text-xs text-[#a9a2ff] hover:text-white">
            Forgot password?
          </Link>
        </div>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-white text-sm font-medium text-black transition-colors hover:bg-[#e7e7e9] disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
