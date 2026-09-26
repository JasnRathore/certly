import type { ReactNode } from "react";
import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";
import { auth } from "@/auth";
import { InviteActions, SwitchAccountButton } from "@/components/InviteActions";
import { roleLabel } from "@/lib/format";
import { getInviteByToken, getUserById, isOrgMember } from "@/lib/org-members";
import { safeNextPath } from "@/lib/safe-path";

function Logo() {
  return (
    <div className="mb-8 text-center">
      <div className="mb-4 inline-flex items-center justify-center">
        <svg className="h-9 w-9 text-white" viewBox="0 0 76 65" fill="currentColor" aria-hidden="true">
          <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-white">CertGen</h1>
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-[#262626] bg-[#0a0a0a] p-5 text-left">
      {children}
    </div>
  );
}

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = await getInviteByToken(token);
  const session = await auth();
  const viewer = session?.user?.id ? await getUserById(session.user.id) : null;
  const viewerEmail = viewer ? String(viewer.email).toLowerCase() : null;
  const nextPath = safeNextPath(`/invite/${token}`);
  const authQuery = invite
    ? `email=${encodeURIComponent(invite.email)}&next=${encodeURIComponent(nextPath)}`
    : `next=${encodeURIComponent(nextPath)}`;

  let body: ReactNode;

  if (!invite) {
    body = (
      <Card>
        <h2 className="text-base font-medium text-white">Invitation not found</h2>
        <p className="mt-2 text-sm text-[#888]">
          This link is invalid. Ask the person who invited you to send a new one.
        </p>
      </Card>
    );
  } else if (invite.status === "EXPIRED") {
    body = (
      <Card>
        <h2 className="text-base font-medium text-white">Invitation expired</h2>
        <p className="mt-2 text-sm text-[#888]">
          The invitation to join {invite.orgName} has expired. Ask an admin to resend it.
        </p>
      </Card>
    );
  } else if (invite.status === "REVOKED") {
    body = (
      <Card>
        <h2 className="text-base font-medium text-white">Invitation revoked</h2>
        <p className="mt-2 text-sm text-[#888]">
          An admin revoked the invitation to {invite.orgName}.
        </p>
      </Card>
    );
  } else if (invite.status === "DECLINED") {
    body = (
      <Card>
        <h2 className="text-base font-medium text-white">Invitation declined</h2>
        <p className="mt-2 text-sm text-[#888]">
          This invitation to {invite.orgName} was declined. An admin can send a new one.
        </p>
      </Card>
    );
  } else if (invite.status === "ACCEPTED") {
    const canOpen = viewer ? await isOrgMember(viewer.id as string, invite.orgId) : false;
    body = (
      <Card>
        <h2 className="text-base font-medium text-white">Already accepted</h2>
        <p className="mt-2 text-sm text-[#888]">
          This invitation to {invite.orgName} has already been used.
        </p>
        {canOpen && (
          <div className="mt-5">
            <InviteActions
              token={invite.token}
              showDecline={false}
              acceptLabel="Open organization"
              pendingAcceptLabel="Opening..."
              layout="stack"
            />
          </div>
        )}
      </Card>
    );
  } else if (!viewerEmail) {
    body = (
      <Card>
        <p className="text-xs uppercase tracking-wide text-[#666]">Organization invite</p>
        <h2 className="mt-2 text-lg font-medium text-white">{invite.orgName}</h2>
        <p className="mt-2 text-sm text-[#888]">
          {invite.inviterName} invited <span className="text-white">{invite.email}</span> to join as {roleLabel(invite.role)}.
        </p>
        <div className="mt-6 space-y-3">
          <Link
            href={`/login?${authQuery}`}
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-white text-[13px] font-medium text-black hover:bg-[#eaeaea]"
          >
            <LogIn className="h-3.5 w-3.5" />
            Sign in to accept
          </Link>
          <Link
            href={`/register?${authQuery}`}
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-[#333] text-[13px] text-white hover:bg-[#111]"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Create an account
          </Link>
        </div>
      </Card>
    );
  } else if (viewerEmail !== invite.email) {
    body = (
      <Card>
        <h2 className="text-base font-medium text-white">Wrong account</h2>
        <p className="mt-2 text-sm text-[#888]">
          This invitation to {invite.orgName} was sent to {invite.email}. You are signed in as {viewerEmail}.
        </p>
        <div className="mt-5">
          <SwitchAccountButton token={invite.token} />
        </div>
      </Card>
    );
  } else {
    body = (
      <Card>
        <p className="text-xs uppercase tracking-wide text-[#666]">Organization invite</p>
        <h2 className="mt-2 text-lg font-medium text-white">{invite.orgName}</h2>
        <p className="mt-2 text-sm text-[#888]">
          {invite.inviterName} invited you to join as {roleLabel(invite.role)}.
        </p>
        <div className="mt-6">
          <InviteActions token={invite.token} layout="stack" acceptLabel="Accept invitation" />
        </div>
      </Card>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-16">
      <div className="w-full max-w-md">
        <Logo />
        {body}
        {viewer && (
          <p className="mt-6 text-center text-sm text-[#888]">
            <Link href="/dashboard" className="text-white hover:underline">
              Back to CertGen
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
