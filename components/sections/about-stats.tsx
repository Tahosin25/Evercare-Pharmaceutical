import Image from "next/image";
import Link from "next/link";
import { Award, Globe2, Sparkles, Users } from "lucide-react";
import { COMPANY_STATS } from "@/lib/demo-data";

const statIcons = [Award, Users, Globe2, Sparkles];

export function AboutStats() {
  return (
    <section className="relative overflow-hidden bg-mist py-20 sm:py-24">
      <div className="pointer-events-none absolute -left-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-brand-100/70 blur-3xl" />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-700">
            About Us
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-ink text-balance sm:text-4xl lg:text-[2.75rem]">
            Committed to <span className="text-brand-700">Better Health</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft">
            Evercare Pharmaceuticals is a trusted name in the healthcare
            industry, committed to research, innovation and excellence in
            pharmaceutical manufacturing. For over two decades we have partnered
            with clinicians and communities to make quality care accessible.
          </p>

          <div className="mt-8 grid max-w-md grid-cols-2 gap-4">
            {COMPANY_STATS.map((stat, index) => {
              const Icon = statIcons[index];
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white bg-white/80 p-4 shadow-[0_12px_30px_-24px_rgba(11,34,57,0.4)] backdrop-blur"
                >
                  <Icon className="h-5 w-5 text-brand-700" />
                  <p className="mt-2 text-2xl font-extrabold text-ink">
                    {stat.value}
                  </p>
                  <p className="text-xs font-medium text-ink-soft">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-brand-800"
          >
            Our Mission
          </Link>
        </div>

        <div className="relative">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2.5rem] shadow-[0_40px_80px_-45px_rgba(11,88,212,0.55)]">
            <Image
              src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80"
              alt="Evercare scientists working in a modern research laboratory"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <Award className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-extrabold text-ink">WHO-GMP</p>
              <p className="text-[11px] text-ink-soft">
                Certified manufacturing facility
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
