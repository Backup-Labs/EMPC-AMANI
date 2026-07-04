import { getPublishedPosts } from "@/lib/cms/news";
import { NewsClient } from "./NewsClient";

export default async function NewsPage() {
  const posts = await getPublishedPosts();
  return <NewsClient posts={posts} />;
}
