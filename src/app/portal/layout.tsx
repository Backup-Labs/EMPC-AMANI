"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { PortalGuard } from "@/components/portal/PortalGuard";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { ToastProvider } from "@/components/ui/Toast";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/portal/login";

  if (isLogin) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  return (
    <ToastProvider>
      <PortalGuard>
        <div className="flex bg-background min-h-screen text-foreground">
          <PortalSidebar />
          <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12">{children}</main>
        </div>
      </PortalGuard>
    </ToastProvider>
  );
}
