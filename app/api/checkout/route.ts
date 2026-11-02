import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  calcShipping,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/utils";

interface CheckoutItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured. Add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable card payments.",
      },
      { status: 400 },
    );
  }

  try {
    const body = (await request.json()) as {
      items?: CheckoutItem[];
      orderId?: string;
    };
    const items = body.items ?? [];

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 },
      );
    }

    for (const item of items) {
      if (
        !item.name ||
        !Number.isFinite(item.price) ||
        item.price <= 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0 ||
        item.quantity > 99
      ) {
        return NextResponse.json(
          { error: "One or more cart items are invalid." },
          { status: 400 },
        );
      }
    }

    const stripe = new Stripe(secret);
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const shipping = calcShipping(subtotal);

    const origin =
      request.headers.get("origin") ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      "http://localhost:3000";

    const orderRef = body.orderId ?? "unknown";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        ...items.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(item.price * 100),
            product_data: {
              name: item.name,
              images:
                item.imageUrl && item.imageUrl.startsWith("https://")
                  ? [item.imageUrl]
                  : undefined,
            },
          },
        })),
        ...(shipping > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: "usd",
                  unit_amount: Math.round(shipping * 100),
                  product_data: {
                    name: "Shipping",
                    description: `Free shipping on orders over $${FREE_SHIPPING_THRESHOLD}`,
                  },
                },
              },
            ]
          : []),
      ],
      metadata: { orderId: orderRef },
      success_url: `${origin}/checkout/success?order=${orderRef}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error", error);
    return NextResponse.json(
      { error: "Unable to create a secure payment session." },
      { status: 500 },
    );
  }
}
