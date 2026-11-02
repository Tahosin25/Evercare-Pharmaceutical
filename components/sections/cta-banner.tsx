import Link from "next/link";
import { ArrowRight, ShieldCheck, Stethoscope, Truck } from "lucide-react";

const perks = [
  { icon: ShieldCheck, label: "100% genuine medicines" },
  { icon: Truck, label: "Free delivery over $50" },
  { icon: Stethoscope, label: "Pharmacist support" },
];

export function CtaBanner() {
  return (
    <section className="bg-white pb-20 sm:pb-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-brand-800 to-brand-600 px-6 py-12 text-white sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-white/5" />
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-extrabold leading-tight text-balance sm:text-3xl">
                Your health, delivered with care — every single day.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-brand-100">
                Shop clinically trusted medicines from the comfort of home, with
                fast delivery and expert guidance at every step.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                {perks.map((perk) => (
                  <span
                    key={perk.label}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-brand-50"
                  >
                    <perk.icon className="h-4 w-4" /> {perk.label}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/products"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-brand-900 transition hover:bg-brand-50"
            >
              Start Shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
