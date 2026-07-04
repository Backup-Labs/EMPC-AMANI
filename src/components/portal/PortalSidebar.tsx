"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Heart,
  User,
  MessageSquare,
  LogOut,
  Home,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { NotificationBell } from "@/components/portal/NotificationBell";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/portal/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/portal/orders", icon: Package },
  { name: "Wishlist", href: "/portal/wishlist", icon: Heart },
  { name: "Profile", href: "/portal/profile", icon: User },
  { name: "Support", href: "/portal/support", icon: MessageSquare },
];

export function PortalSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/portal/login");
  };

  return (
    <aside className="w-64 bg-muted border-r border-border min-h-screen flex flex-col shrink-0">
      <div className="p-5 flex items-center gap-3 border-b border-border/60">
        <div className="relative h-9 w-9 rounded-full overflow-hidden bg-white border border-border">
          <Image src="/logo.jpg" alt="EMPC" fill sizes="36px" className="object-contain p-0.5" />
        </div>
        <div>
          <p className="font-black text-sm tracking-tight m-0">Customer Portal</p>
          <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest m-0">EMPC-AMANI</p>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-[13px] no-underline transition-all",
                isActive ? "bg-primary text-background shadow-sm" : "text-foreground/70 hover:bg-foreground/5"
              )}
            >
              <Icon size={17} />
              {item.name}
            </Link>
          );
        })}
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-[13px] no-underline text-foreground/50 hover:bg-foreground/5 mt-2">
          <Home size={17} /> Back to Website
        </Link>
      </nav>

      <div className="p-3 border-t border-border/60 flex items-center gap-2">
        <NotificationBell />
        <ThemeToggle />
        <button onClick={handleLogout} className="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-[13px] text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 cursor-pointer transition-colors">
          <LogOut size={17} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
