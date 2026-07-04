import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";
import { products as staticProducts } from "@/lib/data/products";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").trim();
}

function mapDbProduct(row: Record<string, unknown>): Product {
  const specs = row.specifications as { label: string; value: string }[] | null;
  const features = row.features as string[] | null;
  const images = row.images as string[] | null;
  return {
    id: (row.id as string) || slugify(row.title as string),
    title: row.title as string,
    category: (row.category as string) || "General",
    price: Number(row.price) || 0,
    image_url: (row.image_url as string) || "/images/hero.png",
    tags: (row.tags as string[]) || [],
    description: (row.description as string) || undefined,
    images: images?.length ? images : row.image_url ? [row.image_url as string] : undefined,
    specifications: specs?.length ? specs : undefined,
    features: features?.length ? features : undefined,
    inStock: row.in_stock !== false,
    created_at: row.created_at as string,
  };
}

export async function getPublishedProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error || !data?.length) return staticProducts;
    return data.map(mapDbProduct);
  } catch {
    return staticProducts;
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("products").select("*").eq("id", id).eq("published", true).maybeSingle();
    if (data) return mapDbProduct(data);

    const { data: all } = await supabase.from("products").select("*").eq("published", true);
    const bySlug = all?.find((p) => slugify(p.title) === id);
    if (bySlug) return mapDbProduct(bySlug);
  } catch {
    // fall through
  }
  return staticProducts.find((p) => p.id === id);
}

export async function getRelatedProducts(id: string, limit = 3): Promise<Product[]> {
  const all = await getPublishedProducts();
  const current = all.find((p) => p.id === id);
  if (!current) return all.slice(0, limit);
  return all.filter((p) => p.id !== id && p.category === current.category).slice(0, limit);
}

export { formatPrice } from "@/lib/data/products";
