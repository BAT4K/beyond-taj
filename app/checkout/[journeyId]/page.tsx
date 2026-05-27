import prisma from "@/lib/prisma";
import CheckoutClient from "@/components/CheckoutClient";
import { notFound } from "next/navigation";
import { estimateBudgetRange, validateExtremeDistance } from "@/lib/routingEngine";

export default async function CheckoutPage({ params }: { params: Promise<{ journeyId: string }> }) {
  const { journeyId } = await params;

  const journey = await prisma.journey.findUnique({
    where: { id: journeyId }
  });

  if (!journey) {
    notFound();
  }

  // Parse destinations from JSON
  const destinationIds = journey.destinations as string[];

  // Fetch destination names
  const destinations = await prisma.destination.findMany({
    where: {
      id: { in: destinationIds }
    },
    select: {
      id: true,
      name: true
    }
  });

  // Calculate budget
  const hasExtremeDistance = await validateExtremeDistance(destinationIds);
  const estimatedBudget = estimateBudgetRange(
    journey.travelStyle, 
    journey.days, 
    destinationIds.length, 
    !!hasExtremeDistance
  );

  return (
    <CheckoutClient
      journeyId={journey.id}
      selectedDays={journey.days}
      travelStyle={journey.travelStyle}
      estimatedBudget={estimatedBudget}
      destinations={destinations}
    />
  );
}
