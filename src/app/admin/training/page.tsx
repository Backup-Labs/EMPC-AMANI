"use client";

import React, { useState, useEffect } from "react";
import { Check, X, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

export default function AdminTraining() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("training_enrollments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (err) {
      console.error("Error loading enrollments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "pending" | "confirmed" | "cancelled") => {
    try {
      const { error } = await supabase
        .from("training_enrollments")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setEnrollments(
        enrollments.map((enr) =>
          enr.id === id ? { ...enr, status: newStatus } : enr
        )
      );
    } catch (err) {
      console.error("Error updating enrollment status:", err);
      alert("Failed to update status.");
    }
  };

  const filteredEnrollments = enrollments.filter((enr) => {
    if (filterStatus === "all") return true;
    return enr.status === filterStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="font-black text-[12px] uppercase tracking-widest text-primary">Education</span>
          <h1 className="font-black text-[2.5rem] md:text-[3.2rem] leading-none tracking-[-0.05em] mt-3 mb-0">
            Training Enrollments
          </h1>
          <p className="text-foreground/50 font-bold text-sm mt-2 mb-0">
            Manage student registrations for vocational carpentry programs.
          </p>
        </div>

        {/* Filter Tab bar */}
        <div className="flex bg-muted rounded-full p-1 border border-border">
          {["all", "pending", "confirmed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`
                px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider cursor-pointer transition-colors
                ${
                  filterStatus === status
                    ? "bg-primary text-background"
                    : "text-foreground/60 hover:text-foreground"
                }
              `}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        </div>
      ) : filteredEnrollments.length === 0 ? (
        <div className="bg-muted p-16 rounded-3xl border border-border/40 text-center">
          <p className="text-foreground/60 text-lg font-bold m-0">No enrollments found for the selected status.</p>
        </div>
      ) : (
        <div className="card-layered overflow-hidden shadow-xs border border-border/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Student</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Course & Sponsor</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Notes</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Registered</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Status</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45 text-right">Approve/Reject</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredEnrollments.map((enr) => (
                  <tr key={enr.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-base text-foreground leading-snug">{enr.full_name}</span>
                        <span className="text-xs text-foreground/50 font-medium">{enr.email}</span>
                        {enr.phone && <span className="text-[11px] text-foreground/40 font-mono mt-0.5">{enr.phone}</span>}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground uppercase tracking-wide">{enr.course_name}</span>
                        {enr.sponsor && (
                          <span className="text-xs text-primary font-bold italic mt-0.5">
                            Sponsor: {enr.sponsor}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-5 text-sm text-foreground/60 max-w-xs truncate" title={enr.message}>
                      {enr.message || "—"}
                    </td>
                    <td className="p-5 text-sm font-bold text-foreground/75">
                      {new Date(enr.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-5">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-full border ${getStatusBadgeClass(enr.status)}`}>
                        {enr.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        {enr.status !== "confirmed" && (
                          <button
                            onClick={() => handleUpdateStatus(enr.id, "confirmed")}
                            className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
                            title="Confirm Enrollment"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        {enr.status !== "pending" && (
                          <button
                            onClick={() => handleUpdateStatus(enr.id, "pending")}
                            className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-yellow-600 hover:bg-yellow-50 transition-colors cursor-pointer"
                            title="Set to Pending"
                          >
                            <AlertTriangle size={14} />
                          </button>
                        )}
                        {enr.status !== "cancelled" && (
                          <button
                            onClick={() => handleUpdateStatus(enr.id, "cancelled")}
                            className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Cancel Registration"
                          >
                            <X size={14} />
                          </button>
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
