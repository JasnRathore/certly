"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { getActiveOrg } from "@/lib/auth-utils";
import { getAppOrigin } from "@/lib/app-origin";
import { db } from "@/lib/db";
import { roleLabel } from "@/lib/format";
import { sendAppEmail } from "@/lib/mail";
import {
  asRole,
  countOrgAdmins,
  findMembershipByEmail,
  getInviteByToken,
  getUserById,
  type OrgRole,
} from "@/lib/org-members";
import { auth, signOut } from "@/auth";

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type MemberActionResult =
  | { ok: true; message: string; warning?: boolean }
  | { ok: false; error: string };

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) return null;
  return email;
}

function parseRole(value: unknown): OrgRole | null {
  if (value === "ADMIN" || value === "MEMBER") return value;
  return null;
}

function oneLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, 200);
}

function revalidateMemberViews() {
  revalidatePath("/settings/members");
  revalidatePath("/invites");
  revalidatePath("/dashboard");
}

async function requireOrgAdmin() {
  const ctx = await getActiveOrg();
  if (ctx.role !== "ADMIN") {
    return { error: "Only organization admins can manage members." as const, ctx: null };
  }
  return { error: null, ctx };
}

async function sessionUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const row = await getUserById(session.user.id);
  if (!row) return null;
  return {
    id: row.id as string,
    name: (row.name as string) || "Someone",
    email: String(row.email).toLowerCase(),
  };
}

function inviteUrl(origin: string, token: string) {
  return `${origin}/invite/${token}`;
}

async function deliverInvite(input: {
  email: string;
  token: string;
  role: OrgRole;
  orgName: string;
  inviterName: string;
  expiresAt: string;
}) {
  const origin = await getAppOrigin();
  const url = inviteUrl(origin, input.token);
  const expires = new Date(input.expiresAt).toUTCString();
  const subject = `${oneLine(input.inviterName)} invited you to ${oneLine(input.orgName)} on Certly`;
  const text = [
    `${input.inviterName} invited you to join ${input.orgName} on Certly as ${roleLabel(input.role)}.`,
    "",
    "Accept the invitation:",
    url,
    "",
    `This link expires on ${expires}.`,
    "If you were not expecting this, you can ignore the email.",
  ].join("\n");

  await sendAppEmail(input.email, subject, text);
  return url;
}

async function saveAndSendInvite(input: {
  orgId: string;
  orgName: string;
  inviterId: string;
  inviterName: string;
  email: string;
  role: OrgRole;
  existingInviteId?: string;
}): Promise<MemberActionResult> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + INVITE_TTL_MS).toISOString();

  if (input.existingInviteId) {
    const updated = await db.execute({
      sql: `
        UPDATE OrgInvite
        SET role = ?, token = ?, invitedBy = ?, expiresAt = ?, createdAt = ?
        WHERE id = ? AND orgId = ? AND status = 'PENDING'
      `,
      args: [
        input.role,
        token,
        input.inviterId,
        expiresAt,
        new Date().toISOString(),
        input.existingInviteId,
        input.orgId,
      ],
    });
    if (Number(updated.rowsAffected) === 0) {
      return { ok: false, error: "That invitation is no longer pending." };
    }
  } else {
    try {
      await db.execute({
        sql: `
          INSERT INTO OrgInvite (id, orgId, email, role, token, invitedBy, status, expiresAt)
          VALUES (?, ?, ?, ?, ?, ?, 'PENDING', ?)
        `,
        args: [uuidv4(), input.orgId, input.email, input.role, token, input.inviterId, expiresAt],
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.toLowerCase().includes("unique") || message.toLowerCase().includes("constraint")) {
        return { ok: false, error: "An invitation for that email is already pending." };
      }
      throw error;
    }
  }

  let emailed = true;
  try {
    await deliverInvite({
      email: input.email,
      token,
      role: input.role,
      orgName: input.orgName,
      inviterName: input.inviterName,
      expiresAt,
    });
  } catch {
    console.error("Failed to send organization invite");
    emailed = false;
  }

  revalidateMemberViews();

  if (emailed) {
    return {
      ok: true as const,
      message: input.existingInviteId
        ? `Invitation resent to ${input.email}.`
        : `Invitation sent to ${input.email}.`,
    };
  }

  return {
    ok: true as const,
    warning: true,
    message: `Invitation saved for ${input.email}, but the email could not be sent. Copy the invite link and share it directly.`,
  };
}

