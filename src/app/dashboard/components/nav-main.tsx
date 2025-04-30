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

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  // Ahora obtenemos también setOpen para forzar cierre en desktop
  const { toggleSidebar, setOpen } = useSidebar()

  // Función común para colapsar siempre
  const collapse = () => {
    toggleSidebar()   // alterna en móvil
    setOpen(false)    // cierra en desktop
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* Quick Create */}
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              onClick={collapse}
              className="bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/90 min-w-8 duration-200"
            >
              <IconCirclePlusFilled />
              <span>Crear Factura</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              variant="outline"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
            >
              <IconBell />
              <span className="sr-only">Notificaciones</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Tus enlaces */}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild>
                <a
                  href={item.url}
                  className="flex items-center gap-2 p-2"
                  onClick={collapse}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
