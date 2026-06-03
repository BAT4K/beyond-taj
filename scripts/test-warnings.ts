// @ts-nocheck
import 'dotenv/config';
import { evaluateTripFeasibility } from '../lib/routingEngine';
import prisma from '../lib/prisma';

async function runTests() {
  console.log("=== BEYOND TAJ ENGINE WARNINGS TEST ===");

  const destinations = await prisma.destination.findMany();
  const getIds = (names: string[]) => names.map(n => destinations.find(d => d.name === n)?.id).filter(Boolean) as string[];
  const getHub = (name: string) => destinations.find(d => d.name === name)?.id || "unknown";

  // Scenario 1: Pacing Note (Too fast)
  console.log("\n--- Scenario 1: PACING NOTE ---");
  console.log("Input: 3 days, trying to visit Leh-Ladakh and Spiti Valley from Delhi");
  let res = await evaluateTripFeasibility(
    getIds(["Leh – Ladakh", "Spiti Valley"]),
    3,
    ["August"], // Good weather
    "balanced",
    "International",
    getHub("Delhi"),
    []
  );
  console.log(res.warnings);

  // Scenario 2: Weather Warning (Heat)
  console.log("\n--- Scenario 2: WEATHER NOTE (Heat) ---");
  console.log("Input: Delhi and Udaipur in May");
  res = await evaluateTripFeasibility(
    getIds(["Delhi", "Udaipur"]),
    7,
    ["May"],
    "balanced",
    "International",
    getHub("Delhi"),
    []
  );
  console.log(res.warnings);

  // Scenario 3: Weather Critical (Monsoon/Floods)
  console.log("\n--- Scenario 3: WEATHER CRITICAL (Monsoons) ---");
  console.log("Input: Kaziranga in July");
  res = await evaluateTripFeasibility(
    getIds(["Kaziranga National Park"]),
    5,
    ["July"],
    "balanced",
    "International",
    getHub("Delhi"),
    []
  );
  console.log(res.warnings);

  // Scenario 4: Logistics Note (Hub Required)
  console.log("\n--- Scenario 4: LOGISTICS NOTE (Hub Required) ---");
  console.log("Input: Kaziranga to Havelock Island (14 days, enough time, but needs hub)");
  res = await evaluateTripFeasibility(
    getIds(["Kaziranga National Park", "Havelock Island (Swaraj Dweep)"]),
    14,
    ["January"], // Good weather
    "balanced",
    "International",
    getHub("Delhi"),
    []
  );
  console.log(res.warnings);

  // Scenario 5: Vibe Note (Mismatched Landscapes)
  console.log("\n--- Scenario 5: VIBE NOTE ---");
  console.log("Input: Requested 'Beaches', but only selected 'Manali' (Mountains)");
  res = await evaluateTripFeasibility(
    getIds(["Manali"]),
    7,
    ["May"], // Good weather
    "balanced",
    "International",
    getHub("Delhi"),
    ["Beaches"]
  );
  console.log(res.warnings);

  // Scenario 6: Multi-Month Weather Warning
  console.log("\n--- Scenario 6: MULTI-MONTH WEATHER WARNING ---");
  console.log("Input: Leh in Jan, Feb, March (closed) but requested Jan-March span");
  res = await evaluateTripFeasibility(
    getIds(["Leh – Ladakh"]),
    14,
    ["January", "February", "March"],
    "balanced",
    "International",
    getHub("Delhi"),
    []
  );
  console.log(res.warnings);

  // Scenario 7: 60-Day Extensive Trip Pacing
  console.log("\n--- Scenario 7: 60-DAY EXTENSIVE TRIP ---");
  console.log("Input: 60 Days, exploring 14 destinations across India");
  res = await evaluateTripFeasibility(
    getIds(["Delhi", "Jaipur", "Jodhpur", "Udaipur", "Agra", "Varanasi", "Kochi", "Munnar", "Alleppey", "Goa", "Hampi", "Mysore", "Bangalore", "Chennai"]),
    60,
    ["November", "December", "January"],
    "balanced",
    "International",
    getHub("Delhi"),
    []
  );
  console.log(res.warnings);

}

runTests()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
