"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { cartCount, useCartStore } from "@/lib/store/cart";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, signOutUser } = useAuth();
  const items = useCartStore((state) => state.items);
  const openCart = useCartStore((state) => state.openCart);

  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [search, setSearch] = useState("");
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const term = search.trim();
    setSearchOpen(false);
    router.push(term ? `/products?q=${encodeURIComponent(term)}` : "/products");
  }

  const count = mounted ? cartCount(items) : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-700 text-white shadow-[0_12px_24px_-14px_rgba(11,88,212,0.9)]">
            <Leaf className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <span className="leading-tight">
            <span className="block text-xl font-extrabold tracking-tight text-ink">
              Evercare
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700">
              Pharmaceuticals
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  active
                    ? "bg-brand-50 text-brand-800"
                    : "text-ink-soft hover:bg-slate-50 hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            aria-label="Search products"
            className="grid h-10 w-10 place-items-center rounded-full text-ink-soft transition hover:bg-slate-50 hover:text-ink"
          >
            {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>

          <div className="relative hidden sm:block" ref={accountRef}>
            <button
              type="button"
              onClick={() => setAccountOpen((open) => !open)}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-ink-soft transition hover:bg-slate-50 hover:text-ink"
            >
              <User className="h-5 w-5" />
              <span className="hidden xl:inline">
                {mounted && user ? user.name.split(" ")[0] : "Account"}
              </span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {accountOpen ? (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-card">
                {mounted && user ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="truncate text-sm font-bold text-ink">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-ink-soft">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/orders"
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink-soft transition hover:bg-brand-50 hover:text-brand-800"
                    >
                      <Package className="h-4 w-4" /> My orders
                    </Link>
                    {isAdmin ? (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink-soft transition hover:bg-brand-50 hover:text-brand-800"
                      >
                        <LayoutDashboard className="h-4 w-4" /> Admin dashboard
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      onClick={async () => {
                        await signOutUser();
                        setAccountOpen(false);
                        router.push("/");
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="block rounded-xl px-3 py-2 text-sm font-semibold text-ink transition hover:bg-brand-50"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block rounded-xl px-3 py-2 text-sm font-medium text-ink-soft transition hover:bg-brand-50"
                    >
                      Create an account
                    </Link>
                  </>
                )}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={openCart}
            aria-label="Open cart"
            className="relative grid h-10 w-10 place-items-center rounded-full text-ink-soft transition hover:bg-slate-50 hover:text-ink"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-700 px-1 text-[10px] font-bold text-white">
                {count > 99 ? "99+" : count}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-full text-ink-soft transition hover:bg-slate-50 hover:text-ink lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {searchOpen ? (
        <div className="border-t border-slate-100 bg-white">
          <form
            onSubmit={submitSearch}
            className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8"
          >
            <Search className="h-5 w-5 text-slate-400" />
            <input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search medicines, vitamins, skin care..."
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="rounded-full bg-brand-700 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white"
            >
              Search
            </button>
          </form>
        </div>
      ) : null}

      {mobileOpen ? (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <nav className="mx-auto grid w-full max-w-7xl gap-1 px-4 py-4 sm:px-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-3 text-sm font-semibold text-ink-soft transition hover:bg-brand-50 hover:text-brand-800"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-slate-100 pt-3">
              {mounted && user ? (
                <>
                  <Link
                    href="/orders"
                    className="block rounded-xl px-3 py-3 text-sm font-semibold text-ink-soft hover:bg-brand-50"
                  >
                    My orders
                  </Link>
                  {isAdmin ? (
                    <Link
                      href="/admin"
                      className="block rounded-xl px-3 py-3 text-sm font-semibold text-ink-soft hover:bg-brand-50"
                    >
                      Admin dashboard
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={async () => {
                      await signOutUser();
                      router.push("/");
                    }}
                    className="block w-full rounded-xl px-3 py-3 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/auth/login"
                    className="flex-1 rounded-full border border-brand-200 px-4 py-2.5 text-center text-sm font-semibold text-brand-800"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="flex-1 rounded-full bg-brand-700 px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
