import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { DEMO_CATEGORIES } from "@/lib/demo-data";

export function CategoryGrid() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.6fr] lg:items-center lg:px-8">
        <div>
          <SectionHeading
            eyebrow="Our Products"
            title="A Wide Range of Pharmaceutical Solutions"
            description="From everyday health needs to specialised therapies, we offer a comprehensive range of pharmaceutical products designed for a healthier tomorrow."
          />
          <Link
            href="/products"
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-brand-200 px-6 py-3 text-sm font-bold text-brand-800 transition hover:border-brand-400 hover:bg-brand-50"
          >
            View All Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          {DEMO_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_16px_35px_-30px_rgba(11,34,57,0.5)] transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-bold text-ink sm:text-base">
                  {category.name}
                </h3>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
                  Explore <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
