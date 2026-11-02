"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { fetchProducts } from "@/lib/store/products";
import type { Product } from "@/lib/types";

export function ProductShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((items) => {
        if (!cancelled) {
          const featured = items.filter((item) => item.featured);
          setProducts((featured.length ? featured : items).slice(0, 8));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-mist py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Best Sellers"
            title="Trusted Medicines, Everyday Wellness"
            description="Pharmacist-approved essentials loved by families across the country."
          />
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-brand-200 bg-white px-6 py-3 text-sm font-bold text-brand-800 transition hover:border-brand-400"
          >
            All Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[420px] animate-pulse rounded-3xl bg-white/70"
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
