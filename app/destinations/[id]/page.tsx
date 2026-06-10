import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Sun, Sparkles, ChevronRight } from 'lucide-react';
import ScrollToTop from '@/components/ScrollToTop';

const FALLBACK_IMAGE = "/master-hero-poster.webp";

const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export async function generateStaticParams() {
  const destinations = await prisma.destination.findMany({ select: { id: true } });
  return destinations.map((d) => ({
    id: d.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const destination = await prisma.destination.findUnique({ where: { id } });
  
  if (!destination) {
    return { title: 'Destination Not Found | Beyond Taj' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://beyondtaj.in';
  const url = `${baseUrl}/destinations/${id}`;

  return {
    title: `${destination.name} Luxury Travel Guide | Beyond Taj`,
    description: destination.shortPitch || destination.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${destination.name} Luxury Travel Guide | Beyond Taj`,
      description: destination.shortPitch || destination.description,
      url,
      type: 'website',
      images: destination.imageUrl ? [{ url: destination.imageUrl, width: 800, height: 600, alt: destination.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${destination.name} Luxury Travel Guide | Beyond Taj`,
      description: destination.shortPitch || destination.description,
      images: destination.imageUrl ? [destination.imageUrl] : [],
    },
  };
}

export default async function DestinationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const destination = await prisma.destination.findUnique({
    where: { id },
    include: { Landscape: true }
  });

  if (!destination) {
    notFound();
  }

  const landscapes = Array.from(new Set(destination.Landscape?.map(l => l.name) || []));
  const vibes = Array.from(new Set(destination.vibeTags || []));

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://beyondtaj.in';

  return (
    <main className="min-h-screen bg-[#0a0806] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            "name": destination.name,
            "description": destination.shortPitch || destination.description,
            "url": `${baseUrl}/destinations/${id}`,
            "image": destination.imageUrl || FALLBACK_IMAGE,
          })
        }}
      />
      <ScrollToTop />
      {/* Hero Section */}
      <div className="relative min-h-[70vh] md:min-h-[85vh] w-full flex flex-col justify-end">
        <Image 
          src={destination.imageUrl || FALLBACK_IMAGE}
          alt={destination.name}
          fill
          sizes="100vw"
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/40 to-transparent" />
        
        <div className="relative z-10 flex flex-col justify-end px-6 md:px-12 pt-32 pb-16 md:pb-24 max-w-6xl mx-auto w-full flex-1">
          <Link href="/destinations" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/60 hover:text-[#c9a96e] transition active:scale-95 active:opacity-50 active:duration-150 mb-8 group w-fit py-2">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Destinations
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <MapPin size={16} className="text-[#c9a96e]" />
            <span className="uppercase tracking-widest text-xs md:text-sm text-[#c9a96e]">{destination.region}</span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-8xl mb-6">{destination.name}</h1>
          <p className="text-lg md:text-2xl font-light text-white/80 max-w-3xl italic">
            "{destination.shortPitch || destination.description}"
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-16">
          <section>
            <h2 className="font-serif text-2xl md:text-3xl mb-6 text-[#c9a96e]">The Experience</h2>
            <p className="font-light text-base md:text-lg leading-relaxed text-white/80">
              {destination.description}
            </p>
          </section>

          <section className="grid grid-cols-2 gap-8">
            {landscapes.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-widest text-white/50 mb-4 border-b border-white/10 pb-2">Landscapes</h3>
                <ul className="space-y-2">
                  {landscapes.map(l => (
                    <li key={l} className="font-light text-white/80 flex items-center gap-2">
                      <div className="w-1 h-1 bg-[#c9a96e] rounded-full" /> {l}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {vibes.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-widest text-white/50 mb-4 border-b border-white/10 pb-2">The Vibe</h3>
                <ul className="space-y-2">
                  {vibes.map(v => (
                    <li key={v} className="font-light text-white/80 flex items-center gap-2">
                      <div className="w-1 h-1 bg-[#c9a96e] rounded-full" /> {v}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {destination.peakMonths && destination.peakMonths.length > 0 && (
            <section className="bg-white/[0.02] border border-white/5 p-8 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Sun className="text-[#c9a96e]" />
                <h3 className="font-serif text-xl md:text-2xl text-white/90">Best Time to Visit</h3>
              </div>
              <p className="font-light text-sm md:text-base text-white/70">
                The optimal months to experience {destination.name} are typically from {MONTH_NAMES[destination.peakMonths[0]]} to {MONTH_NAMES[destination.peakMonths[destination.peakMonths.length - 1]]}. 
                Our curation engine actively monitors seasonal weather patterns to ensure your itinerary only includes destinations during their prime season.
              </p>
            </section>
          )}
        </div>

        {/* Right Column: CTA */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 p-8 border border-[#c9a96e]/30 bg-gradient-to-b from-amber-950/20 to-zinc-950/50 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-[#c9a96e]/10 flex items-center justify-center mb-6">
              <Sparkles className="text-[#c9a96e]" size={24} />
            </div>
            <h3 className="font-serif text-2xl mb-4">Curate Your Journey</h3>
            <p className="text-white/60 font-light text-sm mb-8 leading-relaxed">
              Experience {destination.name} exactly the way it was meant to be seen. Let our AI concierge build an honest, logistically perfect itinerary tailored to your exact travel style.
            </p>
            <Link 
              href="/plan" 
              className="w-full py-4 bg-[#c9a96e] text-black text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 hover:bg-[#d4b47a] transition rounded-sm active:scale-95"
            >
              Start Curation <ChevronRight size={16} />
            </Link>
            <p className="text-center text-[10px] text-white/40 mt-4 uppercase tracking-widest">Takes exactly 2 minutes</p>
          </div>
        </div>

      </div>
    </main>
  );
}
