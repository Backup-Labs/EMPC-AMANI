import { createClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/components/ui/GalleryLightbox";

export const dynamic = "force-dynamic";

const spanPattern = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1",
  "md:col-span-1 md:row-span-1",
];

function mapGalleryRow(item: Record<string, unknown>, i: number) {
  return {
    id: item.id as string,
    title: (item.title as string) || "Untitled",
    tags: item.category ? [item.category as string] : ["Showcase"],
    image: item.image_url as string,
    description: (item.description as string) || undefined,
    category: (item.category as string) || undefined,
    span: spanPattern[i % spanPattern.length],
  };
}

export async function getPublishedGallery(): Promise<(GalleryItem & { span?: string })[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getPublishedGallery:", error.message);
    return [];
  }

  return (data || []).map(mapGalleryRow);
}

export async function getGalleryItemById(id: string): Promise<(GalleryItem & { span?: string }) | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return mapGalleryRow(data, 0);
}
