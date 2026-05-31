import 'dotenv/config';
import prisma from '../lib/prisma';
import fs from 'fs';

function normalizeId(id: string): string {
  // Convert spaces to hyphens, lowercase it to match the user's topographical filter list
  // However, we still use the EXACT original id for Prisma to maintain referential integrity.
  return id.toLowerCase().trim().replace(/[\s&]+/g, '-').replace(/-+/g, '-');
}

function isRouteValid(rawOriginId: string, rawDestinationId: string): boolean {
  // The user prompt used specific ID formats like "spiti-valley"
  // So we normalize the raw IDs specifically for these checks.
  // Wait, if the user manually used underscores (e.g. "dwarka_somnath"), 
  // we'll just check against the lowercase version of the exact ID in the DB.
  
  // It's safer to just check both the raw lowercase and the hyphenated version
  const oId = rawOriginId.toLowerCase();
  const dId = rawDestinationId.toLowerCase();
  
  const oNorm = normalizeId(rawOriginId);
  const dNorm = normalizeId(rawDestinationId);

  const check = (list1: string[], list2: string[]) => {
    const inList1 = (id1: string, id2: string) => list1.includes(id1) || list1.includes(id2);
    const inList2 = (id1: string, id2: string) => list2.includes(id1) || list2.includes(id2);
    
    return (inList1(oId, oNorm) && inList2(dId, dNorm)) || (inList1(dId, dNorm) && inList2(oId, oNorm));
  };

  // Water Trap
  if (check(['rann-of-kutch', 'kutch'], ['dwarka_somnath', 'dwarka-somnath'])) return false;

  // The Pin Parvati Wall
  if (check(
    ['spiti-valley'], 
    ['kasol-kheerganga', 'tosh-khajjiar', 'jibhi-tirthan', 'dharamshala-mcleodganj', 'dalhousie', 'rishikesh', 'haridwar', 'auli', 'chopta-tungnath', 'valley-of-flowers']
  )) return false;

  // Trans-Himalayan Divide
  if (check(
    ['pangong-tso', 'zanskar-valley', 'nubra-valley', 'leh_ladakh_circuit', 'leh-ladakh-circuit'], 
    ['manali', 'spiti-valley', 'spiti_circuit', 'spiti-circuit', 'tosh-khajjiar', 'jibhi-tirthan', 'kasol-kheerganga', 'dharamshala-mcleodganj', 'dalhousie', 'bir-billing', 'kinnaur-valley', 'amritsar']
  )) return false;

  // Northeast Plateau Divide
  if (check(
    ['meghalaya', 'shillong', 'cherrapunji', 'mawlynnong', 'dawki'], 
    ['tawang', 'ziro-valley', 'majuli']
  )) return false;

  // Kashmir Mountain Barriers
  if (check(
    ['gulmarg', 'sonamarg', 'pahalgam', 'kashmir-valley', 'kashmir_circuit', 'kashmir-circuit'], 
    ['zanskar-valley', 'nubra-valley', 'dharamshala-mcleodganj', 'manali']
  )) return false;

  return true;
}

async function main() {
  const auditLogPath = 'generated-edges-audit.json';
  if (!fs.existsSync(auditLogPath)) {
    console.error(`Audit log not found at ${auditLogPath}`);
    return;
  }

  const rawEdges = JSON.parse(fs.readFileSync(auditLogPath, 'utf8'));
  console.log(`Read ${rawEdges.length} original edges from audit log.`);

  // Load valid IDs from the DB
  const destinations = await prisma.destination.findMany({ select: { id: true } });
  const validIds = new Set(destinations.map(d => d.id));

  let skippedFilter = 0;
  let skippedInvalidId = 0;
  const validEdges: any[] = [];

  for (const edge of rawEdges) {
    // The DB IDs from ingest-pdf.ts are the EXACT ids from prisma/data.json
    // but occasionally the audit log might have used a different case depending on how it was generated.
    const originId = edge.originId.toLowerCase();
    const destinationId = edge.destinationId.toLowerCase();

    if (!validIds.has(originId) || !validIds.has(destinationId)) {
      skippedInvalidId++;
      continue;
    }

    if (!isRouteValid(originId, destinationId)) {
      skippedFilter++;
      continue;
    }

    const duration = edge.distanceKm / 40.0; // Estimate: 40 km/h avg speed
    
    validEdges.push({
      id: `${originId}_to_${destinationId}`,
      originId,
      destinationId,
      travelMode: 'Road',
      durationHours: parseFloat(duration.toFixed(1)),
      distanceKm: parseFloat(edge.distanceKm.toFixed(1)),
      fatigueCost: edge.fatigueCost,
      seasonal: false,
      openMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      isFlight: false,
    });
  }

  console.log(`Skipped ${skippedInvalidId} edges due to missing IDs in DB.`);
  console.log(`Skipped ${skippedFilter} edges due to Topographical Filter.`);
  console.log(`Ready to insert ${validEdges.length} validated edges.`);

  // Insert in batches to avoid overwhelming the DB
  const BATCH_SIZE = 500;
  let insertedCount = 0;

  for (let i = 0; i < validEdges.length; i += BATCH_SIZE) {
    const batch = validEdges.slice(i, i + BATCH_SIZE);
    
    const result = await prisma.transitRoute.createMany({
      data: batch,
      skipDuplicates: true,
    });
    
    insertedCount += result.count;
  }

  console.log(`Successfully inserted ${insertedCount} TransitRoute edges!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
