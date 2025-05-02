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
import { useState, useEffect } from "react"
import api from "@/lib/axios"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { NavMain } from "@/app/dashboard/components/nav-main"
import { NavUser } from "@/app/dashboard/components/nav-user"
import { SettingsDialog } from "@/app/dashboard/components/sibebar/settings-dialog"

interface UserProfile {
  name: string
  role: string
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("AppSidebar useEffect ▶︎") // 👈 comprueba que aparece
    api
      .get<UserProfile>("/users/me")
      .then((res) => {
        console.log(">> /users/me:", res.data) // 👈 debería imprimir {name, role}
        setUser(res.data)
      })
      .catch((err) => {
        console.error("users/me error:", err) // 👈 atrapa errores
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const navMain = [
    { title: "Principal",      url: "#", icon: IconDashboard },
    { title: "Historial",      url: "#", icon: IconSearch },
    { title: "Automatización", url: "#", icon: IconFileAi },
    { title: "Plantillas",     url: "#", icon: IconFolder },
  ]

  const navSecondary = [
    { title: "Get Help", url: "#", icon: IconHelp },
  ]

  const secondaryItems = [
    { type: "settings" as const },
    ...navSecondary.map((item) => ({ type: "link" as const, ...item })),
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
        <NavMain items={navMain} />

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
        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando usuario…</p>
        ) : user ? (
          <NavUser user={user} />
        ) : (
          <p className="text-sm text-red-500">No user data</p>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
