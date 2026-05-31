// @ts-nocheck
import 'dotenv/config';
import { evaluateTripFeasibility } from '../utils/routingEngine';
import prisma from '../lib/prisma';

async function runTests() {
  console.log("=== BEYOND TAJ ENGINE WARNINGS TEST ===");

  // Scenario 1: Pacing Note (Too fast)
  console.log("\n--- Scenario 1: PACING NOTE ---");
  console.log("Input: 3 days, trying to visit Leh-Ladakh and Spiti Valley from Delhi");
  let res = await evaluateTripFeasibility(
    ["Leh-Ladakh", "Spiti Valley"],
    3,
    "August", // Good weather
    "balanced",
    "International",
    "Delhi",
    []
  );
  console.log(res.warnings);

  // Scenario 2: Weather Warning (Heat)
  console.log("\n--- Scenario 2: WEATHER NOTE (Heat) ---");
  console.log("Input: Delhi and Udaipur in May");
  res = await evaluateTripFeasibility(
    ["Delhi", "Udaipur"],
    7,
    "May",
    "balanced",
    "International",
    "Delhi",
    []
  );
  console.log(res.warnings);

  // Scenario 3: Weather Critical (Monsoon/Floods)
  console.log("\n--- Scenario 3: WEATHER CRITICAL (Monsoons) ---");
  console.log("Input: Kaziranga in July");
  res = await evaluateTripFeasibility(
    ["Kaziranga"],
    5,
    "July",
    "balanced",
    "International",
    "Delhi",
    []
  );
  console.log(res.warnings);

  // Scenario 4: Logistics Note (Hub Required)
  console.log("\n--- Scenario 4: LOGISTICS NOTE (Hub Required) ---");
  console.log("Input: Kaziranga to Havelock Island (14 days, enough time, but needs hub)");
  res = await evaluateTripFeasibility(
    ["Kaziranga", "Havelock Island"],
    14,
    "January", // Good weather
    "balanced",
    "International",
    "Delhi",
    []
  );
  console.log(res.warnings);

  // Scenario 5: Vibe Note (Mismatched Landscapes)
  console.log("\n--- Scenario 5: VIBE NOTE ---");
  console.log("Input: Requested 'Beaches', but only selected 'Manali' (Mountains)");
  res = await evaluateTripFeasibility(
    ["Manali"],
    7,
    "May", // Good weather
    "balanced",
    "International",
    "Delhi",
    ["Beaches"]
  );
  console.log(res.warnings);

}

runTests()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
