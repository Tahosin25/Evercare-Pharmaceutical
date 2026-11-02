import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminOrders } from "@/components/admin/admin-orders";

export const metadata: Metadata = {
  title: "Manage Orders",
  description: "Review and update Evercare orders.",
};

export default function AdminOrdersPage() {
  return (
    <AdminShell>
      <AdminOrders />
    </AdminShell>
  );
}
