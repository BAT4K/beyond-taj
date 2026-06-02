// @ts-nocheck
import 'dotenv/config';
import prisma from '../lib/prisma';
import assert from 'node:assert/strict';
import { evaluateTripFeasibility } from '../utils/routingEngine';
import { generateBespokeRoute } from '../utils/curationEngine';
import { calculateTripPacing, DestinationSchema, VALID_VIBES, VALID_LANDSCAPES } from '@shared/travel-rules';

// Haversine formula to calculate distance between two lat/lng coordinates in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

async function main() {
  console.log("Starting Automated Engine Fuzz Testing...");
  console.log("\n--- Phase 1: Static Graph Sweeper ---");
  
  const destinations = await prisma.destination.findMany({ include: { Landscape: true } });
  const edges = await prisma.transitRoute.findMany();
  
  // Zod Batch Validation
  const validationErrors: any[] = [];
  for (const d of destinations) {
    const rawData = {
      ...d,
      landscapes: d.Landscape ? d.Landscape.map(l => l.name) : []
    };
    const parseResult = DestinationSchema.safeParse(rawData);
    if (!parseResult.success) {
      validationErrors.push({ id: d.id, errors: parseResult.error.issues });
    }
  }

  if (validationErrors.length > 0) {
    console.error("Data Type Strictness Failed! Found Zod formatting errors in database destinations:");
    console.error(JSON.stringify(validationErrors, null, 2));
    process.exit(1);
  }

  // Orphan & Symmetry Check
  for (const d of destinations) {
    const hasIncoming = edges.some(e => e.destinationId === d.id);
    const hasOutgoing = edges.some(e => e.originId === d.id);
    
    assert.ok(hasIncoming, `Orphan Check Failed: ${d.id} is missing incoming edges.`);
    assert.ok(hasOutgoing, `Orphan Check Failed: ${d.id} is missing outgoing edges.`);
  }
  
  for (const edge of edges) {
    const returnEdge = edges.find(e => e.originId === edge.destinationId && e.destinationId === edge.originId);
    assert.ok(returnEdge, `Symmetry Violation: Edge ${edge.originId} -> ${edge.destinationId} has no return path.`);
  }

  // Proximity Law (Missing Edges)
  const proximityWarnings: string[] = [];
  for (let i = 0; i < destinations.length; i++) {
    for (let j = i + 1; j < destinations.length; j++) {
      const d1 = destinations[i];
      const d2 = destinations[j];
      if (d1.latitude && d1.longitude && d2.latitude && d2.longitude) {
        const dist = calculateDistance(d1.latitude, d1.longitude, d2.latitude, d2.longitude);
        if (dist <= 200) {
          const hasEdge = edges.some(e => e.originId === d1.id && e.destinationId === d2.id);
          if (!hasEdge) {
            proximityWarnings.push(`Nodes ${d1.id} and ${d2.id} are ${Math.round(dist)}km apart but lack a transit edge.`);
          }
        }
      }
    }
  }
  
  if (proximityWarnings.length > 0) {
    console.warn("\n[WARNING] Proximity Law: Found missing edges between geographically close destinations:");
    proximityWarnings.forEach(w => console.warn("  - " + w));
  }

  // Hub Reachability Law (Reverse BFS)
  const hubs = destinations.filter(d => d.isHub === true);
  if (hubs.length === 0) {
    console.error("Hub Reachability Failed! No hubs defined (isHub === true).");
    process.exit(1);
  }

  const hopsMap = new Map<string, number>();
  const queue = hubs.map(h => ({ id: h.id, hops: 0 }));
  queue.forEach(q => hopsMap.set(q.id, 0));

  let head = 0;
  while(head < queue.length) {
    const curr = queue[head++];
    if (curr.hops >= 3) continue; // Only propagate up to 3 hops

    const neighbors = edges.filter(e => e.destinationId === curr.id).map(e => e.originId);
    for (const n of neighbors) {
      if (!hopsMap.has(n) || hopsMap.get(n)! > curr.hops + 1) {
        hopsMap.set(n, curr.hops + 1);
        queue.push({ id: n, hops: curr.hops + 1 });
      }
    }
  }

  const unreachableOrFar = destinations.filter(d => {
    const hops = hopsMap.get(d.id);
    return hops === undefined || hops > 3;
  });

  if (unreachableOrFar.length > 0) {
    console.error("Hub Reachability Failed! The following nodes are >3 hops from any hub or completely isolated:");
    console.error(unreachableOrFar.map(d => ({ id: d.id, hops: hopsMap.get(d.id) ?? 'Infinite' })));
    process.exit(1);
  }

  console.log("\nPhase 1 Passed: Graph is fully reachable, symmetric, strictly typed, and orphaned-free.");

  console.log("\n--- Phase 2: Chaos Monkey (Property-Based Fuzzer) ---");
  const iterations = 50;
  
  const styles = ["Luxury Explorer", "Balanced"];
  const residencies = ["India", "International"];
  const companionsList = ["Solo Expedition", "Solo Female Journey", "Romantic Getaway", "Family Vacation", "Traveling with Friends"];
  
  for (let i = 1; i <= iterations; i++) {
    const numDests = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const selectedDests: typeof destinations = [];
    for (let j = 0; j < numDests; j++) {
      const rnd = destinations[Math.floor(Math.random() * destinations.length)];
      if (!selectedDests.find(d => d.id === rnd.id)) selectedDests.push(rnd);
    }
    
    const destIds = selectedDests.map(d => d.id);
    const days = Math.floor(Math.random() * 30) + 1; // 1 to 30
    const month = Math.floor(Math.random() * 12) + 1; // 1 to 12
    const style = styles[Math.floor(Math.random() * styles.length)];
    const residency = residencies[Math.floor(Math.random() * residencies.length)];
    const companion = companionsList[Math.floor(Math.random() * companionsList.length)];
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[month - 1];

    const startNode = hubs[Math.floor(Math.random() * hubs.length)];
    const payload = { destIds, days, monthName, style, residency, startLocation: startNode.name, companion };

    try {
      const result = await evaluateTripFeasibility(
        payload.destIds,
        payload.days,
        payload.monthName,
        payload.style,
        payload.residency,
        payload.startLocation,
        [],
        payload.companion
      );

      // Boundary Law
      assert.ok(result.score >= 0 && result.score <= 100, "Boundary Law Violation: Score is out of bounds.");
      assert.ok(!Number.isNaN(result.score), "Boundary Law Violation: Score is NaN.");

      // Weather Law
      const isClosed = selectedDests.some(d => d.closedMonths.includes(month));
      if (isClosed) {
        assert.equal(result.score, 0, "Weather Law Violation: Score must be 0 if month is closed.");
      }

      // Time-Space Law (Pacing)
      const { isPhysicallyPossible, sumMinDays } = calculateTripPacing(selectedDests as any, days);
      
      if (!isPhysicallyPossible) {
        assert.equal(result.isValid, false, `Time-Space Law Violation: Trip is physically impossible but marked valid. Days: ${days}, MinRequired: ${sumMinDays}`);
        const hasPacingWarning = result.warnings.some(w => w.category === 'pacing' || w.category === 'logistics');
        assert.ok(hasPacingWarning, "Time-Space Law Violation: Missing logistics/pacing warning.");
      }

    } catch (error: any) {
      console.error("\n[CRITICAL FAILURE] Chaos Monkey uncovered an edge case!");
      console.error("Payload:", JSON.stringify(payload, null, 2));
      console.error(error.message || error);
      process.exit(1);
    }

    if (i % 100 === 0) {
      console.log(`Progress: ${i}/${iterations} simulations passed...`);
    }
  }
  
  console.log("\n✅ All Chaos Monkey simulations passed flawlessly.");

  console.log("\n--- Phase 3: Bespoke Auto-Curation Fuzzer ---");
  for (let i = 1; i <= iterations; i++) {
    const days = Math.floor(Math.random() * 21) + 3; // 3 to 24
    const month = Math.floor(Math.random() * 12) + 1;
    const companion = companionsList[Math.floor(Math.random() * companionsList.length)];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    // Pick 2 random landscapes and 2 random vibes
    const selectedLandscapes = [
      VALID_LANDSCAPES[Math.floor(Math.random() * VALID_LANDSCAPES.length)],
      VALID_LANDSCAPES[Math.floor(Math.random() * VALID_LANDSCAPES.length)]
    ];
    const selectedVibes = [
      VALID_VIBES[Math.floor(Math.random() * VALID_VIBES.length)],
      VALID_VIBES[Math.floor(Math.random() * VALID_VIBES.length)]
    ];

    try {
      const result = generateBespokeRoute({
        travelMonth: monthNames[month - 1],
        selectedLandscapes,
        selectedVibes,
        days,
        companions: companion
      }, destinations as any, edges);

      assert.ok(Array.isArray(result.destinationIds), "Bespoke Result destinationIds must be an array");
      assert.ok(result.destinationIds.length > 0, "Bespoke Result must return at least 1 destination (the hub fallback)");
      assert.ok(typeof result.rationale === 'string' && result.rationale.length > 0, "Bespoke Result must contain a rationale");
    } catch (e: any) {
      console.error("\n[CRITICAL FAILURE] Bespoke Auto-Curation crashed on edge case!");
      console.error(e.message || e);
      process.exit(1);
    }
  }
  
  console.log("\n✅ Bespoke Auto-Curation passed 100% of permutation tests.");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
