"use client"; // 👈 ESTO es lo más importante

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppSidebar } from "@/app/dashboard/components/app-sidebar";
import { SiteHeader } from "@/app/dashboard/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children, // <-- Asegúrate de que children esté aquí
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Login");
    }
  }, [router]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 50)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="flex-1 p-4 md:p-6 lg:p-8"> {/* Ajusta padding si es necesario */}
            {children} {/* <-- Renderiza el contenido de la página actual */}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}