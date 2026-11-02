"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { fetchAllOrders } from "@/lib/store/orders";
import { fetchAllProducts } from "@/lib/store/products";
import type { Order, Product } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAllProducts(), fetchAllOrders()])
      .then(([productList, orderList]) => {
        setProducts(productList);
        setOrders(orderList);
      })
      .finally(() => setLoading(false));
  }, []);

  const revenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);
  const pending = orders.filter((order) =>
    ["pending", "paid", "processing"].includes(order.status),
  ).length;

  const stats = [
    {
      label: "Total revenue",
      value: formatPrice(revenue),
      icon: DollarSign,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Orders",
      value: String(orders.length),
      icon: ShoppingCart,
      tone: "bg-brand-50 text-brand-700",
    },
    {
      label: "Active products",
      value: String(products.length),
      icon: Package,
      tone: "bg-violet-50 text-violet-700",
    },
    {
      label: "To fulfil",
      value: String(pending),
      icon: TrendingUp,
      tone: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Overview of your store performance.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-800"
        >
          Manage products <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
          >
            <span
              className={"grid h-10 w-10 place-items-center rounded-2xl " + stat.tone}
            >
              <stat.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-2xl font-extrabold text-ink">
              {loading ? "—" : stat.value}
            </p>
            <p className="text-xs font-medium text-ink-soft">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-ink">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-brand-700 hover:text-brand-900"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="mt-4 h-32 animate-pulse rounded-2xl bg-slate-100" />
        ) : orders.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-mist px-4 py-8 text-center text-sm text-ink-soft">
            No orders yet. Orders placed by customers will appear here.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 6).map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 font-semibold text-ink">#{order.id}</td>
                    <td className="py-3 text-ink-soft">{order.customerName}</td>
                    <td className="py-3 text-ink-soft">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-ink">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
