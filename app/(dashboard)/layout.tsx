import { Sidebar } from "@/components/Sidebar";
import { getActiveOrg } from "@/lib/auth-utils";
import { db } from "@/lib/db";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, organization, allMemberships } = await getActiveOrg();

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
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto bg-black p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
