"use client"

import * as React from "react"
import {
  IconDashboard,
  IconFileAi,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconSearch,
} from "@tabler/icons-react"

import { NavMain } from "@/app/dashboard/components/nav-main"
import { NavUser } from "@/app/dashboard/components/nav-user"
import { SettingsDialog } from "@/app/dashboard/components/sibebar/settings-dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const data = {
  user: { name: "Nicko", role: "Admin" },
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
      icon: IconFileAi,
    },
    {
      title: "Plantillas",
      url: "#",
      icon: IconFolder,
    },
  ],
  navSecondary: [
    { title: "Get Help", url: "#", icon: IconHelp },
  ],
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  // Creamos un sólo array con Settings primero
  const secondaryItems = [
    { type: "settings" as const },
    ...data.navSecondary.map((item) => ({ type: "link" as const, ...item })),
  ]

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

        <SidebarMenu className="mt-auto space-y-1">
          {secondaryItems.map((item) => (
            <SidebarMenuItem
              key={item.type === "settings" ? "settings" : item.title}
            >
              {item.type === "settings" ? (
                <SettingsDialog />
              ) : (
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon className="!size-5" />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
