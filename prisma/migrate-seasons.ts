import 'dotenv/config';
import prisma from '../lib/prisma';

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

function getTieredMonths(openMonths: number[]) {
  const allMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  
  // Peak months are the center of the open window
  const peakMonths = openMonths; 
  
  // Shoulder months: 1 month before and after peak
  const shoulderMonths: number[] = [];
  if (peakMonths.length > 0) {
     const first = peakMonths[0];
     const last = peakMonths[peakMonths.length - 1];
     const before = first === 1 ? 12 : first - 1;
     const after = last === 12 ? 1 : last + 1;
     shoulderMonths.push(before, after);
  }

  // Avoid months are everything else that isn't closed (for mock data, we'll just split them)
  const remaining = allMonths.filter(m => !peakMonths.includes(m) && !shoulderMonths.includes(m));
  const avoidMonths = remaining.slice(0, Math.floor(remaining.length / 2));
  const closedMonths = remaining.slice(Math.floor(remaining.length / 2));

  return { peakMonths, shoulderMonths, avoidMonths, closedMonths };
}

async function main() {
  const destinations = await prisma.destination.findMany();
  let count = 0;
  for (const d of destinations) {
    const openMonths = parseSeason(d.idealSeason);
    const tiers = getTieredMonths(openMonths);
    
    await prisma.destination.update({
      where: { id: d.id },
      data: {
        peakMonths: tiers.peakMonths,
        shoulderMonths: tiers.shoulderMonths,
        avoidMonths: tiers.avoidMonths,
        closedMonths: tiers.closedMonths
      }
    });
    count++;
    console.log(`Migrated ${d.name}`);
  }
  console.log(`Successfully migrated ${count} destinations.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
