"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Undo2,
} from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { useCartStore } from "@/lib/store/cart";
import { fetchProducts } from "@/lib/store/products";
import type { Product } from "@/lib/types";
import { cn, FREE_SHIPPING_THRESHOLD, formatPrice } from "@/lib/utils";

const categoryLabels: Record<string, string> = {
  tablets: "Tablets & Capsules",
  syrups: "Syrups & Suspensions",
  injectables: "Injectables",
  ointments: "Ointments & Creams",
};

const tabs = ["Description", "Dosage", "Uses", "Side Effects"] as const;

export function ProductDetail({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Description");
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchProducts()
      .then((items) => {
        const match = items.find((item) => item.slug === slug);
        setProduct(match ?? null);
        if (match) {
          setRelated(
            items
              .filter(
                (item) =>
                  item.category === match.category && item.id !== match.id,
              )
              .slice(0, 4),
          );
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-[2rem] bg-slate-100" />
          <div className="space-y-4">
            <div className="h-6 w-32 animate-pulse rounded-full bg-slate-100" />
            <div className="h-10 w-3/4 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-12 w-40 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-extrabold text-ink">Product not found</h1>
        <p className="mt-3 text-sm text-ink-soft">
          The product you are looking for may have been moved or discontinued.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white"
        >
          Browse all products
        </Link>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-ink-soft">
          <Link href="/" className="hover:text-brand-700">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/products" className="hover:text-brand-700">
            Products
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-ink">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-slate-100 shadow-[0_30px_60px_-40px_rgba(11,34,57,0.5)]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-800 shadow-sm">
            {categoryLabels[product.category] ?? product.category}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              {inStock ? "In stock" : "Out of stock"}
            </span>
            {product.featured ? (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-700">
                Best seller
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-ink text-balance sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-0.5 text-amber-500">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={cn(
                    "h-4 w-4",
                    index < Math.round(product.rating ?? 4.8)
                      ? "fill-current"
                      : "text-slate-300",
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-ink">
              {product.rating?.toFixed(1) ?? "4.8"}
            </span>
            <span className="text-sm text-ink-soft">
              ({product.reviews ?? 0} reviews)
            </span>
          </div>

          <p className="mt-5 text-3xl font-extrabold text-brand-800">
            {formatPrice(product.price)}
            <span className="ml-2 text-xs font-medium text-ink-soft">
              incl. all taxes
            </span>
          </p>

          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            {product.description}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-slate-200">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                aria-label="Decrease quantity"
                className="grid h-11 w-11 place-items-center text-ink-soft transition hover:text-ink"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-bold text-ink">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((value) => Math.min(product.stock, value + 1))
                }
                aria-label="Increase quantity"
                className="grid h-11 w-11 place-items-center text-ink-soft transition hover:text-ink"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              disabled={!inStock}
              onClick={() => addItem(product, quantity)}
              className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-8 py-3.5 text-sm font-bold text-white shadow-[0_18px_35px_-18px_rgba(11,88,212,0.8)] transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <ShoppingBag className="h-4 w-4" /> Add to cart
            </button>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {[
              {
                icon: Truck,
                title: "Free delivery",
                subtitle: `On orders over ${formatPrice(FREE_SHIPPING_THRESHOLD)}`,
              },
              {
                icon: ShieldCheck,
                title: "Authentic product",
                subtitle: "Sourced directly from Evercare",
              },
              {
                icon: Undo2,
                title: "Easy returns",
                subtitle: "Within 7 days of delivery",
              },
              {
                icon: BadgeCheck,
                title: "Quality assured",
                subtitle: "WHO-GMP certified facility",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-mist p-3.5"
              >
                <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
                <div>
                  <p className="text-xs font-bold text-ink">{item.title}</p>
                  <p className="text-[11px] text-ink-soft">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-mist py-12">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-100">
            {tabs.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={cn(
                  "shrink-0 rounded-full px-5 py-2.5 text-xs font-bold transition",
                  tab === item
                    ? "bg-brand-700 text-white"
                    : "text-ink-soft hover:text-ink",
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-white p-6 text-sm leading-relaxed text-ink-soft shadow-sm ring-1 ring-slate-100 sm:p-8">
            {tab === "Description" ? <p>{product.description}</p> : null}
            {tab === "Dosage" ? (
              <p>{product.dosage || "Dosage information is not available."}</p>
            ) : null}
            {tab === "Uses" ? (
              <ul className="grid gap-2 sm:grid-cols-2">
                {(product.uses ?? []).map((use) => (
                  <li key={use} className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-emerald-600" />
                    {use}
                  </li>
                ))}
              </ul>
            ) : null}
            {tab === "Side Effects" ? (
              <ul className="space-y-2">
                {(product.sideEffects ?? []).map((effect) => (
                  <li key={effect} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    {effect}
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-6 rounded-xl bg-brand-50 p-3 text-xs text-brand-900">
              Always read the label and consult your doctor or pharmacist before
              starting any new medication.
            </p>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="py-16">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold text-ink">
              You may also like
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item, index) => (
                <ProductCard key={item.id} product={item} index={index} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
