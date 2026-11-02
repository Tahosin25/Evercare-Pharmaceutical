import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold text-ink">Privacy Policy</h1>
      <p className="mt-3 text-sm text-ink-soft">
        Last updated: November 2026
      </p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-soft">
        <p>
          Evercare Pharmaceuticals respects your privacy. This policy explains
          how we collect, use and protect the information you share with us when
          you use this website or purchase our products.
        </p>
        <h2 className="text-lg font-bold text-ink">Information we collect</h2>
        <p>
          We collect information you provide directly, such as your name, email
          address, phone number, shipping address and order details. Payment
          information is processed securely by our payment provider and is never
          stored on our servers.
        </p>
        <h2 className="text-lg font-bold text-ink">How we use your data</h2>
        <p>
          Your information is used to fulfil orders, provide customer support,
          improve our products and send updates you have opted into. We never
          sell your personal data.
        </p>
        <h2 className="text-lg font-bold text-ink">Your rights</h2>
        <p>
          You may request access, correction or deletion of your personal data
          at any time by contacting privacy@evercare.com.
        </p>
      </div>
    </div>
  );
}
