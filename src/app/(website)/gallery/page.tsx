import { getPublishedGallery } from "@/lib/cms/gallery";
import { GalleryClient } from "./GalleryClient";

export default async function GalleryPage() {
  const items = await getPublishedGallery();
  return <GalleryClient items={items} />;
}
