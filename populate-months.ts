import 'dotenv/config';
import prisma from './lib/prisma';

const MONTH_MAP: Record<string, number> = {
  "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6,
  "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12
};

function parseSeason(seasonStr: string): number[] {
  const parts = seasonStr.split(/[-–]/).map(s => s.trim());
  if (parts.length !== 2) return [];
  const start = MONTH_MAP[parts[0]];
  const end = MONTH_MAP[parts[1]];
  if (!start || !end) return [];
  
  const months: number[] = [];
  if (start <= end) {
    for (let i = start; i <= end; i++) months.push(i);
  } else {
    for (let i = start; i <= 12; i++) months.push(i);
    for (let i = 1; i <= end; i++) months.push(i);
  }
  return months;
}

async function main() {
  const destinations = await prisma.destination.findMany();
  let count = 0;
  for (const d of destinations) {
    if (d.idealSeason) {
      const openMonths = parseSeason(d.idealSeason);
      if (openMonths.length > 0) {
        await prisma.destination.update({
          where: { id: d.id },
          data: { openMonths }
        });
        count++;
        console.log(`Updated ${d.name} with months:`, openMonths);
      }
    }
  }
  console.log(`Successfully updated ${count} destinations.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
