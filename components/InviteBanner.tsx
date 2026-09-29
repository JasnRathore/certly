"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";

export function InviteBanner({ count }: { count: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  if (
    count <= 0 ||
    pathname.startsWith("/invites") ||
    (pathname === "/dashboard" && searchParams.get("section") === "invitations")
  ) return null;

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-[13px] text-[#ededed]">
        <Mail className="h-4 w-4 text-[#888]" />
        <span>
          You have {count} pending {count === 1 ? "invitation" : "invitations"}.
        </span>
      </div>
      <Link
        href="/dashboard?section=invitations"
        className="inline-flex h-8 items-center justify-center rounded-md bg-white px-3 text-[13px] font-medium text-black hover:bg-[#eaeaea]"
      >
        Review
      </Link>
    </div>
  );
}
