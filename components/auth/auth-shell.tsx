import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { BadgeCheck, Leaf, ShieldCheck, Truck } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-14 sm:px-8">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center gap-2.5">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-700 text-white">
              <Leaf className="h-6 w-6" />
            </span>
            <span className="leading-tight">
              <span className="block text-xl font-extrabold text-ink">
                Evercare
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700">
                Pharmaceuticals
              </span>
            </span>
          </Link>

          <h1 className="text-3xl font-extrabold text-ink">{title}</h1>
          <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>

          <div className="mt-8">{children}</div>
          <div className="mt-6 text-sm text-ink-soft">{footer}</div>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80"
          alt="Evercare pharmacist supporting a patient"
          fill
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-200">
            Better Health. Brighter Futures.
          </p>
          <h2 className="mt-3 max-w-md text-3xl font-extrabold leading-tight">
            Healthcare you can trust, delivered with care.
          </h2>
          <div className="mt-6 flex flex-wrap gap-5 text-xs font-semibold text-slate-200">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand-300" /> Authentic
              medicines
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-brand-300" /> Fast delivery
            </span>
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-brand-300" /> Pharmacist
              approved
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
