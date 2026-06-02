import 'dotenv/config';
import { evaluateTripFeasibility } from './lib/routingEngine';

async function main() {
  // Test a crazy trip: 6 days, starting in Delhi, but going to South Goa and Leh
  const destinationIds = ["Delhi", "South Goa", "Leh"];
  const res = await evaluateTripFeasibility(destinationIds, 6, "July", "Luxury", "International", "Delhi");
  console.log("Validator Result:", JSON.stringify(res, null, 2));
}
main();
