"use client"

import { IconCirclePlusFilled, IconBell, type Icon } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"; // Import Link from next/link

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const { toggleSidebar, setOpen } = useSidebar()

  const collapse = () => {
    toggleSidebar()
    setOpen(false)
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* Quick Create */}
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            {/* Wrap with Link and use asChild */}
            <SidebarMenuButton
              tooltip="Crear Nueva Factura"
              asChild // Render the child Link component
              className="bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/90 min-w-8 duration-200 flex-grow" // Added flex-grow
            >
              <Link href="/dashboard/newfactura" onClick={collapse}>
                <IconCirclePlusFilled />
                <span>Crear Factura</span>
              </Link>
            </SidebarMenuButton>
            
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Tus enlaces */}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild>
                {/* Use Link for client-side navigation */}
                <Link
                  href={item.url}
                  className="flex items-center gap-2 p-2"
                  onClick={collapse}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
