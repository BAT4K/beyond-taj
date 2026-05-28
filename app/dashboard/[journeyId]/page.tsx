import prisma from "@/lib/prisma";
import DashboardClient from "@/components/DashboardClient";
import { notFound, redirect } from "next/navigation";

export default async function DashboardPage({ params }: { params: Promise<{ journeyId: string }> }) {
  const { journeyId } = await params;

  const journey = await prisma.journey.findUnique({
    where: { id: journeyId },
    select: {
      id: true,
      status: true,
      destinations: true
    }
  });

  if (!journey) {
    notFound();
  }

  if (journey.status !== 'completed') {
    redirect(`/checkout/${journey.id}`);
  }

  // Parse destinations from JSON
  const destinationIds = journey.destinations as string[];

  // Fetch destination coordinates for map
  const unorderedDestinations = await prisma.destination.findMany({
    where: {
      id: { in: destinationIds }
    },
    select: {
      id: true,
      name: true,
      latitude: true,
      longitude: true,
    }
  });

  // Re-sort to match original sequence for correct map route tracing
  const destinationsMap = new Map(unorderedDestinations.map((d: any) => [d.id, d]));
  const destinations = destinationIds.map((id: any) => destinationsMap.get(id)).filter(Boolean) as typeof unorderedDestinations;

  return (
    <DashboardClient
      journeyId={journey.id}
      destinations={destinations}
    />
  );
}
