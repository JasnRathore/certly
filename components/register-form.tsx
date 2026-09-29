"use client";

import { useActionState } from "react";
import Link from "next/link";
import { register } from "@/app/actions/auth";

export function RegisterForm({
  email,
  nextPath,
  loginHref,
}: {
  email: string;
  nextPath: string;
  loginHref: string;
}) {
  const [state, formAction, isPending] = useActionState(register, {});

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={nextPath} />
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#d6d6d9]" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={80}
          autoComplete="name"
          placeholder="John Doe"
          defaultValue={state.name}
          className="h-11 w-full rounded-xl border border-white/[0.14] bg-black/30 px-3 text-sm text-white outline-none transition-colors placeholder:text-[#62626a] focus:border-white/[0.4]"
        />
      </div>

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
          defaultValue={state.email ?? email}
          className="h-11 w-full rounded-xl border border-white/[0.14] bg-black/30 px-3 text-sm text-white outline-none transition-colors placeholder:text-[#62626a] focus:border-white/[0.4]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#d6d6d9]" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          aria-describedby="password-hint"
          className="h-11 w-full rounded-xl border border-white/[0.14] bg-black/30 px-3 text-sm text-white outline-none transition-colors focus:border-white/[0.4]"
        />
        <p id="password-hint" className="text-xs text-[#8f8f98]">
          Use at least 8 characters.
        </p>
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
        {isPending ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-[#8f8f98]">
        Already have an account?{" "}
        <Link href={loginHref} className="font-medium text-white underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
