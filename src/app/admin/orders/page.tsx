"use client";

import React, { useState, useEffect } from "react";
import { Plus, Eye, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Order, OrderItem } from "@/types/database";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminFilterTabs } from "@/components/admin/ui/AdminFilterTabs";
import { AdminSearchBar } from "@/components/admin/ui/AdminSearchBar";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { AdminEmptyState } from "@/components/admin/ui/AdminEmptyState";
import { AdminLoading } from "@/components/admin/ui/AdminLoading";

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "processing", label: "Processing" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

const statusColors: Record<string, string> = {
  pending: "bg-blue-100 text-blue-800",
  confirmed: "bg-indigo-100 text-indigo-800",
  processing: "bg-amber-100 text-amber-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-800",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tableMissing, setTableMissing] = useState(false);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error?.code === "42P01" || error?.message?.includes("does not exist")) {
      setTableMissing(true);
      setOrders([]);
    } else if (!error) {
      setOrders((data || []).map(normalizeOrder));
    }
    setLoading(false);
  };

  const normalizeOrder = (o: Record<string, unknown>): Order => ({
    id: o.id as string,
    customer_id: o.customer_id as string | null,
    customer_email: o.customer_email as string,
    customer_name: o.customer_name as string,
    items: (o.items as OrderItem[]) || [],
    subtotal: Number(o.subtotal) || 0,
    total: Number(o.total) || 0,
    status: o.status as Order["status"],
    payment_status: o.payment_status as Order["payment_status"],
    shipping_address: o.shipping_address as string | null,
    notes: o.notes as string | null,
    created_at: o.created_at as string,
  });

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (!error) {
      setOrders(orders.map((o) => (o.id === id ? { ...o, status: status as Order["status"] } : o)));
      if (selected?.id === id) setSelected({ ...selected, status: status as Order["status"] });
    }
  };

  const filtered = orders.filter((o) => {
    const matchStatus = filter === "all" || o.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || o.customer_name.toLowerCase().includes(q) || o.customer_email.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("en-RW", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(n);

  if (loading) return <AdminLoading />;

  return (
    <div className="flex flex-col gap-8 max-w-7xl">
      <AdminPageHeader
        label="Commerce"
        title="Order Management"
        description="Track orders, update statuses, and manage customer purchases."
        actions={
          <button onClick={() => setModalOpen(true)} className="inline-flex h-11 items-center gap-2 px-5 rounded-full bg-primary text-background font-bold text-sm hover:opacity-90 transition-all cursor-pointer">
            <Plus size={16} /> Create Order
          </button>
        }
      />

      {tableMissing && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
          Orders table not found. Run <code className="bg-amber-100 px-1 rounded">supabase/migrations/001_portal_extensions.sql</code> in your Supabase SQL editor.
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <AdminFilterTabs tabs={STATUS_TABS.map((t) => ({ ...t, count: t.id === "all" ? orders.length : orders.filter((o) => o.status === t.id).length }))} active={filter} onChange={setFilter} />
        <AdminSearchBar value={search} onChange={setSearch} placeholder="Search orders..." />
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState icon={Package} title="No orders yet" description="Orders will appear here when customers place them." />
      ) : (
        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {["Order", "Customer", "Total", "Status", "Payment", "Date", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-foreground/45">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-border/60 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4 font-bold text-sm text-foreground">#{order.id.slice(0, 8)}</td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-sm m-0">{order.customer_name}</p>
                      <p className="text-xs text-foreground/45 m-0">{order.customer_email}</p>
                    </td>
                    <td className="px-5 py-4 font-black text-sm text-primary">{formatPrice(order.total)}</td>
                    <td className="px-5 py-4">
                      <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border-0 cursor-pointer ${statusColors[order.status]}`}>
                        {STATUS_TABS.filter((t) => t.id !== "all").map((s) => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${order.payment_status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-foreground/50">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => setSelected(order)} className="h-8 w-8 rounded-full bg-muted hover:bg-primary hover:text-background flex items-center justify-center transition-colors cursor-pointer">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AdminModal open={!!selected} onClose={() => setSelected(null)} title="Order Details" size="lg">
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-[10px] font-bold uppercase text-foreground/40 m-0 mb-1">Customer</p><p className="font-bold m-0">{selected.customer_name}</p></div>
              <div><p className="text-[10px] font-bold uppercase text-foreground/40 m-0 mb-1">Email</p><p className="font-bold m-0">{selected.customer_email}</p></div>
              <div><p className="text-[10px] font-bold uppercase text-foreground/40 m-0 mb-1">Total</p><p className="font-black text-primary m-0">{formatPrice(selected.total)}</p></div>
              <div><p className="text-[10px] font-bold uppercase text-foreground/40 m-0 mb-1">Shipping</p><p className="font-medium text-sm m-0">{selected.shipping_address || "—"}</p></div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-foreground/40 mb-2">Items</p>
              {selected.items.map((item, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-border/50 text-sm">
                  <span>{item.title} × {item.quantity}</span>
                  <span className="font-bold">{formatPrice(item.unit_price * item.quantity)}</span>
                </div>
              ))}
            </div>
            {selected.notes && <p className="text-sm text-foreground/60 bg-muted p-3 rounded-xl m-0">{selected.notes}</p>}
          </div>
        )}
      </AdminModal>

      <CreateOrderModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={fetchOrders} />
    </div>
  );
}

function CreateOrderModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [total, setTotal] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const amount = parseFloat(total) || 0;
    await supabase.from("orders").insert([{
      customer_name: name,
      customer_email: email,
      items: [{ title: "Custom Order", quantity: 1, unit_price: amount }],
      subtotal: amount,
      total: amount,
      status: "pending",
      payment_status: "unpaid",
    }]);
    setSubmitting(false);
    onCreated();
    onClose();
    setName(""); setEmail(""); setTotal("");
  };

  return (
    <AdminModal open={open} onClose={onClose} title="Create Order">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input required placeholder="Customer name" value={name} onChange={(e) => setName(e.target.value)} className="h-11 px-4 rounded-xl border border-border bg-muted/50 text-sm font-medium focus:outline-none focus:border-primary" />
        <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 px-4 rounded-xl border border-border bg-muted/50 text-sm font-medium focus:outline-none focus:border-primary" />
        <input required type="number" placeholder="Total (RWF)" value={total} onChange={(e) => setTotal(e.target.value)} className="h-11 px-4 rounded-xl border border-border bg-muted/50 text-sm font-medium focus:outline-none focus:border-primary" />
        <button type="submit" disabled={submitting} className="h-11 rounded-full bg-primary text-background font-bold hover:opacity-90 cursor-pointer disabled:opacity-50">
          {submitting ? "Creating..." : "Create Order"}
        </button>
      </form>
    </AdminModal>
  );
}
