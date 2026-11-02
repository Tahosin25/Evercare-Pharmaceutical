import type { Metadata } from "next";
import { CartPage } from "@/components/cart/cart-page";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your Evercare cart and proceed to secure checkout.",
};

export default function CartRoute() {
  return <CartPage />;
}
