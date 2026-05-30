const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const dests = await prisma.destination.findMany({ select: { id: true, name: true } });
  console.log(dests);
}
main().finally(() => prisma.$disconnect());
