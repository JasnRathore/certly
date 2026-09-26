import { db } from "@/lib/db";

export type OrgRole = "ADMIN" | "MEMBER";

export type OrgMemberRecord = {
  membershipId: string;
  userId: string;
  name: string;
  email: string;
  role: OrgRole;
  createdAt: string;
};

export type OrgInviteRecord = {
  id: string;
  email: string;
  role: OrgRole;
  token: string;
  expiresAt: string;
  createdAt: string;
};

export type IncomingInviteRecord = {
  id: string;
  token: string;
  orgId: string;
  orgName: string;
  role: OrgRole;
  inviterName: string;
  expiresAt: string;
};

export type InviteDetails = {
  id: string;
  orgId: string;
  orgName: string;
  email: string;
  role: OrgRole;
  token: string;
  status: string;
  expiresAt: string;
  inviterName: string;
};

const TOKEN_RE = /^[a-f0-9]{64}$/;

export function asRole(value: unknown): OrgRole {
  return value === "ADMIN" ? "ADMIN" : "MEMBER";
}

function nowIso() {
  return new Date().toISOString();
}

export async function listOrgMembers(orgId: string): Promise<OrgMemberRecord[]> {
  const res = await db.execute({
    sql: `
      SELECT m.id AS membershipId, m.role, m.createdAt, m.userId, u.name, u.email
      FROM OrgMembership m
      JOIN User u ON u.id = m.userId
      WHERE m.orgId = ?
      ORDER BY CASE m.role WHEN 'ADMIN' THEN 0 ELSE 1 END, u.name COLLATE NOCASE
    `,
    args: [orgId],
  });

  return res.rows.map((row) => ({
    membershipId: row.membershipId as string,
    userId: row.userId as string,
    name: row.name as string,
    email: row.email as string,
    role: asRole(row.role),
    createdAt: String(row.createdAt),
  }));
}

export async function countOrgAdmins(orgId: string): Promise<number> {
  const res = await db.execute({
    sql: `SELECT COUNT(*) AS total FROM OrgMembership WHERE orgId = ? AND role = 'ADMIN'`,
    args: [orgId],
  });
  return Number(res.rows[0]?.total ?? 0);
}

export async function listPendingInvites(orgId: string): Promise<OrgInviteRecord[]> {
  const res = await db.execute({
    sql: `
      SELECT id, email, role, token, expiresAt, createdAt
      FROM OrgInvite
      WHERE orgId = ? AND status = 'PENDING' AND expiresAt > ?
      ORDER BY createdAt DESC
    `,
    args: [orgId, nowIso()],
  });

  return res.rows.map((row) => ({
    id: row.id as string,
    email: row.email as string,
    role: asRole(row.role),
    token: row.token as string,
    expiresAt: String(row.expiresAt),
    createdAt: String(row.createdAt),
  }));
}

export async function listIncomingInvites(email: string): Promise<IncomingInviteRecord[]> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return [];

  const res = await db.execute({
    sql: `
      SELECT i.id, i.token, i.orgId, i.role, i.expiresAt, o.name AS orgName, u.name AS inviterName
      FROM OrgInvite i
      JOIN Organization o ON o.id = i.orgId
      LEFT JOIN User u ON u.id = i.invitedBy
      WHERE i.email = ? AND i.status = 'PENDING' AND i.expiresAt > ?
      ORDER BY i.createdAt DESC
    `,
    args: [normalized, nowIso()],
  });

  return res.rows.map((row) => ({
    id: row.id as string,
    token: row.token as string,
    orgId: row.orgId as string,
    orgName: row.orgName as string,
    role: asRole(row.role),
    inviterName: (row.inviterName as string) || "A teammate",
    expiresAt: String(row.expiresAt),
  }));
}

export async function getInviteByToken(token: string): Promise<InviteDetails | null> {
  if (!TOKEN_RE.test(token)) return null;

  const res = await db.execute({
    sql: `
      SELECT i.id, i.orgId, i.email, i.role, i.token, i.status, i.expiresAt, o.name AS orgName, u.name AS inviterName
      FROM OrgInvite i
      JOIN Organization o ON o.id = i.orgId
      LEFT JOIN User u ON u.id = i.invitedBy
      WHERE i.token = ?
    `,
    args: [token],
  });

  const row = res.rows[0];
  if (!row) return null;

  let status = String(row.status);
  const expiresAt = String(row.expiresAt);
  if (status === "PENDING" && new Date(expiresAt).getTime() <= Date.now()) {
    await db.execute({
      sql: `UPDATE OrgInvite SET status = 'EXPIRED' WHERE id = ? AND status = 'PENDING'`,
      args: [row.id as string],
    });
    status = "EXPIRED";
  }

  return {
    id: row.id as string,
    orgId: row.orgId as string,
    orgName: row.orgName as string,
    email: row.email as string,
    role: asRole(row.role),
    token: row.token as string,
    status,
    expiresAt,
    inviterName: (row.inviterName as string) || "A teammate",
  };
}

export async function findMembershipByEmail(orgId: string, email: string) {
  const res = await db.execute({
    sql: `
      SELECT m.id, m.role, u.id AS userId
      FROM OrgMembership m
      JOIN User u ON u.id = m.userId
      WHERE m.orgId = ? AND lower(u.email) = ?
    `,
    args: [orgId, email],
  });
  return res.rows[0] ?? null;
}

export async function isOrgMember(userId: string, orgId: string) {
  const res = await db.execute({
    sql: `SELECT id FROM OrgMembership WHERE userId = ? AND orgId = ?`,
    args: [userId, orgId],
  });
  return res.rows.length > 0;
}

export async function getUserById(userId: string) {
  const res = await db.execute({
    sql: `SELECT id, name, email FROM User WHERE id = ?`,
    args: [userId],
  });
  return res.rows[0] ?? null;
}
