const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const landscapes = await prisma.landscape.findMany();
  console.log("Landscapes:", landscapes.map(l => l.name));
  
  // ensure Mountains exists
  const mountain = await prisma.landscape.upsert({
    where: { name: 'Mountains' },
    update: {},
    create: { id: 'l_mountains', name: 'Mountains', description: 'Mountains' }
  });

  // connect
  for (const id of ['Manali', 'Leh-Ladakh', 'Spiti Valley']) {
    await prisma.destination.update({
      where: { id },
      data: {
        Landscape: {
          connect: [{ id: mountain.id }]
        }
      }
    });
    console.log(`Updated ${id}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
