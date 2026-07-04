import { getPublishedProducts } from "@/lib/cms/products";
import { getPublishedPosts } from "@/lib/cms/news";
import { HomeClient } from "./HomeClient";

export default async function HomePage() {
  const [allProducts, allNews] = await Promise.all([
    getPublishedProducts(),
    getPublishedPosts(),
  ]);
  return (
    <HomeClient
      featuredProducts={allProducts.slice(0, 3)}
      latestNewsPosts={allNews.slice(0, 3)}
    />
  );
}
