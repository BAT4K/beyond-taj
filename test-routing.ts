import prisma from './lib/prisma';
import { evaluateTripFeasibility } from './lib/routingEngine';

async function main() {
  const result = await evaluateTripFeasibility(
    ['Delhi', 'Leh-Ladakh', 'Spiti Valley'],
    5,
    ['March'],
    'balanced',
    'International',
    'Delhi'
  );
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
