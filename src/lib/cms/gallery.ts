import { createClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/components/ui/GalleryLightbox";

const staticGallery: (GalleryItem & { span?: string })[] = [
  { title: "Siam Teak Table", tags: ["Hardwood", "Dining"], image: "/images/hero.png", span: "md:col-span-2 md:row-span-2" },
  { title: "Nordic Lounge Chair", tags: ["Oak", "Minimalist"], image: "/images/project1.png", span: "md:col-span-1 md:row-span-1" },
  { title: "Industrial Bookshelf", tags: ["Steel", "Pine"], image: "/images/project2.png", span: "md:col-span-1 md:row-span-2" },
  { title: "Artisan Credenza", tags: ["Walnut", "Mid-Century"], image: "/images/hero.png", span: "md:col-span-1 md:row-span-1" },
  { title: "Floating Bed Frame", tags: ["Maple", "Modern"], image: "/images/project1.png", span: "md:col-span-2 md:row-span-1" },
  { title: "Minimalist Desk", tags: ["Ash", "Office"], image: "/images/project2.png", span: "md:col-span-1 md:row-span-1" },
];

const spanPattern = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1",
  "md:col-span-1 md:row-span-1",
];

export async function getPublishedGallery(): Promise<(GalleryItem & { span?: string })[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error || !data?.length) return staticGallery;

    return data.map((item, i) => ({
      title: item.title || "Untitled",
      tags: item.category ? [item.category] : ["Showcase"],
      image: item.image_url,
      span: spanPattern[i % spanPattern.length],
    }));
  } catch {
    return staticGallery;
  }
}
