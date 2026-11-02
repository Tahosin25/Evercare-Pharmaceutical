import type { Metadata } from "next";
import { ContactSection } from "@/components/contact/contact-section";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Evercare Pharmaceuticals for product enquiries, partnerships or support.",
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-brand-50 to-white py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-700">
            Contact
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight text-ink text-balance sm:text-5xl">
            We&apos;d love to hear from you
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
            Whether you have a product question, need support with an order or
            want to explore a partnership, our team is here to help.
          </p>
        </div>
      </section>
      <ContactSection />
    </div>
  );
}
