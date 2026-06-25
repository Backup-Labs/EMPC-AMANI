"use client";

import React, { useState, useEffect } from "react";
import { Search, Eye, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  // Details Modal
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (err) {
      console.error("Error loading inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("inquiries")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setInquiries(
        inquiries.map((inq) =>
          inq.id === id ? { ...inq, status: newStatus as any } : inq
        )
      );

      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus as any });
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update inquiry status.");
    }
  };

  const filtered = inquiries.filter((inq) => {
    const matchesStatus = statusFilter === "all" || inq.status === statusFilter;
    const matchesType = typeFilter === "all" || inq.inquiry_type === typeFilter;
    
    const searchLower = search.toLowerCase();
    const matchesSearch =
      search === "" ||
      inq.full_name?.toLowerCase().includes(searchLower) ||
      inq.email?.toLowerCase().includes(searchLower) ||
      inq.subject?.toLowerCase().includes(searchLower) ||
      inq.message?.toLowerCase().includes(searchLower);

    return matchesStatus && matchesType && matchesSearch;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-border">
        <div>
          <span className="font-black text-[12px] uppercase tracking-widest text-primary">CRM</span>
          <h1 className="font-black text-[2.5rem] md:text-[3.2rem] leading-none tracking-[-0.05em] mt-3 mb-0">
            Customer Inquiries
          </h1>
          <p className="text-foreground/50 font-bold text-sm mt-2 mb-0">
            Monitor contact submissions, orders, and general inquiries.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-60 min-w-48">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search CRM..."
              className="h-11 w-full pl-10 pr-4 rounded-full border border-border text-xs font-bold bg-muted/30 focus:outline-none focus:border-primary focus:bg-background transition-all"
            />
          </div>

          {/* Status filter dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 px-6 rounded-full border border-border text-xs font-black uppercase tracking-wider bg-muted/40 cursor-pointer focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          {/* Type filter dropdown */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-11 px-6 rounded-full border border-border text-xs font-black uppercase tracking-wider bg-muted/40 cursor-pointer focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="furniture">Furniture</option>
            <option value="custom_order">Custom Order</option>
            <option value="training">Training</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-muted p-16 rounded-3xl border border-border/40 text-center">
          <p className="text-foreground/60 text-lg font-bold m-0">No inquiries match the current search filters.</p>
        </div>
      ) : (
        <div className="card-layered overflow-hidden shadow-xs border border-border/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Sender</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Subject & Message</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Inquiry Type</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Submitted</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Status</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45 text-right">View / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.map((inq) => (
                  <tr key={inq.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-base text-foreground leading-snug">{inq.full_name}</span>
                        <span className="text-xs text-foreground/50 font-medium">{inq.email || "No Email"}</span>
                        {inq.phone && <span className="text-[11px] text-foreground/40 font-mono mt-0.5">{inq.phone}</span>}
                      </div>
                    </td>
                    <td className="p-5 max-w-xs">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground line-clamp-1">{inq.subject || "No Subject"}</span>
                        <span className="text-xs text-foreground/60 mt-1 line-clamp-2">{inq.message}</span>
                      </div>
                    </td>
                    <td className="p-5 text-xs font-bold text-foreground/60 uppercase tracking-widest">
                      {inq.inquiry_type}
                    </td>
                    <td className="p-5 text-sm font-bold text-foreground/75">
                      {new Date(inq.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-5">
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border cursor-pointer focus:outline-none ${getStatusBadgeColor(
                          inq.status
                        )}`}
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => setSelectedInquiry(inq)}
                        className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-primary/75 hover:bg-primary hover:text-background transition-colors cursor-pointer"
                        title="View Details"
                      >
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

      {/* Details View Modal */}
      {selectedInquiry && (
        <div
          onClick={() => setSelectedInquiry(null)}
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-background rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col relative"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-border">
              <div>
                <span className="font-black text-xs uppercase tracking-widest text-primary">Inquiry Details</span>
                <h3 className="font-black text-xl tracking-tight text-foreground mt-2 mb-0 uppercase">
                  {selectedInquiry.subject || "Customer Message"}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-muted hover:bg-foreground/10 text-foreground transition-transform active:scale-90"
              >
                <X size={18} />
              </button>
            </div>

            {/* Details Panel */}
            <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto max-h-[60vh]">
              {/* Sender Details */}
              <div className="grid grid-cols-2 gap-4 bg-muted/40 p-4 rounded-xl border border-border/40">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase text-foreground/40 tracking-wider">From</span>
                  <span className="font-bold text-sm text-foreground">{selectedInquiry.full_name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase text-foreground/40 tracking-wider">Email</span>
                  <span className="font-bold text-sm text-foreground">{selectedInquiry.email || "—"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase text-foreground/40 tracking-wider">Phone</span>
                  <span className="font-mono text-sm text-foreground">{selectedInquiry.phone || "—"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase text-foreground/40 tracking-wider">Submitted</span>
                  <span className="font-bold text-sm text-foreground">
                    {new Date(selectedInquiry.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-black uppercase text-foreground/40 tracking-wider">Message Content</span>
                <div className="p-5 bg-muted/20 border border-border/30 rounded-2xl">
                  <p className="text-sm text-foreground/80 leading-relaxed m-0 whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </p>
                </div>
              </div>

              {/* Status Update Options */}
              <div className="flex items-center justify-between border-t border-border/40 pt-6 mt-2">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase text-foreground/40 tracking-wider">Type</span>
                  <span className="text-xs font-black text-primary uppercase tracking-widest mt-1">
                    {selectedInquiry.inquiry_type}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black uppercase text-foreground/40 tracking-wider mb-1">Update Status</span>
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                    className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none ${getStatusBadgeColor(
                      selectedInquiry.status
                    )}`}
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
