import fs from 'fs';
import path from 'path';
import prisma from '../lib/prisma';

const dbPath = path.join(process.cwd(), 'prisma', 'data.json');

async function main() {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  
  const orphans = data.filter((d: any) => !d.imageUrl);
  const orphanIds = orphans.map((d: any) => d.id);
  
  if (orphanIds.length === 0) {
    console.log("No orphans found. Everything is clean.");
    return;
  }
  
  console.log(`Found ${orphanIds.length} orphans. Beginning purge...`);
  
  // Step 1: Wipe the edges first to prevent Foreign Key constraints
  const deletedRoutes = await prisma.transitRoute.deleteMany({
    where: {
      OR: [
        { originId: { in: orphanIds } },
        { destinationId: { in: orphanIds } }
      ]
    }
  });
  console.log(`Step 1: Deleted ${deletedRoutes.count} associated transit routes.`);
  
  // Step 2: Wipe the destination nodes
  const deletedDests = await prisma.destination.deleteMany({
    where: {
      id: { in: orphanIds }
    }
  });
  console.log(`Step 2: Deleted ${deletedDests.count} orphaned destinations from Postgres.`);
  
  // Step 3: Filter the JSON file and overwrite
  const filteredData = data.filter((d: any) => !!d.imageUrl);
  fs.writeFileSync(dbPath, JSON.stringify(filteredData, null, 2));
  console.log(`Step 3: Saved prisma/data.json without orphans. Remaining nodes: ${filteredData.length}`);
}

main()
  .catch(e => {
    console.error("Purge failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
