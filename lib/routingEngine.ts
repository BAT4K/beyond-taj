import prisma from '@/lib/prisma';

export function validateDestinationCount(selectedDays: number, destinationCount: number): string | null {
  let maxDestinations = 20;
  
  if (selectedDays <= 7) {
    maxDestinations = 2;
  } else if (selectedDays <= 10) {
    maxDestinations = 3;
  } else if (selectedDays <= 14) {
    maxDestinations = 4;
  } else if (selectedDays <= 21) {
    maxDestinations = 6;
  } else if (selectedDays <= 30) {
    maxDestinations = 9;
  } else if (selectedDays <= 45) {
    maxDestinations = 12;
  } else if (selectedDays <= 60) {
    maxDestinations = 15;
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

import { Destination, TransitRoute } from '@prisma/client';
import { MONTH_MAP, FATIGUE_BUDGETS, getWeatherReason } from '@shared/travel-rules';

export type ExtendedDestination = Destination & {
  Cluster?: { id: string, name: string, compatibleClusters: string[] } | null;
};

// 1. Path Finding (TSP with Nearest Neighbor based on Fatigue)
export function optimizePathByFatigue(
  destinations: ExtendedDestination[],
  edges: TransitRoute[],
  startLocation: string,
  allNodeIds: string[]
): { optimalPath: ExtendedDestination[], totalFatigue: number } {
  if (!destinations || destinations.length === 0) return { optimalPath: [], totalFatigue: 0 };

  // First, find the destination closest to the user's startLocation.
  // If startLocation matches a destination exactly, start there.
  // Otherwise, we just pick the first destination as a fallback.
  let startNode = destinations.find(d => d.name.toLowerCase() === startLocation.toLowerCase() || d.id === startLocation) 
                  || destinations[0];

  const unvisited = new Set(destinations.map(d => d.id));
  unvisited.delete(startNode.id);
  
  const optimalPath = [startNode];
  let currentId = startNode.id;
  let totalFatigue = 0;

  while (unvisited.size > 0) {
    let nextId: string | null = null;
    let minFatigue = Infinity;
    
    // Find cheapest path from currentId to any unvisited node
    for (const unv of Array.from(unvisited)) {
      // 1. Check for a direct edge
      let edge = edges.find(e => e.originId === currentId && e.destinationId === unv);
      let cost = edge ? edge.fatigueCost : Infinity;

      // 2. If no direct edge, use Dijkstra's to find the lowest fatigue multi-hop path
      if (!edge) {
        const dijkstraCost = runDijkstra(currentId, unv, edges, allNodeIds);
        cost = dijkstraCost;
      }

      if (cost < minFatigue) {
        minFatigue = cost;
        nextId = unv;
      }
    }

    if (nextId && minFatigue < Infinity) {
      totalFatigue += minFatigue;
      unvisited.delete(nextId);
      optimalPath.push(destinations.find(d => d.id === nextId)!);
      currentId = nextId;
    } else {
      break; // Graph is entirely disconnected even with multi-hops
    }
  }

  return { optimalPath, totalFatigue };
}

// Helper: Dijkstra's Algorithm to find the lowest fatigue path across multiple edges
function runDijkstra(startNode: string, endNode: string, edges: TransitRoute[], allNodeIds: string[]): number {
  const distances: Record<string, number> = {};
  const visited = new Set<string>();

  for (const id of allNodeIds) distances[id] = Infinity;
  distances[startNode] = 0;

  while (true) {
    let currNode: string | null = null;
    let shortest = Infinity;
    
    // Find unvisited node with lowest distance
    for (const id of allNodeIds) {
      if (!visited.has(id) && distances[id] < shortest) {
        shortest = distances[id];
        currNode = id;
      }
    }

    if (currNode === null || currNode === endNode) break;

    visited.add(currNode);

    // Update neighbors
    const outgoingEdges = edges.filter(e => e.originId === currNode);
    for (const edge of outgoingEdges) {
      const alt = distances[currNode] + edge.fatigueCost;
      if (alt < distances[edge.destinationId]) {
        distances[edge.destinationId] = alt;
      }
    }
  }

  return distances[endNode];
}

type WarningMessage = {
  category: 'weather' | 'logistics' | 'vibe' | 'pacing';
  severity: 'critical' | 'warning' | 'info';
  message: string;
};

// 2. Main Evaluator
export async function evaluateTripFeasibility(
  destinationIds: string[],
  days: number,
  travelMonths: string[],
  style: string,
  residency: string,
  startLocation: string,
  requestedLandscapes?: string[],
  companions?: string
) {
  const warnings: WarningMessage[] = [];
  
  // 1. Fetch rich nodes and edges from Prisma
  const destinations = await prisma.destination.findMany({
    where: { id: { in: destinationIds } },
    include: { Cluster: true, Landscape: true }
  });

  const edges = await prisma.transitRoute.findMany();

  if (!destinations || destinations.length === 0) {
    return {
      score: 0,
      isValid: false,
      warnings: [{ category: 'logistics', severity: 'critical', message: "System Error: Destinations not found in database." } as WarningMessage],
      optimalPath: []
    };
  }

  const allDestinations = await prisma.destination.findMany({ select: { id: true } });
  const allNodeIds = allDestinations.map(d => d.id);

  // --- Weather Aggregation Check ---
  let isWeatherClosed = false;
  if (travelMonths && travelMonths.length > 0) {
    const closedDests = new Set<string>();
    const avoidDests = new Set<string>();
    
    travelMonths.forEach(month => {
      const mIndex = MONTH_MAP[month];
      if (!mIndex) return;
      destinations.forEach(d => {
        if (d.closedMonths.includes(mIndex)) closedDests.add(d.name);
        else if (d.avoidMonths.includes(mIndex)) avoidDests.add(d.name);
      });
    });

    if (closedDests.size > 0) {
      isWeatherClosed = true;
      const names = Array.from(closedDests);
      warnings.push({
        category: 'weather',
        severity: 'critical',
        message: `Extreme Weather Alert: ${names.join(" and ")} ${names.length > 1 ? 'are' : 'is'} completely closed or inaccessible during parts of your selected window (${travelMonths.join(", ")}).`
      });
    }
    if (avoidDests.size > 0) {
      const names = Array.from(avoidDests);
      warnings.push({
        category: 'weather',
        severity: 'warning',
        message: `Off-Season Warning: ${names.join(" and ")} ${names.length > 1 ? 'experience' : 'experiences'} extreme weather during parts of your selected window (${travelMonths.join(", ")}).`
      });
    }
  }

  // --- Vibe Thresholding (Anti-Nagging) ---
  if (requestedLandscapes && requestedLandscapes.length > 0) {
    const combinedLandscapes = new Set(
      destinations.flatMap(d => d.Landscape.map(l => l.name))
    );
    let intersectionCount = 0;
    
    requestedLandscapes.forEach(req => {
      if (combinedLandscapes.has(req)) intersectionCount++;
    });

    if (intersectionCount === 0) {
      warnings.push({
        category: 'vibe',
        severity: 'info',
        message: `Vibe Check: You requested ${requestedLandscapes.join(", ")}, but none of your manually selected destinations match these landscapes.`
      });
    }
  }

  // 2. Run Route Optimization
  const { optimalPath, totalFatigue: routeFatigue } = optimizePathByFatigue(destinations, edges, startLocation, allNodeIds);

  const isDisconnected = optimalPath.length < destinations.length;
  if (isDisconnected) {
    const disconnected = destinations.filter(d => !optimalPath.find(o => o.id === d.id));
    const names = disconnected.map(d => d.name);
    warnings.push({
      category: 'logistics',
      severity: 'critical',
      message: `Critical Routing Alert: ${names.join(" and ")} ${names.length > 1 ? "are" : "is"} completely disconnected from your route. No transit options exist.`
    });
  } else if (optimalPath.length > 1) {
    let missingEdges = 0;
    for (let i = 0; i < optimalPath.length - 1; i++) {
      const from = optimalPath[i].id;
      const to = optimalPath[i+1].id;
      const direct = edges.find(e => 
        (e.originId === from && e.destinationId === to) || 
        (e.destinationId === from && e.originId === to)
      );
      if (!direct) missingEdges++;
    }
    
    // Check startLocation to first node if they are different
    const startObj = optimalPath[0];
    if (startObj.name.toLowerCase() !== startLocation.toLowerCase() && startObj.id !== startLocation) {
       const directFromStart = edges.find(e => 
         (e.originId === startLocation && e.destinationId === startObj.id) ||
         (e.destinationId === startLocation && e.originId === startObj.id)
       );
       if (!directFromStart) missingEdges++;
    }

    if (missingEdges > 0) {
      const severity = companions === "Family Vacation" ? 'critical' : 'warning';
      warnings.push({
        category: 'logistics',
        severity: severity,
        message: `Complex Transit: Your route requires transiting through major hubs. There are no direct connections for ${missingEdges} of your journey legs.`
      });
    }
  }

  // 3. Calculate Fatigue Budget based on User Residency & Style
  let baseBudgetPerDay = FATIGUE_BUDGETS[style.toLowerCase()] || 6;
  
  if (residency === "India") {
    baseBudgetPerDay += 2; 
  } else {
    baseBudgetPerDay -= 1; 
  }

  if (companions === "Family Vacation") {
    baseBudgetPerDay -= 2; // Much lower tolerance for fatigue
  } else if (companions === "Solo Female Journey") {
    baseBudgetPerDay -= 1; // Prioritize easier, safer routes
  } else if (companions === "Solo Expedition" || companions === "Traveling with Friends") {
    baseBudgetPerDay += 1; // Higher tolerance for adventure/fatigue
  }

  const totalFatigueAllowed = days * baseBudgetPerDay;
  
  let acclimatizationFatigue = 0;
  for (const dest of optimalPath) {
    if (dest.requiresAcclimatization) {
      acclimatizationFatigue += 6;
    }
  }

  // 4. Calculate Geographic Score (Region rules)
  const uniqueRegions = new Set(optimalPath.map(d => d.region));
  const regionCount = uniqueRegions.size;

  const regionalTransferPenalty = Math.max(0, (regionCount - 1) * 15);
  const arrivalPenalty = residency === "International" ? 6 : 0; 
  const totalTripFatigue = routeFatigue + acclimatizationFatigue + arrivalPenalty + regionalTransferPenalty;
  
  // --- Validate Minimum Required Days ---
  const totalMinDays = optimalPath.reduce((sum, dest) => sum + (dest.minRequiredDays || 2), 0);
  const totalTransitHops = optimalPath.length > 1 ? optimalPath.length - 1 : 0;
  // A rough estimate: each hop takes at least 0.5 to 1 day realistically, but we just check raw minimums for now
  if (totalMinDays > days) {
    warnings.push({
      category: 'logistics',
      severity: 'critical',
      message: `Pacing Alert: You only have ${days} days, but exploring these destinations properly requires an absolute minimum of ${totalMinDays} days (excluding transit time). You are trying to pack way too much in.`
    });
  }

  // --- Validate Slack Days (Too few destinations for available time) ---
  const slackDays = days - totalMinDays;
  if (totalMinDays <= days && slackDays >= 5 && days >= totalMinDays * 2) {
    const destNames = optimalPath.map(d => d.name).join(' and ');
    const maxAllowed = Math.max(3, Math.floor(days / 1.5));
    const isMaxReached = optimalPath.length >= maxAllowed;
    
    const suggestion = isMaxReached 
      ? "reducing your trip length" 
      : "adding more destinations or reducing your trip length";
      
    warnings.push({
      category: 'pacing',
      severity: 'warning',
      message: `${destNames} ${optimalPath.length > 1 ? 'need' : 'needs'} roughly ${totalMinDays} days. You have ${days}. Consider ${suggestion} to keep the journey engaging.`
    });
  }

  let fatigueScoreOverride = (isDisconnected || isWeatherClosed) ? 0 : (totalMinDays > days ? 0 : 100);
  const remainingBudget = totalFatigueAllowed - totalTripFatigue;
  if (remainingBudget < 0 && !isDisconnected && totalMinDays <= days && !isWeatherClosed) {
    fatigueScoreOverride = Math.max(0, 100 - (Math.abs(remainingBudget) * 5));
    warnings.push({
      category: 'logistics',
      severity: 'warning',
      message: `Your transfers will consume too much energy. You have a massive fatigue deficit. Consider focusing on one region, or adding more buffer days to recover.`
    });
  }
  
  // Set the final fatigue score based on the override
  let fatigueScore = fatigueScoreOverride;

  let allowedRegions = 1;
  if (days >= 9) allowedRegions = 2; 
  if (days >= 15) allowedRegions = 3;

  let geoScore = 100;
  if (regionCount > allowedRegions) {
    geoScore -= (regionCount - allowedRegions) * 30;
    warnings.push({
      category: 'logistics',
      severity: 'warning',
      message: `You are attempting to cross ${regionCount} massive geographic regions in just ${days} days. This will feel like a transit marathon rather than a vacation.`
    });
  }

  // Final Aggregation
  geoScore = Math.max(0, geoScore);
  let TRIP_SCORE = Math.round((geoScore * 0.5) + (fatigueScore * 0.5));
  
  if (isDisconnected || isWeatherClosed || totalMinDays > days) {
    TRIP_SCORE = 0;
  }
  
  return {
    score: TRIP_SCORE,
    isValid: TRIP_SCORE >= 50,
    warnings,
    optimalPath: optimalPath.map(d => d.name)
  };
}

