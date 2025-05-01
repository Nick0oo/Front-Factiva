"use client"

import * as React from "react"
import Link from "next/link"
import { ModeToggle } from "@/components/darkmode"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { IconSettings } from "@tabler/icons-react"

export function SettingsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton className="gap-x-2">
          <IconSettings className="!size-5" />
          <span>Ajustes</span>
        </SidebarMenuButton>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajustes</DialogTitle>
          <DialogDescription>
            Personaliza tu cuenta y preferencias de la aplicación.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
        <div className="flex items-center justify-between">
            <span>Tema</span>
            <ModeToggle />
          </div>
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/forgot-password">🔑 Cambiar contraseña</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/2fa">🔒 Activar 2FA</Link>
          </Button>

          
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}