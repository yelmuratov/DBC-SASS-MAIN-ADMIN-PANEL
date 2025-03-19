"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import {Spinner} from "@heroui/spinner";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { loadUser, isAuthenticated, isSuperUser } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      await loadUser();
      setLoading(false);
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== "/login") {
      router.replace("/login"); 
    }
  }, [isAuthenticated, pathname, loading, router]);

  if (loading || isSuperUser === undefined) {
    return <Spinner />;
  }

  if (isAuthenticated && !isSuperUser) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-bold">
        You are not a super user and you don't have permission for it.
      </div>
    );
  }

  return <>{children}</>;
}
