"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import {
  cartSubtotal,
  useCartStore,
} from "@/lib/store/cart";
import { FREE_SHIPPING_THRESHOLD, formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, setQuantity } = useCartStore();
  const subtotal = cartSubtotal(items);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-brand-700" />
                <h2 className="text-lg font-bold text-ink">Your Cart</h2>
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-800">
                  {items.length}
                </span>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="grid h-9 w-9 place-items-center rounded-full text-ink-soft transition hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-700">
                  <ShoppingBag className="h-7 w-7" />
                </span>
                <div>
                  <p className="text-base font-bold text-ink">
                    Your cart is empty
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    Add medicines or wellness essentials to get started.
                  </p>
                </div>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
                >
                  Browse products
                </Link>
              </div>
            ) : (
              <>
                <div className="border-b border-slate-100 px-6 py-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium text-ink-soft">
                    <Truck className="h-4 w-4 text-brand-700" />
                    {remaining > 0 ? (
                      <span>
                        You&apos;re{" "}
                        <strong className="text-ink">
                          {formatPrice(remaining)}
                        </strong>{" "}
                        away from free shipping
                      </span>
                    ) : (
                      <span className="font-semibold text-emerald-600">
                        You&apos;ve unlocked free shipping!
                      </span>
                    )}
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-brand-600 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/products/${item.slug}`}
                            onClick={closeCart}
                            className="line-clamp-2 text-sm font-semibold text-ink transition hover:text-brand-700"
                          >
                            {item.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.name}`}
                            className="text-slate-400 transition hover:text-rose-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mt-0.5 text-xs text-ink-soft">
                          {formatPrice(item.price)}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-slate-200">
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(item.id, item.quantity - 1)
                              }
                              aria-label="Decrease quantity"
                              className="grid h-8 w-8 place-items-center text-ink-soft transition hover:text-ink"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-7 text-center text-sm font-semibold text-ink">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(item.id, item.quantity + 1)
                              }
                              aria-label="Increase quantity"
                              className="grid h-8 w-8 place-items-center text-ink-soft transition hover:text-ink"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="text-sm font-bold text-ink">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 px-6 py-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-soft">Subtotal</span>
                    <span className="text-lg font-extrabold text-ink">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-soft">
                    Shipping calculated at checkout. Free over{" "}
                    {formatPrice(FREE_SHIPPING_THRESHOLD)}.
                  </p>
                  <div className="mt-4 grid gap-2">
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="rounded-full bg-brand-700 px-6 py-3.5 text-center text-sm font-bold text-white transition hover:bg-brand-800"
                    >
                      Checkout
                    </Link>
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className="rounded-full border border-slate-200 px-6 py-3 text-center text-sm font-semibold text-ink transition hover:border-brand-300 hover:text-brand-800"
                    >
                      View cart
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
