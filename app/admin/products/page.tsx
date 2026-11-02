import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminProducts } from "@/components/admin/admin-products";

export const metadata: Metadata = {
  title: "Manage Products",
  description: "Create, edit and remove Evercare products.",
};

export default function AdminProductsPage() {
  return (
    <AdminShell>
      <AdminProducts />
    </AdminShell>
  );
}
