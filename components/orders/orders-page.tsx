"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Package, ShoppingBag } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { fetchOrdersForUser } from "@/lib/store/orders";
import type { Order, OrderStatus } from "@/lib/types";
import { cn, formatDate, formatPrice } from "@/lib/utils";

const statusTones: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  paid: "bg-emerald-50 text-emerald-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-50 text-rose-700",
};

export function OrdersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login?next=/orders");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    fetchOrdersForUser(user.uid)
      .then(setOrders)
      .finally(() => setFetching(false));
  }, [user]);

  if (loading || !user) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        <div className="h-64 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="bg-mist py-12 sm:py-16">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">
          My Orders
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Track deliveries and review your Evercare purchase history.
        </p>

        {fetching ? (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-3xl bg-white"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl bg-white px-6 py-20 text-center shadow-sm ring-1 ring-slate-100">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-700">
              <Package className="h-7 w-7" />
            </span>
            <div>
              <p className="text-lg font-extrabold text-ink">No orders yet</p>
              <p className="mt-1 text-sm text-ink-soft">
                Your future orders will appear here.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-bold text-white"
            >
              <ShoppingBag className="h-4 w-4" /> Start shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-sm font-extrabold text-ink">
                      #{order.id}
                    </p>
                    <p className="text-xs text-ink-soft">
                      Placed {formatDate(order.createdAt)} ·{" "}
                      {order.paymentMethod}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider",
                      statusTones[order.status] ?? "bg-slate-100 text-slate-600",
                    )}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {order.items.slice(0, 5).map((item) => (
                    <div
                      key={item.productId}
                      className="relative h-14 w-14 overflow-hidden rounded-xl bg-slate-100"
                      title={item.name}
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {order.items.length > 5 ? (
                    <span className="text-xs font-semibold text-ink-soft">
                      +{order.items.length - 5} more
                    </span>
                  ) : null}
                  <span className="ml-auto text-base font-extrabold text-ink">
                    {formatPrice(order.total)}
                  </span>
                </div>

                <div className="mt-4 text-xs text-ink-soft">
                  <p>
                    {order.items
                      .map((item) => `${item.name} × ${item.quantity}`)
                      .join(" · ")}
                  </p>
                  <p className="mt-1">
                    Deliver to: {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zip}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
