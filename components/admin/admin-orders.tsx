"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { fetchAllOrders, updateOrderStatus } from "@/lib/store/orders";
import type { Order, OrderStatus } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";

const statuses: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setOrders(await fetchAllOrders());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleStatus(order: Order, status: OrderStatus) {
    setUpdating(order.id);
    setError("");
    try {
      await updateOrderStatus(order.id, status);
      setOrders((current) =>
        current.map((item) =>
          item.id === order.id ? { ...item, status } : item,
        ),
      );
    } catch {
      setError("Unable to update the order status.");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">
            Orders
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {orders.length} order{orders.length === 1 ? "" : "s"} total.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-ink-soft transition hover:text-ink"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
        {loading ? (
          <div className="h-64 animate-pulse bg-slate-50" />
        ) : orders.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-ink-soft">
            No orders yet. Orders placed by customers will appear here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                  <th className="px-5 py-3.5">Order</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Items</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Total</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-5 py-4 font-semibold text-ink">
                      #{order.id}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink">
                        {order.customerName}
                      </p>
                      <p className="text-[11px] text-ink-soft">{order.email}</p>
                    </td>
                    <td className="px-5 py-4 text-ink-soft">
                      {order.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0,
                      )}{" "}
                      item(s)
                    </td>
                    <td className="px-5 py-4 text-ink-soft">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-4 font-bold text-ink">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(event) =>
                            handleStatus(
                              order,
                              event.target.value as OrderStatus,
                            )
                          }
                          disabled={updating === order.id}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold capitalize text-ink outline-none focus:border-brand-400"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        {updating === order.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-brand-700" />
                        ) : null}
                      </div>
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
