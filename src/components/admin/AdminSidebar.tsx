"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Image as ImageIcon,
  BookOpen,
  Mail,
  Users,
  MessageSquare,
  Inbox,
  Settings,
  FileText,
  FolderOpen,
  GraduationCap,
  Bot,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCog,
  Newspaper,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Overview",
    items: [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Commerce",
    items: [
      { name: "Products", href: "/admin/products", icon: ShoppingBag },
      { name: "Orders", href: "/admin/orders", icon: Package },
      { name: "Customers", href: "/admin/customers", icon: Users },
    ],
  },
  {
    label: "Content",
    items: [
      { name: "Site Content", href: "/admin/content", icon: FileText },
      { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
      { name: "News & Blog", href: "/admin/posts", icon: BookOpen },
      { name: "Media Library", href: "/admin/media", icon: FolderOpen },
      { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
    ],
  },
  {
    label: "Communications",
    items: [
      { name: "Inquiries", href: "/admin/inquiries", icon: Inbox },
      { name: "Subscribers", href: "/admin/subscribers", icon: Mail },
      { name: "Newsletter", href: "/admin/newsletter", icon: Newspaper },
      { name: "Training", href: "/admin/training", icon: GraduationCap },
    ],
  },
  {
    label: "System",
    items: [
      { name: "Settings", href: "/admin/settings", icon: Settings },
      { name: "Staff", href: "/admin/staff", icon: UserCog },
      { name: "Chatbot", href: "/admin/chatbot", icon: Bot },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  const navContent = (
    <>
      <div className={cn("p-3 flex items-center gap-3 border-b border-border/60", collapsed && "justify-center")}>
        <div className="relative h-9 w-9 overflow-hidden rounded-full bg-white border border-border shrink-0">
          <Image src="/logo.jpg" alt="EMPC" fill sizes="36px" className="object-contain p-0.5" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm uppercase tracking-wider text-foreground m-0 truncate">EMPC Admin</p>
            <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest m-0">Staff Portal</p>
          </div>
        )}
        <button type="button" className="lg:hidden h-8 w-8 flex items-center justify-center cursor-pointer" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto overscroll-contain py-3 px-2 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-3 mb-1 text-[9px] font-bold uppercase tracking-widest text-foreground/35">{group.label}</p>
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.name : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl font-bold text-[12px] no-underline transition-all",
                      collapsed && "justify-center px-2",
                      isActive ? "bg-primary text-background shadow-sm" : "text-foreground/70 hover:bg-foreground/5"
                    )}
                  >
                    <Icon size={17} className="shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-2 border-t border-border/60 space-y-1 shrink-0">
        <div className="flex items-center gap-2 px-1 pb-1">
          <ThemeToggle />
        </div>
        <button type="button" onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-xl text-foreground/50 hover:bg-foreground/5 transition-colors cursor-pointer">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span className="text-[10px] font-bold uppercase tracking-wider">Collapse</span>}
        </button>
        <button type="button" onClick={handleLogout} className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold text-[12px] text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer", collapsed && "justify-center")}>
          <LogOut size={17} />
          {!collapsed && <span>Sign Out</span>}
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

      <aside className={cn(
        "bg-muted border-r border-border h-full flex flex-col shrink-0 transition-all duration-300 z-50",
        collapsed ? "w-18" : "w-64",
        "hidden lg:flex"
      )}>
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
