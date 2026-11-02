import type { Metadata } from "next";
import { OrdersPage } from "@/components/orders/orders-page";

export const metadata: Metadata = {
  title: "My Orders",
  description: "Track and review your Evercare orders.",
};

export default function OrdersRoute() {
  return <OrdersPage />;
}
