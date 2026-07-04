"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Eye, EyeOff, ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { AdminSearchBar } from "@/components/admin/ui/AdminSearchBar";
import { AdminFilterTabs } from "@/components/admin/ui/AdminFilterTabs";
import { AdminLoading } from "@/components/admin/ui/AdminLoading";
import { AdminEmptyState } from "@/components/admin/ui/AdminEmptyState";
import { useToast } from "@/components/ui/Toast";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  published: boolean;
  created_at: string;
}

const CATEGORIES = ["Residential", "Office", "Dining", "Workshop"];

export default function AdminGallery() {
  const { toast } = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Residential");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchGallery(); }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setItems(data || []);
    } catch {
      toast("Failed to load gallery", "error");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let list = [...items];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((i) => i.title?.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q));
    }
    if (categoryFilter !== "all") list = list.filter((i) => i.category === categoryFilter);
    return list;
  }, [items, search, categoryFilter]);

  const categoryTabs = [
    { id: "all", label: "All", count: items.length },
    ...CATEGORIES.map((c) => ({ id: c, label: c, count: items.filter((i) => i.category === c).length })),
  ];

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("gallery").update({ published: !currentStatus }).eq("id", id);
      if (error) throw error;
      setItems(items.map((item) => (item.id === id ? { ...item, published: !currentStatus } : item)));
      toast(!currentStatus ? "Photo published" : "Photo hidden");
    } catch {
      toast("Failed to update status", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this gallery item?")) return;
    try {
      const { error } = await supabase.from("gallery").delete().eq("id", id);
      if (error) throw error;
      setItems(items.filter((item) => item.id !== id));
      toast("Gallery item deleted");
    } catch {
      toast("Failed to delete item", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast("Please select an image file", "error"); return; }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "gallery");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Upload failed");
      }
      const { url } = await res.json();
      const { error } = await supabase.from("gallery").insert([{
        title, description: description || null, image_url: url, category, published: true,
      }]);
      if (error) throw error;
      setTitle(""); setDescription(""); setCategory("Residential"); setFile(null);
      setModalOpen(false);
      fetchGallery();
      toast("Photo uploaded");
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        label="Media"
        title="Gallery Manager"
        description="Upload images, categorize showcases, and control publication."
        actions={
          <button onClick={() => setModalOpen(true)} className="inline-flex h-11 items-center px-5 rounded-full bg-primary text-background font-black hover:opacity-90 text-sm cursor-pointer shadow-md">
            Upload Photo <Plus size={16} className="ml-2" />
          </button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <AdminFilterTabs tabs={categoryTabs} active={categoryFilter} onChange={setCategoryFilter} />
        <AdminSearchBar value={search} onChange={setSearch} placeholder="Search gallery..." />
      </div>

      {loading ? (
        <AdminLoading variant="grid" />
      ) : filtered.length === 0 ? (
        <AdminEmptyState icon={ImageIcon} title="No photos yet" description="Upload your first showcase image." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="card-elevated overflow-hidden flex flex-col group border border-border/40">
              <div className="relative aspect-4/3 w-full bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image_url} alt={item.title} className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-3 left-3">
                  <span className="glass px-2.5 py-1 rounded-full text-[9px] font-black uppercase text-white tracking-widest">{item.category}</span>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                <div>
                  <h3 className="font-black text-lg m-0">{item.title || "Untitled"}</h3>
                  {item.description && <p className="text-xs text-foreground/55 mt-1 mb-0 line-clamp-2">{item.description}</p>}
                </div>
                <div className="flex justify-between items-center border-t border-border/40 pt-3">
                  <button onClick={() => handleTogglePublish(item.id, item.published)} className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider cursor-pointer ${item.published ? "text-emerald-600" : "text-foreground/40"}`}>
                    {item.published ? <><Eye size={12} /> Published</> : <><EyeOff size={12} /> Hidden</>}
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer" aria-label="Delete">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Upload Image" size="md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Title</label>
            <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="h-11 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-11 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-sm cursor-pointer">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Description</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="bg-transparent border-b border-border focus:border-foreground outline-none font-medium text-sm resize-none py-2" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Image File</label>
            <input required type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} className="text-xs font-bold file:h-9 file:px-3 file:rounded-full file:border-0 file:bg-muted file:font-black file:text-[10px] file:uppercase cursor-pointer" />
          </div>
          <button type="submit" disabled={submitting} className="h-12 bg-primary text-background font-black rounded-full hover:opacity-90 disabled:opacity-50 cursor-pointer">
            {submitting ? "Uploading..." : "Add to Gallery"}
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
