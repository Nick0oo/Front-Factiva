"use client"; // 👈 ESTO es lo más importante

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppSidebar } from "@/app/dashboard/components/app-sidebar"
import { DataTable } from "@/app/dashboard/components/data-table"
import { SectionCards } from "@/app/dashboard/components/section-cards"
import { SiteHeader } from "@/app/dashboard/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import data from "@/app/dashboard/data.json"

export default function DashboardLayout({
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}