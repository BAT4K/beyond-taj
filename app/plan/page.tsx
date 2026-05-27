import prisma from "@/lib/prisma";
import TravelWizard from "@/components/TravelWizard";

// export const revalidate = 60;

export default async function Plan() {
  const dbDestinations = await prisma.destination.findMany({
    include: {
      Landscape: true,
    },
  });

  const liveDestinations = dbDestinations.map((dest: any) => ({
    id: dest.id,
    name: dest.name,
    description: dest.description,
    region: dest.region,
    vibeTags: dest.vibeTags,
    idealSeason: dest.idealSeason,
    latitude: dest.latitude,
    longitude: dest.longitude,
    landscape: dest.Landscape.length > 0 ? dest.Landscape[0].name : "Explore",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop",
  }));

  return (
    <main>
      <TravelWizard destinations={liveDestinations} />
    </main>
  );
}
