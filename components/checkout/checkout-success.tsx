"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { CheckCircle2, Package, ShoppingBag } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { markOrderPaid } from "@/lib/store/orders";

export function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const sessionId = searchParams.get("session_id");
  const { user } = useAuth();

  useEffect(() => {
    if (orderId && sessionId && user) {
      markOrderPaid(orderId).catch((error) =>
        console.error("Unable to mark order as paid", error),
      );
    }
  }, [orderId, sessionId, user]);

  return (
    <div className="bg-mist py-16 sm:py-24">
      <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
        <div className="rounded-[2.5rem] bg-white p-8 text-center shadow-[0_30px_60px_-40px_rgba(11,34,57,0.4)] ring-1 ring-slate-100 sm:p-12">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </span>
          <h1 className="mt-6 text-3xl font-extrabold text-ink">
            Thank you for your order!
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Your order has been placed successfully. A confirmation email is on
            its way. Our pharmacist team will prepare your medicines with care.
          </p>

          {orderId ? (
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-50 px-5 py-2.5 text-sm font-bold text-brand-800">
              Order ID: {orderId}
            </p>
          ) : null}

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              href="/orders"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-brand-800"
            >
              <Package className="h-4 w-4" /> Track my order
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-6 py-3.5 text-sm font-bold text-ink transition hover:border-brand-300 hover:text-brand-800"
            >
              <ShoppingBag className="h-4 w-4" /> Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
