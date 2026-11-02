import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutPage } from "@/components/checkout/checkout-page";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Evercare order securely.",
};

export default function CheckoutRoute() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="h-96 animate-pulse rounded-3xl bg-slate-100" />
        </div>
      }
    >
      <CheckoutPage />
    </Suspense>
  );
}
