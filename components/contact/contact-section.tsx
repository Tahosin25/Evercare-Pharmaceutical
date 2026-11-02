"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { submitContactMessage } from "@/lib/store/forms";

const faqs = [
  {
    question: "Are your medicines authentic?",
    answer:
      "Yes. Every product ships directly from Evercare's certified facilities or authorised distributors, with full batch traceability.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Standard delivery takes 3-5 business days. Orders over $50 qualify for free shipping, and you can track your order any time from your account.",
  },
  {
    question: "Can I return a product?",
    answer:
      "Unopened products can be returned within 7 days of delivery. For safety reasons, opened medicines cannot be returned unless faulty.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "We currently ship across the United States and to select partner markets. Contact our team for international distribution enquiries.",
  },
];

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const form = new FormData(event.currentTarget);
    try {
      await submitContactMessage({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        subject: String(form.get("subject") ?? ""),
        message: String(form.get("message") ?? ""),
      });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-14 sm:py-16">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          {status === "done" ? (
            <div className="flex flex-col items-center py-16 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </span>
              <h2 className="mt-5 text-xl font-extrabold text-ink">
                Message sent
              </h2>
              <p className="mt-2 max-w-sm text-sm text-ink-soft">
                Thank you for reaching out. Our team will get back to you within
                one business day.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-6 rounded-full bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-extrabold text-ink">
                Send us a message
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                Fill in the form and we&apos;ll respond as soon as possible.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    name="name"
                    required
                    placeholder="Full name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email address"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                </div>
                <input
                  name="subject"
                  required
                  placeholder="Subject"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                />
                <textarea
                  name="message"
                  required
                  rows={6}
                  placeholder="How can we help?"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                />
                {status === "error" ? (
                  <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                    Something went wrong. Please try again.
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-brand-800 disabled:opacity-70"
                >
                  {status === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  Send message
                </button>
              </form>
            </>
          )}
        </div>

        <div className="space-y-4">
          {[
            {
              icon: MapPin,
              title: "Visit us",
              lines: ["Evercare House, Andheri East", "Mumbai 400069, India"],
            },
            {
              icon: Phone,
              title: "Call us",
              lines: ["+91 22 4000 8800", "Mon–Fri, 9:00–18:00 IST"],
            },
            {
              icon: Mail,
              title: "Email us",
              lines: ["hello@evercare.com", "support@evercare.com"],
            },
            {
              icon: Clock,
              title: "Response time",
              lines: ["Within 1 business day", "Priority support for orders"],
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-3xl border border-slate-100 bg-mist p-5"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-brand-700 shadow-sm">
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">{item.title}</p>
                {item.lines.map((line) => (
                  <p key={line} className="text-xs text-ink-soft">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        id="faq"
        className="mx-auto mt-14 w-full max-w-7xl scroll-mt-28 px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-2xl font-extrabold text-ink">
          Frequently asked questions
        </h2>
        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-slate-100 bg-white p-5 open:bg-mist"
            >
              <summary className="cursor-pointer list-none text-sm font-bold text-ink marker:hidden">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