export async function sendOrgInvite(emailInput: string, roleInput: string): Promise<MemberActionResult> {
  const gate = await requireOrgAdmin();
  if (!gate.ctx) return { ok: false, error: gate.error || "Unauthorized" };

  const email = normalizeEmail(emailInput);
  if (!email) return { ok: false, error: "Enter a valid email address." };

  const role = parseRole(roleInput);
  if (!role) return { ok: false, error: "Choose Admin or Member." };

  const { organization, user } = gate.ctx;
  const existingMember = await findMembershipByEmail(organization.id, email);
  if (existingMember) {
    return { ok: false, error: "That person is already a member of this organization." };
  }

  await db.execute({
    sql: `
      UPDATE OrgInvite
      SET status = 'EXPIRED'
      WHERE orgId = ? AND email = ? AND status = 'PENDING' AND expiresAt <= ?
    `,
    args: [organization.id, email, new Date().toISOString()],
  });

  const pending = await db.execute({
    sql: `SELECT id FROM OrgInvite WHERE orgId = ? AND email = ? AND status = 'PENDING'`,
    args: [organization.id, email],
  });

  const inviter = await getUserById(user.id as string);
  const inviterName = (inviter?.name as string) || user.name || "A teammate";

  return saveAndSendInvite({
    orgId: organization.id,
    orgName: organization.name,
    inviterId: user.id as string,
    inviterName,
    email,
    role,
    existingInviteId: pending.rows[0]?.id as string | undefined,
  });
}

export async function resendOrgInvite(inviteId: string): Promise<MemberActionResult> {
  const gate = await requireOrgAdmin();
  if (!gate.ctx) return { ok: false, error: gate.error || "Unauthorized" };

  const { organization, user } = gate.ctx;
  const res = await db.execute({
    sql: `SELECT id, email, role, status, expiresAt FROM OrgInvite WHERE id = ? AND orgId = ?`,
    args: [inviteId, organization.id],
  });
  const invite = res.rows[0];
  if (!invite || invite.status !== "PENDING") {
    return { ok: false, error: "That invitation is no longer pending." };
  }
  if (new Date(String(invite.expiresAt)).getTime() <= Date.now()) {
    await db.execute({
      sql: `UPDATE OrgInvite SET status = 'EXPIRED' WHERE id = ? AND status = 'PENDING'`,
      args: [inviteId],
    });
    revalidateMemberViews();
    return { ok: false, error: "That invitation has expired. Send a new one." };
  }

  const inviter = await getUserById(user.id as string);
  return saveAndSendInvite({
    orgId: organization.id,
    orgName: organization.name,
    inviterId: user.id as string,
    inviterName: (inviter?.name as string) || user.name || "A teammate",
    email: String(invite.email),
    role: asRole(invite.role),
    existingInviteId: invite.id as string,
  });
}

export async function revokeOrgInvite(inviteId: string): Promise<MemberActionResult> {
  const gate = await requireOrgAdmin();
  if (!gate.ctx) return { ok: false, error: gate.error || "Unauthorized" };

  const updated = await db.execute({
    sql: `
      UPDATE OrgInvite
      SET status = 'REVOKED'
      WHERE id = ? AND orgId = ? AND status = 'PENDING'
    `,
    args: [inviteId, gate.ctx.organization.id],
  });

  if (Number(updated.rowsAffected) === 0) {
    return { ok: false, error: "That invitation is no longer pending." };
  }

  revalidateMemberViews();
  return { ok: true, message: "Invitation revoked." };
}

export async function updateMemberRole(membershipId: string, roleInput: string): Promise<MemberActionResult> {
  const gate = await requireOrgAdmin();
  if (!gate.ctx) return { ok: false, error: gate.error || "Unauthorized" };

  const role = parseRole(roleInput);
  if (!role) return { ok: false, error: "Choose Admin or Member." };

  const orgId = gate.ctx.organization.id;
  const current = await db.execute({
    sql: `SELECT id, userId, role FROM OrgMembership WHERE id = ? AND orgId = ?`,
    args: [membershipId, orgId],
  });
  const membership = current.rows[0];
  if (!membership) return { ok: false, error: "Member not found." };

  if (membership.role === "ADMIN" && role !== "ADMIN") {
    const admins = await countOrgAdmins(orgId);
    if (admins <= 1) {
      return { ok: false, error: "Promote another admin before changing the last admin's role." };
    }
  }

  await db.execute({
    sql: `UPDATE OrgMembership SET role = ? WHERE id = ? AND orgId = ?`,
    args: [role, membershipId, orgId],
  });

  revalidateMemberViews();
  return { ok: true, message: "Role updated." };
}

export async function removeMember(membershipId: string): Promise<MemberActionResult> {
  const gate = await requireOrgAdmin();
  if (!gate.ctx) return { ok: false, error: gate.error || "Unauthorized" };

  const orgId = gate.ctx.organization.id;
  const current = await db.execute({
    sql: `SELECT id, userId, role FROM OrgMembership WHERE id = ? AND orgId = ?`,
    args: [membershipId, orgId],
  });
  const membership = current.rows[0];
  if (!membership) return { ok: false, error: "Member not found." };

  if (membership.userId === gate.ctx.user.id) {
    return { ok: false, error: "Use Leave organization to remove yourself." };
  }

  if (membership.role === "ADMIN") {
    const admins = await countOrgAdmins(orgId);
    if (admins <= 1) {
      return { ok: false, error: "You can't remove the last admin." };
    }
  }

  await db.execute({
    sql: `DELETE FROM OrgMembership WHERE id = ? AND orgId = ?`,
    args: [membershipId, orgId],
  });

  revalidateMemberViews();
  return { ok: true, message: "Member removed." };
}

