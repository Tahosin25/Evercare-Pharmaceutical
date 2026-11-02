"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Loader2,
  Lock,
  Truck,
  Wallet,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { cartSubtotal, useCartStore } from "@/lib/store/cart";
import { createOrder } from "@/lib/store/orders";
import type { OrderItem, ShippingAddress } from "@/lib/types";
import { calcShipping, cn, formatPrice } from "@/lib/utils";

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  address: z.string().min(5, "Enter your street address"),
  city: z.string().min(2, "Enter your city"),
  state: z.string().min(2, "Enter your state"),
  zip: z.string().min(3, "Enter your ZIP / postal code"),
  country: z.string().min(2, "Enter your country"),
  payment: z.enum(["card", "cod"]),
});

type CheckoutValues = z.infer<typeof schema>;

const stripeEnabled = Boolean(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

export function CheckoutPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [mounted, setMounted] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user?.name ?? "",
      email: user?.email ?? "",
      payment: "card",
      country: "United States",
    },
  });

  const payment = watch("payment");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.replace("/auth/login?next=/checkout");
    }
  }, [mounted, loading, user, router]);

  if (!mounted || loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-96 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="text-sm font-medium text-ink-soft">
          Redirecting to sign in…
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-extrabold text-ink">Your cart is empty</h1>
        <p className="mt-3 text-sm text-ink-soft">
          Add products before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white"
        >
          Browse products
        </Link>
      </div>
    );
  }

  const subtotal = cartSubtotal(items);
  const shipping = calcShipping(subtotal);
  const total = subtotal + shipping;

  async function onSubmit(values: CheckoutValues) {
    if (!user) return;
    setServerError("");

    const shippingAddress: ShippingAddress = {
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      address: values.address,
      city: values.city,
      state: values.state,
      zip: values.zip,
      country: values.country,
    };

    const orderItems: OrderItem[] = items.map((item) => ({
      productId: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
    }));

    try {
      const order = await createOrder({
        userId: user.uid,
        email: values.email,
        customerName: values.fullName,
        items: orderItems,
        subtotal,
        shipping,
        total,
        status: values.payment === "card" && stripeEnabled ? "pending" : "paid",
        paymentMethod: values.payment === "card" ? "Card" : "Cash on delivery",
        shippingAddress,
        createdAt: new Date().toISOString(),
      });

      if (values.payment === "card" && stripeEnabled) {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: orderItems, orderId: order.id }),
        });
        const data = (await response.json()) as { url?: string; error?: string };
        if (!response.ok || !data.url) {
          throw new Error(data.error ?? "Unable to start secure payment.");
        }
        clearCart();
        window.location.assign(data.url);
        return;
      }

      clearCart();
      router.push(`/checkout/success?order=${order.id}`);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  }

  return (
    <div className="bg-mist py-12 sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">
          Secure Checkout
        </h1>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-soft">
          <Lock className="h-4 w-4 text-brand-700" /> Your information is
          encrypted and protected.
        </p>

        {!stripeEnabled ? (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800">
            Demo checkout is active. No real payment will be charged — add your
            Stripe keys to enable live card payments.
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]"
        >
          <div className="space-y-6">
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-lg font-extrabold text-ink">
                Shipping details
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Full name" error={errors.fullName?.message}>
                    <input
                      {...register("fullName")}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                    />
                  </Field>
                </div>
                <Field label="Email" error={errors.email?.message}>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="jane@example.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                </Field>
                <Field label="Phone" error={errors.phone?.message}>
                  <input
                    {...register("phone")}
                    placeholder="+1 555 000 1234"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Street address" error={errors.address?.message}>
                    <input
                      {...register("address")}
                      placeholder="123 Wellness Avenue, Apt 4B"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                    />
                  </Field>
                </div>
                <Field label="City" error={errors.city?.message}>
                  <input
                    {...register("city")}
                    placeholder="San Francisco"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                </Field>
                <Field label="State / Province" error={errors.state?.message}>
                  <input
                    {...register("state")}
                    placeholder="California"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                </Field>
                <Field label="ZIP / Postal code" error={errors.zip?.message}>
                  <input
                    {...register("zip")}
                    placeholder="94103"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                </Field>
                <Field label="Country" error={errors.country?.message}>
                  <input
                    {...register("country")}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                </Field>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-lg font-extrabold text-ink">
                Payment method
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition",
                    payment === "card"
                      ? "border-brand-500 bg-brand-50/60 ring-2 ring-brand-100"
                      : "border-slate-200 hover:border-brand-300",
                  )}
                >
                  <input
                    type="radio"
                    value="card"
                    {...register("payment")}
                    className="mt-1 accent-brand-700"
                  />
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                      <CreditCard className="h-4 w-4 text-brand-700" /> Card
                      payment
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">
                      Secure Stripe checkout with 3D Secure support.
                    </p>
                  </div>
                </label>
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition",
                    payment === "cod"
                      ? "border-brand-500 bg-brand-50/60 ring-2 ring-brand-100"
                      : "border-slate-200 hover:border-brand-300",
                  )}
                >
                  <input
                    type="radio"
                    value="cod"
                    {...register("payment")}
                    className="mt-1 accent-brand-700"
                  />
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                      <Wallet className="h-4 w-4 text-brand-700" /> Cash on
                      delivery
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">
                      Pay with cash when your order arrives.
                    </p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:sticky lg:top-28">
            <h2 className="text-lg font-extrabold text-ink">Order summary</h2>
            <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-700 px-1 text-[10px] font-bold text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <p className="line-clamp-2 flex-1 text-xs font-semibold text-ink">
                    {item.name}
                  </p>
                  <p className="text-xs font-bold text-ink">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <dl className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="font-semibold text-ink">
                  {formatPrice(subtotal)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="flex items-center gap-1 text-ink-soft">
                  <Truck className="h-4 w-4" /> Shipping
                </dt>
                <dd className="font-semibold text-ink">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3 text-base">
                <dt className="font-bold text-ink">Total</dt>
                <dd className="font-extrabold text-brand-800">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>

            {serverError ? (
              <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                {serverError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-brand-800 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Placing order…
                </>
              ) : (
                <>
                  Place order <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-ink-soft">
              <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" /> 100%
              genuine products · Secure payment
            </p>
          </aside>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-soft">
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs font-medium text-rose-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}
