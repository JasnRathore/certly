import { auth } from "@/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createOrganizationAvatarDataUri,
  ensureOrganizationAvatars,
  parseOrganizationAvatarConfig,
} from "@/lib/organization-avatar";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }
  return session.user;
}

export async function getActiveOrg() {
  const user = await requireAuth();
  await ensureOrganizationAvatars();
  
  const cookieStore = await cookies();
  const activeOrgId = cookieStore.get('active-org-id')?.value;

  const res = await db.execute({
    sql: `
      SELECT m.*, o.name as orgName, o.gmailAddress, o.gmailAppPassword,
        a.config as avatarConfig
      FROM OrgMembership m 
      JOIN Organization o ON m.orgId = o.id 
      JOIN OrganizationAvatar a ON a.orgId = o.id
      WHERE m.userId = ?
    `,
    args: [user.id as string]
  });

  const memberships = res.rows.map(row => ({
    id: row.id as string,
    role: row.role as string,
    userId: row.userId as string,
    orgId: row.orgId as string,
    organization: {
      id: row.orgId as string,
      name: row.orgName as string,
      gmailAddress: row.gmailAddress as string | null,
      gmailAppPassword: row.gmailAppPassword as string | null,
      avatar: createOrganizationAvatarDataUri(
        parseOrganizationAvatarConfig(row.avatarConfig as string),
      ),
    }
  }));

  if (memberships.length === 0) {
    throw new Error("No organizations found for user");
  }

  // Find the active one, or default to the first one
  const activeMembership = activeOrgId 
    ? memberships.find(m => m.orgId === activeOrgId) || memberships[0]
    : memberships[0];

  return {
    user,
    organization: activeMembership.organization,
    role: activeMembership.role,
    allMemberships: memberships
  };
}

