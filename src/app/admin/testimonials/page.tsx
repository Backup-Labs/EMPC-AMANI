"use client";

import React, { useState, useEffect } from "react";
import { Check, Trash2, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  rating: number;
  approved: boolean;
  created_at: string;
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err) {
      console.error("Error loading testimonials:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, newStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ approved: newStatus })
        .eq("id", id);

      if (error) throw error;

      setTestimonials(
        testimonials.map((t) =>
          t.id === id ? { ...t, approved: newStatus } : t
        )
      );
    } catch (err) {
      console.error("Error updating review status:", err);
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
      setTestimonials(testimonials.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Failed to delete review.");
    }
  };

  const filtered = testimonials.filter((t) => {
    if (filter === "approved") return t.approved;
    if (filter === "pending") return !t.approved;
    return true;
  });

  const renderStars = (num: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={12}
            className={s <= num ? "fill-primary text-primary" : "text-primary/20"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="font-black text-[12px] uppercase tracking-widest text-primary">Reviews</span>
          <h1 className="font-black text-[2.5rem] md:text-[3.2rem] leading-none tracking-[-0.05em] mt-3 mb-0">
            Testimonials Manager
          </h1>
          <p className="text-foreground/50 font-bold text-sm mt-2 mb-0">
            Review and approve customer quotes before they go live.
          </p>
        </div>

        <div className="flex bg-muted rounded-full p-1 border border-border">
          {["all", "pending", "approved"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`
                px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider cursor-pointer transition-colors
                ${
                  filter === f
                    ? "bg-primary text-background"
                    : "text-foreground/60 hover:text-foreground"
                }
              `}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-muted p-16 rounded-3xl border border-border/40 text-center">
          <p className="text-foreground/60 text-lg font-bold m-0">No reviews found for the selected status.</p>
        </div>
      ) : (
        <div className="card-layered overflow-hidden shadow-xs border border-border/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Reviewer</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Rating</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Message</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Submitted</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Status</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45 text-right">Approve / Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-base text-foreground leading-snug">{t.name}</span>
                        <span className="text-[11px] font-black text-foreground/50 uppercase mt-0.5">{t.role}</span>
                      </div>
                    </td>
                    <td className="p-5">{renderStars(t.rating)}</td>
                    <td className="p-5 text-sm text-foreground/75 leading-relaxed italic max-w-sm" title={t.message}>
                      &ldquo;{t.message}&rdquo;
                    </td>
                    <td className="p-5 text-sm font-bold text-foreground/75">
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-5">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        t.approved 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {t.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleApprove(t.id, !t.approved)}
                          className={`
                            h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors cursor-pointer
                            ${
                              t.approved 
                                ? "text-yellow-600 hover:bg-yellow-50" 
                                : "text-green-600 hover:bg-green-50"
                            }
                          `}
                          title={t.approved ? "Revoke Approval" : "Approve Review"}
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Review"
                        >
                          <Trash2 size={14} />
                        </button>
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
