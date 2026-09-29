"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  requestPasswordReset,
  resetPassword,
} from "@/app/actions/auth";

export function RequestPasswordResetForm({ email }: { email: string }) {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, {});

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#d6d6d9]" htmlFor="reset-email">
          Email
        </label>
        <input
          id="reset-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="name@example.com"
          defaultValue={email}
          className="h-11 w-full rounded-xl border border-white/[0.14] bg-black/30 px-3 text-sm text-white outline-none transition-colors placeholder:text-[#62626a] focus:border-white/[0.4]"
        />
      </div>
      {state.error && <p role="alert" className="text-sm text-red-400">{state.error}</p>}
      {state.success && <p role="status" className="text-sm text-emerald-400">{state.success}</p>}
      {!state.success && (
        <button
          type="submit"
          disabled={isPending}
          className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-white text-sm font-medium text-black transition-colors hover:bg-[#e7e7e9] disabled:cursor-wait disabled:opacity-60"
        >
          {isPending ? "Sending link..." : "Send reset link"}
        </button>
      )}
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(resetPassword, {});

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="token" value={token} />
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#d6d6d9]" htmlFor="new-password">
          New password
        </label>
        <input
          id="new-password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="h-11 w-full rounded-xl border border-white/[0.14] bg-black/30 px-3 text-sm text-white outline-none transition-colors focus:border-white/[0.4]"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#d6d6d9]" htmlFor="confirm-password">
          Confirm new password
        </label>
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="h-11 w-full rounded-xl border border-white/[0.14] bg-black/30 px-3 text-sm text-white outline-none transition-colors focus:border-white/[0.4]"
        />
      </div>
      {state.error && <p role="alert" className="text-sm text-red-400">{state.error}</p>}
      {state.success ? (
        <div className="space-y-4">
          <p role="status" className="text-sm text-emerald-400">{state.success}</p>
          <Link
            href="/login"
            className="flex h-11 w-full items-center justify-center rounded-xl bg-white text-sm font-medium text-black transition-colors hover:bg-[#e7e7e9]"
          >
            Go to sign in
          </Link>
        </div>
      ) : (
        <button
          type="submit"
          disabled={isPending}
          className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-white text-sm font-medium text-black transition-colors hover:bg-[#e7e7e9] disabled:cursor-wait disabled:opacity-60"
        >
          {isPending ? "Resetting password..." : "Reset password"}
        </button>
      )}
    </form>
  );
}
