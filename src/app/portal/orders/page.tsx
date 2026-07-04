"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Download } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { downloadInvoice } from "@/lib/portal/invoice";
import type { Order } from "@/types/database";

export default function PortalOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.email) return;
      const { data } = await supabase.from("orders").select("*").eq("customer_email", session.user.email).order("created_at", { ascending: false });
      setOrders((data || []).map((o) => ({
        ...o,
        items: o.items || [],
        subtotal: Number(o.subtotal),
        total: Number(o.total),
      })));
      setLoading(false);
    })();
  }, []);

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("en-RW", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(n);

  const statusColors: Record<string, string> = {
    pending: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    shipped: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
    cancelled: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div>
        <span className="font-bold text-[11px] uppercase tracking-widest text-primary">Account</span>
        <h1 className="font-black text-[2rem] leading-none tracking-tight mt-2 m-0">My Orders</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" /></div>
      ) : orders.length === 0 ? (
        <div className="card-elevated p-12 text-center">
          <Package size={32} className="mx-auto text-foreground/25 mb-4" />
          <p className="font-bold text-foreground/50 m-0">No orders yet.</p>
          <Link href="/products" className="inline-block mt-4 text-sm font-bold text-primary no-underline">Browse Products →</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="card-elevated p-6">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <p className="font-black text-base m-0">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-foreground/45 m-0 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${statusColors[order.status] || "bg-muted"}`}>{order.status}</span>
                  <span className="font-black text-primary">{formatPrice(order.total)}</span>
                  <button onClick={() => downloadInvoice(order)} className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full border border-border text-xs font-bold hover:bg-primary hover:text-background transition-colors cursor-pointer">
                    <Download size={14} /> Invoice
                  </button>
                </div>
              </div>
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1.5 border-t border-border/50">
                  <span>{item.title} × {item.quantity}</span>
                  <span className="font-bold">{formatPrice(item.unit_price * item.quantity)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
