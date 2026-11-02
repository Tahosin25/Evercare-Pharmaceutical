import type { Metadata } from "next";
import { CareersList } from "@/components/careers/careers-list";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Evercare Pharmaceuticals. Explore open roles in research, quality, regulatory affairs, manufacturing and medical affairs.",
};

export default function CareersPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-brand-50 to-white py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-700">
            Careers
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight text-ink text-balance sm:text-5xl">
            Build a career that makes{" "}
            <span className="text-brand-700">healthier lives</span> possible
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
            Our people are the heart of Evercare. From formulation scientists to
            supply chain specialists, every role contributes to medicines
            families can trust.
          </p>
        </div>
      </section>
      <CareersList />
    </div>
  );
}
