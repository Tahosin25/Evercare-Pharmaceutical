import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";

export const metadata: Metadata = {
  title: {
    default: "Evercare Pharmaceuticals — Better Health, Brighter Futures",
    template: "%s | Evercare Pharmaceuticals",
  },
  description:
    "Evercare Pharmaceuticals develops safe, effective and affordable medicines for every stage of life. Shop trusted tablets, syrups, injectables and topical care with fast delivery.",
  keywords: [
    "pharmaceuticals",
    "online pharmacy",
    "medicines",
    "Evercare",
    "healthcare",
  ],
  openGraph: {
    title: "Evercare Pharmaceuticals — Better Health, Brighter Futures",
    description:
      "Trusted healthcare for every stage of life. Safe, effective and affordable medicines delivered to your door.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-white text-ink">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </AuthProvider>
      </body>
    </html>
  );
}
