"use client";

import { useState, useTransition } from "react";
import { unstable_rethrow, useRouter } from "next/navigation";
import { Copy, LogOut, Mail, RefreshCw, UserPlus, Users, X } from "lucide-react";
import {
  leaveOrganization,
  removeMember,
  resendOrgInvite,
  revokeOrgInvite,
  sendOrgInvite,
  updateMemberRole,
} from "@/app/actions/members";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type MemberRow = {
  membershipId: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  role: "ADMIN" | "MEMBER";
  joinedLabel: string;
};

type InviteRow = {
  id: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  token: string;
  sentLabel: string;
  expiresLabel: string;
};

type Notice = { type: "ok" | "warn" | "error"; text: string };

const card = "overflow-hidden rounded-lg border border-border bg-card w-full";
const cardHeader = "flex items-center justify-between gap-3 border-b border-border px-4 py-3";
const whiteBtn =
  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50";
const outlineBtn =
  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-border bg-transparent px-2.5 text-[13px] text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";
const field =
  "h-8 w-full rounded-md border border-input bg-background px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none";

function initials(name: string, email: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return email.slice(0, 2).toUpperCase();
}

export function MembersManager({
  orgName,
  isAdmin,
  currentUserId,
  adminCount,
  members,
  invites,
  leaveBlockedReason,
}: {
  orgName: string;
  isAdmin: boolean;
  currentUserId: string;
  adminCount: number;
  members: MemberRow[];
  invites: InviteRow[];
  leaveBlockedReason: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const run = (id: string, action: () => Promise<{ ok: true; message: string; warning?: boolean } | { ok: false; error: string }>) => {
    setNotice(null);
    setBusy(id);
    startTransition(async () => {
      try {
        const result = await action();
        if (!result.ok) {
          setNotice({ type: "error", text: result.error });
          return;
        }
        setNotice({ type: result.warning ? "warn" : "ok", text: result.message });
        if (id === "invite") setEmail("");
        router.refresh();
      } catch {
        setNotice({ type: "error", text: "Something went wrong. Try again." });
      } finally {
        setBusy(null);
      }
    });
  };

  const copyLink = async (invite: InviteRow) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/invite/${invite.token}`);
      setCopiedId(invite.id);
      window.setTimeout(() => setCopiedId((current) => (current === invite.id ? null : current)), 2000);
    } catch {
      setNotice({ type: "error", text: "Couldn't copy the invite link." });
    }
  };

  return (
    <div className="space-y-4 w-full ">
      {notice && (
        <p
          className={`rounded-md border px-3 py-2 text-[13px] ${
            notice.type === "error"
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : notice.type === "warn"
                ? "border-secondary bg-secondary/50 text-secondary-foreground"
                : "border-primary/20 bg-primary/10 text-primary"
          }`}
        >
          {notice.text}
        </p>
      )}

      <section className={card}>
        <div className={cardHeader}>
          <div className="flex min-w-0 items-center gap-2">
            <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
            <h2 className="text-sm font-medium text-card-foreground">Team</h2>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
              {members.length}
            </span>
          </div>
          {isAdmin && <p className="hidden text-xs text-muted-foreground md:block">Admins manage access</p>}
        </div>
        {!isAdmin && (
          <p className="border-b border-border px-4 py-2 text-xs text-muted-foreground">
            Only admins can invite or change roles.
          </p>
        )}

        <ul className="space-y-1 p-2">
          {members.map((member) => {
            const isSelf = member.userId === currentUserId;
            const lastAdmin = member.role === "ADMIN" && adminCount <= 1;
            return (
              <li
                key={member.membershipId}
                className="flex flex-col gap-3 rounded-md px-2 py-2 hover:bg-muted sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Avatar className="size-8 rounded-full after:hidden">
                    <AvatarImage src={member.avatar} alt={`${member.name} avatar`} />
                    <AvatarFallback className="font-mono text-[11px]">
                      {initials(member.name, member.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="truncate text-sm text-card-foreground">
                      {member.name}
                      {isSelf && <span className="ml-2 text-xs text-muted-foreground">You</span>}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {member.email}
                      <span className="text-muted-foreground/70"> · Joined {member.joinedLabel}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:justify-end">
                  {isAdmin ? (
                    <Combobox
                      items={["ADMIN", "MEMBER"]}
                      value={member.role}
                      itemToStringLabel={(value) => value === "ADMIN" ? "Admin" : "Member"}
                      disabled={pending || lastAdmin}
                      onValueChange={(nextRole) => {
                        if (nextRole === null || nextRole === member.role) return;
                        if (nextRole !== "ADMIN" && nextRole !== "MEMBER") return;
                        run(`role:${member.membershipId}`, () => updateMemberRole(member.membershipId, nextRole));
                      }}
                    >
                      <ComboboxInput
                        aria-label={`Role for ${member.name}`}
                        className="w-28"
                        disabled={pending || lastAdmin}
                        title={lastAdmin ? "Promote another admin before changing this role" : "Change role"}
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>No roles found.</ComboboxEmpty>
                        <ComboboxList>
                          {(option) => (
                            <ComboboxItem key={option} value={option}>
                              {option === "ADMIN" ? "Admin" : "Member"}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  ) : (
                    <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                      {member.role === "ADMIN" ? "Admin" : "Member"}
                    </span>
                  )}
                  {isAdmin && !isSelf && (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => {
                        if (!window.confirm(`Remove ${member.name} from ${orgName}?`)) return;
                        run(`remove:${member.membershipId}`, () => removeMember(member.membershipId));
                      }}
                      className={`${outlineBtn} hover:border-destructive/40 hover:text-destructive`}
                    >
                      <X className="h-3.5 w-3.5" />
                      {busy === `remove:${member.membershipId}` ? "Removing..." : "Remove"}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            {leaveBlockedReason ?? `Leaving ${orgName} removes your access until you are invited again.`}
          </p>
          <button
            type="button"
            disabled={pending || Boolean(leaveBlockedReason)}
            onClick={() => {
              if (!window.confirm(`Leave ${orgName}?`)) return;
              setNotice(null);
              setBusy("leave");
              startTransition(async () => {
                try {
                  const result = await leaveOrganization();
                  if (result?.error) setNotice({ type: "error", text: result.error });
                } catch (caught) {
                  unstable_rethrow(caught);
                  setNotice({ type: "error", text: "Couldn't leave the organization." });
                } finally {
                  setBusy(null);
                }
              });
            }}
            className={`${outlineBtn} hover:border-destructive/40 hover:text-destructive`}
          >
            <LogOut className="h-3.5 w-3.5" />
            {busy === "leave" ? "Leaving..." : "Leave"}
          </button>
        </div>
      </section>

      <div className={`grid gap-4 ${isAdmin ? "lg:grid-cols-2" : ""}`}>
        {isAdmin && (
          <form
            className={card}
            onSubmit={(event) => {
              event.preventDefault();
              if (pending) return;
              run("invite", () => sendOrgInvite(email, role));
            }}
          >
            <div className={cardHeader}>
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-medium text-card-foreground">Invite</h2>
              </div>
              <button type="submit" disabled={pending || !email.trim()} className={whiteBtn}>
                <UserPlus className="h-3.5 w-3.5" />
                {busy === "invite" ? "Sending..." : "Send invite"}
              </button>
            </div>
            <div className="space-y-3 p-4">
              <div>
                <label htmlFor="inviteEmail" className="mb-1.5 block text-xs text-muted-foreground">
                  Email
                </label>
                <Input
                  id="inviteEmail"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="teammate@example.com"
                  className="h-8 w-full px-3 text-[13px]"
                />
              </div>
              <div>
                <label htmlFor="inviteRole" className="mb-1.5 block text-xs text-muted-foreground">
                  Role
                </label>
                <Combobox
                  items={["MEMBER", "ADMIN"]}
                  value={role}
                  itemToStringLabel={(value) => value === "ADMIN" ? "Admin" : "Member"}
                  onValueChange={(nextRole) => {
                    if (nextRole === "ADMIN" || nextRole === "MEMBER") setRole(nextRole);
                  }}
                >
                  <ComboboxInput
                    id="inviteRole"
                    aria-label="Invite role"
                    className="w-full"
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No roles found.</ComboboxEmpty>
                    <ComboboxList>
                      {(option) => (
                        <ComboboxItem key={option} value={option}>
                          {option === "ADMIN" ? "Admin" : "Member"}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
              <p className="text-xs text-muted-foreground">
                Sends a link to join {orgName}. It expires in 7 days and only works for this email.
              </p>
            </div>
          </form>
        )}

        {isAdmin && (
          <section className={card}>
            <div className={cardHeader}>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-medium text-card-foreground">Pending</h2>
              </div>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                {invites.length}
              </span>
            </div>
            {invites.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-10 text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-foreground">No pending invitations</p>
                <p className="mt-1 text-xs text-muted-foreground">Invited people show up here until they accept.</p>
              </div>
            ) : (
              <ul className="space-y-1 p-2">
                {invites.map((invite) => (
                  <li key={invite.id} className="rounded-md px-2 py-2 hover:bg-muted">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm text-card-foreground">{invite.email}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {invite.role === "ADMIN" ? "Admin" : "Member"} · Sent {invite.sentLabel} · Expires {invite.expiresLabel}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <button type="button" disabled={pending} onClick={() => copyLink(invite)} className={outlineBtn}>
                            <Copy className="h-3.5 w-3.5" />
                            {copiedId === invite.id ? "Copied" : "Copy link"}
                          </button>
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() => run(`resend:${invite.id}`, () => resendOrgInvite(invite.id))}
                            className={outlineBtn}
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            {busy === `resend:${invite.id}` ? "Sending..." : "Resend"}
                          </button>
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() => {
                              if (!window.confirm(`Revoke the invitation for ${invite.email}?`)) return;
                              run(`revoke:${invite.id}`, () => revokeOrgInvite(invite.id));
                            }}
                            className={`${outlineBtn} hover:border-destructive/40 hover:text-destructive`}
                          >
                            <X className="h-3.5 w-3.5" />
                            {busy === `revoke:${invite.id}` ? "Revoking..." : "Revoke"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
