import 'dotenv/config';
import prisma from './lib/prisma';

async function main() {
  const landscapes = await prisma.landscape.findMany();
  console.log("Landscapes:", landscapes.map((l: any) => l.name));
  
  // ensure Mountains exists
  const mountain = await prisma.landscape.upsert({
    where: { name: 'Mountains' },
    update: {},
    create: { id: 'l_mountains', name: 'Mountains', description: 'Mountains', updatedAt: new Date() }
  });
  
  // ensure Cold Desert exists
  const coldDesert = await prisma.landscape.upsert({
    where: { name: 'Cold Desert' },
    update: {},
    create: { id: 'l_cold_desert', name: 'Cold Desert', description: 'Cold Desert', updatedAt: new Date() }
  });

  // connect
  for (const id of ['Manali', 'Leh-Ladakh', 'Spiti Valley']) {
    await prisma.destination.update({
      where: { id },
      data: {
        Landscape: {
          connect: [{ id: mountain.id }, { id: coldDesert.id }]
        }
      }
    });
    console.log(`Updated ${id}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
