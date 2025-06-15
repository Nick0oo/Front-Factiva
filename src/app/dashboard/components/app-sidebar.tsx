"use client"

import * as React from "react"
import {
  IconAlpha,
  IconDashboard,
  IconFileAi,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconPackage,
  IconSearch,
  IconLogout,
  IconUserCircle,
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
import { SettingsDialog } from "@/app/dashboard/components/settings-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

interface UserProfile {
  name: string
  role: string
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

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
    { title: "Principal",      url: "/dashboard", icon: IconDashboard },
    { title: "Historial",      url: "/dashboard/history", icon: IconSearch },
    { title: "Clientes",       url: "/dashboard/clients", icon: IconAlpha },
    { title: "Productos",      url: "/dashboard/products", icon: IconPackage },
  ]

  const navSecondary = [
  ]

  const secondaryItems = [
  ]

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = '/Login';
      return;
    }
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      // Silenciar error
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = '/Login';
    }
  };

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
      </SidebarContent>

      <SidebarFooter>
        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando usuario…</p>
        ) : user ? (
          <div className="flex flex-col gap-2 items-start w-full px-2 py-2">
            <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
              <button
                onClick={() => setLogoutDialogOpen(true)}
                className="flex items-center text-white text-sm w-full min-h-[32px] ml-0 transition-colors hover:bg-white/10 rounded"
                type="button"
              >
                <IconLogout className="h-5 w-5" />
                <span className="ml-2">Cerrar sesión</span>
              </button>
              <DialogContent className="max-w-xs">
                <DialogHeader>
                  <DialogTitle>¿Cerrar sesión?</DialogTitle>
                </DialogHeader>
                <div className="py-2 text-sm">¿Estás seguro de que deseas cerrar sesión?</div>
                <DialogFooter className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <button className="px-3 py-1 rounded bg-muted text-sm" type="button">Cancelar</button>
                  </DialogClose>
                  <button
                    className="px-3 py-1 rounded bg-destructive text-white text-sm"
                    type="button"
                    onClick={handleLogout}
                  >
                    Sí, salir
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="flex items-center w-full min-h-[32px] hover:bg-white/10 rounded transition-colors cursor-pointer">
              <SettingsDialog />
            </div>
            <div className="flex items-center text-white text-sm w-full min-h-[32px]">
              <IconUserCircle className="h-5 w-5 text-primary" />
              <span className="ml-2 font-medium leading-tight">{user.name}</span>
              <span className="text-xs text-muted-foreground ml-2">{user.role}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-red-500">No user data</p>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
