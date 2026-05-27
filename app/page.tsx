import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import BlueprintHighlights from "@/components/BlueprintHighlights";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <main className="bg-[#0a0806]">
      <Hero />
      <Manifesto />
      <BlueprintHighlights />
      <FAQ />
    </main>
  );
}
