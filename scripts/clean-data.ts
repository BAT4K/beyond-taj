import 'dotenv/config';
import fs from 'fs';
import prisma from '../lib/prisma';

const CENTRAL_IDS = ['kanha', 'bandhavgarh', 'pench', 'khajuraho', 'orchha', 'mandu'];
const WEST_IDS = ['tadoba', 'lonar', 'gir'];
const NORTHEAST_IDS = [
  'tawang', 'ziro-valley', 'kaziranga', 'shillong', 'cherrapunji',
  'mawlynnong', 'dawki', 'majuli', 'nagaland_hornbill', 'unakoti',
  'aizawl_mizoram', 'gangtok', 'pelling-yuksom', 'yumthang-valley'
];

async function main() {
  const dataPath = './prisma/data.json';
  const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Deduplication
  const uniqueData = [];
  const seenIds = new Set();
  
  for (const dest of rawData) {
    if (!seenIds.has(dest.id)) {
      uniqueData.push(dest);
      seenIds.add(dest.id);
    }
  }

  // Region Remapping and Validation
  for (const dest of uniqueData) {
    // Validation Flagging
    if (dest.latitude === null || dest.latitude === undefined || dest.latitude === 0 ||
        dest.longitude === null || dest.longitude === undefined || dest.longitude === 0) {
      console.error(`[WARNING] Destination ${dest.id} has missing or zero coordinates.`);
    }

    if (!dest.shortPitch || dest.shortPitch.length < 10) {
      console.error(`[WARNING] Destination ${dest.id} has an invalid shortPitch (< 10 chars).`);
    }

    const highlights = Array.isArray(dest.topHighlights) ? dest.topHighlights : [];
    if (highlights.length < 3) {
      console.error(`[WARNING] Destination ${dest.id} has fewer than 3 topHighlights.`);
    }

    // Remapping
    if (CENTRAL_IDS.includes(dest.id)) {
      dest.region = 'Central';
    } else if (WEST_IDS.includes(dest.id)) {
      dest.region = 'West';
    } else if (NORTHEAST_IDS.includes(dest.id)) {
      dest.region = 'Northeast';
    }
  }

  // Overwrite prisma/data.json
  fs.writeFileSync(dataPath, JSON.stringify(uniqueData, null, 2));
  console.log(`Saved ${uniqueData.length} deduplicated and remapped destinations to data.json`);

  // Sync to database
  console.log('Syncing updated regions to Postgres...');
  for (const dest of uniqueData) {
    await prisma.destination.update({
      where: { id: dest.id },
      data: { region: dest.region }
    });
  }
  
  console.log('Database sync complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
