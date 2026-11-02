import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Leaf, Users } from "lucide-react";

const pillars = [
  {
    icon: Heart,
    title: "Better Health",
    description: "Preventive care and trusted medicines for daily wellbeing.",
  },
  {
    icon: Users,
    title: "Stronger Families",
    description: "Safe formulations designed for every generation.",
  },
  {
    icon: Leaf,
    title: "Healthier Communities",
    description: "Sustainable practices and accessible healthcare outreach.",
  },
];

export function Wellness() {
  return (
    <section className="relative overflow-hidden bg-brand-950">
      <div className="mx-auto grid w-full max-w-7xl items-stretch lg:grid-cols-2">
        <div className="relative min-h-[320px] lg:min-h-[520px]">
          <Image
            src="https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=1400&q=80"
            alt="A happy family enjoying the outdoors together"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-950/70 lg:to-brand-950" />
        </div>

        <div className="relative px-4 py-14 sm:px-10 lg:py-20 lg:pl-16 lg:pr-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-300">
            Health & Wellness
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white text-balance sm:text-4xl">
            Healthy Choices for a Brighter Tomorrow
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
            Because good health is the foundation for a better life, we bring
            you trusted medicines and wellness solutions that fit seamlessly
            into your everyday routine.
          </p>

          <div className="mt-8 space-y-4">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-500/20 text-brand-200">
                  <pillar.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-300">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-brand-900 transition hover:bg-brand-50"
          >
            Learn More <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
