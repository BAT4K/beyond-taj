import prisma from '@/lib/prisma';

export function validateDestinationCount(selectedDays: number, destinationCount: number): string | null {
  let maxDestinations = 9;
  
  if (selectedDays <= 7) {
    maxDestinations = 2;
  } else if (selectedDays <= 10) {
    maxDestinations = 3;
  } else if (selectedDays <= 14) {
    maxDestinations = 4;
  } else if (selectedDays <= 21) {
    maxDestinations = 6;
  }

  if (destinationCount > maxDestinations) {
    return `For a ${selectedDays}-day trip, we recommend a maximum of ${maxDestinations} destinations to ensure a relaxed pace.`;
  }
  
  return null;
}

export async function validateExtremeDistance(destinationIds: string[]): Promise<string | null> {
  if (destinationIds.length < 2) return null;

  const extremeRoute = await prisma.transitRoute.findFirst({
    where: {
      AND: [
        { originId: { in: destinationIds } },
        { destinationId: { in: destinationIds } },
        { distanceKm: { gte: 3000 } }
      ]
    }
  });

  if (extremeRoute) {
    return 'Extreme distance detected between selected destinations. This may require long transit times and disrupt your itinerary pace.';
  }

  return null;
}

export function estimateBudgetRange(travelStyle: string, selectedDays: number, destinationCount: number, hasExtremeDistance: boolean): string {
  let dailyRateMin = 0;
  let dailyRateMax = 0;

  switch (travelStyle.toLowerCase()) {
    case 'luxury explorer':
      dailyRateMin = 300;
      dailyRateMax = 700;
      break;
    case 'balanced':
      dailyRateMin = 150;
      dailyRateMax = 300;
      break;
    case 'adventure nomad':
      dailyRateMin = 80;
      dailyRateMax = 150;
      break;
    case 'deep immersion':
      dailyRateMin = 40;
      dailyRateMax = 80;
      break;
    default:
      dailyRateMin = 100;
      dailyRateMax = 200;
  }

  let minBudget = dailyRateMin * selectedDays;
  let maxBudget = dailyRateMax * selectedDays;

  // 15% distance surcharge for ambitious multi-city routes
  if (destinationCount > 3) {
    minBudget = Math.round(minBudget * 1.15);
    maxBudget = Math.round(maxBudget * 1.15);
  }

  // Flat surcharge for extreme geographic spread
  if (hasExtremeDistance) {
    minBudget += 500;
    maxBudget += 1000;
  }

  return `$${minBudget.toLocaleString()} – $${maxBudget.toLocaleString()}`;
}
