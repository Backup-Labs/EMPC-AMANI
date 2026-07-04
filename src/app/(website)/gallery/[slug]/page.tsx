import { notFound } from "next/navigation";
import { getGalleryItemById } from "@/lib/cms/gallery";
import { GalleryDetailClient } from "./GalleryDetailClient";

export const dynamic = "force-dynamic";

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: id } = await params;
  const item = await getGalleryItemById(id);
  if (!item) notFound();
  return <GalleryDetailClient item={item} />;
}
