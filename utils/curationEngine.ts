import { calculateMatchScore, TransitRouteEdge } from './scoringEngine';

export type EngineDestination = {
  id: string;
  name: string;
  clusterId?: string | null;
  region?: string;
  landscapes?: string[];
  peakMonths: number[];
  shoulderMonths: number[];
  avoidMonths: number[];
  closedMonths: number[];
  vibeTags: string[];
};

export type EnginePreferences = {
  travelMonth: string; // "January", "February", etc.
  selectedLandscapes: string[];
  selectedVibes?: string[]; // Added this to interface
  days: number;
};

// Removed hardcoded HUB_ANCHORS, we now calculate graph connectivity dynamically

export function generateBespokeRoute(
  preferences: EnginePreferences, 
  destinations: EngineDestination[], 
  transitRoutes?: TransitRouteEdge[]
) {
  // 1. Pick the best Hub Anchor to start
  // Dynamically calculate hubs based on graph degree (connectivity)
  let hubs: EngineDestination[] = [];
  if (transitRoutes && transitRoutes.length > 0) {
    const connectionCounts: Record<string, number> = {};
    transitRoutes.forEach(r => {
      connectionCounts[r.originId] = (connectionCounts[r.originId] || 0) + 1;
      connectionCounts[r.destinationId] = (connectionCounts[r.destinationId] || 0) + 1;
    });

    // Find the max connections any node has
    const maxConns = Math.max(...Object.values(connectionCounts));
    // Any node with connections >= maxConns - 1 is considered a major Hub
    const dynamicHubIds = Object.keys(connectionCounts).filter(id => connectionCounts[id] >= Math.max(3, maxConns - 2));
    
    hubs = destinations.filter(d => dynamicHubIds.includes(d.id));
  }
  
  // Fallback if no routes exist
  if (hubs.length === 0) hubs = [...destinations];
  
  // Shuffle to prevent deterministic tie-breaks
  hubs = hubs.sort(() => Math.random() - 0.5);
  
  // Score hubs without a lastSelectedNode (no logistics factor)
  let bestHub = hubs[0];
  let maxHubScore = -1;

  for (const hub of hubs) {
    const { score } = calculateMatchScore(hub, preferences);
    if (score > maxHubScore) {
      maxHubScore = score;
      bestHub = hub;
    }
  }

  // Fallback if no hub somehow
  if (!bestHub) {
    bestHub = destinations[0];
  }

  const selectedDests: string[] = [bestHub.id];
  const pacingN = Math.max(1, Math.ceil(preferences.days / 3));

  // 2. Pathfinding Loop
  while (selectedDests.length < pacingN) {
    const lastNodeId = selectedDests[selectedDests.length - 1];
    
    let nextNodeId: string | null = null;
    let nextMaxScore = -1;

    for (const d of destinations) {
      if (selectedDests.includes(d.id)) continue;
      
      let { score, isDeadEnd } = calculateMatchScore(d, preferences, lastNodeId, transitRoutes);
      
      if (isDeadEnd) continue;

      // Regional Continuity Bonus: strongly prefer staying in the same cluster/region
      const lastDestObj = destinations.find(x => x.id === lastNodeId);
      if (lastDestObj) {
        if (d.clusterId && d.clusterId === lastDestObj.clusterId) {
          score += 20; // Massive boost for same cluster
        } else if (d.region && d.region === lastDestObj.region) {
          score += 10; // Moderate boost for same region
        }
      }

      if (score > nextMaxScore) {
        nextMaxScore = score;
        nextNodeId = d.id;
      }
    }

    if (!nextNodeId || nextMaxScore === 0) {
      // Dead-End Protection: break loop early if no valid nodes left
      break; 
    }

    selectedDests.push(nextNodeId);
  }

  // Rationale Generation
  const hubName = bestHub.name;
  let rationale = `Based on your selected vibe and pacing, we've dynamically generated a ${preferences.days}-day optimal path starting from ${hubName}.`;
  
  if (selectedDests.length < pacingN) {
    rationale += ` Note: Your itinerary is slightly shorter than requested to avoid extreme weather or exhausting transit times.`;
  }

  return {
    destinationIds: selectedDests,
    rationale
  };
}
