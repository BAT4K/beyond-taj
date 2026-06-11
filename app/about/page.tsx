import Image from 'next/image';
import Link from 'next/link';
import { Compass, ShieldCheck, Sparkles, Map } from 'lucide-react';

export const metadata = {
  title: "About Us | Beyond Taj",
  description: "Learn about the philosophy and local expertise behind Beyond Taj, India's premier AI-curated luxury travel concierge.",
};

const TEAM_IMAGE = "/destinations/varanasi.webp";

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
        <h2 className="font-serif text-4xl mb-12 text-[#c9a96e]">Why We Built BeyondTaj</h2>
        <div className="prose-luxury font-light text-white/80 space-y-8 text-lg leading-relaxed">
          <p>
            BeyondTaj started with a frustrating truth: India is one of the most rewarding countries on earth to travel — and one of the easiest to get wrong. Between the logistics, the scams, the wrong neighborhoods, and a hundred outdated blog posts all contradicting each other, most first-timers are exhausted before they even board the flight.
          </p>
          <p>
            So we built the opposite of a tour company. No pre-packaged group trips. No commission-driven hotel lists. No algorithm pretending to know India better than a person does. Just honest, tested planning from people who actually know the country — Indians who travel it for a living, and foreign travelers who've spent months on the road here and learned the hard way.
          </p>
          <p>
            Every route we recommend, one of us has actually traveled. Every hotel, someone has actually stayed in. Every scam we warn you about, someone got caught by first. We don't take commissions, so we've got no reason to push you anywhere that isn't worth it. We just tell you what we'd tell a friend flying into Delhi next week — where to go, what to skip, what's genuinely worth your time, and what's a tourist trap dressed up to look impressive.
          </p>
        </div>
      </div>

      {/* Expertise Grid */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/[0.02] border border-white/5 p-10 rounded-lg hover:border-[#c9a96e]/30 transition-colors">
            <Compass className="text-[#c9a96e] mb-6" size={32} />
            <h3 className="font-serif text-2xl mb-4 text-white/90">Built Around You, Not a Bus</h3>
            <p className="text-white/50 font-light leading-relaxed">
              Your plan is shaped by your dates, your budget, your pace, and who you're traveling with — solo, couple, family, or friends. Not a fixed route shuffled between 40 strangers on a coach.
            </p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-10 rounded-lg hover:border-[#c9a96e]/30 transition-colors">
            <Map className="text-[#c9a96e] mb-6" size={32} />
            <h3 className="font-serif text-2xl mb-4 text-white/90">Routing That Actually Works</h3>
            <p className="text-white/50 font-light leading-relaxed">
              We map your trip so you're not stuck on a brutal overnight bus you never needed or zig-zagging across the country. Sensible order, realistic travel days, and a straight answer on when to fly instead of suffering the road.
            </p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-10 rounded-lg hover:border-[#c9a96e]/30 transition-colors">
            <ShieldCheck className="text-[#c9a96e] mb-6" size={32} />
            <h3 className="font-serif text-2xl mb-4 text-white/90">Safety, Already Handled</h3>
            <p className="text-white/50 font-light leading-relaxed">
              We bake it in — the right neighborhoods to stay in, which scams hit at which station, when "friendly" is genuine and when it's a setup — so you can actually relax instead of staying on edge the whole trip.
            </p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-10 rounded-lg hover:border-[#c9a96e]/30 transition-colors">
            <Sparkles className="text-[#c9a96e] mb-6" size={32} />
            <h3 className="font-serif text-2xl mb-4 text-white/90">Honest, Never Sponsored</h3>
            <p className="text-white/50 font-light leading-relaxed">
              No hotel pays to be on your itinerary, and we take zero commissions. Every recommendation is something we'd book ourselves. And when a famous place isn't worth your time, we say so.
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
