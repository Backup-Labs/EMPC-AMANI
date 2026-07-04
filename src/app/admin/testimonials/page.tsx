"use client";

import React, { useState, useEffect } from "react";
import { Plus, Check, Trash2, Edit2, Upload, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { uploadFile } from "@/lib/upload";
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
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
    setName(""); setRole("Customer"); setMessage(""); setRating(5); setAvatarUrl(""); setAvatarFile(null);
    setModalOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setName(t.name); setRole(t.role); setMessage(t.message); setRating(t.rating); setAvatarUrl(t.avatar_url || ""); setAvatarFile(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let finalAvatarUrl = avatarUrl || null;
      if (avatarFile) {
        finalAvatarUrl = await uploadFile(avatarFile, "media", setUploadProgress);
      }
      const payload = { name, role, message, rating, avatar_url: finalAvatarUrl, approved: editing?.approved ?? false };
      if (editing) {
        await supabase.from("testimonials").update(payload).eq("id", editing.id);
      } else {
        await supabase.from("testimonials").insert([payload]);
      }
      setModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save testimonial");
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
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

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/45">Profile Photo</label>
            {(avatarUrl || avatarFile) && (
              <div className="relative h-16 w-16 rounded-full overflow-hidden border border-border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarFile ? URL.createObjectURL(avatarFile) : avatarUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => { setAvatarUrl(""); setAvatarFile(null); }}
                  className="absolute top-0 right-0 h-5 w-5 bg-black/60 text-white flex items-center justify-center rounded-full cursor-pointer"
                  aria-label="Remove photo"
                >
                  <X size={10} />
                </button>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="inline-flex h-10 items-center gap-2 px-4 rounded-full border border-border bg-muted/50 text-xs font-bold cursor-pointer hover:bg-muted transition-colors">
                <Upload size={14} /> Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) { setAvatarFile(file); setAvatarUrl(""); }
                  }}
                />
              </label>
              <input
                placeholder="Or paste image URL..."
                value={avatarUrl}
                onChange={(e) => { setAvatarUrl(e.target.value); setAvatarFile(null); }}
                className="h-10 flex-1 px-4 rounded-xl border border-border bg-muted/50 text-sm font-medium focus:outline-none focus:border-primary"
              />
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}
          </div>

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
