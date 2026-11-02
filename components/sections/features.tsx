import {
  FlaskConical,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { FEATURES } from "@/lib/demo-data";

const icons = {
  shield: ShieldCheck,
  flask: FlaskConical,
  heart: HeartHandshake,
  leaf: Leaf,
  truck: Truck,
};

export function Features() {
  return (
    <section className="border-y border-slate-100 bg-white">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 divide-y divide-slate-100 px-4 sm:grid-cols-2 sm:divide-y-0 sm:px-6 md:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:px-8">
        {FEATURES.map((feature, index) => {
          const Icon = icons[feature.icon as keyof typeof icons];
          return (
            <div
              key={feature.title}
              className={
                "flex items-start gap-4 px-2 py-7 lg:px-6 " +
                (index === 4 ? "sm:col-span-2 md:col-span-1" : "")
              }
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-ink">{feature.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
