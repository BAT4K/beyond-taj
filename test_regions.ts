import 'dotenv/config';
import prisma from './lib/prisma';
async function main() {
  const dests = await prisma.destination.findMany({ select: { name: true, region: true } });
  console.log(dests.filter(d => d.name.includes("Darjeeling") || d.name.includes("Meghalaya")));
}
main();
