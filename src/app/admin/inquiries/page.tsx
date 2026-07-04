"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Eye, Inbox } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { AdminSearchBar } from "@/components/admin/ui/AdminSearchBar";
import { AdminFilterTabs } from "@/components/admin/ui/AdminFilterTabs";
import { AdminLoading } from "@/components/admin/ui/AdminLoading";
import { AdminEmptyState } from "@/components/admin/ui/AdminEmptyState";
import { useToast } from "@/components/ui/Toast";

interface Inquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  inquiry_type: "furniture" | "custom_order" | "training" | "general";
  status: "new" | "in_progress" | "resolved";
  created_at: string;
}

const statusColors: Record<string, string> = {
  resolved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  in_progress: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  new: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
};

export default function AdminInquiries() {
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => { fetchInquiries(); }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setInquiries(data || []);
    } catch {
      toast("Failed to load inquiries", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: Inquiry["status"]) => {
    try {
      const { error } = await supabase.from("inquiries").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
      setInquiries(inquiries.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq)));
      if (selectedInquiry?.id === id) setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      toast("Status updated");
    } catch {
      toast("Failed to update status", "error");
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return inquiries.filter((inq) => {
      const matchesStatus = statusFilter === "all" || inq.status === statusFilter;
      const matchesType = typeFilter === "all" || inq.inquiry_type === typeFilter;
      const matchesSearch = !search || [inq.full_name, inq.email, inq.subject, inq.message].some((f) => f?.toLowerCase().includes(q));
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [inquiries, statusFilter, typeFilter, search]);

  const statusTabs = [
    { id: "all", label: "All", count: inquiries.length },
    { id: "new", label: "New", count: inquiries.filter((i) => i.status === "new").length },
    { id: "in_progress", label: "In Progress", count: inquiries.filter((i) => i.status === "in_progress").length },
    { id: "resolved", label: "Resolved", count: inquiries.filter((i) => i.status === "resolved").length },
  ];

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader label="CRM" title="Customer Inquiries" description="Monitor contact submissions, orders, and general inquiries." />

      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between flex-wrap">
        <AdminFilterTabs tabs={statusTabs} active={statusFilter} onChange={setStatusFilter} />
        <div className="flex flex-wrap gap-3">
          <AdminSearchBar value={search} onChange={setSearch} placeholder="Search CRM..." />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-11 px-4 rounded-full border border-border bg-muted/50 text-xs font-black uppercase tracking-wider cursor-pointer focus:outline-none focus:border-primary">
            <option value="all">All Types</option>
            <option value="furniture">Furniture</option>
            <option value="custom_order">Custom Order</option>
            <option value="training">Training</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      {loading ? (
        <AdminLoading />
      ) : filtered.length === 0 ? (
        <AdminEmptyState icon={Inbox} title="No inquiries" description="No inquiries match your current filters." />
      ) : (
        <div className="card-elevated overflow-hidden border border-border/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/45">Sender</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/45">Subject</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/45">Type</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/45">Date</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/45">Status</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/45 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.map((inq) => (
                  <tr key={inq.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-sm block">{inq.full_name}</span>
                      <span className="text-xs text-foreground/50">{inq.email}</span>
                    </td>
                    <td className="p-4 max-w-xs">
                      <span className="font-bold text-sm line-clamp-1">{inq.subject || "No Subject"}</span>
                      <span className="text-xs text-foreground/55 line-clamp-1">{inq.message}</span>
                    </td>
                    <td className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/55">{inq.inquiry_type}</td>
                    <td className="p-4 text-xs font-bold text-foreground/70">{new Date(inq.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <select value={inq.status} onChange={(e) => handleStatusChange(inq.id, e.target.value as Inquiry["status"])} className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border cursor-pointer focus:outline-none ${statusColors[inq.status]}`}>
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => setSelectedInquiry(inq)} className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-colors cursor-pointer" aria-label="View">
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AdminModal open={!!selectedInquiry} onClose={() => setSelectedInquiry(null)} title="Inquiry Details" size="lg">
        {selectedInquiry && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4 bg-muted/40 p-4 rounded-xl border border-border/40 text-sm">
              <div><span className="text-[9px] font-black uppercase text-foreground/40 block">From</span><span className="font-bold">{selectedInquiry.full_name}</span></div>
              <div><span className="text-[9px] font-black uppercase text-foreground/40 block">Email</span><span className="font-bold">{selectedInquiry.email || "—"}</span></div>
              <div><span className="text-[9px] font-black uppercase text-foreground/40 block">Phone</span><span className="font-mono">{selectedInquiry.phone || "—"}</span></div>
              <div><span className="text-[9px] font-black uppercase text-foreground/40 block">Submitted</span><span className="font-bold">{new Date(selectedInquiry.created_at).toLocaleString()}</span></div>
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-foreground/40 tracking-wider">Message</span>
              <div className="p-4 mt-2 bg-muted/20 border border-border/30 rounded-xl">
                <p className="text-sm leading-relaxed m-0 whitespace-pre-wrap">{selectedInquiry.message}</p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border/40">
              <span className="text-xs font-black text-primary uppercase">{selectedInquiry.inquiry_type}</span>
              <select value={selectedInquiry.status} onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value as Inquiry["status"])} className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full border cursor-pointer ${statusColors[selectedInquiry.status]}`}>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
