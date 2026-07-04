"use client";

import React, { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Copy, FolderOpen } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminFilterTabs } from "@/components/admin/ui/AdminFilterTabs";
import { AdminEmptyState } from "@/components/admin/ui/AdminEmptyState";
import { AdminLoading } from "@/components/admin/ui/AdminLoading";
import type { MediaItem } from "@/types/database";

const FOLDERS = ["all", "general", "products", "gallery", "blog"];

export default function AdminMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState("all");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchMedia(); }, []);

  const fetchMedia = async () => {
    setLoading(true);
    const { data } = await supabase.from("media_library").select("*").order("created_at", { ascending: false });
    if (data?.length) {
      setMedia(data);
    } else {
      // Fallback: aggregate from gallery
      const { data: gallery } = await supabase.from("gallery").select("id, title, image_url, created_at");
      setMedia((gallery || []).map((g) => ({
        id: g.id,
        filename: g.title,
        url: g.image_url,
        folder: "gallery",
        mime_type: "image/jpeg",
        size_bytes: null,
        created_at: g.created_at,
      })));
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json();
    if (json.url) {
      await supabase.from("media_library").insert([{
        filename: file.name,
        url: json.url,
        folder: folder === "all" ? "general" : folder,
        mime_type: file.type,
        size_bytes: file.size,
      }]);
      fetchMedia();
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this media file?")) return;
    await supabase.from("media_library").delete().eq("id", id);
    setMedia(media.filter((m) => m.id !== id));
  };

  const copyUrl = (url: string) => navigator.clipboard.writeText(url);

  const filtered = media.filter((m) => folder === "all" || m.folder === folder);

  if (loading) return <AdminLoading />;

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        label="Content"
        title="Media Library"
        description="Centralized storage for all website images and documents."
        actions={
          <>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="inline-flex h-11 items-center gap-2 px-5 rounded-full bg-primary text-background font-bold text-sm hover:opacity-90 cursor-pointer disabled:opacity-50">
              <Upload size={16} /> {uploading ? "Uploading..." : "Upload"}
            </button>
          </>
        }
      />

      <AdminFilterTabs tabs={FOLDERS.map((f) => ({ id: f, label: f === "all" ? "All Files" : f, count: f === "all" ? media.length : media.filter((m) => m.folder === f).length }))} active={folder} onChange={setFolder} />

      {filtered.length === 0 ? (
        <AdminEmptyState icon={FolderOpen} title="No media files" description="Upload images to build your media library." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="card-elevated overflow-hidden group">
              <div className="relative aspect-square bg-muted">
                <Image src={item.url} alt={item.filename} fill sizes="200px" className="object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => copyUrl(item.url)} className="h-8 w-8 rounded-full bg-white/20 text-white flex items-center justify-center cursor-pointer hover:bg-white/40">
                    <Copy size={14} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="h-8 w-8 rounded-full bg-white/20 text-white flex items-center justify-center cursor-pointer hover:bg-rose-500/80">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="font-bold text-xs truncate m-0">{item.filename}</p>
                <p className="text-[10px] text-foreground/40 m-0 mt-0.5 uppercase">{item.folder}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
