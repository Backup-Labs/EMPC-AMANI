"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, X, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  published: boolean;
  created_at: string;
}

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form/Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Residential");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error("Error loading gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("gallery")
        .update({ published: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, published: !currentStatus } : item
        )
      );
    } catch (err) {
      console.error("Error toggling publish status:", err);
      alert("Failed to toggle publish status. Verify schema matches.");
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;

    try {
      // 1. Delete database record
      const { error: dbError } = await supabase.from("gallery").delete().eq("id", id);
      if (dbError) throw dbError;

      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting gallery item:", err);
      alert("Failed to delete item. Verify database matches.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an image file to upload.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Upload file to Cloudinary API route
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to upload image to Cloudinary.");
      }

      const data = await res.json();
      const uploadedUrl = data.url;

      // 2. Insert record into database
      const { error: dbError } = await supabase.from("gallery").insert([
        {
          title,
          description: description || null,
          image_url: uploadedUrl,
          category,
          published: true,
        },
      ]);

      if (dbError) throw dbError;

      // Reset and close
      setTitle("");
      setDescription("");
      setCategory("Residential");
      setFile(null);
      setModalOpen(false);
      fetchGallery();
    } catch (err: any) {
      console.error("Error creating gallery item:", err);
      alert(err.message || "Failed to create gallery item.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="font-black text-[12px] uppercase tracking-widest text-primary">Media</span>
          <h1 className="font-black text-[2.5rem] md:text-[3.2rem] leading-none tracking-[-0.05em] mt-3 mb-0">
            Gallery Manager
          </h1>
          <p className="text-foreground/50 font-bold text-sm mt-2 mb-0">
            Upload images, toggle publication, and categorize showcased works.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex h-12 items-center px-6 rounded-full bg-primary text-background font-black hover:opacity-90 active:scale-95 transition-all text-sm cursor-pointer shadow-md"
        >
          Upload Photo <Plus size={16} className="ml-2" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-muted p-16 rounded-3xl border border-border/40 text-center">
          <p className="text-foreground/60 text-lg font-bold m-0">No photos in the gallery yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.id} className="card-layered overflow-hidden flex flex-col group shadow-xs border border-border/20">
              <div className="relative aspect-4/3 w-full bg-muted border-b border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="object-cover h-full w-full transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="glass px-3 py-1 rounded-full text-[9px] font-black uppercase text-white tracking-widest">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-4 flex-1 justify-between">
                <div>
                  <h3 className="font-black text-xl text-foreground m-0 tracking-tight leading-snug">
                    {item.title || "Untitled Showcase"}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-foreground/60 leading-relaxed mt-2 mb-0 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center border-t border-border/40 pt-4">
                  <button
                    onClick={() => handleTogglePublish(item.id, item.published)}
                    className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
                      item.published ? "text-primary" : "text-foreground/40 hover:text-foreground"
                    }`}
                  >
                    {item.published ? (
                      <>
                        <Eye size={14} /> Published
                      </>
                    ) : (
                      <>
                        <EyeOff size={14} /> Hidden
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.image_url)}
                    className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    aria-label="Delete image"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-background rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col relative"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-border">
              <span className="font-black text-xl uppercase tracking-wider text-foreground">Upload Image</span>
              <button
                onClick={() => setModalOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-muted hover:bg-foreground/10 text-foreground transition-transform active:scale-90"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">Title</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Bedroom Wardrobe"
                  className="h-12 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-base transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-12 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-base transition-colors cursor-pointer appearance-none"
                >
                  <option value="Residential">Residential Showcase</option>
                  <option value="Office">Office Furniture</option>
                  <option value="Dining">Dining Collection</option>
                  <option value="Workshop">Workshop / Alumni</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell the story of this craft..."
                  className="bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-base transition-colors resize-none py-2"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">
                  Select Image File
                </label>
                <input
                  required
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2 text-sm font-bold text-foreground/60 cursor-pointer file:cursor-pointer file:h-10 file:px-4 file:rounded-full file:border-0 file:bg-muted file:text-foreground file:font-black file:text-xs file:uppercase file:tracking-wide file:mr-4 hover:file:opacity-90"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-4 h-14 bg-primary text-background font-black rounded-full flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Uploading file..." : "Add to Gallery"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
