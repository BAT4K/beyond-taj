import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import Manifesto from "@/components/Manifesto";
import BlueprintHighlights from "@/components/BlueprintHighlights";
import FAQ from "@/components/FAQ";
import FloatingReviewTicker from "@/components/FloatingReviewTicker";

export default function Home() {
  return (
    <main className="bg-[#0a0806]">
      <Hero />
      <WhyChooseUs />
      <Manifesto />
      <BlueprintHighlights />
      <FAQ />
      <FloatingReviewTicker />
    </main>
  );
}