export async function leaveOrganization(): Promise<{ ok: false; error: string }> {
  const { user, organization, role, allMemberships } = await getActiveOrg();

  if (allMemberships.length <= 1) {
    return { ok: false, error: "Join or create another organization before leaving this one." };
  }

  if (role === "ADMIN") {
    const admins = await countOrgAdmins(organization.id);
    if (admins <= 1) {
      return { ok: false, error: "Promote another admin before leaving." };
    }
  }

  await db.execute({
    sql: `DELETE FROM OrgMembership WHERE userId = ? AND orgId = ?`,
    args: [user.id as string, organization.id],
  });

  const nextOrg = allMemberships.find((membership) => membership.orgId !== organization.id);
  const cookieStore = await cookies();
  if (nextOrg) {
    cookieStore.set("active-org-id", nextOrg.orgId, { path: "/" });
  }

  revalidateMemberViews();
  redirect("/dashboard");
}

async function inviteForCurrentUser(token: string) {
  const user = await sessionUser();
  if (!user) return { error: "Sign in to respond to this invitation." as const, user: null, invite: null };

  const invite = await getInviteByToken(token);
  if (!invite) return { error: "This invitation is invalid." as const, user, invite: null };
  if (invite.email !== user.email) {
    return {
      error: `This invitation was sent to ${invite.email}. Sign in with that email to respond.` as const,
      user,
      invite,
    };
  }

  return { error: null, user, invite };
}

export async function acceptInvite(token: string): Promise<{ ok: false; error: string }> {
  const loaded = await inviteForCurrentUser(token);
  if (!loaded.user) {
    redirect(`/login?next=${encodeURIComponent(`/invite/${token}`)}`);
  }
  if (!loaded.invite || loaded.error) {
    return { ok: false, error: loaded.error || "This invitation is invalid." };
  }

  const { invite, user } = loaded;
  if (invite.status === "REVOKED") return { ok: false, error: "This invitation was revoked." };
  if (invite.status === "DECLINED") return { ok: false, error: "This invitation was declined." };
  if (invite.status === "EXPIRED") return { ok: false, error: "This invitation has expired." };

  const existing = await db.execute({
    sql: `SELECT id FROM OrgMembership WHERE userId = ? AND orgId = ?`,
    args: [user.id, invite.orgId],
  });
  const alreadyMember = existing.rows.length > 0;

  if (invite.status !== "PENDING" && !alreadyMember) {
    return { ok: false, error: "This invitation was already used. Ask an admin to invite you again." };
  }

  if (invite.status === "PENDING") {
    const updated = await db.execute({
      sql: `
        UPDATE OrgInvite
        SET status = 'ACCEPTED', acceptedAt = ?
        WHERE id = ? AND status = 'PENDING'
      `,
      args: [new Date().toISOString(), invite.id],
    });
    if (Number(updated.rowsAffected) === 0) {
      return { ok: false, error: "This invitation is no longer pending." };
    }

    if (!alreadyMember) {
      try {
        await db.execute({
          sql: `INSERT INTO OrgMembership (id, userId, orgId, role) VALUES (?, ?, ?, ?)`,
          args: [uuidv4(), user.id, invite.orgId, invite.role],
        });
      } catch (error) {
        const membership = await db.execute({
          sql: `SELECT id FROM OrgMembership WHERE userId = ? AND orgId = ?`,
          args: [user.id, invite.orgId],
        });
        if (membership.rows.length === 0) throw error;
      }
    }
  }

  const cookieStore = await cookies();
  cookieStore.set("active-org-id", invite.orgId, { path: "/" });
  revalidateMemberViews();
  redirect("/dashboard");
}

export async function declineInvite(token: string): Promise<MemberActionResult> {
  const loaded = await inviteForCurrentUser(token);
  if (!loaded.user) return { ok: false, error: "Sign in to respond to this invitation." };
  if (!loaded.invite || loaded.error) {
    return { ok: false, error: loaded.error || "This invitation is invalid." };
  }
  if (loaded.invite.status !== "PENDING") {
    return { ok: false, error: "This invitation is no longer pending." };
  }

  const updated = await db.execute({
    sql: `UPDATE OrgInvite SET status = 'DECLINED' WHERE id = ? AND status = 'PENDING'`,
    args: [loaded.invite.id],
  });
  if (Number(updated.rowsAffected) === 0) {
    return { ok: false, error: "This invitation is no longer pending." };
  }

  revalidateMemberViews();
  return { ok: true, message: "Invitation declined." };
}

export async function signOutForInvite(token: string) {
  const invite = await getInviteByToken(token);
  const email = invite?.email ?? "";
  const next = `/invite/${token}`;
  await signOut({
    redirectTo: `/login?email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`,
  });
}
