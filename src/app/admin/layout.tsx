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
        <div className="flex bg-background min-h-screen text-foreground transition-colors duration-300">
          <AdminSidebar />
          <main className="flex-1 h-screen overflow-y-auto bg-background/80 p-6 md:p-10 lg:p-12">
            {children}
          </main>
        </div>
      </AdminGuard>
    </ToastProvider>
  );
}
