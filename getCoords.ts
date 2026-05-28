import prisma from './lib/prisma';
async function main() {
  const dests = await prisma.destination.findMany();
  const map: Record<string, any> = {};
  for (const d of dests) {
    map[d.id] = { lat: d.latitude, lng: d.longitude };
  }
  console.log(JSON.stringify(map, null, 2));
}
main();
