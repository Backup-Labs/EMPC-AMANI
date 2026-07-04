import { notFound, redirect } from "next/navigation";
import { getPostBySlug, getRelatedPosts } from "@/lib/cms/news";
import { NewsDetailClient } from "./NewsDetailClient";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  if (post.externalUrl) redirect(post.externalUrl);
  const related = await getRelatedPosts(slug);
  return <NewsDetailClient post={post} related={related} />;
}
