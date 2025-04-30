"use client"

import * as React from "react"
import Link from "next/link"
import { type Icon } from "@tabler/icons-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: { title: string; url: string; icon: Icon }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { toggleSidebar } = useSidebar()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                onClick={toggleSidebar}
              >
                <Link href={item.url} className="flex items-center gap-2 p-2">
                  <item.icon />
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
