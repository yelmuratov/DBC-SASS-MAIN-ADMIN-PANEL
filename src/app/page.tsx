"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard"); // Redirect authenticated users to dashboard
    } else {
      router.replace("/login"); // Redirect unauthenticated users to login
    }
  }, [isAuthenticated, router]);

  return <div>Loading...</div>; // Show a temporary loading state while redirecting
}
