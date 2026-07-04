"use client";

import React, { useState, useEffect } from "react";
import { Plus, Check, Trash2, Edit2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminFilterTabs } from "@/components/admin/ui/AdminFilterTabs";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { AdminEmptyState } from "@/components/admin/ui/AdminEmptyState";
import { AdminLoading } from "@/components/admin/ui/AdminLoading";
import { StarRating } from "@/components/admin/ui/StarRating";
import type { Testimonial } from "@/types/database";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    setTestimonials(data || []);
    setLoading(false);
  };

  const openCreate = () => {
    setEditing(null);
    setName(""); setRole("Customer"); setMessage(""); setRating(5); setAvatarUrl("");
    setModalOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setName(t.name); setRole(t.role); setMessage(t.message); setRating(t.rating); setAvatarUrl(t.avatar_url || "");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { name, role, message, rating, avatar_url: avatarUrl || null, approved: editing?.approved ?? false };
    if (editing) {
      await supabase.from("testimonials").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("testimonials").insert([payload]);
    }
    setSubmitting(false);
    setModalOpen(false);
    fetchTestimonials();
  };

  const handleApprove = async (id: string, approved: boolean) => {
    await supabase.from("testimonials").update({ approved }).eq("id", id);
    setTestimonials(testimonials.map((t) => (t.id === id ? { ...t, approved } : t)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    setTestimonials(testimonials.filter((t) => t.id !== id));
  };

  const filtered = testimonials.filter((t) => {
    if (filter === "approved") return t.approved;
    if (filter === "pending") return !t.approved;
    return true;
  });

  if (loading) return <AdminLoading />;

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      <AdminPageHeader
        label="Reviews"
        title="Testimonials Manager"
        description="Create, edit, and approve customer testimonials."
        actions={
          <button onClick={openCreate} className="inline-flex h-11 items-center gap-2 px-5 rounded-full bg-primary text-background font-bold text-sm hover:opacity-90 cursor-pointer">
            <Plus size={16} /> Add Testimonial
          </button>
        }
      />

      <AdminFilterTabs
        tabs={[
          { id: "all", label: "All", count: testimonials.length },
          { id: "pending", label: "Pending", count: testimonials.filter((t) => !t.approved).length },
          { id: "approved", label: "Approved", count: testimonials.filter((t) => t.approved).length },
        ]}
        active={filter}
        onChange={setFilter}
      />

      {filtered.length === 0 ? (
        <AdminEmptyState icon={Check} title="No testimonials" description="Add testimonials or wait for customer submissions." action={
          <button onClick={openCreate} className="inline-flex h-10 items-center gap-2 px-5 rounded-full bg-primary text-background font-bold text-xs cursor-pointer">
            <Plus size={14} /> Add Testimonial
          </button>
        } />
      ) : (
        <div className="card-elevated overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {["Reviewer", "Rating", "Message", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-foreground/45">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-border/60 hover:bg-muted/30">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary overflow-hidden">
                        {t.avatar_url ? <img src={t.avatar_url} alt="" className="h-full w-full object-cover" /> : t.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-sm m-0">{t.name}</p>
                        <p className="text-[10px] text-foreground/45 m-0 uppercase">{t.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><StarRating value={t.rating} readonly size={14} /></td>
                  <td className="px-5 py-4 text-sm text-foreground/70 italic max-w-xs truncate">&ldquo;{t.message}&rdquo;</td>
                  <td className="px-5 py-4 text-xs text-foreground/50">{new Date(t.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${t.approved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {t.approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(t)} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center cursor-pointer"><Edit2 size={14} /></button>
                      <button onClick={() => handleApprove(t.id, !t.approved)} className="h-8 w-8 rounded-full hover:bg-emerald-50 text-emerald-600 flex items-center justify-center cursor-pointer"><Check size={14} /></button>
                      <button onClick={() => handleDelete(t.id)} className="h-8 w-8 rounded-full hover:bg-rose-50 text-rose-500 flex items-center justify-center cursor-pointer"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Testimonial" : "Add Testimonial"}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <input required placeholder="Customer name" value={name} onChange={(e) => setName(e.target.value)} className="h-11 px-4 rounded-xl border border-border bg-muted/50 text-sm font-medium focus:outline-none focus:border-primary" />
          <input placeholder="Role / Position (optional)" value={role} onChange={(e) => setRole(e.target.value)} className="h-11 px-4 rounded-xl border border-border bg-muted/50 text-sm font-medium focus:outline-none focus:border-primary" />
          <input placeholder="Profile photo URL (optional)" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="h-11 px-4 rounded-xl border border-border bg-muted/50 text-sm font-medium focus:outline-none focus:border-primary" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/45 mb-2">Rating</p>
            <StarRating value={rating} onChange={setRating} size={20} />
          </div>
          <textarea required placeholder="Testimonial content" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="px-4 py-3 rounded-xl border border-border bg-muted/50 text-sm focus:outline-none focus:border-primary resize-y" />
          <button type="submit" disabled={submitting} className="h-11 rounded-full bg-primary text-background font-bold hover:opacity-90 cursor-pointer disabled:opacity-50">
            {submitting ? "Saving..." : editing ? "Update" : "Create"}
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
