import 'dotenv/config';
import prisma from './lib/prisma';

async function main() {
  const landscapes = await prisma.landscape.findMany();
  const lsMap: Record<string, string> = {};
  for (const l of landscapes) {
    lsMap[l.name] = l.id;
  }
  
  const ensureLandscape = async (name: string) => {
    if (lsMap[name]) return lsMap[name];
    const l = await prisma.landscape.upsert({
      where: { name },
      update: {},
      create: { id: `l_${name.toLowerCase().replace(/\s+/g, '_')}`, name, description: name, updatedAt: new Date() }
    });
    lsMap[name] = l.id;
    return l.id;
  };

  const map = {
    'Delhi': ['Modern Cities', 'Royal Cities'],
    'Jaipur': ['Royal Cities'],
    'Jodhpur': ['Royal Cities', 'Desert'],
    'Udaipur': ['Royal Cities'],
    'Jaisalmer': ['Desert', 'Royal Cities']
  };

  for (const [id, lNames] of Object.entries(map)) {
    const lIds = [];
    for (const name of lNames) {
      lIds.push(await ensureLandscape(name));
    }
    await prisma.destination.update({
      where: { id },
      data: {
        Landscape: {
          connect: lIds.map(lid => ({ id: lid }))
        }
      }
    });
    console.log(`Updated ${id}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
