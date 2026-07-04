import { getFeaturedProducts, getPublishedProducts } from "@/lib/cms/products";
import { getPublishedPosts } from "@/lib/cms/news";
import { getPublishedGallery } from "@/lib/cms/gallery";
import { getSiteContent, getPublishedFaqs } from "@/lib/cms/settings";
import { HomeClient } from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, allNews, gallery, siteContent, faqs] = await Promise.all([
    getFeaturedProducts(6),
    getPublishedPosts(),
    getPublishedGallery(),
    getSiteContent(),
    getPublishedFaqs(),
  ]);

  const products = featuredProducts.length ? featuredProducts : await getPublishedProducts();

  return (
    <HomeClient
      featuredProducts={products.slice(0, 6)}
      latestNewsPosts={allNews.slice(0, 3)}
      galleryItems={gallery.slice(0, 6)}
      siteContent={siteContent}
      faqs={faqs}
    />
  );
}
