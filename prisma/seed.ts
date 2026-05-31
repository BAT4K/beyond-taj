import 'dotenv/config';
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
  console.log("Upserting landscapes (idempotent)...");
  for (const land of LANDSCAPES) {
    const slugId = `l_${land.name.toLowerCase().replace(/\s+/g, '_')}`;
    await prisma.landscape.upsert({
      where: { name: land.name },
      update: { description: land.description, updatedAt: new Date() },
      create: { ...land, id: slugId, updatedAt: new Date() }
    });
  }

  console.log("Injecting premium destination nodes via upsert...");

  const destinationsData = [
    // --- MOUNTAINS & COLD DESERTS ---
    { shortPitch: "", topHighlights: [], id: "Leh-Ladakh", name: "Leh-Ladakh", description: "High-altitude desert, crystal lakes, and ancient monasteries.", region: "North", idealSeason: "Jun–Sep", vibeTags: ["Otherworldly", "Bold"], minRequiredDays: 6, latitude: 34.1526, longitude: 77.5771, landRefs: ["Mountains", "Cold Desert"] },
    { shortPitch: "", topHighlights: [], id: "Spiti Valley", name: "Spiti Valley", description: "Rugged, remote Himalayan valley with ancient Buddhist culture.", region: "North", idealSeason: "Jun–Sep", vibeTags: ["Remote", "Spiritual"], minRequiredDays: 5, latitude: 32.2461, longitude: 78.0349, landRefs: ["Mountains", "Cold Desert"] },
    { shortPitch: "", topHighlights: [], id: "Manali", name: "Manali", description: "Himalayan resort town with adventurous valleys and alpine forests.", region: "North", idealSeason: "Mar–Jun", vibeTags: ["Wild", "Exhilarating"], minRequiredDays: 4, latitude: 32.2396, longitude: 77.1887, landRefs: ["Mountains"] },
    { shortPitch: "", topHighlights: [], id: "Gulmarg", name: "Gulmarg", description: "Pristine snow-capped peaks and world-class skiing.", region: "North", idealSeason: "Dec–Mar", vibeTags: ["Winter Wonderland", "Luxury"], minRequiredDays: 3, latitude: 34.0484, longitude: 74.3805, landRefs: ["Mountains"] },
    { shortPitch: "", topHighlights: [], id: "Tirthan Valley", name: "Tirthan Valley", description: "Untouched Himalayan valley known for trout fishing and quiet retreats.", region: "North", idealSeason: "Mar–Jun", vibeTags: ["Peaceful", "Rustic"], minRequiredDays: 3, latitude: 31.6380, longitude: 77.3436, landRefs: ["Mountains", "Hidden Villages"] },

    // --- ROYAL CITIES & DESERT ---
    { shortPitch: "", topHighlights: [], id: "Udaipur", name: "Udaipur", description: "City of lakes, floating palaces, and romantic heritage.", region: "West", idealSeason: "Oct–Mar", vibeTags: ["Romantic", "Regal"], minRequiredDays: 3, latitude: 24.5854, longitude: 73.7125, landRefs: ["Royal Cities"] },
    { shortPitch: "", topHighlights: [], id: "Jodhpur", name: "Jodhpur", description: "The Blue City shadowed by the imposing Mehrangarh Fort.", region: "West", idealSeason: "Oct–Mar", vibeTags: ["Historic", "Vibrant"], minRequiredDays: 2, latitude: 26.2389, longitude: 73.0243, landRefs: ["Royal Cities", "Desert"] },
    { shortPitch: "", topHighlights: [], id: "Jaisalmer", name: "Jaisalmer", description: "The Golden City surrounded by sweeping dunes.", region: "West", idealSeason: "Oct–Feb", vibeTags: ["Mystical", "Golden"], minRequiredDays: 3, latitude: 26.9157, longitude: 70.9083, landRefs: ["Desert", "Royal Cities"] },
    { shortPitch: "", topHighlights: [], id: "Jaipur", name: "Jaipur", description: "The Pink City, known for bustling bazaars and grand architecture.", region: "West", idealSeason: "Oct–Mar", vibeTags: ["Vibrant", "Iconic"], minRequiredDays: 3, latitude: 26.9124, longitude: 75.7873, landRefs: ["Royal Cities"] },
    { shortPitch: "", topHighlights: [], id: "Bundi", name: "Bundi", description: "Underrated town of stepwells, blue houses, and miniature paintings.", region: "West", idealSeason: "Oct–Mar", vibeTags: ["Authentic", "Quiet"], minRequiredDays: 2, latitude: 25.4305, longitude: 75.6499, landRefs: ["Royal Cities", "Hidden Villages"] },
    { shortPitch: "", topHighlights: [], id: "Mysore", name: "Mysore", description: "Southern capital of silk, sandalwood, and spectacular palaces.", region: "South", idealSeason: "Oct–Feb", vibeTags: ["Regal", "Cultural"], minRequiredDays: 2, latitude: 12.2958, longitude: 76.6394, landRefs: ["Royal Cities"] },

    // --- BEACHES, ISLANDS & BACKWATERS ---
    { shortPitch: "", topHighlights: [], id: "South Goa", name: "South Goa", description: "Serene, palm-fringed luxury beaches away from the party crowds.", region: "West", idealSeason: "Nov–Mar", vibeTags: ["Relaxed", "Lush"], minRequiredDays: 4, latitude: 15.2993, longitude: 74.1240, landRefs: ["Beaches"] },
    { shortPitch: "", topHighlights: [], id: "Gokarna", name: "Gokarna", description: "Temple town meets secluded crescent beaches.", region: "South", idealSeason: "Oct–Mar", vibeTags: ["Soulful", "Bohemian"], minRequiredDays: 3, latitude: 14.5398, longitude: 74.3180, landRefs: ["Beaches", "Spiritual India"] },
    { shortPitch: "", topHighlights: [], id: "Varkala", name: "Varkala", description: "Cliff-side coastal town overlooking the Arabian Sea.", region: "South", idealSeason: "Oct–Mar", vibeTags: ["Soulful", "Relaxed"], minRequiredDays: 3, latitude: 8.7338, longitude: 76.7059, landRefs: ["Beaches"] },
    { shortPitch: "", topHighlights: [], id: "Havelock Island", name: "Havelock Island (Swaraj Dweep)", description: "Crystal clear diving waters and white sand rainforest beaches.", region: "Islands", idealSeason: "Dec–Apr", vibeTags: ["Pristine", "Tropical"], minRequiredDays: 4, latitude: 11.9761, longitude: 92.9876, landRefs: ["Islands", "Beaches"] },
    { shortPitch: "", topHighlights: [], id: "Alleppey", name: "Alleppey", description: "Lush network of canals and luxury houseboats.", region: "South", idealSeason: "Nov–Feb", vibeTags: ["Dreamy", "Slow"], minRequiredDays: 2, latitude: 9.4981, longitude: 76.3388, landRefs: ["Backwaters"] },
    { shortPitch: "", topHighlights: [], id: "Munroe Island", name: "Munroe Island", description: "Untouched backwater network, perfect for quiet canoe explorations.", region: "South", idealSeason: "Oct–Mar", vibeTags: ["Hidden", "Tranquil"], minRequiredDays: 2, latitude: 8.9892, longitude: 76.6196, landRefs: ["Backwaters", "Hidden Villages"] },

    // --- WILDLIFE & JUNGLE ---
    { shortPitch: "", topHighlights: [], id: "Ranthambore", name: "Ranthambore", description: "Historic tiger reserve set amidst ancient fort ruins.", region: "West", idealSeason: "Oct–May", vibeTags: ["Wild", "Historic"], minRequiredDays: 2, latitude: 26.0173, longitude: 76.2215, landRefs: ["Wildlife & Jungle"] },
    { shortPitch: "", topHighlights: [], id: "Jawai", name: "Jawai", description: "Exclusive luxury leopard safaris amidst striking granite hills.", region: "West", idealSeason: "Sep–May", vibeTags: ["Exclusive", "Raw"], minRequiredDays: 2, latitude: 25.1011, longitude: 73.3228, landRefs: ["Wildlife & Jungle", "Hidden Villages"] },
    { shortPitch: "", topHighlights: [], id: "Kabini", name: "Kabini", description: "Premium safaris known for black panthers and dense southern jungles.", region: "South", idealSeason: "Oct–May", vibeTags: ["Mysterious", "Lush"], minRequiredDays: 2, latitude: 11.9421, longitude: 76.2690, landRefs: ["Wildlife & Jungle"] },
    { shortPitch: "", topHighlights: [], id: "Kaziranga", name: "Kaziranga", description: "Northeast floodplains, home to the one-horned rhinoceros.", region: "East", idealSeason: "Nov–Apr", vibeTags: ["Unique", "Wild"], minRequiredDays: 3, latitude: 26.5775, longitude: 93.1711, landRefs: ["Wildlife & Jungle"] },

    // --- TEA PLANTATIONS & HIDDEN NORTHEAST ---
    { shortPitch: "", topHighlights: [], id: "Munnar", name: "Munnar", description: "Endless rolling tea plantations wrapped in mountain mist.", region: "South", idealSeason: "Sep–May", vibeTags: ["Lush", "Restorative"], minRequiredDays: 3, latitude: 10.0889, longitude: 77.0595, landRefs: ["Tea Plantations"] },
    { shortPitch: "", topHighlights: [], id: "Darjeeling", name: "Darjeeling", description: "Colonial-era hill station with views of Kanchenjunga and famous estates.", region: "East", idealSeason: "Mar–May", vibeTags: ["Nostalgic", "Scenic"], minRequiredDays: 3, latitude: 27.0360, longitude: 88.2627, landRefs: ["Tea Plantations", "Mountains"] },
    { shortPitch: "", topHighlights: [], id: "Meghalaya", name: "Meghalaya (Shillong & Sohra)", description: "The abode of clouds, waterfalls, and living root bridges.", region: "East", idealSeason: "Oct–Apr", vibeTags: ["Magical", "Pure"], minRequiredDays: 5, latitude: 25.5788, longitude: 91.8831, landRefs: ["Hidden Villages", "Mountains"] },
    { shortPitch: "", topHighlights: [], id: "Ziro Valley", name: "Ziro Valley", description: "Picturesque pine-clad valley, home to the Apatani tribe.", region: "East", idealSeason: "Mar–Oct", vibeTags: ["Tribal", "Untouched"], minRequiredDays: 3, latitude: 27.5562, longitude: 93.8340, landRefs: ["Hidden Villages"] },

    // --- SPIRITUAL & MODERN CITIES ---
    { shortPitch: "", topHighlights: [], id: "Varanasi", name: "Varanasi", description: "The spiritual heart of India; ancient ghats along the Ganges.", region: "North", idealSeason: "Oct–Mar", vibeTags: ["Intense", "Sacred"], minRequiredDays: 2, latitude: 25.3176, longitude: 82.9739, landRefs: ["Spiritual India", "Modern Cities"] },
    { shortPitch: "", topHighlights: [], id: "Rishikesh", name: "Rishikesh", description: "Yoga capital of the world set against the Himalayan foothills.", region: "North", idealSeason: "Sep–Nov", vibeTags: ["Zen", "Awakening"], minRequiredDays: 3, latitude: 30.0869, longitude: 78.2676, landRefs: ["Spiritual India", "Mountains"] },
    { shortPitch: "", topHighlights: [], id: "Hampi", name: "Hampi", description: "Surreal boulder landscapes and magnificent ancient temple ruins.", region: "South", idealSeason: "Oct–Feb", vibeTags: ["Surreal", "Historic"], minRequiredDays: 3, latitude: 15.3350, longitude: 76.4600, landRefs: ["Spiritual India", "Hidden Villages"] },
    { shortPitch: "", topHighlights: [], id: "Mumbai", name: "Mumbai", description: "The city of dreams, Bollywood, colonial architecture, and high-end dining.", region: "West", idealSeason: "Nov–Feb", vibeTags: ["Cosmopolitan", "Fast-paced"], minRequiredDays: 3, latitude: 19.0760, longitude: 72.8777, landRefs: ["Modern Cities"] },
    { shortPitch: "", topHighlights: [], id: "Delhi", name: "Delhi", description: "A striking mix of Mughal tombs, narrow bazaars, and modern luxury.", region: "North", idealSeason: "Oct–Mar", vibeTags: ["Historic", "Bustling"], minRequiredDays: 3, latitude: 28.7041, longitude: 77.1025, landRefs: ["Modern Cities", "Royal Cities"] },
  ];

  for (const dest of destinationsData) {
    const { id, landRefs, ...pureDest } = dest;
    
    // Connect or create landscapes safely
    const connectOrCreateLandscapes = landRefs.map(name => {
      const slugId = `l_${name.toLowerCase().replace(/\s+/g, '_')}`;
      return {
        where: { name },
        create: { id: slugId, name, description: name, updatedAt: new Date() }
      };
    });

    await prisma.destination.upsert({
      where: { id },
      update: {
        ...pureDest,
        updatedAt: new Date(),
        Landscape: {
          connectOrCreate: connectOrCreateLandscapes
        }
      },
      create: {
        id,
        ...pureDest,
        updatedAt: new Date(),
        Landscape: {
          connectOrCreate: connectOrCreateLandscapes
        }
      }
    });
  }

  console.log("Populating avoidMonths and closedMonths for off-season logic...");
  await prisma.destination.updateMany({
    where: { region: "North" },
    data: { avoidMonths: [7, 8], closedMonths: [12, 1, 2] } // Monsoon and deep winter
  });
  await prisma.destination.updateMany({
    where: { region: "South" },
    data: { avoidMonths: [6, 7], closedMonths: [] } // Heavy monsoon
  });
  await prisma.destination.updateMany({
    where: { 
      OR: [
        { region: "West" },
        { id: "Delhi" }
      ]
    },
    data: { avoidMonths: [5, 6], closedMonths: [] } // Extreme heat for Rajasthan/Delhi, pre-monsoon for West Coast
  });

  console.log("Building transit logic matrices via upsert...");
  
  // Base symmetric routes. We will generate both directions automatically.
  // Fatigue mapping: 
  // 1-2: Easy flight or very short drive
  // 3-4: Standard flight or moderate highway drive
  // 5-6: Long train/drive
  // 7-8: Exhausting road trip
  // 9-10: Punishing mountain pass or multi-leg journey
  const baseRoutes = [
    // Intra-Cluster: Mountains (High Friction)
    { from: "Leh-Ladakh", to: "Spiti Valley", mode: "Mountain Road", time: 14.0, dist: 400, fatigue: 9.5 },
    { from: "Spiti Valley", to: "Manali", mode: "Mountain Road", time: 8.0, dist: 200, fatigue: 8.0 },
    { from: "Manali", to: "Tirthan Valley", mode: "Mountain Road", time: 3.5, dist: 100, fatigue: 4.5 },
    { from: "Gulmarg", to: "Leh-Ladakh", mode: "Flight + Road", time: 8.0, dist: 450, fatigue: 7.0 },
    
    // Intra-Cluster: Royal Cities & Desert (Moderate Friction)
    { from: "Udaipur", to: "Jodhpur", mode: "Highway Drive", time: 4.5, dist: 250, fatigue: 4.0 },
    { from: "Jodhpur", to: "Jaisalmer", mode: "Highway Drive", time: 4.5, dist: 280, fatigue: 4.5 },
    { from: "Jodhpur", to: "Jaipur", mode: "Highway Drive", time: 5.5, dist: 330, fatigue: 5.0 },
    { from: "Jaipur", to: "Bundi", mode: "Highway Drive", time: 4.0, dist: 210, fatigue: 4.0 },
    { from: "Bundi", to: "Udaipur", mode: "Highway Drive", time: 5.0, dist: 270, fatigue: 4.5 },
    { from: "Udaipur", to: "Jaipur", mode: "Highway Drive", time: 6.5, dist: 390, fatigue: 6.0 },
    { from: "Udaipur", to: "Jaisalmer", mode: "Highway Drive", time: 8.0, dist: 490, fatigue: 7.5 },
    { from: "Udaipur", to: "Ranthambore", mode: "Highway Drive", time: 6.5, dist: 400, fatigue: 6.0 },
    { from: "Udaipur", to: "Jawai", mode: "Highway Drive", time: 3.0, dist: 150, fatigue: 3.0 },
    { from: "Jodhpur", to: "Jawai", mode: "Highway Drive", time: 3.0, dist: 160, fatigue: 3.0 },
    { from: "Jaipur", to: "Ranthambore", mode: "Highway Drive", time: 3.5, dist: 190, fatigue: 3.5 },
    
    // Intra-Cluster: South Beaches & Backwaters (Low-Mod Friction)
    { from: "South Goa", to: "Gokarna", mode: "Coastal Drive", time: 2.5, dist: 115, fatigue: 2.5 },
    { from: "Gokarna", to: "Mysore", mode: "Highway Drive", time: 8.0, dist: 450, fatigue: 7.5 },
    { from: "Alleppey", to: "Varkala", mode: "Coastal Drive", time: 3.0, dist: 117, fatigue: 3.0 },
    { from: "Alleppey", to: "Munroe Island", mode: "Coastal Drive", time: 2.0, dist: 80, fatigue: 2.0 },
    { from: "Munroe Island", to: "Varkala", mode: "Coastal Drive", time: 1.5, dist: 50, fatigue: 1.5 },
    
    // Intra-Cluster: Tea & Jungles (Moderate Friction)
    { from: "Alleppey", to: "Munnar", mode: "Winding Drive", time: 4.5, dist: 170, fatigue: 5.0 },
    { from: "Munnar", to: "Kabini", mode: "Winding Drive", time: 7.0, dist: 300, fatigue: 6.5 },
    { from: "Mysore", to: "Kabini", mode: "Highway Drive", time: 2.0, dist: 80, fatigue: 2.0 },
    
    // Inter-Cluster Flights (Hubs) (Low Friction)
    { from: "Delhi", to: "Mumbai", mode: "Direct Flight", time: 2.2, dist: 1150, fatigue: 2.0 },
    { from: "Delhi", to: "Leh-Ladakh", mode: "Direct Flight", time: 1.5, dist: 615, fatigue: 2.5 },
    { from: "Delhi", to: "Udaipur", mode: "Direct Flight", time: 1.5, dist: 575, fatigue: 2.0 },
    { from: "Delhi", to: "Varanasi", mode: "Direct Flight", time: 1.5, dist: 680, fatigue: 2.0 },
    { from: "Delhi", to: "Rishikesh", mode: "Highway Drive", time: 5.0, dist: 240, fatigue: 4.5 },
    { from: "Delhi", to: "Manali", mode: "Overnight Bus/Drive", time: 12.0, dist: 530, fatigue: 8.0 },
    { from: "Delhi", to: "Gulmarg", mode: "Flight to Srinagar + Drive", time: 4.0, dist: 850, fatigue: 4.0 },
    { from: "Delhi", to: "Jaipur", mode: "Express Train/Drive", time: 4.0, dist: 280, fatigue: 3.5 },
    { from: "Delhi", to: "Ranthambore", mode: "Train", time: 4.0, dist: 380, fatigue: 3.5 },
    { from: "Mumbai", to: "South Goa", mode: "Direct Flight", time: 1.2, dist: 400, fatigue: 1.5 },
    { from: "Mumbai", to: "Udaipur", mode: "Direct Flight", time: 1.5, dist: 750, fatigue: 2.0 },
    { from: "Mumbai", to: "Varanasi", mode: "Direct Flight", time: 2.5, dist: 1250, fatigue: 3.0 },
    { from: "Mumbai", to: "Hampi", mode: "Flight + Drive", time: 5.0, dist: 600, fatigue: 6.0 },
    
    // Distant/Island Connections
    { from: "Mumbai", to: "Havelock Island", mode: "Flight to Port Blair + Ferry", time: 8.0, dist: 2300, fatigue: 7.0 },
    { from: "Delhi", to: "Darjeeling", mode: "Flight to Bagdogra + Drive", time: 5.0, dist: 1100, fatigue: 6.0 },
    { from: "Delhi", to: "Kaziranga", mode: "Flight to Guwahati + Drive", time: 6.0, dist: 1600, fatigue: 6.5 },
    { from: "Delhi", to: "Meghalaya", mode: "Flight to Shillong", time: 4.0, dist: 1500, fatigue: 5.0 },
    { from: "Darjeeling", to: "Kaziranga", mode: "Flight + Drive", time: 8.0, dist: 600, fatigue: 7.5 },
    { from: "Delhi", to: "Ziro Valley", mode: "Flight to Guwahati + Long Drive", time: 10.0, dist: 1800, fatigue: 8.5 },
    { from: "Kaziranga", to: "Ziro Valley", mode: "Road", time: 6.0, dist: 250, fatigue: 5.5 },
    { from: "Meghalaya", to: "Ziro Valley", mode: "Road", time: 12.0, dist: 450, fatigue: 9.0 },
    
    // Cross-Country Hub Flights
    { from: "Udaipur", to: "South Goa", mode: "Connecting Flight", time: 4.5, dist: 1000, fatigue: 4.5 },
    { from: "Jaipur", to: "Varanasi", mode: "Direct Flight", time: 1.8, dist: 700, fatigue: 2.5 },
  ];

  const allRoutes: typeof baseRoutes = [];
  baseRoutes.forEach(r => {
    allRoutes.push(r);
    // Reverse route
    allRoutes.push({
      from: r.to,
      to: r.from,
      mode: r.mode,
      time: r.time,
      dist: r.dist,
      fatigue: r.fatigue
    });
  });

  for (const r of allRoutes) {
    const orig = await prisma.destination.findUnique({ where: { id: r.from } });
    const dest = await prisma.destination.findUnique({ where: { id: r.to } });
    
    if (orig && dest) {
      await prisma.transitRoute.upsert({
        where: {
          originId_destinationId: {
            originId: orig.id,
            destinationId: dest.id
          }
        },
        update: {
          travelMode: r.mode,
          durationHours: r.time,
          distanceKm: r.dist,
          fatigueCost: r.fatigue,
          updatedAt: new Date()
        },
        create: {
          id: uuidv4(),
          originId: orig.id,
          destinationId: dest.id,
          travelMode: r.mode,
          durationHours: r.time,
          distanceKm: r.dist,
          fatigueCost: r.fatigue,
          updatedAt: new Date()
        }
      });
    }
  }

  console.log("Seed successfully executed idempotently.");
}

main().catch(e => { console.error(e); process.exit(1); });