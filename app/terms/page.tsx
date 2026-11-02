import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold text-ink">Terms & Conditions</h1>
      <p className="mt-3 text-sm text-ink-soft">
        Last updated: November 2026
      </p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-soft">
        <p>
          By accessing this website and purchasing Evercare products, you agree
          to the following terms. Please read them carefully.
        </p>
        <h2 className="text-lg font-bold text-ink">Medical disclaimer</h2>
        <p>
          Information on this website is for general education and does not
          replace professional medical advice. Always read the product label and
          consult your doctor or pharmacist before use.
        </p>
        <h2 className="text-lg font-bold text-ink">Orders and payment</h2>
        <p>
          All orders are subject to availability and confirmation of payment.
          Prices are listed in USD and include applicable taxes. Shipping is
          free on orders over $50.
        </p>
        <h2 className="text-lg font-bold text-ink">Returns</h2>
        <p>
          Unopened products may be returned within 7 days of delivery. For
          safety and regulatory reasons, opened medicines cannot be returned
          unless they are faulty.
        </p>
        <h2 className="text-lg font-bold text-ink">Contact</h2>
        <p>
          Questions about these terms can be sent to legal@evercare.com.
        </p>
      </div>
    </div>
  );
}
