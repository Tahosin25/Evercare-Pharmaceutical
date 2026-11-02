"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { DEMO_TESTIMONIALS } from "@/lib/demo-data";

export function Testimonials() {
  const scroller = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    scroller.current?.scrollBy({
      left: direction * 380,
      behavior: "smooth",
    });
  }

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="What Our Customers Say"
            title="Real People. Real Health Journeys."
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Previous testimonials"
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 text-ink-soft transition hover:border-brand-300 hover:text-brand-800"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Next testimonials"
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 text-ink-soft transition hover:border-brand-300 hover:text-brand-800"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scroller}
          className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
        >
          {DEMO_TESTIMONIALS.map((testimonial) => (
            <article
              key={testimonial.id}
              className="relative w-[85%] shrink-0 snap-start rounded-3xl border border-slate-100 bg-mist p-6 sm:w-[46%] lg:w-[31.5%]"
            >
              <Quote className="h-8 w-8 text-brand-200" />
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                &ldquo;{testimonial.comment}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-200/70 pt-5">
                <span className="relative h-11 w-11 overflow-hidden rounded-full">
                  <Image
                    src={
                      testimonial.imageUrl ??
                      "https://randomuser.me/api/portraits/lego/1.jpg"
                    }
                    alt={testimonial.name}
                    fill
                    sizes="44px"
                  />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">
                    {testimonial.name}
                  </p>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-ink-soft">
                    {testimonial.role}
                  </p>
                </div>
                <div className="ml-auto flex gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={
                        "h-3.5 w-3.5 " +
                        (index < testimonial.rating ? "fill-current" : "text-slate-300")
                      }
                    />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
