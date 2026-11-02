"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Star } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const categoryLabels: Record<string, string> = {
  tablets: "Tablets",
  syrups: "Syrups",
  injectables: "Injectables",
  ointments: "Ointments",
};

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const inStock = product.stock > 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.3) }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_18px_40px_-32px_rgba(11,34,57,0.4)] transition hover:-translate-y-1 hover:shadow-card"
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-slate-100"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-800 shadow-sm">
          {categoryLabels[product.category] ?? product.category}
        </span>
        {!inStock ? (
          <span className="absolute right-3 top-3 rounded-full bg-rose-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Out of stock
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1.5 flex items-center gap-1 text-amber-500">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span className="text-xs font-bold text-ink">
            {product.rating?.toFixed(1) ?? "4.8"}
          </span>
          <span className="text-xs text-slate-400">
            ({product.reviews ?? 0} reviews)
          </span>
        </div>
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 text-base font-bold leading-snug text-ink transition hover:text-brand-700"
        >
          {product.name}
        </Link>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-soft">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 pt-1">
          <span className="text-lg font-extrabold text-ink">
            {formatPrice(product.price)}
          </span>
          <button
            type="button"
            disabled={!inStock}
            onClick={() => addItem(product)}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Plus className="h-3.5 w-3.5" /> Add to cart
          </button>
        </div>
      </div>
    </motion.article>
  );
}
