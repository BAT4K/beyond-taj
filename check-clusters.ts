import 'dotenv/config';
import prisma from './lib/prisma';
async function main() {
  const dests = await prisma.destination.findMany({ select: { name: true, clusterId: true, openMonths: true } });
  console.log(dests);
}
main();
