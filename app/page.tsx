import nextDynamic from "next/dynamic";
import Hero from "@/components/Hero";
import ShowcaseVideo from "@/components/ShowcaseVideo";
import FeaturedBlogWidget from "@/components/FeaturedBlogWidget";
import { getBlogBySlug } from '@/lib/blogs';

export const dynamic = 'force-static';
export const revalidate = 86400; // Cache for 24 hours
// Dynamically import components below the fold
const WhyChooseUs = nextDynamic(() => import("@/components/WhyChooseUs"));
const Manifesto = nextDynamic(() => import("@/components/Manifesto"));
const BlueprintHighlights = nextDynamic(() => import("@/components/BlueprintHighlights"));
const FAQ = nextDynamic(() => import("@/components/FAQ"));
const FloatingReviewTicker = nextDynamic(() => import("@/components/FloatingReviewTicker"));

export default function Home() {
  // Pre-fetch the featured article to pass to the widget
  const featuredBlog = getBlogBySlug('the-perfect-14-day-india-itinerary-for-first-timers');

  return (
    <main className="bg-[#0a0806]">
      <Hero />
      <ShowcaseVideo />
      <WhyChooseUs />
      <Manifesto />
      <BlueprintHighlights />
      <FAQ />
      <FloatingReviewTicker />
      <FeaturedBlogWidget blog={featuredBlog} />
    </main>
  );
}
