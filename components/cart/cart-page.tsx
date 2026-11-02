"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import {
  cartSubtotal,
  useCartStore,
} from "@/lib/store/cart";
import {
  calcShipping,
  FREE_SHIPPING_THRESHOLD,
  formatPrice,
} from "@/lib/utils";

export function CartPage() {
  const { items, removeItem, setQuantity } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-72 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  const subtotal = cartSubtotal(items);
  const shipping = calcShipping(subtotal);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div className="bg-mist py-12 sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">
          Your Cart
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          {items.length === 0
            ? "Your cart is waiting to be filled."
            : `${items.length} item${items.length === 1 ? "" : "s"} in your cart.`}
        </p>

        {items.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-5 rounded-3xl bg-white px-6 py-20 text-center shadow-sm ring-1 ring-slate-100">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-50 text-brand-700">
              <ShoppingBag className="h-9 w-9" />
            </span>
            <div>
              <p className="text-xl font-extrabold text-ink">
                Your cart is empty
              </p>
              <p className="mt-2 text-sm text-ink-soft">
                Explore our range of trusted medicines and wellness essentials.
              </p>
            </div>
            <Link
              href="/products"
              className="rounded-full bg-brand-700 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-brand-800"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.7fr_1fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-medium text-ink-soft ring-1 ring-slate-100">
                <Truck className="h-4 w-4 text-brand-700" />
                {remaining > 0 ? (
                  <span>
                    Add{" "}
                    <strong className="text-ink">{formatPrice(remaining)}</strong>{" "}
                    more to unlock free shipping.
                  </span>
                ) : (
                  <span className="font-semibold text-emerald-600">
                    Free shipping unlocked on this order.
                  </span>
                )}
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-28 sm:w-28"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          className="line-clamp-2 text-sm font-bold text-ink transition hover:text-brand-700 sm:text-base"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-xs text-ink-soft">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="text-slate-400 transition hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                      <div className="flex items-center rounded-full border border-slate-200">
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(item.id, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="grid h-9 w-9 place-items-center text-ink-soft transition hover:text-ink"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-ink">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(item.id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="grid h-9 w-9 place-items-center text-ink-soft transition hover:text-ink"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-base font-extrabold text-ink">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-900"
              >
                Continue shopping <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:sticky lg:top-28">
              <h2 className="text-lg font-extrabold text-ink">Order Summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Subtotal</dt>
                  <dd className="font-semibold text-ink">
                    {formatPrice(subtotal)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Shipping</dt>
                  <dd className="font-semibold text-ink">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-3 text-base">
                  <dt className="font-bold text-ink">Total</dt>
                  <dd className="font-extrabold text-brand-800">
                    {formatPrice(subtotal + shipping)}
                  </dd>
                </div>
              </dl>
              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-brand-800"
              >
                Proceed to checkout <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-4 text-center text-[11px] text-ink-soft">
                Secure checkout · Free shipping over{" "}
                {formatPrice(FREE_SHIPPING_THRESHOLD)}
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
