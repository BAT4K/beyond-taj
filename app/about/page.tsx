import Image from 'next/image';
import Link from 'next/link';
import { Compass, ShieldCheck, Sparkles, Map } from 'lucide-react';

export const metadata = {
  title: "About Us | Beyond Taj",
  description: "Learn about the philosophy and local expertise behind Beyond Taj, India's premier AI-curated luxury travel concierge.",
};

const TEAM_IMAGE = "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0806] text-white pt-32 pb-24 selection:bg-[#c9a96e]/30">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center mb-24">
        <p className="text-[#c9a96e] uppercase tracking-widest text-xs mb-6">Our Philosophy</p>
        <h1 className="font-serif text-5xl md:text-7xl font-light mb-8 leading-tight">
          Beyond the Guidebook.
        </h1>
        <p className="text-white/60 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed italic">
          We believe the true essence of the Indian subcontinent cannot be found in a generic top-10 list. It must be curated, vetted, and experienced.
        </p>
      </div>

      {/* Hero Image */}
      <div className="relative w-full max-w-6xl mx-auto aspect-[21/9] rounded-xl overflow-hidden mb-32 border border-white/5">
        <Image 
          src={TEAM_IMAGE}
          alt="Taj Mahal silhouette at dawn"
          fill
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-transparent to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 mb-32">
        <h2 className="font-serif text-4xl mb-12 text-[#c9a96e]">The Architecture of Luxury</h2>
        <div className="prose-luxury font-light text-white/80 space-y-8 text-lg leading-relaxed">
          <p>
            Beyond Taj was born out of a stark realization: traveling to India is often an exercise in overwhelming complexity. Between navigating intense logistics, avoiding tourist traps, and filtering through outdated blogs, the modern traveler is left exhausted before they even board their flight.
          </p>
          <p>
            We built a completely different paradigm. Instead of selling pre-packaged, cookie-cutter tours, we engineered a deterministic AI concierge rooted entirely in localized, ground-truth data.
          </p>
          <p>
            Every destination in our routing engine has been physically vetted by our network of local experts. Every transit route accounts for real-world fatigue costs. Our algorithm doesn't hallucinate—it strictly computes the perfect intersection of your unique travel style, physical logistics, seasonal weather patterns, and uncompromising luxury.
          </p>
        </div>
      </div>

      {/* Expertise Grid */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/[0.02] border border-white/5 p-10 rounded-lg hover:border-[#c9a96e]/30 transition-colors">
            <Compass className="text-[#c9a96e] mb-6" size={32} />
            <h3 className="font-serif text-2xl mb-4 text-white/90">Curated Granularity</h3>
            <p className="text-white/50 font-light leading-relaxed">
              We tag every destination across 50+ axes—from the specific "vibe" of a luxury tented camp in Ranthambore to the exact demographic it best serves.
            </p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-10 rounded-lg hover:border-[#c9a96e]/30 transition-colors">
            <Map className="text-[#c9a96e] mb-6" size={32} />
            <h3 className="font-serif text-2xl mb-4 text-white/90">Mathematical Routing</h3>
            <p className="text-white/50 font-light leading-relaxed">
              Our bespoke routing engine uses strict graphical traversal algorithms to ensure your itinerary is not only beautiful, but physically and logistically sound.
            </p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-10 rounded-lg hover:border-[#c9a96e]/30 transition-colors">
            <ShieldCheck className="text-[#c9a96e] mb-6" size={32} />
            <h3 className="font-serif text-2xl mb-4 text-white/90">Ground-Truth Safety</h3>
            <p className="text-white/50 font-light leading-relaxed">
              Safety and comfort are not afterthoughts. Our engine automatically applies strict transit and arrival heuristics for solo travelers and families to ensure peace of mind.
            </p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-10 rounded-lg hover:border-[#c9a96e]/30 transition-colors">
            <Sparkles className="text-[#c9a96e] mb-6" size={32} />
            <h3 className="font-serif text-2xl mb-4 text-white/90">Uncompromised Quality</h3>
            <p className="text-white/50 font-light leading-relaxed">
              We do not accept commissions from subpar hotels to push them onto your itinerary. Our recommendations remain completely objective and relentlessly focused on quality.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <h2 className="font-serif text-4xl mb-6">Ready to experience India?</h2>
        <p className="text-white/50 font-light mb-12">
          Let our deterministic engine curate an itinerary that perfectly matches your soul.
        </p>
        <Link 
          href="/plan" 
          className="inline-flex py-4 px-8 bg-[#c9a96e] text-black text-xs uppercase tracking-widest font-semibold items-center justify-center hover:bg-[#d4b47a] transition rounded-sm active:scale-95"
        >
          Curate My Journey
        </Link>
      </div>

    </main>
  );
}
