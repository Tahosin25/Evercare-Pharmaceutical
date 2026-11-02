"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import {
  ArrowLeft,
  LayoutDashboard,
  Package,
  ShieldAlert,
  ShoppingCart,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAdmin, demoMode } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login?next=/admin");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-64 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="text-sm text-ink-soft">Redirecting to sign in…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center sm:px-6">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-50 text-amber-600">
          <ShieldAlert className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-ink">
          Admin access required
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          This area is restricted to Evercare administrators.
          {demoMode
            ? " Sign in with admin@evercare.com / admin123 to explore the dashboard."
            : ""}
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white"
        >
          Back to store
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:gap-8 lg:px-8">
        <aside className="h-fit rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 lg:sticky lg:top-28 lg:w-60">
          <p className="px-3 pb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-soft">
            Admin Panel
          </p>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                    active
                      ? "bg-brand-700 text-white"
                      : "text-ink-soft hover:bg-brand-50 hover:text-brand-800",
                  )}
                >
                  <item.icon className="h-4 w-4" /> {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 border-t border-slate-100 pt-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" /> Back to store
            </Link>
          </div>
          {demoMode ? (
            <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-800">
              Demo mode — data is stored locally until Firebase is configured.
            </p>
          ) : null}
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
