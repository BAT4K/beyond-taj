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
  console.log("🧹 Wiping previous entries...");
  await prisma.transitRoute.deleteMany({});
  await prisma.destination.deleteMany({});
  await prisma.landscape.deleteMany({});

  console.log("🌱 Creating landscapes...");
  const landscapesMap: Record<string, any> = {};
  for (const land of LANDSCAPES) {
    const created = await prisma.landscape.create({ data: { ...land, id: uuidv4(), updatedAt: new Date() } });
    landscapesMap[land.name] = created;
  }

  console.log("🌱 Injecting premium destination nodes...");

  const destinationsData = [
    { name: "Leh-Ladakh", description: "High-altitude desert and monasteries.", region: "North", idealSeason: "Jun–Sep", vibeTags: ["Otherworldly", "Bold"], minRequiredDays: 6, latitude: 34.1526, longitude: 77.5771, landRefs: ["Mountains", "Cold Desert"] },
    { name: "Udaipur", description: "City of lakes and royal palaces.", region: "West", idealSeason: "Oct–Mar", vibeTags: ["Romantic", "Regal"], minRequiredDays: 3, latitude: 24.5854, longitude: 73.7125, landRefs: ["Royal Cities", "Historical Architecture"] },
    { name: "Jaisalmer", description: "The Golden City surrounded by dunes.", region: "West", idealSeason: "Oct–Feb", vibeTags: ["Mystical", "Golden"], minRequiredDays: 3, latitude: 26.9157, longitude: 70.9083, landRefs: ["Desert", "Royal Cities"] },
    { name: "Manali", description: "Himalayan resort town with adventurous valleys.", region: "North", idealSeason: "Mar–Jun", vibeTags: ["Wild", "Exhilarating"], minRequiredDays: 4, latitude: 32.2396, longitude: 77.1887, landRefs: ["Mountains"] },
    { name: "Varkala", description: "Cliff-side coastal town overlooking the Arabian Sea.", region: "South", idealSeason: "Oct–Mar", vibeTags: ["Soulful", "Relaxed"], minRequiredDays: 3, latitude: 8.7338, longitude: 76.7059, landRefs: ["Beaches"] },
    { name: "Alleppey", description: "Lush network of canals and houseboats.", region: "South", idealSeason: "Nov–Feb", vibeTags: ["Dreamy", "Slow"], minRequiredDays: 2, latitude: 9.4981, longitude: 76.3388, landRefs: ["Backwaters"] },
    { name: "Munnar", description: "Endless tea plantations wrapped in mist.", region: "South", idealSeason: "Sep–May", vibeTags: ["Lush", "Restorative"], minRequiredDays: 3, latitude: 10.0889, longitude: 77.0595, landRefs: ["Tea Plantations"] },
    { name: "Meghalaya (Shillong)", description: "The abode of clouds and living root bridges.", region: "East", idealSeason: "Oct–Apr", vibeTags: ["Magical", "Pure"], minRequiredDays: 4, latitude: 25.5788, longitude: 91.8831, landRefs: ["Hidden Villages", "Mountains"] },
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

  console.log("🌱 Building transit logic matrices...");
  const routes = [
    { from: "Leh-Ladakh", to: "Varkala", mode: "Flight Interconnect", time: 16.5, dist: 3500 },
    { from: "Jaisalmer", to: "Meghalaya (Shillong)", mode: "Flight/Rail Mix", time: 22.0, dist: 2400 },
    { from: "Udaipur", to: "Jaisalmer", mode: "Private Car", time: 4.5, dist: 490 },
    { from: "Alleppey", to: "Munnar", mode: "Private SUV", time: 3.5, dist: 170 },
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

  console.log("✅ Seed successfully integrated into cloud infrastructure.");
}

main().catch(e => { console.error(e); process.exit(1); });
