import { InviteBanner } from "@/components/InviteBanner";
import { AppSidebar } from "@/components/app-sidebar";
import { getActiveOrg } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { listIncomingInvites } from "@/lib/org-members";
import { DashboardBreadcrumb } from "@/components/dashboard-breadcrumb";
import { createUserAvatarDataUri } from "@/lib/user-avatar";
import { getUserAvatarConfig } from "@/lib/user-avatar-storage";
import { ensureEventAvatars, parseEventAvatarDataUri } from "@/lib/event-avatar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, organization, allMemberships } = await getActiveOrg();
  const incomingInvites = await listIncomingInvites(user.email || "");
  const avatarConfig = await getUserAvatarConfig(user.id as string);
  const profileResult = await db.execute({
    sql: "SELECT name, email FROM User WHERE id = ?",
    args: [user.id as string],
  });
  const profile = profileResult.rows[0];

  await ensureEventAvatars();
  const eventsRes = await db.execute({
    sql: `
      SELECT e.id, e.name, a.config AS avatarConfig
      FROM Event e
      JOIN EventAvatar a ON a.eventId = e.id
      WHERE e.orgId = ?
      ORDER BY e.createdAt DESC
    `,
    args: [organization.id as string]
  });
  
  const events = eventsRes.rows.map(row => ({
    id: row.id as string,
    name: row.name as string,
    avatar: parseEventAvatarDataUri(row.avatarConfig),
  }));

  return (
    <SidebarProvider>
      <AppSidebar
        organizations={allMemberships}
        currentOrganization={organization}
        user={{
          name: (profile?.name as string | undefined) || user.email || "User",
          email: (profile?.email as string | undefined) || user.email || "",
          avatar: createUserAvatarDataUri(avatarConfig),
        }}
        events={events.slice(0, 5)}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/60">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DashboardBreadcrumb events={events} />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 md:p-10">
          <InviteBanner count={incomingInvites.length} />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
