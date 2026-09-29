"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  OrganizationMembership,
  TeamSwitcher,
} from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { CalendarDaysIcon, MailIcon, Settings2Icon } from "lucide-react"

const data = {
  navMain: [
    {
      title: "Events",
      url: "/dashboard?section=events",
      icon: <CalendarDaysIcon />,
      isActive: true,
    },
    {
      title: "Invitations",
      url: "/dashboard?section=invitations",
      icon: <MailIcon />,
    },
    {
      title: "Settings",
      url: "/dashboard?section=settings",
      icon: <Settings2Icon />,
      items: [
        {
          title: "General",
          url: "/dashboard?section=settings",
        },
        {
          title: "Members",
          url: "/dashboard?section=members",
        },
      ],
    },
  ],
}

interface sidebarprops extends React.ComponentProps<typeof Sidebar> {
  organizations: OrganizationMembership[]
  currentOrganization: OrganizationMembership["organization"]
  user: {
    name: string
    email: string
    avatar: string
  }
  events?: {
    id: string
    name: string
    avatar: string
  }[]
}

export function AppSidebar({
  organizations,
  currentOrganization,
  user,
  events = [],
  className,
}: sidebarprops) {
  return (
    <Sidebar collapsible="icon" className={className}>
      <SidebarHeader>
        <TeamSwitcher
          organizations={organizations}
          currentOrganization={currentOrganization}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects
          projects={events.map((event) => ({
            name: event.name,
            url: `/dashboard?section=event&eventId=${encodeURIComponent(event.id)}`,
            avatar: event.avatar,
          }))}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
