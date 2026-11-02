import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Star } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-mist to-white">
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-sky-100 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-24 lg:pt-16 lg:px-8">
        <div className="animate-fade-up">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-700">
            Better Health. Brighter Futures.
          </p>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-ink text-balance sm:text-5xl lg:text-6xl">
            Trusted Healthcare{" "}
            <span className="text-brand-700">for Every Stage of Life</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            We are dedicated to developing safe, effective and affordable
            medicines that help people live healthier, happier lives — backed
            by science, delivered with care.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 text-sm font-bold text-white shadow-[0_18px_35px_-18px_rgba(11,88,212,0.8)] transition hover:bg-brand-800"
            >
              Explore Our Products <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-7 py-3.5 text-sm font-bold text-brand-800 transition hover:border-brand-400 hover:bg-white"
            >
              Our Mission
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-3">
                {[
                  "https://randomuser.me/api/portraits/women/44.jpg",
                  "https://randomuser.me/api/portraits/men/32.jpg",
                  "https://randomuser.me/api/portraits/women/68.jpg",
                ].map((src) => (
                  <span
                    key={src}
                    className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white"
                  >
                    <Image src={src} alt="Happy customer" fill sizes="36px" />
                  </span>
                ))}
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-0.5 font-semibold text-ink-soft">
                  240k+ happy customers
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-ink-soft ring-1 ring-brand-100">
              <BadgeCheck className="h-4 w-4 text-brand-700" />
              WHO-GMP certified manufacturing
            </div>
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:150ms]">
          <div className="relative aspect-[4/4.4] overflow-hidden rounded-[2.5rem] shadow-[0_40px_80px_-40px_rgba(11,88,212,0.55)]">
            <Image
              src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=80"
              alt="Evercare pharmaceutical scientist holding a medicine vial"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/50 via-transparent to-transparent" />
            <div className="absolute right-4 top-4 flex flex-col items-end gap-2 text-right text-white">
              {["Science", "Innovation", "Better Lives"].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold backdrop-blur-md"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="animate-float-slow absolute -left-4 bottom-8 rounded-2xl bg-white/95 p-4 shadow-card backdrop-blur sm:-left-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-700">
              Certified Quality
            </p>
            <p className="mt-1 text-2xl font-extrabold text-ink">ISO 9001</p>
            <p className="text-xs text-ink-soft">Quality management</p>
          </div>

          <div className="absolute -right-2 top-1/2 hidden rounded-2xl bg-white/95 p-4 shadow-card backdrop-blur sm:block lg:-right-6">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                <BadgeCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-extrabold text-ink">99.8%</p>
                <p className="text-[11px] text-ink-soft">Batch accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
