import 'dotenv/config';
import { evaluateTripFeasibility } from './utils/routingEngine';

async function main() {
  const dests = ["Meghalaya", "Darjeeling"];
  const res = await evaluateTripFeasibility(
    dests, 
    14, 
    "October", 
    "Balanced", 
    "International", 
    "Delhi", 
    []
  );
  
  console.log("Score:", res.score);
  console.log("isValid:", res.isValid);
  console.log("Optimal Path:", res.optimalPath);
  console.log("Warnings:\n", JSON.stringify(res.warnings, null, 2));
}

main().catch(console.error);
