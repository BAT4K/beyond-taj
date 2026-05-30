import prisma from './lib/prisma';
async function main() {
  const dests = await prisma.destination.findMany({
    select: { id: true, name: true, vibeTags: true, closedMonths: true, avoidMonths: true }
  });
  console.log(dests.filter(d => ['jaipur', 'leh', 'south-goa', 'jodhpur'].includes(d.id)));
}
main();
