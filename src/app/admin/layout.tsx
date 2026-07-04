"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ToastProvider } from "@/components/ui/Toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <ToastProvider>
        {children}
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <AdminGuard>
        <div className="flex h-dvh overflow-hidden bg-background text-foreground transition-colors duration-300">
          <AdminSidebar />
          <main className="flex-1 min-w-0 overflow-y-auto overscroll-contain p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">
            {children}
          </main>
        </div>
      </AdminGuard>
    </ToastProvider>
  );
}
