import DashboardEvents from "@/components/dashboard-events";
import DashboardInvitations from "@/components/dashboard-invitations";
import DashboardMembers from "@/components/dashboard-members";
import DashboardSettings from "@/components/dashboard-settings";
import DashboardUserSettings from "@/components/dashboard-user-settings";
import EventDetailWorkspace from "@/components/event-detail-workspace";

type DashboardSearchParams = Promise<{
  section?: string | string[];
  eventId?: string | string[];
}>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: DashboardSearchParams;
}) {
  const params = await searchParams;
  const section = firstValue(params.section) ?? "events";
  const eventId = firstValue(params.eventId);

  if (section === "event" && eventId) {
    return <EventDetailWorkspace eventId={eventId} />;
  }
  if (section === "invitations") {
    return <DashboardInvitations />;
  }
  if (section === "settings") {
    return <DashboardSettings />;
  }
  if (section === "members") {
    return <DashboardMembers />;
  }
  if (section === "account") {
    return <DashboardUserSettings />;
  }

  return <DashboardEvents />;
}
