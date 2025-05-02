"use client"

import { useRouter } from 'next/navigation'
import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
  user,
}: {
  user: {
    name: string
    role: string
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    console.log("Token recuperado para logout:", token); // <-- Añade este log

    // Verifica si el token es nulo o inválido antes de hacer fetch
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      console.error("Token inválido o no encontrado en localStorage. Limpiando y redirigiendo.");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      router.push('/Login');
      return; // No intentes hacer fetch si no hay token válido
    }

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`, // Asegúrate que token no sea null aquí
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error("Error al llamar al endpoint de logout:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      router.push('/Login');
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.role}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.role}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Mi cuenta
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Mi plan
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout}>
              <IconLogout />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
