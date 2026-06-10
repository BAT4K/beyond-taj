import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: "Destinations in India | Beyond Taj",
  description: "Explore our curated collection of luxury travel destinations across India. From royal palaces in Rajasthan to the serene backwaters of Kerala.",
};

const FALLBACK_IMAGE = "/master-hero-poster.webp";

export default async function DestinationsIndex() {
  const destinations = await prisma.destination.findMany({
    orderBy: { region: 'asc' },
    select: {
      id: true,
      region: true,
      name: true,
      imageUrl: true,
    }
  });

  const groupedDestinations = destinations.reduce((acc, dest) => {
    if (!acc[dest.region]) {
      acc[dest.region] = [];
    }
    acc[dest.region].push(dest);
    return acc;
  }, {} as Record<string, typeof destinations>);

  return (
    <div className="min-h-screen bg-[#0a0806] text-white pt-32 pb-24 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-20 text-center">
          <p className="text-[#c9a96e] uppercase tracking-widest text-xs mb-4">The Collection</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light mb-6">Curated Destinations</h1>
          <p className="text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
            Discover the most extraordinary locations across the Indian subcontinent. Each destination has been meticulously vetted for luxury, culture, and absolute authenticity.
          </p>
        </header>

        <div className="space-y-24">
          {Object.entries(groupedDestinations).map(([region, dests]) => (
            <section key={region}>
              <div className="flex items-center gap-6 mb-12">
                <h2 className="font-serif text-3xl text-white/90">{region}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dests.map((dest) => (
                  <Link href={`/destinations/${dest.id}`} key={dest.id} className="group relative block aspect-[5/4] md:aspect-[4/5] rounded-lg overflow-hidden border border-white/5 hover:border-[#c9a96e]/50 transition duration-500">
                    <Image 
                      src={dest.imageUrl || FALLBACK_IMAGE}
                      alt={dest.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    
                    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                      <h3 className="font-serif text-2xl md:text-3xl text-white group-hover:text-[#c9a96e] transition-colors">{dest.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
