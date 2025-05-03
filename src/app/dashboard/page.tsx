// app/dashboard/page.tsx
"use client";

import { DataTable } from "@/app/dashboard/components/data-table";
import { SectionCards } from "@/app/dashboard/components/section-cards";

export default function DashboardHomePage() {
  return (
    <div className="flex flex-col gap-4 md:gap-6"> {/* O la estructura que prefieras */}
      <SectionCards />
      <DataTable />
    </div>
  );
}
