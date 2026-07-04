import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";
import { slugify } from "@/lib/format";

export const dynamic = "force-dynamic";

function mapDbProduct(row: Record<string, unknown>): Product {
  const specs = row.specifications as { label: string; value: string }[] | null;
  const features = row.features as string[] | null;
  const images = (row.images as string[] | null) || [];
  const primary = (row.image_url as string) || images[0] || "";
  const title = row.title as string;
  return {
    id: row.id as string,
    slug: (row.slug as string) || slugify(title),
    title,
    category: (row.category as string) || "General",
    price: Number(row.price) || 0,
    image_url: primary,
    tags: (row.tags as string[]) || [],
    description: (row.description as string) || undefined,
    images: images.length ? images : primary ? [primary] : [],
    specifications: specs?.length ? specs : undefined,
    features: features?.length ? features : undefined,
    inStock: row.in_stock !== false,
    featured: row.featured === true,
    created_at: row.created_at as string,
  };
}

export async function getPublishedProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getPublishedProducts:", error.message);
    return [];
  }
  return (data || []).map(mapDbProduct);
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (data?.length) return data.map(mapDbProduct);
  const all = await getPublishedProducts();
  return all.slice(0, limit);
}

export async function getProductById(idOrSlug: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data: bySlug } = await supabase
    .from("products")
    .select("*")
    .eq("slug", idOrSlug)
    .eq("published", true)
    .maybeSingle();
  if (bySlug) return mapDbProduct(bySlug);

  const { data: byId } = await supabase
    .from("products")
    .select("*")
    .eq("id", idOrSlug)
    .eq("published", true)
    .maybeSingle();
  if (byId) return mapDbProduct(byId);

  const { data: all } = await supabase.from("products").select("*").eq("published", true);
  const byTitleSlug = all?.find((p) => slugify(p.title as string) === idOrSlug);
  return byTitleSlug ? mapDbProduct(byTitleSlug) : null;
}

export async function getRelatedProducts(idOrSlug: string, limit = 3): Promise<Product[]> {
  const all = await getPublishedProducts();
  const current = all.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  if (!current) return all.slice(0, limit);
  return all.filter((p) => p.id !== current.id && p.category === current.category).slice(0, limit);
}
