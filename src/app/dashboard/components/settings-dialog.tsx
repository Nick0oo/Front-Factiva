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
import { IconSettings, IconLock, IconMoonStars } from "@tabler/icons-react"
import { Separator } from '@/components/ui/separator'

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
          <DialogTitle className="flex items-center gap-2">
            <IconSettings className="h-5 w-5 text-primary" />
            Ajustes de usuario
          </DialogTitle>
          <DialogDescription>
            Personaliza tu cuenta y preferencias de la aplicación.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium">
              <IconMoonStars className="h-4 w-4 text-muted-foreground" /> Tema
            </span>
            <ModeToggle />
          </div>
          <Separator />
          <Button asChild variant="outline" className="w-full flex items-center gap-2">
            <Link href="/auth/forgot-password">
              <IconLock className="h-4 w-4" /> Cambiar contraseña
            </Link>
          </Button>
        </div>

        <DialogFooter className="flex justify-end space-x-2 mt-2">
          <DialogClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}