import prisma from '../lib/prisma';
import crypto from 'node:crypto';
const uuidv4 = () => crypto.randomUUID();

const LANDSCAPES = [
  { name: "Mountains", description: "Snow peaks, pine forests, Himalayan roads and peaceful valleys" },
  { name: "Beaches", description: "Tropical coastlines, golden sand, turquoise waves" },
  { name: "Islands", description: "Coral atolls, remote paradises, crystal lagoons" },
  { name: "Cold Desert", description: "Moonscape terrain, Ladakh roads, starlit Spiti valleys" },
  { name: "Royal Cities", description: "Forts, palaces, Mughal grandeur, painted havelis" },
  { name: "Spiritual India", description: "Sacred ghats, ancient temples, ashrams and rituals" },
  { name: "Wildlife & Jungle", description: "Tiger reserves, dense forests, rare biodiversity" },
  { name: "Backwaters", description: "Kerala lagoons, houseboat drifts, lush canals" },
  { name: "Tea Plantations", description: "Rolling green hills, mist and the scent of Darjeeling" },
  { name: "Desert", description: "Camel safaris, sand dunes, folk music under the stars" },
  { name: "Modern Cities", description: "Cyber hubs, street food, cosmopolitan culture" },
  { name: "Hidden Villages", description: "Tribal cultures, ancient crafts, untouched landscapes" },
];

