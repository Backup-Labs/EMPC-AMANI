"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Heart,
  User,
  MessageSquare,
  LogOut,
  Home,
  Menu,
  X,
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/portal/login");
  };

  const navContent = (
    <>
      <div className="p-5 flex items-center gap-3 border-b border-border/60">
        <div className="relative h-9 w-9 rounded-full overflow-hidden bg-white border border-border shrink-0">
          <Image src="/logo.jpg" alt="EMPC" fill sizes="36px" className="object-contain p-0.5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-sm tracking-tight m-0">Customer Portal</p>
          <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest m-0">EMPC-AMANI</p>
        </div>
        <button type="button" className="lg:hidden h-8 w-8 flex items-center justify-center cursor-pointer" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto overscroll-contain">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
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
        <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-[13px] no-underline text-foreground/50 hover:bg-foreground/5 mt-2">
          <Home size={17} /> Back to Website
        </Link>
      </nav>

      <div className="p-3 border-t border-border/60 flex items-center gap-2 shrink-0">
        <NotificationBell />
        <ThemeToggle />
        <button onClick={handleLogout} className="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-[13px] text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 cursor-pointer transition-colors">
          <LogOut size={17} /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 h-10 w-10 rounded-full bg-background border border-border shadow-md flex items-center justify-center cursor-pointer"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setMobileOpen(false)} />
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex w-64 bg-muted border-r border-border h-full flex-col shrink-0">
        {navContent}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="lg:hidden fixed inset-y-0 left-0 w-64 bg-muted border-r border-border flex flex-col z-50 shadow-xl"
          >
            {navContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
