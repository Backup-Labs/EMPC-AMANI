import { notFound } from "next/navigation";
import { getProductById, getRelatedProducts } from "@/lib/cms/products";
import { ProductDetailClient } from "./ProductDetailClient";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();
  const relatedProducts = await getRelatedProducts(id);
  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