async function main() {
  console.log("Wiping previous entries...");
  await prisma.transitRoute.deleteMany({});
  await prisma.destination.deleteMany({});
  await prisma.landscape.deleteMany({});

  console.log("Creating landscapes...");
  const landscapesMap: Record<string, any> = {};
  for (const land of LANDSCAPES) {
    const created = await prisma.landscape.create({ data: { ...land, id: uuidv4(), updatedAt: new Date() } });
    landscapesMap[land.name] = created;
  }

  console.log("Injecting premium destination nodes...");

  const destinationsData = [
    // --- MOUNTAINS & COLD DESERTS ---
    { name: "Leh-Ladakh", description: "High-altitude desert, crystal lakes, and ancient monasteries.", region: "North", idealSeason: "Jun–Sep", vibeTags: ["Otherworldly", "Bold"], minRequiredDays: 6, latitude: 34.1526, longitude: 77.5771, landRefs: ["Mountains", "Cold Desert"] },
    { name: "Spiti Valley", description: "Rugged, remote Himalayan valley with ancient Buddhist culture.", region: "North", idealSeason: "Jun–Sep", vibeTags: ["Remote", "Spiritual"], minRequiredDays: 5, latitude: 32.2461, longitude: 78.0349, landRefs: ["Mountains", "Cold Desert"] },
    { name: "Manali", description: "Himalayan resort town with adventurous valleys and alpine forests.", region: "North", idealSeason: "Mar–Jun", vibeTags: ["Wild", "Exhilarating"], minRequiredDays: 4, latitude: 32.2396, longitude: 77.1887, landRefs: ["Mountains"] },
    { name: "Gulmarg", description: "Pristine snow-capped peaks and world-class skiing.", region: "North", idealSeason: "Dec–Mar", vibeTags: ["Winter Wonderland", "Luxury"], minRequiredDays: 3, latitude: 34.0484, longitude: 74.3805, landRefs: ["Mountains"] },
    { name: "Tirthan Valley", description: "Untouched Himalayan valley known for trout fishing and quiet retreats.", region: "North", idealSeason: "Mar–Jun", vibeTags: ["Peaceful", "Rustic"], minRequiredDays: 3, latitude: 31.6380, longitude: 77.3436, landRefs: ["Mountains", "Hidden Villages"] },

    // --- ROYAL CITIES & DESERT ---
    { name: "Udaipur", description: "City of lakes, floating palaces, and romantic heritage.", region: "West", idealSeason: "Oct–Mar", vibeTags: ["Romantic", "Regal"], minRequiredDays: 3, latitude: 24.5854, longitude: 73.7125, landRefs: ["Royal Cities"] },
    { name: "Jodhpur", description: "The Blue City shadowed by the imposing Mehrangarh Fort.", region: "West", idealSeason: "Oct–Mar", vibeTags: ["Historic", "Vibrant"], minRequiredDays: 2, latitude: 26.2389, longitude: 73.0243, landRefs: ["Royal Cities", "Desert"] },
    { name: "Jaisalmer", description: "The Golden City surrounded by sweeping dunes.", region: "West", idealSeason: "Oct–Feb", vibeTags: ["Mystical", "Golden"], minRequiredDays: 3, latitude: 26.9157, longitude: 70.9083, landRefs: ["Desert", "Royal Cities"] },
    { name: "Jaipur", description: "The Pink City, known for bustling bazaars and grand architecture.", region: "West", idealSeason: "Oct–Mar", vibeTags: ["Vibrant", "Iconic"], minRequiredDays: 3, latitude: 26.9124, longitude: 75.7873, landRefs: ["Royal Cities"] },
    { name: "Bundi", description: "Underrated town of stepwells, blue houses, and miniature paintings.", region: "West", idealSeason: "Oct–Mar", vibeTags: ["Authentic", "Quiet"], minRequiredDays: 2, latitude: 25.4305, longitude: 75.6499, landRefs: ["Royal Cities", "Hidden Villages"] },
    { name: "Mysore", description: "Southern capital of silk, sandalwood, and spectacular palaces.", region: "South", idealSeason: "Oct–Feb", vibeTags: ["Regal", "Cultural"], minRequiredDays: 2, latitude: 12.2958, longitude: 76.6394, landRefs: ["Royal Cities"] },

    // --- BEACHES, ISLANDS & BACKWATERS ---
    { name: "South Goa", description: "Serene, palm-fringed luxury beaches away from the party crowds.", region: "West", idealSeason: "Nov–Mar", vibeTags: ["Relaxed", "Lush"], minRequiredDays: 4, latitude: 15.2993, longitude: 74.1240, landRefs: ["Beaches"] },
    { name: "Gokarna", description: "Temple town meets secluded crescent beaches.", region: "South", idealSeason: "Oct–Mar", vibeTags: ["Soulful", "Bohemian"], minRequiredDays: 3, latitude: 14.5398, longitude: 74.3180, landRefs: ["Beaches", "Spiritual India"] },
    { name: "Varkala", description: "Cliff-side coastal town overlooking the Arabian Sea.", region: "South", idealSeason: "Oct–Mar", vibeTags: ["Soulful", "Relaxed"], minRequiredDays: 3, latitude: 8.7338, longitude: 76.7059, landRefs: ["Beaches"] },
    { name: "Havelock Island (Swaraj Dweep)", description: "Crystal clear diving waters and white sand rainforest beaches.", region: "Islands", idealSeason: "Dec–Apr", vibeTags: ["Pristine", "Tropical"], minRequiredDays: 4, latitude: 11.9761, longitude: 92.9876, landRefs: ["Islands", "Beaches"] },
    { name: "Alleppey", description: "Lush network of canals and luxury houseboats.", region: "South", idealSeason: "Nov–Feb", vibeTags: ["Dreamy", "Slow"], minRequiredDays: 2, latitude: 9.4981, longitude: 76.3388, landRefs: ["Backwaters"] },
    { name: "Munroe Island", description: "Untouched backwater network, perfect for quiet canoe explorations.", region: "South", idealSeason: "Oct–Mar", vibeTags: ["Hidden", "Tranquil"], minRequiredDays: 2, latitude: 8.9892, longitude: 76.6196, landRefs: ["Backwaters", "Hidden Villages"] },

    // --- WILDLIFE & JUNGLE ---
    { name: "Ranthambore", description: "Historic tiger reserve set amidst ancient fort ruins.", region: "West", idealSeason: "Oct–May", vibeTags: ["Wild", "Historic"], minRequiredDays: 2, latitude: 26.0173, longitude: 76.2215, landRefs: ["Wildlife & Jungle"] },
    { name: "Jawai", description: "Exclusive luxury leopard safaris amidst striking granite hills.", region: "West", idealSeason: "Sep–May", vibeTags: ["Exclusive", "Raw"], minRequiredDays: 2, latitude: 25.1011, longitude: 73.3228, landRefs: ["Wildlife & Jungle", "Hidden Villages"] },
    { name: "Kabini", description: "Premium safaris known for black panthers and dense southern jungles.", region: "South", idealSeason: "Oct–May", vibeTags: ["Mysterious", "Lush"], minRequiredDays: 2, latitude: 11.9421, longitude: 76.2690, landRefs: ["Wildlife & Jungle"] },
    { name: "Kaziranga", description: "Northeast floodplains, home to the one-horned rhinoceros.", region: "East", idealSeason: "Nov–Apr", vibeTags: ["Unique", "Wild"], minRequiredDays: 3, latitude: 26.5775, longitude: 93.1711, landRefs: ["Wildlife & Jungle"] },

    // --- TEA PLANTATIONS & HIDDEN NORTHEAST ---
    { name: "Munnar", description: "Endless rolling tea plantations wrapped in mountain mist.", region: "South", idealSeason: "Sep–May", vibeTags: ["Lush", "Restorative"], minRequiredDays: 3, latitude: 10.0889, longitude: 77.0595, landRefs: ["Tea Plantations"] },
    { name: "Darjeeling", description: "Colonial-era hill station with views of Kanchenjunga and famous estates.", region: "East", idealSeason: "Mar–May", vibeTags: ["Nostalgic", "Scenic"], minRequiredDays: 3, latitude: 27.0360, longitude: 88.2627, landRefs: ["Tea Plantations", "Mountains"] },
    { name: "Meghalaya (Shillong & Sohra)", description: "The abode of clouds, waterfalls, and living root bridges.", region: "East", idealSeason: "Oct–Apr", vibeTags: ["Magical", "Pure"], minRequiredDays: 5, latitude: 25.5788, longitude: 91.8831, landRefs: ["Hidden Villages", "Mountains"] },
    { name: "Ziro Valley", description: "Picturesque pine-clad valley, home to the Apatani tribe.", region: "East", idealSeason: "Mar–Oct", vibeTags: ["Tribal", "Untouched"], minRequiredDays: 3, latitude: 27.5562, longitude: 93.8340, landRefs: ["Hidden Villages"] },

    // --- SPIRITUAL & MODERN CITIES ---
    { name: "Varanasi", description: "The spiritual heart of India; ancient ghats along the Ganges.", region: "North", idealSeason: "Oct–Mar", vibeTags: ["Intense", "Sacred"], minRequiredDays: 2, latitude: 25.3176, longitude: 82.9739, landRefs: ["Spiritual India", "Modern Cities"] },
    { name: "Rishikesh", description: "Yoga capital of the world set against the Himalayan foothills.", region: "North", idealSeason: "Sep–Nov", vibeTags: ["Zen", "Awakening"], minRequiredDays: 3, latitude: 30.0869, longitude: 78.2676, landRefs: ["Spiritual India", "Mountains"] },
    { name: "Hampi", description: "Surreal boulder landscapes and magnificent ancient temple ruins.", region: "South", idealSeason: "Oct–Feb", vibeTags: ["Surreal", "Historic"], minRequiredDays: 3, latitude: 15.3350, longitude: 76.4600, landRefs: ["Spiritual India", "Hidden Villages"] },
    { name: "Mumbai", description: "The city of dreams, Bollywood, colonial architecture, and high-end dining.", region: "West", idealSeason: "Nov–Feb", vibeTags: ["Cosmopolitan", "Fast-paced"], minRequiredDays: 3, latitude: 19.0760, longitude: 72.8777, landRefs: ["Modern Cities"] },
    { name: "Delhi", description: "A striking mix of Mughal tombs, narrow bazaars, and modern luxury.", region: "North", idealSeason: "Oct–Mar", vibeTags: ["Historic", "Bustling"], minRequiredDays: 3, latitude: 28.7041, longitude: 77.1025, landRefs: ["Modern Cities", "Royal Cities"] },
  ];

  const dbDestinations: Record<string, any> = {};
  for (const dest of destinationsData) {
    const { landRefs, ...pureDest } = dest;
    const connectIds = landRefs.map(name => ({ id: landscapesMap[name]?.id })).filter(x => x.id);

    const createdDest = await prisma.destination.create({
      data: {
        ...pureDest,
        id: uuidv4(),
        updatedAt: new Date(),
        Landscape: { connect: connectIds }
      }
    });
    dbDestinations[dest.name] = createdDest;
  }

  console.log("Building transit logic matrices...");
  const routes = [
    { from: "Leh-Ladakh", to: "Delhi", mode: "Direct Flight", time: 1.5, dist: 615 },
    { from: "Delhi", to: "Udaipur", mode: "Direct Flight", time: 1.5, dist: 575 },
    { from: "Udaipur", to: "Jodhpur", mode: "Private Car", time: 4.5, dist: 250 },
    { from: "Jodhpur", to: "Jaisalmer", mode: "Private Car", time: 4.5, dist: 280 },
    { from: "Jodhpur", to: "Jawai", mode: "Private SUV", time: 3.0, dist: 160 },
    { from: "Mumbai", to: "South Goa", mode: "Direct Flight", time: 1.2, dist: 400 },
    { from: "South Goa", to: "Gokarna", mode: "Private Car", time: 2.5, dist: 115 },
    { from: "Alleppey", to: "Munnar", mode: "Private SUV", time: 4.0, dist: 170 },
    { from: "Munnar", to: "Varkala", mode: "Private Car", time: 5.5, dist: 240 },
    { from: "Delhi", to: "Ranthambore", mode: "Luxury Train (Vande Bharat)", time: 3.5, dist: 380 },
    { from: "Varanasi", to: "Delhi", mode: "Direct Flight", time: 1.5, dist: 680 },
  ];

  for (const r of routes) {
    const orig = dbDestinations[r.from];
    const dest = dbDestinations[r.to];
    if (orig && dest) {
      await prisma.transitRoute.create({
        data: { id: uuidv4(), updatedAt: new Date(), originId: orig.id, destinationId: dest.id, travelMode: r.mode, durationHours: r.time, distanceKm: r.dist }
      });
    }
  }

  console.log("Seed successfully integrated into cloud infrastructure.");
}

main().catch(e => { console.error(e); process.exit(1); });