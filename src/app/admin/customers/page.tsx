"use client";

import React, { useState, useEffect } from "react";
import { Users, Ban, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminSearchBar } from "@/components/admin/ui/AdminSearchBar";
import { AdminEmptyState } from "@/components/admin/ui/AdminEmptyState";
import { AdminLoading } from "@/components/admin/ui/AdminLoading";
import type { CustomerProfile } from "@/types/database";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    const { data } = await supabase.from("customer_profiles").select("*").order("created_at", { ascending: false });
    if (data?.length) {
      setCustomers(data);
    } else {
      // Fallback: derive from inquiries
      const { data: inq } = await supabase.from("inquiries").select("email, full_name, created_at");
      const unique = new Map<string, CustomerProfile>();
      (inq || []).forEach((i) => {
        if (i.email && !unique.has(i.email)) {
          unique.set(i.email, {
            id: i.email,
            full_name: i.full_name,
            email: i.email,
            phone: null,
            avatar_url: null,
            address: null,
            city: null,
            country: null,
            newsletter_subscribed: true,
            status: "active",
            created_at: i.created_at,
          });
        }
      });
      setCustomers(Array.from(unique.values()));
    }
    setLoading(false);
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === "active" ? "suspended" : "active";
    await supabase.from("customer_profiles").update({ status: next }).eq("id", id);
    setCustomers(customers.map((c) => (c.id === id ? { ...c, status: next as "active" | "suspended" } : c)));
  };

  const filtered = customers.filter((c) =>
    (c.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <AdminLoading />;

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <AdminPageHeader label="Commerce" title="Customer Management" description={`${customers.length} registered customers`} />
      <AdminSearchBar value={search} onChange={setSearch} placeholder="Search customers..." />

      {filtered.length === 0 ? (
        <AdminEmptyState icon={Users} title="No customers yet" description="Customer profiles appear when users sign in via the portal." />
      ) : (
        <div className="card-elevated overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {["Customer", "Email", "Status", "Joined", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-foreground/45">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border/60 hover:bg-muted/30">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary">
                        {(c.full_name || c.email)[0].toUpperCase()}
                      </div>
                      <span className="font-bold text-sm">{c.full_name || "—"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-foreground/60">{c.email}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${c.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-foreground/50">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => toggleStatus(c.id, c.status)} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center cursor-pointer transition-colors" title={c.status === "active" ? "Suspend" : "Activate"}>
                      {c.status === "active" ? <Ban size={14} className="text-rose-500" /> : <CheckCircle size={14} className="text-emerald-500" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
