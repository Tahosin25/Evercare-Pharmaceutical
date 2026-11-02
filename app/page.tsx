import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { CategoryGrid } from "@/components/sections/category-grid";
import { AboutStats } from "@/components/sections/about-stats";
import { Wellness } from "@/components/sections/wellness";
import { Testimonials } from "@/components/sections/testimonials";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <CategoryGrid />
      <ProductShowcase />
      <AboutStats />
      <Wellness />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
