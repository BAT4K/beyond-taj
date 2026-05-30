import 'dotenv/config';
import prisma from '../lib/prisma';
import assert from 'node:assert/strict';
import { evaluateTripFeasibility } from '../utils/routingEngine';

async function main() {
  console.log("Starting Automated Engine Fuzz Testing...");
  console.log("\n--- Phase 1: Static Graph Sweeper ---");
  
  const destinations = await prisma.destination.findMany();
  const edges = await prisma.transitRoute.findMany();
  
  let orphans = 0;
  let symmetryViolations = 0;
  
  for (const d of destinations) {
    const hasIncoming = edges.some(e => e.destinationId === d.id);
    const hasOutgoing = edges.some(e => e.originId === d.id);
    if (!hasIncoming || !hasOutgoing) {
      console.warn(`Orphan Check Failed: ${d.id} is missing ${!hasIncoming ? 'incoming' : ''} ${!hasOutgoing ? 'outgoing' : ''} edges.`);
      orphans++;
    }

    assert.ok(d.minRequiredDays !== null && d.minRequiredDays > 0, `Data Integrity: ${d.id} is missing a valid minRequiredDays.`);
    assert.ok(Array.isArray(d.peakMonths), `Data Integrity: ${d.id} peakMonths is not an array.`);
    assert.ok(Array.isArray(d.closedMonths), `Data Integrity: ${d.id} closedMonths is not an array.`);
  }
  
  for (const edge of edges) {
    const returnEdge = edges.find(e => e.originId === edge.destinationId && e.destinationId === edge.originId);
    if (!returnEdge) {
      console.warn(`Symmetry Violation: Edge ${edge.originId} -> ${edge.destinationId} has no return path.`);
      symmetryViolations++;
    }
  }
  
  assert.equal(orphans, 0, "Graph contains orphan nodes.");
  // Warning: strict symmetry might fail if there are intentional one-way flights. For now we just log warnings or assert it.
  // We won't strictly fail on symmetry unless requested, but we will fail on orphans.
  
  // BFS Global Reachability
  let startNode = destinations.find(d => d.id === 'Delhi' || d.id === 'Mumbai');
  if (!startNode) startNode = destinations[0];

  const visited = new Set<string>();
  const queue = [startNode.id];
  visited.add(startNode.id);

  while(queue.length > 0) {
    const curr = queue.shift()!;
    const neighbors = edges.filter(e => e.originId === curr).map(e => e.destinationId);
    for (const n of neighbors) {
      if (!visited.has(n)) {
        visited.add(n);
        queue.push(n);
      }
    }
  }

  if (visited.size !== destinations.length) {
    const unreached = destinations.filter(d => !visited.has(d.id)).map(d => d.id);
    console.error("Global Reachability Failed! The following nodes are isolated islands:", unreached);
    process.exit(1);
  }
  console.log("Phase 1 Passed: Graph is fully reachable and data integrity is verified.");


  console.log("\n--- Phase 2: Chaos Monkey (Property-Based Fuzzer) ---");
  const iterations = 1000;
  
  const styles = ["Backpacker", "Balanced", "Luxury"];
  const residencies = ["India", "International"];
  
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
    
    // Map month number to name
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[month - 1];

    const payload = { destIds, days, monthName, style, residency, startLocation: startNode.name };

    try {
      const result = await evaluateTripFeasibility(
        payload.destIds,
        payload.days,
        payload.monthName,
        payload.style,
        payload.residency,
        payload.startLocation,
        [] // landscapes
      );

      // Boundary Law
      assert.ok(result.score >= 0 && result.score <= 100, "Boundary Law Violation: Score is out of bounds.");

      // Weather Law
      const isClosed = selectedDests.some(d => d.closedMonths.includes(month));
      if (isClosed) {
        assert.equal(result.score, 0, "Weather Law Violation: Score must be 0 if month is closed.");
      }

      // Time-Space Law
      const sumMinDays = selectedDests.reduce((sum, d) => sum + (d.minRequiredDays || 2), 0);
      if (sumMinDays > days) {
        assert.equal(result.isValid, false, "Time-Space Law Violation: Trip is physically impossible but marked valid.");
        const hasLogisticsWarning = result.warnings.some(w => w.category === 'logistics');
        assert.ok(hasLogisticsWarning, "Time-Space Law Violation: Missing logistics warning.");
      }
      
    } catch (error) {
      console.error("\n[CRITICAL FAILURE] Chaos Monkey uncovered an edge case!");
      console.error("Payload:", JSON.stringify(payload, null, 2));
      console.error(error);
      process.exit(1);
    }

    if (i % 100 === 0) {
      console.log(`Progress: ${i}/${iterations} simulations passed...`);
    }
  }
  
  console.log("\n✅ All 1,000 Chaos Monkey simulations passed flawlessly.");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
