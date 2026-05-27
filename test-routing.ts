import { validateExtremeDistance } from './lib/routingEngine';
import prisma from './lib/prisma';

async function main() {
  const dests = await prisma.destination.findMany({
    where: { name: { in: ['Hampi', 'Spiti Valley'] } },
    select: { id: true }
  });
  console.log('IDs:', dests.map(d => d.id));
  const res = await validateExtremeDistance(dests.map(d => d.id), 5);
  console.log('Result:', res);
}

main().catch(console.error);
