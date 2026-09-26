import Link from "next/link";
import { Mail } from "lucide-react";
import { InviteActions } from "@/components/InviteActions";
import { getActiveOrg } from "@/lib/auth-utils";
import { formatShortDate, roleLabel } from "@/lib/format";
import { listIncomingInvites } from "@/lib/org-members";

export default async function InvitesPage() {
  const { user } = await getActiveOrg();
  const invites = await listIncomingInvites(user.email || "");

  return (
    <div className="max-w-5xl space-y-4">
      <div>
        <h1 className="text-sm font-medium text-white">Invitations</h1>
        <p className="mt-1 text-[13px] text-[#888]">
          Organizations that invited {user.email}
        </p>
      </div>

      <section className="overflow-hidden rounded-lg border border-[#262626] bg-[#0a0a0a]">
        <div className="flex items-center justify-between gap-3 border-b border-[#262626] px-4 py-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-[#888]" />
            <h2 className="text-sm font-medium text-white">Pending</h2>
          </div>
          <span className="rounded-full bg-[#10243f] px-2 py-0.5 text-[11px] font-medium text-[#7eb6ff]">
            {invites.length}
          </span>
        </div>

        {invites.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md border border-[#2a2a2a] bg-[#111]">
              <Mail className="h-4 w-4 text-[#888]" />
            </div>
            <p className="text-sm text-white">No pending invitations</p>
            <p className="mt-1 text-xs text-[#666]">When someone invites this email, it will show up here.</p>
            <Link
              href="/dashboard"
              className="mt-4 inline-flex h-8 items-center rounded-md border border-[#333] px-3 text-[13px] text-white hover:bg-[#111]"
            >
              Back to events
            </Link>
          </div>
        ) : (
          <ul className="space-y-1 p-2">
            {invites.map((invite) => (
              <li key={invite.id} className="flex flex-col gap-3 rounded-md px-2 py-2 hover:bg-[#111] lg:flex-row lg:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#2a2a2a] bg-[#111] text-[11px] font-medium text-white">
                    {invite.orgName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm text-white">{invite.orgName}</div>
                    <div className="truncate text-xs text-[#888]">
                      {invite.inviterName} invited you as {roleLabel(invite.role)} · Expires {formatShortDate(invite.expiresAt)}
                    </div>
                  </div>
                </div>
                <InviteActions token={invite.token} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
