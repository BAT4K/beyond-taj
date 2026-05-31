import 'dotenv/config';
import prisma from './lib/prisma';
import { generateBespokeRoute } from './utils/curationEngine';

async function main() {
  const destinations = await prisma.destination.findMany();
  const transitRoutes = await prisma.transitRoute.findMany();

  const scenarios = [
    { name: "14 days in July (Monsoon) - Beaches", pref: { travelMonth: 'July', selectedLandscapes: ['Beaches'], days: 14 } },
    { name: "5 days in January (Winter) - Mountains", pref: { travelMonth: 'January', selectedLandscapes: ['Mountains'], days: 5 } },
    { name: "21 days in November (Peak) - Royal Cities", pref: { travelMonth: 'November', selectedLandscapes: ['Royal Cities'], days: 21 } },
    { name: "8 days in May (Summer Heat) - Jungles", pref: { travelMonth: 'May', selectedLandscapes: ['Jungles'], days: 8 } }
  ];

  for (const s of scenarios) {
    console.log(`\n--- Scenario: ${s.name} ---`);
    const res = generateBespokeRoute(s.pref, destinations as any, transitRoutes);
    const names = res.destinationIds.map(id => destinations.find(d => d.id === id)?.name);
    console.log(`Itinerary: ${names.join(' -> ')}`);
    console.log(`Rationale: ${res.rationale}`);
  }
}
main();
