"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Check, X, AlertTriangle, GraduationCap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminSearchBar } from "@/components/admin/ui/AdminSearchBar";
import { AdminFilterTabs } from "@/components/admin/ui/AdminFilterTabs";
import { AdminLoading } from "@/components/admin/ui/AdminLoading";
import { AdminEmptyState } from "@/components/admin/ui/AdminEmptyState";
import { useToast } from "@/components/ui/Toast";

interface Enrollment {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  course_name: string;
  sponsor: string;
  message: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}

const statusColors: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  cancelled: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
};

export default function AdminTraining() {
  const { toast } = useToast();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => { fetchEnrollments(); }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("training_enrollments").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setEnrollments(data || []);
    } catch {
      toast("Failed to load enrollments", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: Enrollment["status"]) => {
    try {
      const { error } = await supabase.from("training_enrollments").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
      setEnrollments(enrollments.map((enr) => (enr.id === id ? { ...enr, status: newStatus } : enr)));
      toast(`Enrollment ${newStatus}`);
    } catch {
      toast("Failed to update status", "error");
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return enrollments.filter((enr) => {
      const matchesStatus = filterStatus === "all" || enr.status === filterStatus;
      const matchesSearch = !search || [enr.full_name, enr.email, enr.course_name, enr.sponsor].some((f) => f?.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [enrollments, filterStatus, search]);

  const statusTabs = [
    { id: "all", label: "All", count: enrollments.length },
    { id: "pending", label: "Pending", count: enrollments.filter((e) => e.status === "pending").length },
    { id: "confirmed", label: "Confirmed", count: enrollments.filter((e) => e.status === "confirmed").length },
    { id: "cancelled", label: "Cancelled", count: enrollments.filter((e) => e.status === "cancelled").length },
  ];

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader label="Education" title="Training Enrollments" description="Manage student registrations for vocational carpentry programs." />

      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <AdminFilterTabs tabs={statusTabs} active={filterStatus} onChange={setFilterStatus} />
        <AdminSearchBar value={search} onChange={setSearch} placeholder="Search enrollments..." />
      </div>

      {loading ? (
        <AdminLoading />
      ) : filtered.length === 0 ? (
        <AdminEmptyState icon={GraduationCap} title="No enrollments" description="No enrollments match your filters." />
      ) : (
        <div className="card-elevated overflow-hidden border border-border/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/45">Student</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/45">Course</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/45">Notes</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/45">Registered</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/45">Status</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/45 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.map((enr) => (
                  <tr key={enr.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-sm block">{enr.full_name}</span>
                      <span className="text-xs text-foreground/50">{enr.email}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-sm uppercase">{enr.course_name}</span>
                      {enr.sponsor && <span className="block text-xs text-primary font-bold italic">Sponsor: {enr.sponsor}</span>}
                    </td>
                    <td className="p-4 text-sm text-foreground/60 max-w-xs truncate" title={enr.message}>{enr.message || "—"}</td>
                    <td className="p-4 text-xs font-bold text-foreground/70">{new Date(enr.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full border ${statusColors[enr.status]}`}>{enr.status}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {enr.status !== "confirmed" && (
                          <button onClick={() => handleUpdateStatus(enr.id, "confirmed")} className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 cursor-pointer" title="Confirm"><Check size={13} /></button>
                        )}
                        {enr.status !== "pending" && (
                          <button onClick={() => handleUpdateStatus(enr.id, "pending")} className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950 cursor-pointer" title="Pending"><AlertTriangle size={13} /></button>
                        )}
                        {enr.status !== "cancelled" && (
                          <button onClick={() => handleUpdateStatus(enr.id, "cancelled")} className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 cursor-pointer" title="Cancel"><X size={13} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
