"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Heart, MessageSquare, Bell, ArrowUpRight, Plus, Star, Clock } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { useToast } from "@/components/ui/Toast";
import { getRecentlyViewed, type RecentProduct } from "@/lib/portal/recentlyViewed";
import { formatPrice } from "@/lib/data/products";
import type { Order, CustomerProfile } from "@/types/database";

export default function PortalDashboard() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiryCount, setInquiryCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [inquiryType, setInquiryType] = useState("furniture");

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const email = session.user.email || "";
    const [{ data: prof }, { data: ords }, { count: inqCount }, { count: wishCount }, { count: notifCount }] = await Promise.all([
      supabase.from("customer_profiles").select("*").eq("id", session.user.id).maybeSingle(),
      supabase.from("orders").select("*").eq("customer_email", email).order("created_at", { ascending: false }).limit(5),
      supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("email", email),
      supabase.from("wishlist").select("*", { count: "exact", head: true }).eq("user_id", session.user.id),
      supabase.from("notifications").select("*", { count: "exact", head: true }).eq("user_id", session.user.id).eq("read", false),
    ]);

    setProfile(prof || {
      id: session.user.id,
      full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || email.split("@")[0],
      email,
      phone: null, avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
      address: null, city: null, country: null, newsletter_subscribed: true, status: "active", created_at: new Date().toISOString(),
    });
    setOrders((ords || []).map(normalizeOrder));
    setInquiryCount(inqCount || 0);
    setWishlistCount(wishCount || 0);
    setNotificationCount(notifCount || 0);
    setRecentProducts(getRecentlyViewed());
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const normalizeOrder = (o: Record<string, unknown>): Order => ({
    id: o.id as string, customer_id: o.customer_id as string | null,
    customer_email: o.customer_email as string, customer_name: o.customer_name as string,
    items: (o.items as Order["items"]) || [], subtotal: Number(o.subtotal), total: Number(o.total),
    status: o.status as Order["status"], payment_status: o.payment_status as Order["payment_status"],
    shipping_address: o.shipping_address as string | null, notes: o.notes as string | null,
    created_at: o.created_at as string,
  });

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    await supabase.from("inquiries").insert([{
      full_name: profile.full_name || profile.email.split("@")[0],
      email: profile.email, subject, message, inquiry_type: inquiryType, status: "new",
    }]);
    setModalOpen(false);
    setSubject(""); setMessage("");
    toast("Inquiry submitted — we'll respond soon!");
    loadData();
  };

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("en-RW", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(n);

  const statusColors: Record<string, string> = {
    pending: "bg-blue-100 text-blue-800", confirmed: "bg-indigo-100 text-indigo-800",
    processing: "bg-amber-100 text-amber-800", shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-emerald-100 text-emerald-800",
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <span className="font-bold text-[11px] uppercase tracking-widest text-primary">Dashboard</span>
        <h1 className="font-black text-[2rem] md:text-[2.6rem] leading-none tracking-[-0.04em] mt-2 mb-0">
          Welcome back, {profile?.full_name?.split(" ")[0] || "there"}.
        </h1>
        <p className="text-foreground/50 text-sm mt-2 font-medium">{profile?.email}</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Orders", value: orders.length, icon: Package, href: "/portal/orders", color: "text-primary" },
          { label: "Wishlist", value: wishlistCount, icon: Heart, href: "/portal/wishlist", color: "text-rose-500" },
          { label: "Inquiries", value: inquiryCount, icon: MessageSquare, href: "#", color: "text-blue-600" },
          { label: "Notifications", value: notificationCount, icon: Bell, href: "/portal/dashboard", color: "text-amber-600" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link href={stat.href} className="card-elevated p-5 flex flex-col gap-3 no-underline text-foreground hover:shadow-md transition-shadow block">
                <Icon size={18} className={stat.color} />
                <p className="font-black text-2xl m-0">{stat.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/45 m-0">{stat.label}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="card-elevated p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-black text-sm uppercase tracking-wide m-0">Recent Orders</h2>
            <Link href="/portal/orders" className="text-xs font-bold text-primary no-underline">View all</Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-foreground/50 py-6 text-center">No orders yet. Browse our <Link href="/products" className="text-primary">products</Link>.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex justify-between items-center p-3 rounded-xl bg-muted/50">
                  <div>
                    <p className="font-bold text-sm m-0">#{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-foreground/45 m-0">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm text-primary m-0">{formatPrice(order.total)}</p>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColors[order.status] || "bg-muted text-foreground"}`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="card-elevated p-6">
          <h2 className="font-black text-sm uppercase tracking-wide m-0 mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "New Inquiry", action: () => setModalOpen(true), icon: Plus },
              { label: "Browse Products", href: "/products", icon: Package },
              { label: "My Wishlist", href: "/portal/wishlist", icon: Heart },
              { label: "Leave Review", href: "/portal/support", icon: Star },
            ].map((item) => {
              const Icon = item.icon;
              const cls = "flex flex-col items-center gap-2 p-4 rounded-xl bg-muted hover:bg-primary hover:text-background transition-all cursor-pointer text-foreground no-underline";
              return item.href ? (
                <Link key={item.label} href={item.href} className={cls}><Icon size={18} /><span className="text-[10px] font-bold uppercase tracking-wider text-center">{item.label}</span></Link>
              ) : (
                <button key={item.label} onClick={item.action} className={cls}><Icon size={18} /><span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span></button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recently viewed */}
      {recentProducts.length > 0 && (
        <div className="card-elevated p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-black text-sm uppercase tracking-wide m-0 flex items-center gap-2"><Clock size={16} /> Recently Viewed</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {recentProducts.slice(0, 4).map((p) => (
              <Link key={p.id} href={`/products/${p.id}`} className="group block no-underline text-foreground">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-muted mb-2">
                  <Image src={p.image_url} alt={p.title} fill sizes="120px" className="object-cover group-hover:scale-105 transition-transform" />
                </div>
                <p className="font-bold text-xs m-0 line-clamp-1 group-hover:text-primary">{p.title}</p>
                <p className="text-[10px] font-bold text-primary m-0">{formatPrice(p.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recommended */}
      <div className="card-elevated p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-black text-sm uppercase tracking-wide m-0">Recommended for You</h2>
          <Link href="/products" className="inline-flex items-center gap-1 text-xs font-bold text-primary no-underline">
            Shop all <ArrowUpRight size={14} />
          </Link>
        </div>
        <p className="text-sm text-foreground/50 m-0">Explore our latest handcrafted furniture collections.</p>
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="New Support Inquiry">
        <form onSubmit={handleInquiry} className="flex flex-col gap-4">
          <input required placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="h-11 px-4 rounded-xl border border-border bg-muted/50 text-sm font-medium focus:outline-none focus:border-primary" />
          <select value={inquiryType} onChange={(e) => setInquiryType(e.target.value)} className="h-11 px-4 rounded-xl border border-border bg-muted/50 text-sm font-medium cursor-pointer">
            <option value="furniture">Furniture Inquiry</option>
            <option value="custom_order">Custom Order</option>
            <option value="training">Training</option>
            <option value="general">General</option>
          </select>
          <textarea required placeholder="Your message..." value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="px-4 py-3 rounded-xl border border-border bg-muted/50 text-sm focus:outline-none focus:border-primary resize-y" />
          <button type="submit" className="h-11 rounded-full bg-primary text-background font-bold hover:opacity-90 cursor-pointer">Send Inquiry</button>
        </form>
      </AdminModal>
    </div>
  );
}
