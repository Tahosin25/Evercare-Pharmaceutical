import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutSuccess } from "@/components/checkout/checkout-success";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Thank you for your Evercare order.",
};

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center sm:px-6">
          <div className="mx-auto h-72 max-w-md animate-pulse rounded-3xl bg-slate-100" />
        </div>
      }
    >
      <CheckoutSuccess />
    </Suspense>
  );
}
