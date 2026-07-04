"use client";

import React, { useCallback, useRef, useState } from "react";
import { GripVertical, Star, Trash2, Upload, Link2, Loader2 } from "lucide-react";
import { uploadFile } from "@/lib/upload";
import { useToast } from "@/components/ui/Toast";

export interface ProductImage {
  url: string;
  isPrimary: boolean;
}

interface ProductImageManagerProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  bucket?: "products" | "media";
}

export function ProductImageManager({ images, onChange, bucket = "products" }: ProductImageManagerProps) {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const setPrimary = (idx: number) => {
    onChange(images.map((img, i) => ({ ...img, isPrimary: i === idx })));
  };

  const removeImage = (idx: number) => {
    const next = images.filter((_, i) => i !== idx);
    if (next.length && !next.some((i) => i.isPrimary)) next[0].isPrimary = true;
    onChange(next);
  };

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    try {
      new URL(url);
    } catch {
      toast("Invalid URL", "error");
      return;
    }
    onChange([...images, { url, isPrimary: images.length === 0 }]);
    setUrlInput("");
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setProgress(0);
    try {
      const newImages: ProductImage[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          toast(`${file.name} is not an image`, "error");
          continue;
        }
        const url = await uploadFile(file, bucket, (pct) => setProgress(pct));
        newImages.push({ url, isPrimary: images.length === 0 && i === 0 });
      }
      if (newImages.length) {
        const merged = [...images, ...newImages.map((img, i) => ({
          ...img,
          isPrimary: images.length === 0 && i === 0 ? true : img.isPrimary,
        }))];
        if (!merged.some((m) => m.isPrimary) && merged[0]) merged[0].isPrimary = true;
        onChange(merged);
        toast(`${newImages.length} image(s) uploaded`);
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images]
  );

  const reorder = (from: number, to: number) => {
    if (from === to) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/40 transition-colors"
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Upload size={24} className="mx-auto text-foreground/30 mb-2" />
        <p className="text-sm font-bold text-foreground/60 m-0">Drag & drop images or</p>
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="mt-2 h-9 px-4 rounded-full bg-primary text-background text-xs font-black uppercase tracking-wider cursor-pointer disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Browse Files"}
        </button>
        {uploading && (
          <div className="mt-3 max-w-xs mx-auto">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-[10px] text-foreground/40 mt-1 flex items-center justify-center gap-1">
              <Loader2 size={10} className="animate-spin" /> {progress}%
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Or paste image URL..."
          className="flex-1 h-10 px-3 rounded-xl border border-border bg-muted/30 text-sm font-medium focus:outline-none focus:border-primary"
        />
        <button type="button" onClick={addUrl} className="h-10 px-4 rounded-xl border border-border font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-muted">
          <Link2 size={14} /> Add
        </button>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img, idx) => (
            <div
              key={`${img.url}-${idx}`}
              draggable
              onDragStart={() => setDragIdx(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIdx !== null) reorder(dragIdx, idx);
                setDragIdx(null);
              }}
              className={`relative group rounded-xl overflow-hidden border-2 aspect-square bg-muted ${img.isPrimary ? "border-primary" : "border-border"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="object-cover w-full h-full" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button type="button" onClick={() => setPrimary(idx)} title="Set primary" className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center cursor-pointer">
                  <Star size={14} className={img.isPrimary ? "fill-amber-400 text-amber-400" : "text-foreground/50"} />
                </button>
                <button type="button" onClick={() => removeImage(idx)} className="h-8 w-8 rounded-full bg-rose-500 text-white flex items-center justify-center cursor-pointer">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="absolute top-2 left-2 cursor-grab text-white/80">
                <GripVertical size={14} />
              </div>
              {img.isPrimary && (
                <span className="absolute bottom-2 left-2 text-[9px] font-black uppercase bg-primary text-background px-2 py-0.5 rounded-full">Primary</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function imagesToPayload(images: ProductImage[]) {
  const urls = images.map((i) => i.url);
  const primary = images.find((i) => i.isPrimary)?.url || urls[0] || null;
  return { image_url: primary, images: urls };
}

export function payloadToImages(image_url?: string | null, images?: string[] | null): ProductImage[] {
  const urls = images?.length ? images : image_url ? [image_url] : [];
  return urls.map((url, i) => ({ url, isPrimary: url === image_url || (i === 0 && !image_url) }));
}
