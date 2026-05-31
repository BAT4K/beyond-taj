const fs = require('fs');

const data = JSON.parse(fs.readFileSync('prisma/data.json', 'utf8'));

// The last 20 items are the ones we just added (batch4).
// We need to fix their landscapes and vibes to match the enums.

const VALID_VIBES = ["Otherworldly", "Bold", "Remote", "Spiritual", "Wild", "Exhilarating", "Winter Wonderland", "Luxury", "Peaceful", "Rustic", "Romantic", "Regal", "Historic", "Vibrant", "Mystical", "Golden", "Iconic", "Authentic", "Quiet", "Cultural", "Relaxed", "Lush", "Soulful", "Bohemian", "Pristine", "Tropical", "Dreamy", "Slow", "Hidden", "Tranquil", "Exclusive", "Raw", "Mysterious", "Unique", "Restorative", "Nostalgic", "Scenic", "Magical", "Pure", "Tribal", "Untouched", "Intense", "Sacred", "Zen", "Awakening", "Surreal", "Cosmopolitan", "Fast-paced", "Bustling"];
const VALID_LANDSCAPES = ["Mountains", "Beaches", "Islands", "Cold Desert", "Royal Cities", "Spiritual India", "Wildlife & Jungle", "Backwaters", "Tea Plantations", "Desert", "Modern Cities", "Hidden Villages"];

function fixItem(item) {
  // Fix landscapes
  if (item.landscapes) {
    item.landscapes = item.landscapes.map(l => {
      if (l === "Wildlife & Safaris") return "Wildlife & Jungle";
      if (l === "Tea Plantations & Valleys") return "Tea Plantations";
      if (l === "Vibrant Metropolises") return "Modern Cities";
      if (l === "Northeast & Living Roots") return "Hidden Villages";
      if (!VALID_LANDSCAPES.includes(l)) return "Hidden Villages";
      return l;
    });
  }

  // Fix vibes
  if (item.vibeTags) {
    item.vibeTags = item.vibeTags.map(v => {
      if (v === "Nature") return "Pure";
      if (v === "Adventure") return "Exhilarating";
      if (v === "Thrilling") return "Exhilarating";
      if (v === "Dynamic") return "Fast-paced";
      if (v === "Cinematic") return "Iconic";
      if (v === "Modern") return "Cosmopolitan";
      if (v === "Rugged") return "Wild";
      if (!VALID_VIBES.includes(v)) return "Surreal";
      return v;
    });
  }
}

for (let i = data.length - 20; i < data.length; i++) {
  fixItem(data[i]);
}

fs.writeFileSync('prisma/data.json', JSON.stringify(data, null, 2));
console.log('Fixed batch 4.');
