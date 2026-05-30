import { EngineDestination, EnginePreferences } from './curationEngine';

export type TransitRouteEdge = {
  originId: string;
  destinationId: string;
  fatigueCost: number;
};

// Vibe Factor: 1.0 (intersect), 0.5 (partial), 0.0 (none). 
// Note: If no vibes are selected, default to 1.0 as requested.
function calculateVibeFactor(destination: EngineDestination, selectedVibes?: string[]) {
  if (!selectedVibes || selectedVibes.length === 0) return 1.0;
  if (!destination.vibeTags || !Array.isArray(destination.vibeTags)) return 0.0;
  
  let matchCount = 0;
  for (const v of selectedVibes) {
    if (destination.vibeTags.includes(v)) matchCount++;
  }
  
  if (matchCount === selectedVibes.length) return 1.0;
  if (matchCount > 0) return 0.5;
  return 0.0;
}

// Landscape Factor: +0.2 for every matching landscape (up to 1.0)
function calculateLandscapeFactor(destination: EngineDestination, selectedLandscapes?: string[]) {
  if (!selectedLandscapes || selectedLandscapes.length === 0) return 1.0;
  if (!destination.landscapes || !Array.isArray(destination.landscapes)) return 0.0;
  
  let matchCount = 0;
  for (const l of selectedLandscapes) {
    if (destination.landscapes.includes(l)) matchCount++;
  }
  
  if (matchCount === 0) return 0.0;
  return Math.min(1.0, matchCount * 0.5); // 1 match = 0.5, 2 matches = 1.0
}

// Weather Factor: Peak = 1.0, Shoulder = 0.75, Avoid = 0.1, Closed = 0.0
function calculateWeatherFactor(destination: EngineDestination, travelMonthStr: string) {
  if (!travelMonthStr) return 1.0;
  
  const MONTH_MAP: Record<string, number> = {
    "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
    "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12
  };
  const monthInt = MONTH_MAP[travelMonthStr];
  if (!monthInt) return 1.0;

  if (destination.closedMonths?.includes(monthInt)) return 0.0;
  if (destination.avoidMonths?.includes(monthInt)) return 0.1;
  if (destination.peakMonths?.includes(monthInt)) return 1.0;
  if (destination.shoulderMonths?.includes(monthInt)) return 0.75;
  
  return 1.0; // Default if not explicitly defined
}

// Logistics Factor: 1.0 - (fatigueCost / 10). Max fatigue penalty is 10.
function calculateLogisticsFactor(destinationId: string, lastSelectedNode: string, transitRoutes: TransitRouteEdge[]) {
  const route = transitRoutes.find(r => 
    (r.originId === lastSelectedNode && r.destinationId === destinationId) ||
    (r.destinationId === lastSelectedNode && r.originId === destinationId)
  );

  let fatigueCost = 10; // Massive penalty for no route
  if (route) {
    fatigueCost = route.fatigueCost;
  }
  
  const factor = 1.0 - (fatigueCost / 10.0);
  return Math.max(0, Math.min(1.0, factor)); // Clamp between 0 and 1
}

export function calculateMatchScore(
  destination: EngineDestination, 
  userContext: EnginePreferences & { selectedVibes?: string[] },
  lastSelectedNode?: string,
  transitRoutes?: TransitRouteEdge[]
) {
  const vibeFactor = calculateVibeFactor(destination, userContext.selectedVibes);
  const weatherFactor = calculateWeatherFactor(destination, userContext.travelMonth);
  const landscapeFactor = calculateLandscapeFactor(destination, userContext.selectedLandscapes);
  
  let logisticsFactor = 1.0;
  let hasLogistics = false;

  if (lastSelectedNode && transitRoutes && transitRoutes.length > 0) {
    logisticsFactor = calculateLogisticsFactor(destination.id, lastSelectedNode, transitRoutes);
    hasLogistics = true;
  }

  // Dynamic Weights Based on Trip Length (pacing)
  // If no lastSelectedNode, it means we are picking a hub (no logistics needed)
  let vibeWeight = 0.15;
  let weatherWeight = 0.35;
  let landscapeWeight = 0.50;
  let logisticsWeight = 0.0;

  if (hasLogistics) {
    if (userContext.days <= 7) {
      logisticsWeight = 0.5;
      vibeWeight = 0.1;
      landscapeWeight = 0.2;
      weatherWeight = 0.2;
    } else {
      logisticsWeight = 0.2;
      vibeWeight = 0.2;
      landscapeWeight = 0.4;
      weatherWeight = 0.2;
    }
  }

  const finalScore = (
    (vibeFactor * vibeWeight) +
    (weatherFactor * weatherWeight) +
    (landscapeFactor * landscapeWeight) +
    (logisticsFactor * logisticsWeight)
  ) * 100;

  return {
    score: Math.round(finalScore),
    vibeFactor,
    weatherFactor,
    landscapeFactor,
    logisticsFactor,
    isDeadEnd: weatherFactor === 0.0 || (hasLogistics && logisticsFactor === 0.0)
  };
}
