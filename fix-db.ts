import prisma from './lib/prisma';

async function main() {
  const dests = await prisma.destination.findMany();
  console.log('Total destinations:', dests.length);
  
  // Find duplicates: destinations with the same name as our seeded ones but different IDs
  const seededNames = ['Delhi', 'Manali', 'Leh-Ladakh', 'Spiti Valley', 'Jaipur', 'Jodhpur', 'Udaipur', 'Jaisalmer'];
  
  let deletedCount = 0;
  for (const d of dests) {
    if (seededNames.includes(d.name) && d.id !== d.name) {
      console.log(`Deleting duplicate: ${d.name} with ID: ${d.id}`);
      await prisma.destination.delete({ where: { id: d.id } });
      deletedCount++;
    }
  }
  
  console.log(`Deleted ${deletedCount} duplicate destinations.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
