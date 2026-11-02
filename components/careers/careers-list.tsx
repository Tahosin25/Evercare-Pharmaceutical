"use client";

import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Loader2,
  MapPin,
  X,
} from "lucide-react";
import { DEMO_CAREERS } from "@/lib/demo-data";
import { submitApplication } from "@/lib/store/forms";
import type { Career } from "@/lib/types";

export function CareersList() {
  const [activeJob, setActiveJob] = useState<Career | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeJob) return;
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await submitApplication({
        careerId: activeJob.id,
        careerTitle: activeJob.title,
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        message: String(form.get("message") ?? ""),
      });
      setSubmitted(true);
    } catch {
      setError("Unable to submit your application. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function closeDialog() {
    setActiveJob(null);
    setSubmitted(false);
    setError("");
  }

  return (
    <section className="py-14 sm:py-16">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-ink">Open positions</h2>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            {DEMO_CAREERS.length} openings
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {DEMO_CAREERS.map((job) => (
            <article
              key={job.id}
              className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_16px_35px_-32px_rgba(11,34,57,0.4)] transition hover:border-brand-200"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
                    {job.department}
                  </span>
                  <h3 className="mt-1 text-lg font-extrabold text-ink">
                    {job.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-ink-soft">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BriefcaseBusiness className="h-3.5 w-3.5" /> {job.type}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveJob(job)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-brand-800"
                >
                  Apply now <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                {job.description}
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {job.requirements.map((requirement) => (
                  <li
                    key={requirement}
                    className="flex items-start gap-2 text-xs text-ink-soft"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {requirement}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      {activeJob ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
                  Apply for
                </p>
                <h3 className="mt-1 text-lg font-extrabold text-ink">
                  {activeJob.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                aria-label="Close application form"
                className="grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {submitted ? (
              <div className="mt-8 rounded-2xl bg-emerald-50 p-6 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                <p className="mt-3 text-base font-bold text-emerald-900">
                  Application received!
                </p>
                <p className="mt-1 text-sm text-emerald-700">
                  Our talent team will reach out soon. Thank you for your
                  interest in Evercare.
                </p>
                <button
                  type="button"
                  onClick={closeDialog}
                  className="mt-5 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    name="name"
                    required
                    placeholder="Full name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                  <input
                    name="phone"
                    required
                    placeholder="Phone number"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                />
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell us briefly about your experience and why you'd be a great fit."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                />
                {error ? (
                  <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                    {error}
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-brand-800 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Submit application
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
