import Link from "next/link";
import { Info, Mail } from "lucide-react";
import { InviteActions } from "@/components/InviteActions";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getActiveOrg } from "@/lib/auth-utils";
import { formatShortDate, roleLabel } from "@/lib/format";
import { listIncomingInvites } from "@/lib/org-members";

export default async function DashboardInvitations() {
  const { user } = await getActiveOrg();
  const invites = await listIncomingInvites(user.email || "");

  return (
    <div className="max-w-full h-full text-foreground">
      <section className="h-full ">

        {invites.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-20 text-center">
            <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-base font-medium text-foreground">You&apos;re all caught up</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              When someone invites you to join an organization, you&apos;ll see it here.
            </p>
            <Link
              href="/dashboard?section=events"
              className="mt-5 inline-flex h-8 items-center rounded-md border border-border px-3 text-sm text-foreground transition-colors hover:bg-muted"
            >
              Back to events
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-1 pt-2">
            {invites.map((invite) => (
              <li key={invite.id} className="flex flex-col gap-3 rounded-md px-2 py-2 hover:bg-muted lg:flex-row lg:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-xs font-medium text-foreground">
                    {invite.orgName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm text-card-foreground">{invite.orgName}</div>
                    <div className="truncate text-xs text-muted-foreground">
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
