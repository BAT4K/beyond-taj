import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import ShowcaseVideo from "@/components/ShowcaseVideo";

// Dynamically import components below the fold
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"));
const Manifesto = dynamic(() => import("@/components/Manifesto"));
const BlueprintHighlights = dynamic(() => import("@/components/BlueprintHighlights"));
const FAQ = dynamic(() => import("@/components/FAQ"));
const FloatingReviewTicker = dynamic(() => import("@/components/FloatingReviewTicker"));

export default function Home() {
  return (
    <main className="bg-[#0a0806]">
      <Hero />
      <ShowcaseVideo />
      <WhyChooseUs />
      <Manifesto />
      <BlueprintHighlights />
      <FAQ />
      <FloatingReviewTicker />
    </main>
  );
}
