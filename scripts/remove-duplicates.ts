// @ts-nocheck
import 'dotenv/config';
import prisma from '../lib/prisma';

const targetIds = [
  'leh_ladakh_circuit',
  'kashmir_circuit',
  'spiti_circuit',
  'zanskar_circuit',
  'rajasthan_circuit',
  'thar-desert-circuit',
  'konkan_coast_circuit',
  'sundarbans_region',
  'kutch',
  'golden_triangle',
  'char-dham-uttarakhand'
];

async function main() {
  console.log(`Targeting ${targetIds.length} macro-circuit duplicates for deletion.`);

  try {
    // Step A: Explicitly delete related TransitRoutes FIRST to avoid FK constraints
    const deletedEdges = await prisma.transitRoute.deleteMany({
      where: {
        OR: [
          { originId: { in: targetIds } },
          { destinationId: { in: targetIds } }
        ]
      }
    });
    console.log(`[Step A] Successfully deleted ${deletedEdges.count} related TransitRoute edges.`);

    // Step B: Delete the Destination records
    const deletedDestinations = await prisma.destination.deleteMany({
      where: {
        id: { in: targetIds }
      }
    });
    console.log(`[Step B] Successfully deleted ${deletedDestinations.count} Destination records.`);
    
  } catch (error) {
    console.error('Error during deletion:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
