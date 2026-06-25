"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // Login page should not have sidebar or guard
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AdminGuard>
      <div className="flex bg-background min-h-screen text-foreground transition-colors duration-300">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Workspace content area */}
        <main className="flex-1 h-screen overflow-y-auto p-8 md:p-12 lg:p-16">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
