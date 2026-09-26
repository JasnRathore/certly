import { InviteBanner } from "@/components/InviteBanner";
import { Sidebar } from "@/components/Sidebar";
import { getActiveOrg } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { listIncomingInvites } from "@/lib/org-members";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, organization, allMemberships } = await getActiveOrg();
  const incomingInvites = await listIncomingInvites(user.email || "");

  const eventsRes = await db.execute({
    sql: `SELECT * FROM Event WHERE orgId = ? ORDER BY createdAt DESC`,
    args: [organization.id as string]
  });
  
  const events = eventsRes.rows.map(row => ({
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    status: row.status as string,
  }));

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar 
        events={events as any} 
        currentOrg={organization} 
        memberships={allMemberships} 
        userName={user.name!}
        userEmail={user.email!}
        incomingInviteCount={incomingInvites.length}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto bg-black p-6 md:p-10">
          <InviteBanner count={incomingInvites.length} />
          {children}
        </main>
      </div>
    </div>
  );
}
