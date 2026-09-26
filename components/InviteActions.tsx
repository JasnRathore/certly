"use client";

import { useState, useTransition } from "react";
import { unstable_rethrow, useRouter } from "next/navigation";
import { Check, LogOut, X } from "lucide-react";
import { acceptInvite, declineInvite, signOutForInvite } from "@/app/actions/members";

const whiteBtn =
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-white px-3 text-[13px] font-medium text-black hover:bg-[#eaeaea] disabled:cursor-not-allowed disabled:opacity-50";
const outlineBtn =
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-[#333] bg-transparent px-3 text-[13px] text-[#ededed] hover:bg-[#111] disabled:cursor-not-allowed disabled:opacity-50";

export function InviteActions({
  token,
  showDecline = true,
  acceptLabel = "Accept",
  pendingAcceptLabel = "Joining...",
  layout = "inline",
}: {
  token: string;
  showDecline?: boolean;
  acceptLabel?: string;
  pendingAcceptLabel?: string;
  layout?: "inline" | "stack";
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [action, setAction] = useState<"accept" | "decline" | null>(null);

  const respond = (next: "accept" | "decline") => {
    setError(null);
    setAction(next);
    startTransition(async () => {
      try {
        if (next === "accept") {
          const result = await acceptInvite(token);
          if (result?.error) setError(result.error);
          return;
        }
        const result = await declineInvite(token);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        router.refresh();
      } catch (caught) {
        unstable_rethrow(caught);
        setError("Something went wrong. Try again.");
      } finally {
        setAction(null);
      }
    });
  };

  return (
    <div className={layout === "stack" ? "space-y-3" : "space-y-2"}>
      {error && <p className="text-[13px] text-red-300">{error}</p>}
      <div className={layout === "stack" ? "flex flex-col gap-2" : "flex flex-wrap items-center gap-2"}>
        <button
          type="button"
          onClick={() => respond("accept")}
          disabled={pending}
          className={layout === "stack" ? `${whiteBtn} w-full` : whiteBtn}
        >
          <Check className="h-3.5 w-3.5" />
          {action === "accept" ? pendingAcceptLabel : acceptLabel}
        </button>
        {showDecline && (
          <button
            type="button"
            onClick={() => respond("decline")}
            disabled={pending}
            className={layout === "stack" ? `${outlineBtn} w-full` : outlineBtn}
          >
            <X className="h-3.5 w-3.5" />
            {action === "decline" ? "Declining..." : "Decline"}
          </button>
        )}
      </div>
    </div>
  );
}

export function SwitchAccountButton({ token }: { token: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await signOutForInvite(token);
        });
      }}
      className={`${whiteBtn} w-full`}
    >
      <LogOut className="h-3.5 w-3.5" />
      {pending ? "Signing out..." : "Sign out and switch account"}
    </button>
  );
}
