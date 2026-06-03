import 'dotenv/config';
import prisma from '../lib/prisma';
import { generateBespokeRoute } from '../lib/curationEngine';

async function main() {
  console.log("Loading graph...");
  const destinations = await prisma.destination.findMany({ include: { Landscape: true } });
  const edges = await prisma.transitRoute.findMany();

  const formattedDestinations = destinations.map(d => ({
    ...d,
    landscapes: d.Landscape ? d.Landscape.map(l => l.name) : []
  }));

  const basePreferences = {
    travelMonths: ["January"],
    selectedLandscapes: ["Mountains", "Royal Cities"],
    selectedVibes: ["Luxury", "Regal", "Iconic"], // "Luxury Explorer" style
    days: 10
  };

  console.log("\n--- Testing Bespoke Output by Companion Type ---\n");
  console.log("Base Request: 10 Days in January, Mountains & Royal Cities, Luxury Vibe\n");

  const companionsToTest = [
    "Solo Expedition",
    "Family Vacation",
    "Romantic Getaway",
    "Solo Female Journey"
  ];

  for (const companion of companionsToTest) {
    const result = generateBespokeRoute({
      ...basePreferences,
      companions: companion
    }, formattedDestinations as any, edges);

    const curatedNames = result.destinationIds.map((id: string) => {
      const dest = destinations.find(d => d.id === id);
      return dest?.name || id;
    });

    console.log(`[ ${companion} ]`);
    console.log(`Curated Route: ${curatedNames.join(" -> ")}`);
    console.log(`Rationale: ${result.rationale}`);
    console.log("--------------------------------------------------");
  }
}

main().catch(console.error);
