"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset className="flex flex-col flex-1">
          <SiteHeader />
          <div className="flex flex-1 flex-col p-6">{children}</div>
        </SidebarInset>
    </SidebarProvider>
  );
}
