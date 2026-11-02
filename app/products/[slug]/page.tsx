import type { Metadata } from "next";
import { ProductDetail } from "@/components/products/product-detail";

export const metadata: Metadata = {
  title: "Product Details",
  description:
    "View dosage, uses and safety information for Evercare pharmaceutical products.",
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetail slug={slug} />;
}
