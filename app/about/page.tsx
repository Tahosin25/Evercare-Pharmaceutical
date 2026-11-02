import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  BadgeCheck,
  FlaskConical,
  Globe2,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { COMPANY_STATS } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "For over 20 years Evercare Pharmaceuticals has developed safe, effective and affordable medicines. Learn about our mission, quality standards and manufacturing.",
};

const values = [
  {
    icon: HeartHandshake,
    title: "Patients First",
    description:
      "Every decision starts with the people who take our medicines and the clinicians who prescribe them.",
  },
  {
    icon: FlaskConical,
    title: "Science Led",
    description:
      "Our R&D teams pursue formulations backed by evidence, rigorous testing and clinical insight.",
  },
  {
    icon: ShieldCheck,
    title: "Uncompromising Quality",
    description:
      "WHO-GMP facilities, multi-stage quality checks and complete batch traceability.",
  },
  {
    icon: Leaf,
    title: "Sustainable Healthcare",
    description:
      "Responsible manufacturing and community programmes that widen access to quality care.",
  },
];

const certifications = [
  "WHO-GMP Certified",
  "ISO 9001:2015",
  "ISO 14001:2015",
  "ISO 45001:2018",
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-brand-50 to-white py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-700">
              About Evercare
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-ink text-balance sm:text-5xl">
              Committed to{" "}
              <span className="text-brand-700">better health</span> since 2004
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft">
              Evercare Pharmaceuticals is a trusted name in healthcare,
              committed to research, innovation and excellence in
              pharmaceutical manufacturing. From our first facility to a global
              supply network, our purpose has never changed: help people live
              healthier, happier lives.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-full bg-brand-700 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-brand-800"
              >
                Explore products
              </Link>
              <Link
                href="/careers"
                className="rounded-full border border-brand-200 px-7 py-3.5 text-sm font-bold text-brand-800 transition hover:border-brand-400"
              >
                Join our team
              </Link>
            </div>
          </div>
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2.5rem] shadow-[0_40px_80px_-45px_rgba(11,88,212,0.55)]">
            <Image
              src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=80"
              alt="Evercare research and manufacturing team"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {COMPANY_STATS.map((stat, index) => {
            const icons = [Award, Users, Globe2, BadgeCheck];
            const Icon = icons[index];
            return (
              <div
                key={stat.label}
                className="rounded-3xl border border-slate-100 bg-mist p-6 text-center"
              >
                <Icon className="mx-auto h-6 w-6 text-brand-700" />
                <p className="mt-3 text-3xl font-extrabold text-ink">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-mist py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-700">
              Our Mission & Values
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
              Science with purpose. Care in every dose.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              We exist to make high-quality medicines accessible, affordable and
              dependable for every family — while holding ourselves to the
              highest standards of safety and integrity.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-3xl bg-white p-6 shadow-[0_16px_35px_-32px_rgba(11,34,57,0.5)] ring-1 ring-slate-100"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                  <value.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-ink">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="quality" className="scroll-mt-28 bg-white py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2.5rem]">
            <Image
              src="https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?auto=format&fit=crop&w=1200&q=80"
              alt="Quality assurance laboratory at Evercare"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-700">
              Quality & Safety
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
              Quality is not a step. It&apos;s our culture.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              From raw material sourcing to the final packaged product, every
              batch passes through documented quality gates. Our laboratories
              test identity, potency and purity before release, and every unit
              carries full traceability.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-ink-soft">
              {[
                "Multi-stage in-process and finished-product testing",
                "Validated processes with complete batch records",
                "Cold-chain and controlled storage where required",
                "Pharmacovigilance and post-market safety monitoring",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        id="manufacturing"
        className="scroll-mt-28 bg-mist py-16 sm:py-20"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="order-2 lg:order-1">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-700">
              Manufacturing
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
              Modern facilities, meticulous standards.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Our manufacturing sites operate under WHO-GMP guidelines with
              dedicated lines for solid dosage forms, liquids, sterile
              injectables and topical products. Automated systems and trained
              teams work together to deliver consistent quality at scale.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {certifications.map((certification) => (
                <div
                  key={certification}
                  className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-bold text-ink ring-1 ring-slate-100"
                >
                  <ShieldCheck className="h-4 w-4 text-brand-700" />
                  {certification}
                </div>
              ))}
            </div>
          </div>
          <div className="relative order-1 aspect-[5/4] overflow-hidden rounded-[2.5rem] lg:order-2">
            <Image
              src="https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1200&q=80"
              alt="Evercare manufacturing facility"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-brand-800 to-brand-600 px-6 py-12 text-white sm:px-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
            <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <Target className="h-8 w-8 text-brand-200" />
                <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                  Our goal is simple: healthier lives, everywhere.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-brand-100">
                  Partner with us to bring trusted medicines to more families,
                  communities and clinics around the world.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-brand-900 transition hover:bg-brand-50"
              >
                Partner with us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
