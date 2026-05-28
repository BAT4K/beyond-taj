const prisma = require('./lib/prisma').default;
async function main() {
  const dests = await prisma.destination.findMany();
  const map = {};
  for (const d of dests) {
    map[d.id] = { lat: d.latitude, lng: d.longitude };
  }
  console.log(map);
}
main();
