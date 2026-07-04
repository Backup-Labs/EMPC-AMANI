import { getPublishedProducts } from "@/lib/cms/products";
import { ProductsClient } from "./ProductsClient";

export default async function ProductsPage() {
  const products = await getPublishedProducts();
  return <ProductsClient products={products} />;
}
