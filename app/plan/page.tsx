import prisma from "@/lib/prisma";
import TravelWizard from "@/components/TravelWizard";
import { unstable_cache } from "next/cache";

const getDestinations = unstable_cache(
  async () => {
    return await prisma.destination.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        region: true,
        vibeTags: true,
        idealSeason: true,
        latitude: true,
        longitude: true,
        Landscape: { select: { name: true } },
      }
    });
  },
  ['destinations'],
  { revalidate: 3600, tags: ['destinations'] }
);

export default async function Plan() {
  const dbDestinations = await getDestinations();

  const liveDestinations = dbDestinations.map((dest: any) => ({
    id: dest.id,
    name: dest.name,
    description: dest.description,
    region: dest.region,
    vibeTags: dest.vibeTags,
    idealSeason: dest.idealSeason,
    latitude: dest.latitude,
    longitude: dest.longitude,
    landscapes: dest.Landscape.map((l: any) => l.name),
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop",
  }));

  return (
    <main>
      <TravelWizard destinations={liveDestinations} />
    </main>
  );
}
