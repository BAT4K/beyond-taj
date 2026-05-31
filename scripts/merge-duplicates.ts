import 'dotenv/config';
import prisma from '../lib/prisma';
import fs from 'fs';

const ID_MAPPINGS: Record<string, string> = {
  'Darjeeling': 'darjeeling',
  'Spiti Valley': 'spiti-valley',
  'Mysore': 'mysore',
  'Gokarna': 'gokarna',
  'Varkala': 'varkala',
  'Meghalaya': 'shillong',
  'Ziro Valley': 'ziro-valley',
  'Kaziranga': 'kaziranga',
  'Havelock Island': 'andaman-islands',
  'Udaipur': 'udaipur',
  'Jodhpur': 'jodhpur',
  'Leh-Ladakh': 'leh-ladakh',
  'Manali': 'manali',
  'Munnar': 'munnar',
  'Hampi': 'hampi',
  'Mumbai': 'mumbai',
  'Alleppey': 'alleppey',
  'Kabini': 'nagarhole_bandipur',
  'Bundi': 'bundi',
  'South Goa': 'south-goa',
  'Ranthambore': 'ranthambore',
  'Delhi': 'delhi',
  'Gulmarg': 'gulmarg',
  'Tirthan Valley': 'jibhi-tirthan',
  'Varanasi': 'varanasi',
  'Rishikesh': 'rishikesh',
  'Jaisalmer': 'jaisalmer',
  'Jaipur': 'jaipur',
  // The two unique items that need PK conversion:
  'Jawai': 'jawai',
  'Munroe Island': 'munroe-island'
};

const LEGACY_IDS = Object.keys(ID_MAPPINGS);
const UNIQUE_TO_CREATE = ['Jawai', 'Munroe Island'];

async function main() {
  console.log('Starting Duplicate Merge Process...');

  // 1. Create the lowercase versions of the unique items
  for (const uniqueId of UNIQUE_TO_CREATE) {
    const legacyRecord = await prisma.destination.findUnique({
      where: { id: uniqueId }
    });

    if (legacyRecord) {
      const newId = ID_MAPPINGS[uniqueId];
      // Check if it already exists to avoid creation error
      const existing = await prisma.destination.findUnique({ where: { id: newId } });
      
      if (!existing) {
        console.log(`Creating new lowercase record for ${uniqueId} -> ${newId}`);
        await prisma.destination.create({
          data: {
            id: newId,
            name: legacyRecord.name,
            description: legacyRecord.description || "",
            shortPitch: legacyRecord.shortPitch,
            topHighlights: legacyRecord.topHighlights,
            region: legacyRecord.region,
            vibeTags: legacyRecord.vibeTags,
            idealSeason: legacyRecord.idealSeason,
            peakMonths: legacyRecord.peakMonths,
            shoulderMonths: legacyRecord.shoulderMonths,
            avoidMonths: legacyRecord.avoidMonths,
            closedMonths: legacyRecord.closedMonths,
            minRequiredDays: legacyRecord.minRequiredDays,
            latitude: legacyRecord.latitude,
            longitude: legacyRecord.longitude,
            clusterId: legacyRecord.clusterId,
            compatibleClusters: legacyRecord.compatibleClusters,
            isHub: legacyRecord.isHub,
            requiresAcclimatization: legacyRecord.requiresAcclimatization,
            updatedAt: new Date(),
            createdAt: legacyRecord.createdAt || new Date()
          }
        });
      }
    }
  }

  // 2. Map Edges
  const allEdges = await prisma.transitRoute.findMany();
  
  // Find all edges that involve a legacy ID
  const edgesToProcess = allEdges.filter(e => 
    LEGACY_IDS.includes(e.originId) || LEGACY_IDS.includes(e.destinationId)
  );

  console.log(`Found ${edgesToProcess.length} edges attached to legacy nodes.`);

  for (const edge of edgesToProcess) {
    // Calculate new mapped IDs
    const newOrigin = ID_MAPPINGS[edge.originId] || edge.originId;
    const newDest = ID_MAPPINGS[edge.destinationId] || edge.destinationId;

    // Self-loop prevention
    if (newOrigin === newDest) {
      console.log(`Self-loop detected (${newOrigin} -> ${newDest}). Deleting edge ${edge.originId} -> ${edge.destinationId}`);
      await prisma.transitRoute.delete({
        where: {
          originId_destinationId: {
            originId: edge.originId,
            destinationId: edge.destinationId
          }
        }
      });
      continue;
    }

    // Check if an edge already exists at the target location (both directions)
    const existingTargetEdge = await prisma.transitRoute.findFirst({
      where: {
        OR: [
          { originId: newOrigin, destinationId: newDest },
          { originId: newDest, destinationId: newOrigin }
        ]
      }
    });

    // If target edge exists, AND it's not THIS exact same edge (in case it wasn't mapped)
    // Wait, since newOrigin/newDest involves at least one change, it's definitely a different edge key
    if (existingTargetEdge) {
      console.log(`Collision! Route ${newOrigin} <-> ${newDest} already exists. Deleting legacy edge ${edge.originId} -> ${edge.destinationId}`);
      await prisma.transitRoute.delete({
        where: {
          originId_destinationId: {
            originId: edge.originId,
            destinationId: edge.destinationId
          }
        }
      });
    } else {
      console.log(`Updating edge ${edge.originId} -> ${edge.destinationId} to ${newOrigin} -> ${newDest}`);
      // Update edge
      await prisma.transitRoute.update({
        where: {
          originId_destinationId: {
            originId: edge.originId,
            destinationId: edge.destinationId
          }
        },
        data: {
          originId: newOrigin,
          destinationId: newDest
        }
      });
    }
  }

  // 3. Purge the 30 Legacy Destinations
  for (const legacyId of LEGACY_IDS) {
    try {
      await prisma.destination.delete({
        where: { id: legacyId }
      });
      console.log(`Deleted legacy destination: ${legacyId}`);
    } catch (e) {
      // Might have already been deleted or missing
      console.log(`Could not delete ${legacyId} (maybe already deleted)`);
    }
  }

  // 4. Update data.json
  const dataPath = './prisma/data.json';
  let dataJson = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  
  // Filter out the legacy IDs
  dataJson = dataJson.filter((d: any) => !LEGACY_IDS.includes(d.id));
  
  // Make sure Jawai and Munroe Island lowercase exist in dataJson
  for (const uid of UNIQUE_TO_CREATE) {
    const newId = ID_MAPPINGS[uid];
    if (!dataJson.find((d: any) => d.id === newId)) {
      // We will just fetch it from DB and push it
      const dbRec = await prisma.destination.findUnique({ where: { id: newId } });
      if (dbRec) {
        dataJson.push(dbRec);
      }
    }
  }

  fs.writeFileSync(dataPath, JSON.stringify(dataJson, null, 2));
  console.log(`Cleaned data.json. Remaining destinations: ${dataJson.length}`);

}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
