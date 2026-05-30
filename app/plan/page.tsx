import prisma from "@/lib/prisma";
import TravelWizard from "@/components/TravelWizard";
import { unstable_cache } from "next/cache";

export const dynamic = 'force-dynamic';

const getDestinations = async () => {
  const dests = await prisma.destination.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      region: true,
      vibeTags: true,
      idealSeason: true,
      peakMonths: true,
      shoulderMonths: true,
      avoidMonths: true,
      closedMonths: true,
      latitude: true,
      longitude: true,
      Landscape: { select: { name: true } },
      clusterId: true,
      Cluster: {
        select: {
          id: true,
          compatibleClusters: true,
        }
      }
    }
  });

  const routes = await prisma.transitRoute.findMany({
    select: {
      originId: true,
      destinationId: true,
      fatigueCost: true
    }
  });

  return { dbDestinations: dests, transitRoutes: routes };
};

export default async function Plan() {
  const { dbDestinations, transitRoutes } = await getDestinations();

  const liveDestinations = dbDestinations.map((dest: any) => ({
    id: dest.id,
    name: dest.name,
    description: dest.description,
    region: dest.region,
    vibeTags: dest.vibeTags,
    idealSeason: dest.idealSeason,
    peakMonths: dest.peakMonths || [],
    shoulderMonths: dest.shoulderMonths || [],
    avoidMonths: dest.avoidMonths || [],
    closedMonths: dest.closedMonths || [],
    latitude: dest.latitude,
    longitude: dest.longitude,
    landscapes: dest.Landscape.map((l: any) => l.name),
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop",
    clusterId: dest.clusterId,
    compatibleClusters: dest.Cluster?.compatibleClusters || [],
    isHub: dest.Cluster?.id === 'transit_hub',
  }));

  return (
    <main>
      <TravelWizard destinations={liveDestinations} transitRoutes={transitRoutes} />
    </main>
  );
}
