import 'dotenv/config';
import prisma from './lib/prisma';

async function main() {
  const dests = await prisma.destination.findMany({
    include: { Landscape: true }
  });
  
  const missing = dests.filter(d => d.Landscape.length === 0);
  console.log(`Total destinations: ${dests.length}`);
  console.log(`Destinations missing landscapes: ${missing.length}`);
  
  if (missing.length > 0) {
    console.log("Missing landscapes for:");
    missing.forEach(m => console.log(`- ${m.id} (${m.name})`));
  } else {
    console.log("All destinations have at least one landscape.");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
