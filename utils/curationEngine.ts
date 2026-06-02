import { calculateMatchScore, TransitRouteEdge } from '@shared/travel-rules';

import { Destination as EngineDestination } from '@shared/travel-rules';

export type EnginePreferences = {
  travelMonth: string; // "January", "February", etc.
  selectedLandscapes: string[];
  selectedVibes?: string[]; // Added this to interface
  days: number;
  companions?: string;
};

// Removed hardcoded HUB_ANCHORS, we now calculate graph connectivity dynamically

export function generateBespokeRoute(
  preferences: EnginePreferences, 
  destinations: EngineDestination[], 
  transitRoutes?: TransitRouteEdge[]
) {
  // 1. Pick the best Hub Anchor to start
  let hubs: EngineDestination[] = [];
  if (transitRoutes && transitRoutes.length > 0) {
    const connectionCounts: Record<string, number> = {};
    transitRoutes.forEach(r => {
      connectionCounts[r.originId] = (connectionCounts[r.originId] || 0) + 1;
      connectionCounts[r.destinationId] = (connectionCounts[r.destinationId] || 0) + 1;
    });

    const maxConns = Math.max(...Object.values(connectionCounts));
    const dynamicHubIds = Object.keys(connectionCounts).filter(id => connectionCounts[id] >= Math.max(3, maxConns - 2));
    hubs = destinations.filter(d => dynamicHubIds.includes(d.id));
  }
  
  if (hubs.length === 0) hubs = [...destinations];
  hubs = hubs.sort(() => Math.random() - 0.5);
  
  let bestHub = hubs[0];
  let maxHubScore = -1;

  for (const hub of hubs) {
    const { score } = calculateMatchScore(hub, preferences);
    if (score > maxHubScore) {
      maxHubScore = score;
      bestHub = hub;
    }
  }
  if (!bestHub) bestHub = destinations[0];

  const selectedDests: EngineDestination[] = [bestHub];
  let remainingDays = preferences.days;
  remainingDays -= (bestHub.minRequiredDays || 2);

  const accumulatedVibes = new Set<string>();
  bestHub.vibeTags?.forEach(v => accumulatedVibes.add(v));

  let fatigueAccumulator = 0;
  let stayedInSameCluster = true;
  const initialCluster = bestHub.clusterId;

  // 2. Pathfinding Loop: The Time-Pool with BFS Look-Ahead
  while (remainingDays >= 1) {
    const lastNode = selectedDests[selectedDests.length - 1];
    
    let nextNode: EngineDestination | null = null;
    let nextMaxScore = -1;
    let chosenTransitPenalty = 0;

    for (const d of destinations) {
      if (selectedDests.some(s => s.id === d.id)) continue;
      
      let { score, isDeadEnd } = calculateMatchScore(d, preferences, lastNode.id, transitRoutes);
      if (isDeadEnd) continue;

      // Find edge for dynamic transit penalty
      const edge = transitRoutes?.find(r => 
        (r.originId === lastNode.id && r.destinationId === d.id) ||
        (r.destinationId === lastNode.id && r.originId === d.id)
      );

      // Depth-2 Look-Ahead (BFS)
      let lookAheadBonus = 0;
      const neighbors = destinations.filter(nd => 
        !selectedDests.some(s => s.id === nd.id) && nd.id !== d.id &&
        transitRoutes?.some(r => 
          (r.originId === d.id && r.destinationId === nd.id) || 
          (r.destinationId === d.id && r.originId === nd.id)
        )
      );
      
      if (neighbors.length > 0) {
        let bestNeighborScore = -1;
        for (const n of neighbors.slice(0, 5)) { // Bounded to 5 neighbors to save CPU
          const { score: ns } = calculateMatchScore(n, preferences, d.id, transitRoutes);
          if (ns > bestNeighborScore) bestNeighborScore = ns;
        }
        lookAheadBonus = bestNeighborScore * 0.3; // 30% weight to best neighbor
        score = (score * 0.7) + lookAheadBonus;
      }

      // Regional Continuity Bonus
      if (d.clusterId && d.clusterId === lastNode.clusterId) {
        score += 20; 
      } else if (d.region && d.region === lastNode.region) {
        score += 10; 
      } else {
        stayedInSameCluster = false;
      }

      // Diversity Penalty (Vibe Fatigue)
      let duplicateVibeCount = 0;
      if (d.vibeTags) {
        for (const v of d.vibeTags) {
          if (accumulatedVibes.has(v)) duplicateVibeCount++;
        }
      }
      if (duplicateVibeCount > 0) {
        // If it's monsoon season (July/August) and the destination is in the North (Himalayas),
        // reduce the diversity penalty since weather safety supersedes vibe diversity.
        let penaltyMultiplier = 5;
        if ((preferences.travelMonth === 'July' || preferences.travelMonth === 'August') && d.region === 'North') {
          penaltyMultiplier = 1;
        }
        score -= (duplicateVibeCount * penaltyMultiplier);
      }

      // Scale score by time efficiency (penalize if it requires more days than we have)
      const reqDays = d.minRequiredDays || 2;
      let transitDayCost = 0.5; // fallback
      if (edge) {
        if (edge.fatigueCost <= 2) transitDayCost = 0.25;
        else if (edge.fatigueCost === 3 || edge.fatigueCost === 4) transitDayCost = 0.5;
        else if (edge.fatigueCost === 5) transitDayCost = 0.75;
        else if (edge.fatigueCost >= 6) transitDayCost = 1.0;
      }
      
      if (reqDays + transitDayCost > remainingDays + 1) {
        score *= 0.5; // Heavy penalty if it exceeds remaining time
      }

      if (score > nextMaxScore) {
        nextMaxScore = score;
        nextNode = d;
        chosenTransitPenalty = transitDayCost;
      }
    }

    if (!nextNode || nextMaxScore <= 0) {
      break; 
    }

    // Apply Time-Pool Subtractions
    selectedDests.push(nextNode);
    remainingDays -= ((nextNode.minRequiredDays || 2) + chosenTransitPenalty);
    fatigueAccumulator += chosenTransitPenalty;
    nextNode.vibeTags?.forEach(v => accumulatedVibes.add(v));
  }

  // 3. Dynamic Rationale Generation
  const hubName = bestHub.name;
  let rationale = `We anchored your ${preferences.days}-day journey in ${hubName} for optimal connectivity. `;

  if (stayedInSameCluster) {
    rationale += `To minimize travel fatigue, we designed a route strictly within the ${bestHub.region} region. `;
  } else if (fatigueAccumulator > 3) {
    rationale += `This is an ambitious cross-regional route covering diverse landscapes, balanced with strategic pacing. `;
  } else {
    rationale += `The route blends popular hubs with diverse regional experiences. `;
  }

  if (preferences.selectedVibes && preferences.selectedVibes.length > 0) {
    const v = preferences.selectedVibes[0];
    rationale += `We specifically prioritized stops to match your preference for ${v} vibes, while ensuring the pacing leaves you ample time to actually experience each location without rushing.`;
  } else {
    rationale += `We balanced the pacing to ensure you have time to actually experience each location without rushing.`;
  }

  return {
    destinationIds: selectedDests.map(d => d.id),
    rationale
  };
}
