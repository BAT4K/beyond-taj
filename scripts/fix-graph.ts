// @ts-nocheck
import 'dotenv/config';
import prisma from '../lib/prisma';

async function main() {
  const edges = await prisma.transitRoute.findMany();
  let created = 0;

  console.log('Starting graph symmetry enforcement...');

  // 1. Enforce Symmetry
  for (const edge of edges) {
    const rev = edges.find(e => e.originId === edge.destinationId && e.destinationId === edge.originId);
    if (!rev) {
      // Create it if it wasn't already created in the DB during this run
      const exists = await prisma.transitRoute.findUnique({
        where: { originId_destinationId: { originId: edge.destinationId, destinationId: edge.originId } }
      });
      if (!exists) {
        await prisma.transitRoute.create({
          data: {
            id: `${edge.destinationId}_to_${edge.originId}`,
            originId: edge.destinationId,
            destinationId: edge.originId,
            travelMode: edge.travelMode,
            durationHours: edge.durationHours,
            distanceKm: edge.distanceKm,
            fatigueCost: edge.fatigueCost,
            seasonal: edge.seasonal,
            openMonths: edge.openMonths,
            isFlight: edge.isFlight,
            notes: edge.notes
          }
        });
        created++;
      }
    }
  }
  
  console.log(`Created ${created} reverse edges to enforce symmetry.`);

  // 2. Fix Orphans (Manual Edges)
  console.log('Fixing isolated orphaned nodes...');
  const manualConnections = [
    { o: 'hyderabad', d: 'mumbai', dist: 710, dur: 14, fatigue: 6 },
    { o: 'hyderabad', d: 'hampi', dist: 380, dur: 8, fatigue: 4 },
    { o: 'lakshadweep', d: 'kochi', dist: 400, dur: 1.5, fatigue: 2, flight: true },
    // Re-connect Gujarat (lost Ahmedabad)
    { o: 'rann-of-kutch', d: 'gir', dist: 380, dur: 8, fatigue: 5 },
    { o: 'gir', d: 'dwarka_somnath', dist: 230, dur: 5, fatigue: 4 },
    { o: 'gir', d: 'mumbai', dist: 800, dur: 2, fatigue: 2, flight: true },
    // Re-connect Odisha (lost Bhubaneswar)
    { o: 'puri', d: 'konark', dist: 35, dur: 1, fatigue: 1 },
    { o: 'puri', d: 'kolkata', dist: 500, dur: 1.5, fatigue: 2, flight: true },
  ];

  for (const conn of manualConnections) {
    // A -> B
    const aToB = await prisma.transitRoute.findUnique({ where: { originId_destinationId: { originId: conn.o, destinationId: conn.d } } });
    if (!aToB) {
      await prisma.transitRoute.create({
        data: {
          id: `${conn.o}_to_${conn.d}`,
          originId: conn.o, destinationId: conn.d,
          travelMode: conn.flight ? 'Flight' : 'Road',
          durationHours: conn.dur, distanceKm: conn.dist, fatigueCost: conn.fatigue,
          seasonal: false, openMonths: [1,2,3,4,5,6,7,8,9,10,11,12], isFlight: conn.flight || false
        }
      });
    }

    // B -> A
    const bToA = await prisma.transitRoute.findUnique({ where: { originId_destinationId: { originId: conn.d, destinationId: conn.o } } });
    if (!bToA) {
      await prisma.transitRoute.create({
        data: {
          id: `${conn.d}_to_${conn.o}`,
          originId: conn.d, destinationId: conn.o,
          travelMode: conn.flight ? 'Flight' : 'Road',
          durationHours: conn.dur, distanceKm: conn.dist, fatigueCost: conn.fatigue,
          seasonal: false, openMonths: [1,2,3,4,5,6,7,8,9,10,11,12], isFlight: conn.flight || false
        }
      });
    }
  }

  console.log('Fixed orphans successfully.');
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
