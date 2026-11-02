"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { subscribeEmail } from "@/lib/store/newsletter";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      await subscribeEmail(email.trim());
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-300">
        <Check className="h-4 w-4" /> You&apos;re subscribed. Welcome to Evercare.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 p-1.5 pl-4">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email address"
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label="Subscribe"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-600 text-white transition hover:bg-brand-500 disabled:opacity-60"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      {status === "error" ? (
        <p className="mt-2 text-xs text-rose-300">
          Something went wrong. Please try again.
        </p>
      ) : null}
    </form>
  );
}
