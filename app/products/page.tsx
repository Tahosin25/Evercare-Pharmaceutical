import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductsBrowser } from "@/components/products/products-browser";

export const metadata: Metadata = {
  title: "Our Products",
  description:
    "Browse Evercare's complete range of tablets, syrups, injectables and dermatological care — all manufactured to strict quality standards.",
};

export default function ProductsPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-slate-100 bg-gradient-to-b from-brand-50 to-white py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-700">
            Our Products
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight text-ink text-balance sm:text-4xl">
            Pharmaceutical solutions for every stage of life
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
            Every Evercare product is developed with rigorous research, tested
            for safety and manufactured to WHO-GMP standards.
          </p>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[420px] animate-pulse rounded-3xl bg-slate-100"
                />
              ))}
            </div>
          </div>
        }
      >
        <ProductsBrowser />
      </Suspense>
    </div>
  );
}
