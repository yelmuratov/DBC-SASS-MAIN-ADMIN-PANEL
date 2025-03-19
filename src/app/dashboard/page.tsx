// app/dashboard/page.tsx
"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardPage() {
  const { isAuthenticated, isSuperUser, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  if (!isSuperUser) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-bold">
        You are not a super user and you don't have permission for it.
      </div>
    );
  }

  // Default user data in case user is null
  const userData = typeof user === "object" && user !== null
    ? user
    : { username: "Guest", email: "", avatar: "" };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" user={userData} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}