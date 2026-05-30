import 'dotenv/config';
import prisma from './lib/prisma';

async function main() {
  const dests = await prisma.destination.findMany({ select: { id: true, name: true } });
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  const toDelete = dests.filter(d => uuidRegex.test(d.id));
  console.log(`Found ${toDelete.length} UUID destinations to delete.`);
  
  if (toDelete.length > 0) {
    for (const d of toDelete) {
      // First delete transit routes connected to this destination
      await prisma.transitRoute.deleteMany({
        where: {
          OR: [
            { originId: d.id },
            { destinationId: d.id }
          ]
        }
      });
      // Then delete destination
      await prisma.destination.delete({ where: { id: d.id } });
      console.log(`Deleted duplicate: ${d.name} (${d.id})`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
