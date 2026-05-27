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

export async function validateExtremeDistance(destinationIds: string[], selectedDays: number): Promise<string | null> {
  if (destinationIds.length < 2 || selectedDays >= 8) return null;

  const dests = await prisma.destination.findMany({
    where: { id: { in: destinationIds } },
    select: { latitude: true, longitude: true, name: true }
  });

  if (dests.length < 2) return null;

  let maxDistanceKm = 0;
  for (let i = 0; i < dests.length; i++) {
    for (let j = i + 1; j < dests.length; j++) {
      const d = calculateHaversineDistance(dests[i].latitude, dests[i].longitude, dests[j].latitude, dests[j].longitude);
      if (d > maxDistanceKm) maxDistanceKm = d;
    }
  }

  // Use 900km as the flight threshold
  if (maxDistanceKm > 900) {
    return "High Transit Friction: Your selected destinations are geographically polarized (exceeding 900 km straight-line distance). Combining these regions in a short window requires multiple domestic flights and airport transfers, which will significantly exhaust your available leisure time.";
  }

  return null;
}

function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
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
