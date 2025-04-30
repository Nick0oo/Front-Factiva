"use client"

import * as React from "react"
import {
  IconCamera,
  IconDashboard,
  IconFileAi,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react"

import { NavMain } from "@/app/dashboard/components/nav-main"
import { NavSecondary } from "@/app/dashboard/components/nav-secondary"
import { NavUser } from "@/app/dashboard/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Nicko",
    role: "Admin",
  },
  navMain: [
    {
      title: "Principal",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Historial",
      url: "#",
      icon: IconSearch,
    },
    {
      title: "Automatización",
      url: "#",
      icon:  IconFileAi,
    },
    {
      title: "Plantillas",
      url: "#",
      icon: IconFolder,
    },

  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Factiva.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
