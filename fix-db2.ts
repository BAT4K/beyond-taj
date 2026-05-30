import prisma from './lib/prisma';

async function main() {
  const dests = await prisma.destination.findMany();
  
  // Find duplicates: destinations with the same name as our seeded ones but different IDs
  const seededNames = ['Delhi', 'Manali', 'Leh-Ladakh', 'Spiti Valley', 'Jaipur', 'Jodhpur', 'Udaipur', 'Jaisalmer'];
  
  for (const d of dests) {
    if (seededNames.includes(d.name) && d.id !== d.name) {
      console.log(`Cleaning up duplicate: ${d.name} with ID: ${d.id}`);
      
      // Delete any transit routes where this duplicate is the origin or destination
      await prisma.transitRoute.deleteMany({
        where: {
          OR: [
            { originId: d.id },
            { destinationId: d.id }
          ]
        }
      });
      
      // Now delete the destination itself
      await prisma.destination.delete({ where: { id: d.id } });
      console.log(`Deleted duplicate: ${d.name}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
