const fs = require('fs');

const data = JSON.parse(fs.readFileSync('prisma/data.json', 'utf8'));

// Fix regions for the remaining 5 failed items
const VALID_REGIONS = ["North", "West", "South", "Islands", "East"];

for (let i = 0; i < data.length; i++) {
  if (data[i].region === "Northeast") {
    data[i].region = "East";
  }
  if (data[i].region === "Central") {
    // For MP/Maharashtra parks, we'll map them to West or East
    if (data[i].id === "tadoba") {
      data[i].region = "West"; // Maharashtra is West
    } else {
      data[i].region = "East"; // MP parks (Kanha, Bandhavgarh, Pench) can be East
    }
  }
}

fs.writeFileSync('prisma/data.json', JSON.stringify(data, null, 2));
console.log('Fixed regions.');
