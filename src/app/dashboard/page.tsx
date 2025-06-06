// app/dashboard/page.tsx
"use client";

import { DataTable } from "@/app/dashboard/components/data-table";
import SectionCards from "./components/SectionCards";
import RecentInvoices from "./components/RecentInvoices";
import QuickSummaryAndTips from "./components/QuickSummaryAndTips";

export default function DashboardHomePage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <SectionCards />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        <RecentInvoices />
        <QuickSummaryAndTips />
      </div>
    </div>
  );
}
