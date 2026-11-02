import Link from "next/link";
import {
  Facebook,
  Instagram,
  Leaf,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { NewsletterForm } from "@/components/sections/newsletter-form";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

const moreLinks = [
  { href: "/about#quality", label: "Quality & Safety" },
  { href: "/about#manufacturing", label: "Manufacturing" },
  { href: "/careers", label: "Careers" },
  { href: "/contact#faq", label: "FAQs" },
  { href: "/orders", label: "Track Order" },
];

export function Footer() {
  return (
    <footer className="bg-[#082b4d] text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr_0.8fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
                <Leaf className="h-6 w-6 text-brand-200" />
              </span>
              <span className="leading-tight">
                <span className="block text-xl font-extrabold">Evercare</span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-200">
                  Pharmaceuticals
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-300">
              Better health, brighter futures. We develop safe, effective and
              affordable medicines for every stage of life.
            </p>
            <div className="mt-6 space-y-2 text-sm text-slate-300">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-300" />
                Evercare House, Andheri East, Mumbai 400069
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-300" />
                +91 22 4000 8800
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-300" />
                hello@evercare.com
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-brand-200">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-brand-200">
              More Information
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {moreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-300 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-brand-200">
              Stay Connected
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-slate-300">
              Get the latest updates on our products, health tips and
              innovations.
            </p>
            <NewsletterForm />
            <div className="mt-6 flex items-center gap-2">
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, index) => (
                <span
                  key={index}
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white/10 text-slate-200 transition hover:bg-brand-600 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Evercare Pharmaceuticals. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
