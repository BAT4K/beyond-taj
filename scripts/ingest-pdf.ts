// @ts-nocheck
import 'dotenv/config';
import fs from 'fs';
import prisma from '../lib/prisma';
import { DestinationSchema } from '../shared/travel-rules';

// Haversine formula
function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c;
}

async function main() {
  console.log("Reading prisma/data.json...");
  const rawData = fs.readFileSync('prisma/data.json', 'utf8');
  const destinations = JSON.parse(rawData);

  console.log(`Found ${destinations.length} destinations. Starting validation and insertion...`);
  
  let successCount = 0;
  let skipCount = 0;

  // 1. Validate & Insert (Nodes)
  for (const item of destinations) {
    const parsed = DestinationSchema.safeParse(item);
    if (!parsed.success) {
      console.error(`\n[SKIP] Validation failed for destination: ${item.id || item.name || 'Unknown'}`);
      console.error(JSON.stringify(parsed.error.issues, null, 2));
      skipCount++;
      continue;
    }

    const dest = parsed.data;

    try {
      await prisma.destination.upsert({
        where: { id: dest.id },
        update: {
          name: dest.name,
          description: dest.description || "",
          shortPitch: dest.shortPitch,
          topHighlights: dest.topHighlights,
          region: dest.region,
          vibeTags: dest.vibeTags,
          idealSeason: dest.idealSeason || "",
          peakMonths: dest.peakMonths,
          shoulderMonths: dest.shoulderMonths,
          avoidMonths: dest.avoidMonths,
          closedMonths: dest.closedMonths,
          minRequiredDays: dest.minRequiredDays || 2,
          latitude: dest.latitude || 0,
          longitude: dest.longitude || 0,
          requiresAcclimatization: dest.requiresAcclimatization || false,
          isHub: dest.isHub || false,
          updatedAt: new Date(),
          Landscape: {
            connectOrCreate: (dest.landscapes || []).map((l: string) => ({
              where: { name: l },
              create: { id: l.toLowerCase().replace(/ /g, '-'), name: l, updatedAt: new Date() }
            }))
          }
        },
        create: {
          id: dest.id,
          name: dest.name,
          description: dest.description || "",
          shortPitch: dest.shortPitch,
          topHighlights: dest.topHighlights,
          region: dest.region,
          vibeTags: dest.vibeTags,
          idealSeason: dest.idealSeason || "",
          peakMonths: dest.peakMonths,
          shoulderMonths: dest.shoulderMonths,
          avoidMonths: dest.avoidMonths,
          closedMonths: dest.closedMonths,
          minRequiredDays: dest.minRequiredDays || 2,
          latitude: dest.latitude || 0,
          longitude: dest.longitude || 0,
          requiresAcclimatization: dest.requiresAcclimatization || false,
          isHub: dest.isHub || false,
          updatedAt: new Date(),
          Landscape: {
            connectOrCreate: (dest.landscapes || []).map((l: string) => ({
              where: { name: l },
              create: { id: l.toLowerCase().replace(/ /g, '-'), name: l, updatedAt: new Date() }
            }))
          }
        }
      });
      successCount++;
    } catch (dbError) {
      console.error(`\n[DB ERROR] Failed to upsert ${dest.id}:`, dbError);
      skipCount++;
    }
  }

  console.log(`\nInsertion complete: ${successCount} inserted, ${skipCount} skipped.`);

  // 2. Automated Edge Generation (Graph Math)
  console.log("\nGenerating proximity-based TransitRoute edges...");
  const allDests = await prisma.destination.findMany();
  const auditLog = [];

  for (let i = 0; i < allDests.length; i++) {
    for (let j = i + 1; j < allDests.length; j++) {
      const d1 = allDests[i];
      const d2 = allDests[j];

      if (d1.latitude && d1.longitude && d2.latitude && d2.longitude) {
        const dist = getHaversineDistance(d1.latitude, d1.longitude, d2.latitude, d2.longitude);

        if (dist > 0 && dist <= 300) {
          // Base cost of 1 + 1 point for every 50km
          const fatigueCost = 1 + Math.floor(dist / 50);

          auditLog.push({
            originId: d1.id,
            originName: d1.name,
            destinationId: d2.id,
            destinationName: d2.name,
            distanceKm: Math.round(dist * 10) / 10,
            fatigueCost
          });
        }
      }
    }
  }

  // 3. Safety Constraint (Audit Log)
  const auditFilePath = 'generated-edges-audit.json';
  fs.writeFileSync(auditFilePath, JSON.stringify(auditLog, null, 2));
  console.log(`\n[CRITICAL SAFETY] Successfully bypassed DB insertion for edges.`);
  console.log(`Wrote ${auditLog.length} potential transit edges to ${auditFilePath} for human review.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
