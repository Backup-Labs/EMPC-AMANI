import { createClient } from "@/lib/supabase/server";
import type { NewsPost, NewsContentBlock } from "@/types";

export const dynamic = "force-dynamic";

export type CmsNewsPost = NewsPost & {
  externalUrl?: string;
  externalSource?: string;
};

function parseContent(raw: string): NewsContentBlock[] {
  if (!raw?.trim()) return [{ type: "p", text: "" }];
  const blocks: NewsContentBlock[] = [];
  raw.split(/\n\n+/).forEach((block) => {
    const trimmed = block.trim();
    if (!trimmed) return;
    if (trimmed.startsWith("### ")) blocks.push({ type: "h3", text: trimmed.slice(4) });
    else if (trimmed.startsWith("## ")) blocks.push({ type: "h2", text: trimmed.slice(3) });
    else if (trimmed.startsWith("![")) {
      const match = trimmed.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (match) blocks.push({ type: "image", src: match[2], alt: match[1] });
    } else blocks.push({ type: "p", text: trimmed });
  });
  return blocks.length ? blocks : [{ type: "p", text: raw }];
}

function estimateReadTime(content: NewsContentBlock[]): string {
  const words = content.reduce((n, b) => n + ("text" in b ? b.text.split(/\s+/).length : 0), 0);
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function mapDbPost(row: Record<string, unknown>): CmsNewsPost {
  const content = parseContent(row.content as string);
  const created = row.created_at ? new Date(row.created_at as string) : new Date();
  return {
    slug: row.slug as string,
    title: row.title as string,
    excerpt: (row.excerpt as string) || "",
    date: created.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" }).replace(/\//g, "."),
    author: (row.author as string) || "EMPC Team",
    category: (row.category as string) || "News",
    tags: (row.tags as string[]) || [],
    image: (row.cover_image as string) || "",
    content,
    readTime: estimateReadTime(content),
    ...(row.post_type === "external"
      ? { externalUrl: row.external_url as string, externalSource: row.external_source as string }
      : {}),
  };
}

export async function getPublishedPosts(): Promise<CmsNewsPost[]> {
  const supabase = await createClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getPublishedPosts:", error.message);
    return [];
  }

  return (data || [])
    .filter((p) => !p.scheduled_at || p.scheduled_at <= now)
    .map(mapDbPost);
}

export async function getPostBySlug(slug: string): Promise<CmsNewsPost | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  return data ? mapDbPost(data) : null;
}

export async function getRelatedPosts(slug: string, limit = 2): Promise<CmsNewsPost[]> {
  const all = await getPublishedPosts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return all.slice(0, limit);
  return all.filter((p) => p.slug !== slug && p.category === current.category).slice(0, limit);
}
