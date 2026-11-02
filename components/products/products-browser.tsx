"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { fetchProducts } from "@/lib/store/products";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

const categories = [
  { value: "all", label: "All Products" },
  { value: "tablets", label: "Tablets & Capsules" },
  { value: "syrups", label: "Syrups" },
  { value: "injectables", label: "Injectables" },
  { value: "ointments", label: "Ointments & Creams" },
];

export function ProductsBrowser() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(
    searchParams.get("category") ?? "all",
  );
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCategory(searchParams.get("category") ?? "all");
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = products.filter((product) => {
      const matchesCategory =
        category === "all" || product.category === category;
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });

    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "name":
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return [...list].sort(
          (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
        );
    }
  }, [products, category, search, sort]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setCategory(item.value)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-xs font-bold transition",
                category === item.value
                  ? "bg-brand-700 text-white"
                  : "border border-slate-200 bg-white text-ink-soft hover:border-brand-300 hover:text-brand-800",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100 sm:w-64"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="w-full appearance-none rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-8 text-sm font-medium text-ink outline-none transition focus:border-brand-400 sm:w-44"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-[420px] animate-pulse rounded-3xl bg-slate-100"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-slate-200 bg-mist py-20 text-center">
          <p className="text-lg font-bold text-ink">No products found</p>
          <p className="mt-2 text-sm text-ink-soft">
            Try a different search term or category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("all");
            }}
            className="mt-5 rounded-full bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <>
          <p className="mt-6 text-xs font-medium text-ink-soft">
            Showing {filtered.length} product{filtered.length === 1 ? "" : "s"}
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
