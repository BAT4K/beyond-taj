import 'dotenv/config';
import { evaluateTripFeasibility } from './utils/routingEngine';

async function main() {
  console.log("=========================================");
  console.log("TESTING SOFT RESTRICTIONS VALIDATOR (PHASE 5)");
  console.log("=========================================\n");

  // TEST 1: Extreme Weather & Crazy Logistics (Leh-Ladakh + Manali in January for 5 days)
  // January (Month 1): Leh and Manali roads are closed (closedMonths contains 1 for Leh and Manali in DB usually)
  // Requested Vibes: 'Beaches', 'Jungles' (Neither has these)
  
  console.log("--- SCENARIO 1: Extreme Weather (Closed Mountains in Winter) ---");
  const dests1 = ["Leh-Ladakh", "Manali"];
  const res1 = await evaluateTripFeasibility(
    dests1, 
    5, // days
    "January", // travelMonth
    "Luxury", // style
    "International", // residency
    "Delhi", // startLocation
    ["Jungles"] // requestedLandscapes
  );
  
  console.log("Score:", res1.score);
  console.log("isValid:", res1.isValid);
  console.log("Optimal Path:", res1.optimalPath);
  console.log("Warnings:\n", JSON.stringify(res1.warnings, null, 2));


  console.log("\n--- SCENARIO 2: Perfect Trip (No Warnings) ---");
  // 14 days in October, Rajasthan Circuit (Jaipur, Jodhpur, Udaipur)
  // Requested Vibe: Royal Cities (Which all of them have)
  const dests2 = ["Jaipur", "Jodhpur", "Udaipur"];
  const res2 = await evaluateTripFeasibility(
    dests2, 
    14, // days
    "October", // travelMonth
    "Balanced", // style
    "International", // residency
    "Delhi", // startLocation
    ["Royal Cities"] // requestedLandscapes
  );
  
  console.log("Score:", res2.score);
  console.log("isValid:", res2.isValid);
  console.log("Optimal Path:", res2.optimalPath);
  console.log("Warnings:\n", JSON.stringify(res2.warnings, null, 2));

}

main().catch(console.error);
