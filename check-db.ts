import 'dotenv/config';
import prisma from './lib/prisma';
async function main() {
  const dests = await prisma.destination.findMany({ select: { name: true, openMonths: true } });
  console.log(dests.filter(d => d.name === 'Udaipur' || d.name === 'Leh-Ladakh'));
}
main();
