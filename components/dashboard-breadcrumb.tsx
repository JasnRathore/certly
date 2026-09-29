"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const sectionLabels: Record<string, string> = {
  events: "Events",
  invitations: "Invitations",
  settings: "Settings",
  members: "Members",
  account: "Account",
};

export function DashboardBreadcrumb({
  events,
}: {
  events: { id: string; name: string }[];
}) {
  const searchParams = useSearchParams();
  const section = searchParams.get("section") ?? "events";
  const eventId = searchParams.get("eventId");
  const label = section === "event"
    ? events.find((event) => event.id === eventId)?.name ?? "Event"
    : sectionLabels[section] ?? "Events";
  const isEventsSection = section === "events";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {!isEventsSection && (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard?section=events">Events</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{label}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
        {isEventsSection && (
          <BreadcrumbItem>
            <BreadcrumbPage>Events</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
