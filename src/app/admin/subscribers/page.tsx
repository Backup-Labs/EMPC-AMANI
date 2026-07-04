"use client";

import React, { useState, useEffect } from "react";
import { Download, Trash2, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminSearchBar } from "@/components/admin/ui/AdminSearchBar";
import { AdminEmptyState } from "@/components/admin/ui/AdminEmptyState";
import { AdminLoading } from "@/components/admin/ui/AdminLoading";
import type { Subscriber } from "@/types/database";

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchSubs(); }, []);

  const fetchSubs = async () => {
    setLoading(true);
    const { data } = await supabase.from("subscribers").select("*").order("created_at", { ascending: false });
    setSubscribers(data || []);
    setLoading(false);
  };

  const handleDelete = async (email: string) => {
    if (!confirm(`Remove ${email} from subscribers?`)) return;
    await supabase.from("subscribers").delete().eq("email", email);
    setSubscribers(subscribers.filter((s) => s.email !== email));
  };

  const handleExport = () => {
    const csv = "email,status,created_at\n" + filtered.map((s) => `${s.email},${s.status || "active"},${s.created_at || ""}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
  };

  const filtered = subscribers.filter((s) => s.email.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <AdminLoading />;

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <AdminPageHeader
        label="Communications"
        title="Newsletter Subscribers"
        description={`${subscribers.length} total subscribers`}
        actions={
          <button onClick={handleExport} className="inline-flex h-11 items-center gap-2 px-5 rounded-full border border-border font-bold text-sm hover:bg-muted transition-colors cursor-pointer">
            <Download size={16} /> Export CSV
          </button>
        }
      />

      <AdminSearchBar value={search} onChange={setSearch} placeholder="Search by email..." />

      {filtered.length === 0 ? (
        <AdminEmptyState icon={Mail} title="No subscribers" description="Subscribers will appear when users sign up via the newsletter form." />
      ) : (
        <div className="card-elevated overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {["Email", "Status", "Subscribed", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-foreground/45">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr key={sub.email} className="border-b border-border/60 hover:bg-muted/30">
                  <td className="px-5 py-3 font-bold text-sm">{sub.email}</td>
                  <td className="px-5 py-3">
                    <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">{sub.status || "active"}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-foreground/50">{sub.created_at ? new Date(sub.created_at).toLocaleDateString() : "—"}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => handleDelete(sub.email)} className="h-8 w-8 rounded-full hover:bg-rose-50 text-rose-500 flex items-center justify-center cursor-pointer transition-colors">
                      <Trash2 size={14} />
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
