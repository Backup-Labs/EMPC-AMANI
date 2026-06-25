"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Image as ImageIcon,
  BookOpen,
  GraduationCap,
  MessageSquare,
  Inbox,
  Bot,
  LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: ShoppingBag },
  { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { name: "News / Blog", href: "/admin/posts", icon: BookOpen },
  { name: "Training", href: "/admin/training", icon: GraduationCap },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { name: "Inquiries (CRM)", href: "/admin/inquiries", icon: Inbox },
  { name: "Chatbot Config", href: "/admin/chatbot", icon: Bot },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  return (
    <aside className="w-64 bg-muted border-r border-border min-h-screen flex flex-col pt-8 pb-6 px-4 shrink-0 transition-colors duration-300">
      {/* Brand logo header */}
      <div className="px-4 mb-10 flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-primary block" />
        <span className="font-black text-lg uppercase tracking-wider text-foreground">
          EMPC Admin
        </span>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 flex flex-col gap-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-[13px] uppercase tracking-wider no-underline transition-colors
                ${
                  isActive
                    ? "bg-primary text-background"
                    : "text-foreground/75 hover:bg-foreground/5 hover:text-foreground"
                }
              `}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="pt-6 border-t border-border/40">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-[13px] uppercase tracking-wider text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
