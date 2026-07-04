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
        <div className="flex h-dvh overflow-hidden bg-background text-foreground">
          <PortalSidebar />
          <main className="flex-1 min-w-0 overflow-y-auto overscroll-contain p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">{children}</main>
        </div>
      </PortalGuard>
    </ToastProvider>
  );
}
