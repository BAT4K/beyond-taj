import 'dotenv/config';
import prisma from './lib/prisma';
async function main() {
  const edges = await prisma.transitRoute.findMany({ 
    where: { 
      OR: [
        { originId: 'Meghalaya' },
        { originId: 'Darjeeling' }
      ]
    } 
  });
  console.log(edges);
}
main();
