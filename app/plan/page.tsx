import prisma from "@/lib/prisma";
import TravelWizard, { MappedDestination } from "@/components/TravelWizard";
import { unstable_cache } from "next/cache";

export const revalidate = 3600; // Cache the data and revalidate every hour

const getDestinations = async () => {
  const dests = await prisma.destination.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      shortPitch: true,
      topHighlights: true,
      region: true,
      vibeTags: true,
      idealSeason: true,
      peakMonths: true,
      shoulderMonths: true,
      avoidMonths: true,
      closedMonths: true,
      minRequiredDays: true,
      latitude: true,
      longitude: true,
      requiresAcclimatization: true,
      imageUrl: true,
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

  const liveDestinations = dbDestinations.map((dest: any): MappedDestination => ({
    id: dest.id,
    name: dest.name,
    description: dest.description,
    shortPitch: dest.shortPitch || "",
    topHighlights: dest.topHighlights || [],
    region: dest.region,
    vibeTags: dest.vibeTags,
    idealSeason: dest.idealSeason,
    peakMonths: dest.peakMonths || [],
    shoulderMonths: dest.shoulderMonths || [],
    avoidMonths: dest.avoidMonths || [],
    closedMonths: dest.closedMonths || [],
    minRequiredDays: dest.minRequiredDays,
    latitude: dest.latitude,
    longitude: dest.longitude,
    imageUrl: dest.imageUrl,
    landscapes: dest.Landscape.map((l: any) => l.name),
    clusterId: dest.clusterId,
    compatibleClusters: dest.Cluster?.compatibleClusters || [],
    isHub: dest.Cluster?.id === 'transit_hub',
    requiresAcclimatization: dest.requiresAcclimatization,
  }));

  return (
    <main>
      <TravelWizard destinations={liveDestinations} transitRoutes={transitRoutes} />
    </main>
  );
}
