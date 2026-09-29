import { MembersManager } from "@/components/MembersManager";
import { SettingsTabs } from "@/components/SettingsTabs";
import { getActiveOrg } from "@/lib/auth-utils";
import { formatShortDate } from "@/lib/format";
import { listOrgMembers, listPendingInvites } from "@/lib/org-members";

export default async function DashboardMembers() {
  const { user, organization, role, allMemberships } = await getActiveOrg();
  const isAdmin = role === "ADMIN";
  const members = await listOrgMembers(organization.id);
  const invites = isAdmin ? await listPendingInvites(organization.id) : [];
  const adminCount = members.filter((member) => member.role === "ADMIN").length;

  let leaveBlockedReason: string | null = null;
  if (allMemberships.length <= 1) {
    leaveBlockedReason = "Join or create another organization before leaving this one.";
  } else if (isAdmin && adminCount <= 1) {
    leaveBlockedReason = "Promote another admin before you leave.";
  }

  return (
    <div className="max-w-full space-y-5 text-foreground">
      <SettingsTabs />

      <MembersManager
        orgName={organization.name}
        isAdmin={isAdmin}
        currentUserId={user.id as string}
        adminCount={adminCount}
        leaveBlockedReason={leaveBlockedReason}
        members={members.map((member) => ({
          membershipId: member.membershipId,
          userId: member.userId,
          name: member.name,
          email: member.email,
          avatar: member.avatar,
          role: member.role,
          joinedLabel: formatShortDate(member.createdAt),
        }))}
        invites={invites.map((invite) => ({
          id: invite.id,
          email: invite.email,
          role: invite.role,
          token: invite.token,
          sentLabel: formatShortDate(invite.createdAt),
          expiresLabel: formatShortDate(invite.expiresAt),
        }))}
      />
    </div>
  );
}
