"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Bell, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  href: string | null;
  created_at: string;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    setNotifications(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const unread = notifications.filter((n) => !n.read).length;

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", session.user.id).eq("read", false);
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative h-9 w-9 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:bg-muted transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-background text-[9px] font-black flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              className="absolute right-0 top-full mt-2 w-80 z-50 card-elevated border border-border shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="font-black text-xs uppercase tracking-wider">Notifications</span>
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-[10px] font-bold text-primary cursor-pointer flex items-center gap-1">
                    <Check size={12} /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {loading ? (
                  <p className="text-sm text-foreground/50 p-4 text-center">Loading...</p>
                ) : notifications.length === 0 ? (
                  <p className="text-sm text-foreground/50 p-6 text-center">No notifications yet.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => { if (!n.read) markRead(n.id); if (n.href) window.location.href = n.href; }}
                      className={`px-4 py-3 border-b border-border/50 cursor-pointer hover:bg-muted/50 transition-colors ${!n.read ? "bg-primary/5" : ""}`}
                    >
                      <p className="font-bold text-sm m-0">{n.title}</p>
                      <p className="text-xs text-foreground/55 mt-0.5 m-0 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-foreground/35 mt-1 m-0">{new Date(n.created_at).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
              <Link href="/portal/dashboard" onClick={() => setOpen(false)} className="block text-center text-xs font-bold text-primary py-3 no-underline border-t border-border hover:bg-muted/30">
                View dashboard
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
