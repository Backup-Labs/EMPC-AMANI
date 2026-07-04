"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Inbox,
  MessageSquare,
  GraduationCap,
  Users,
  ShoppingBag,
  Package,
  BookOpen,
  DollarSign,
  ArrowUpRight,
  Bell,
  Plus,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/ui/AdminStatCard";
import { AdminDashboardSkeleton } from "@/components/admin/ui/AdminSkeleton";
import { motion } from "framer-motion";

interface Metrics {
  inquiries: number;
  testimonials: number;
  enrollments: number;
  subscribers: number;
  products: number;
  posts: number;
  orders: number;
  revenue: number;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  time: string;
  href: string;
}

async function safeCount(table: string, filter?: { col: string; val: string | boolean }): Promise<number> {
  try {
    let q = supabase.from(table).select("*", { count: "exact", head: true });
    if (filter) q = q.eq(filter.col, filter.val);
    const { count, error } = await q;
    if (error) return 0;
    return count || 0;
  } catch {
    return 0;
  }
}

async function safeOrdersTotals(): Promise<{ count: number; revenue: number }> {
  try {
    const { data, error } = await supabase.from("orders").select("total");
    if (error || !data) return { count: 0, revenue: 0 };
    return {
      count: data.length,
      revenue: data.reduce((s, o) => s + (Number(o.total) || 0), 0),
    };
  } catch {
    return { count: 0, revenue: 0 };
  }
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics>({
    inquiries: 0, testimonials: 0, enrollments: 0, subscribers: 0,
    products: 0, posts: 0, orders: 0, revenue: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [inq, test, enr, sub, prod, posts, orders] = await Promise.all([
        safeCount("inquiries", { col: "status", val: "new" }),
        safeCount("testimonials", { col: "approved", val: false }),
        safeCount("training_enrollments", { col: "status", val: "pending" }),
        safeCount("subscribers"),
        safeCount("products"),
        safeCount("posts", { col: "published", val: true }),
        safeOrdersTotals(),
      ]);

      setMetrics({
        inquiries: inq, testimonials: test, enrollments: enr, subscribers: sub,
        products: prod, posts: posts, orders: orders.count, revenue: orders.revenue,
      });

      const { data: recentInq } = await supabase
        .from("inquiries")
        .select("id, subject, full_name, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      setActivities(
        (recentInq || []).map((i) => ({
          id: i.id,
          type: "inquiry",
          title: i.subject || `Inquiry from ${i.full_name}`,
          time: new Date(i.created_at).toLocaleDateString(),
          href: "/admin/inquiries",
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: "Add Product", href: "/admin/products", icon: ShoppingBag },
    { label: "Write Article", href: "/admin/posts", icon: BookOpen },
    { label: "View Orders", href: "/admin/orders", icon: Package },
    { label: "Send Newsletter", href: "/admin/newsletter", icon: Bell },
  ];

  const formatRevenue = (n: number) =>
    new Intl.NumberFormat("en-RW", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(n);

  if (loading) return <AdminDashboardSkeleton />;

  return (
    <div className="flex flex-col gap-5 max-w-7xl pt-12 lg:pt-0">
      <AdminPageHeader
        label="Overview"
        title="Executive Dashboard"
        description="Real-time platform metrics, recent activity, and quick management actions."
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <AdminStatCard label="New Inquiries" value={metrics.inquiries} description="Awaiting response" icon={Inbox} href="/admin/inquiries" color="blue" />
        <AdminStatCard label="Total Orders" value={metrics.orders} description="All time" icon={Package} href="/admin/orders" color="primary" />
        <AdminStatCard label="Revenue" value={formatRevenue(metrics.revenue)} description="Order total" icon={DollarSign} href="/admin/orders" color="green" />
        <AdminStatCard label="Subscribers" value={metrics.subscribers} description="Newsletter reach" icon={Users} href="/admin/subscribers" color="purple" />
        <AdminStatCard label="Pending Reviews" value={metrics.testimonials} description="Needs approval" icon={MessageSquare} href="/admin/testimonials" color="amber" />
        <AdminStatCard label="Enrollments" value={metrics.enrollments} description="Pending training" icon={GraduationCap} href="/admin/training" color="rose" />
        <AdminStatCard label="Products" value={metrics.products} description="In catalog" icon={ShoppingBag} href="/admin/products" color="primary" />
        <AdminStatCard label="Published Posts" value={metrics.posts} description="Live articles" icon={BookOpen} href="/admin/posts" color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity feed */}
        <div className="lg:col-span-2 card-elevated p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-black text-base uppercase tracking-wide text-foreground m-0">Recent Activity</h2>
            <Link href="/admin/inquiries" className="text-xs font-bold text-primary no-underline hover:underline">View all</Link>
          </div>
          {activities.length === 0 ? (
            <p className="text-sm text-foreground/50 py-8 text-center">No recent activity</p>
          ) : (
            <div className="flex flex-col gap-3">
              {activities.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={a.href} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors no-underline group">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Inbox size={14} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground m-0 group-hover:text-primary transition-colors">{a.title}</p>
                        <p className="text-[10px] text-foreground/40 m-0">{a.time}</p>
                      </div>
                    </div>
                    <ArrowUpRight size={14} className="text-foreground/25 group-hover:text-primary transition-colors" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions + system status */}
        <div className="flex flex-col gap-4">
          <div className="card-elevated p-6">
            <h2 className="font-black text-base uppercase tracking-wide text-foreground m-0 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted hover:bg-primary hover:text-background transition-all no-underline text-foreground group"
                  >
                    <Icon size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-center">{action.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="card-elevated p-6">
            <h2 className="font-black text-base uppercase tracking-wide text-foreground m-0 mb-4">System Status</h2>
            <div className="flex flex-col gap-3">
              {[
                { label: "Database", status: "Connected", ok: true },
                { label: "Media Storage", status: "Supabase", ok: true },
                { label: "AI Chatbot", status: "Active", ok: true },
              ].map((s) => (
                <div key={s.label} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground/70">{s.label}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${s.ok ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Simple analytics bar chart */}
      <div className="card-elevated p-6">
        <h2 className="font-black text-base uppercase tracking-wide text-foreground m-0 mb-6">Platform Overview</h2>
        <div className="flex items-end gap-3 h-32">
          {[
            { label: "Inquiries", val: metrics.inquiries, max: Math.max(metrics.inquiries, metrics.orders, metrics.subscribers, 1) },
            { label: "Orders", val: metrics.orders, max: Math.max(metrics.inquiries, metrics.orders, metrics.subscribers, 1) },
            { label: "Products", val: metrics.products, max: Math.max(metrics.products, metrics.posts, 1) },
            { label: "Posts", val: metrics.posts, max: Math.max(metrics.products, metrics.posts, 1) },
            { label: "Subscribers", val: metrics.subscribers, max: Math.max(metrics.inquiries, metrics.orders, metrics.subscribers, 1) },
          ].map((bar) => (
            <div key={bar.label} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(8, (bar.val / bar.max) * 100)}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full bg-primary/80 rounded-t-lg min-h-2"
              />
              <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-wider text-center">{bar.label}</span>
              <span className="text-xs font-black text-foreground">{bar.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
