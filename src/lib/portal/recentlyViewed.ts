"use client";

const STORAGE_KEY = "empc_recently_viewed";
const MAX_ITEMS = 8;

export interface RecentProduct {
  id: string;
  title: string;
  image_url: string;
  price: number;
  viewedAt: string;
}

export function getRecentlyViewed(): RecentProduct[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function trackProductView(product: Omit<RecentProduct, "viewedAt">) {
  if (typeof window === "undefined") return;
  const existing = getRecentlyViewed().filter((p) => p.id !== product.id);
  const updated: RecentProduct[] = [
    { ...product, viewedAt: new Date().toISOString() },
    ...existing,
  ].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
