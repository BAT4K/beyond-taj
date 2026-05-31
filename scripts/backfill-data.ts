// @ts-nocheck
import 'dotenv/config';
import fs from 'fs';
import prisma from '../lib/prisma';

const missingDataMap: Record<string, any> = {
  "Darjeeling": { lat: 27.036, lng: 88.2627, shortPitch: "Synonymous with the world's finest teas, Darjeeling is a timeless Himalayan retreat. The vintage UNESCO Toy Train and colonial-era charm make it deeply nostalgic and romantic.", highlights: ["Watching the sunrise over Kanchenjunga from Tiger Hill", "Riding the historic UNESCO Darjeeling Himalayan Railway", "Touring legendary tea estates and tasting first-flush brews"] },
  "Spiti Valley": { lat: 32.2461, lng: 78.0349, shortPitch: "A harsh, high-altitude cold desert, Spiti offers a landscape of stark, otherworldly beauty. Ancient Buddhist monasteries cling to treacherous cliffs, preserving a centuries-old Tibetan culture.", highlights: ["Visiting the 1,000-year-old Key Monastery", "Stargazing in the unpolluted night skies of Kibber village", "Crossing the dizzying Kunzum Pass"] },
  "Mysore": { lat: 12.2958, lng: 76.6394, shortPitch: "The cultural capital of Karnataka, Mysore is an elegant city famous for its spectacular royal heritage. Its legacy of silk, sandalwood, and yoga makes it profoundly rich and vibrant.", highlights: ["Exploring the opulent, illuminated Mysore Palace", "Strolling through the fragrant Devaraja Market", "Studying traditional Ashtanga yoga"] },
  "Gokarna": { lat: 14.5398, lng: 74.3180, shortPitch: "A soulful confluence of a sacred temple town and secluded crescent beaches. Gokarna offers a quiet, bohemian alternative to Goa's commercial coastlines.", highlights: ["Trekking the lush coastal trail between Om Beach and Half Moon Beach", "Witnessing ancient rituals at the Mahabaleshwar Temple", "Watching the sun set over the pristine Arabian Sea"] },
  "Varkala": { lat: 8.7338, lng: 76.7059, shortPitch: "Famous for its striking laterite cliffs plunging into the Arabian Sea, Varkala is a bohemian haven. It draws spiritual seekers, surfers, and yogis to its healing mineral springs.", highlights: ["Walking the iconic cliff-top promenade at sunset", "Bathing in the natural, holy mineral springs at Papanasam Beach", "Practicing yoga overlooking the vast ocean"] },
  "Meghalaya": { lat: 25.4670, lng: 91.3662, shortPitch: "The 'Abode of Clouds', Meghalaya is arguably India's greenest and most dramatic state. It is famous for its living root bridges, plunging waterfalls, and deep, mysterious caves.", highlights: ["Trekking to the ancient double-decker living root bridges", "Exploring the vast limestone networks of Mawsmai Cave", "Boating on the crystal-clear waters of the Dawki river"] },
  "Ziro Valley": { lat: 27.5350, lng: 93.8290, shortPitch: "A lush, incredibly scenic valley in Arunachal Pradesh, home to the fascinating Apatani tribe. Its terraced rice fields and pine-clad hills host India's most famous indie music festival.", highlights: ["Meeting the Apatani tribe known for their facial tattoos", "Attending the vibrant Ziro Festival of Music", "Hiking through dense pine and bamboo forests"] },
  "Kaziranga": { lat: 26.5775, lng: 93.1711, shortPitch: "A UNESCO World Heritage site, Kaziranga's vast floodplains are the last stronghold of the one-horned rhinoceros. This primordial landscape offers arguably the best megafauna viewing in India.", highlights: ["Spotting the rare one-horned rhinoceros on a jeep safari", "Observing wild elephant herds crossing the Brahmaputra floodplains", "Birdwatching for over 400 exotic species"] },
  "Havelock Island": { lat: 11.9761, lng: 92.9876, shortPitch: "India's premier tropical island, Havelock boasts some of Asia's finest scuba diving and pristine, sugar-white beaches. The juxtaposition of deep rainforests meeting neon-blue water is truly magical.", highlights: ["Scuba diving over pristine coral reefs", "Swimming in the luminescent waters of Radhanagar Beach", "Kayaking through ancient, dense mangrove forests"] },
  "Jawai": { lat: 25.1054, lng: 73.1491, shortPitch: "A stark, dramatic landscape in Rajasthan where leopards roam freely among massive granite boulders. Jawai offers a unique, luxurious wilderness experience intertwined with local Rabari herdsmen.", highlights: ["Tracking wild leopards thriving in the rocky granite hills", "Staying in ultra-luxury, sustainable wilderness camps", "Interacting with the indigenous Rabari pastoralists"] },
  "Udaipur": { lat: 24.5854, lng: 73.7125, shortPitch: "Often called the Venice of the East, Udaipur is a city of shimmering lakes and floating marble palaces. Its romantic, regal ambiance is unmatched in the Indian subcontinent.", highlights: ["Taking a sunset boat cruise on Lake Pichola", "Exploring the vast, ornate corridors of the City Palace", "Dining at the iconic, floating Taj Lake Palace"] },
  "Jodhpur": { lat: 26.2389, lng: 73.0243, shortPitch: "The Blue City is shadowed by the colossal, imposing Mehrangarh Fort. Jodhpur is a vibrant maze of indigo-painted houses, bustling bazaars, and stark desert beauty.", highlights: ["Touring the imposing, magnificent Mehrangarh Fort", "Wandering through the indigo-painted alleys of the old city", "Ziplining across the fort's deep historical moats"] },
  "Leh-Ladakh": { lat: 34.1526, lng: 77.5771, shortPitch: "A high-altitude desert of crystal-clear lakes, barren mountains, and ancient Tibetan monasteries. Ladakh is an otherworldly frontier that feels entirely removed from the rest of India.", highlights: ["Gazing at the shifting blues of Pangong Tso lake", "Driving over Khardung La, one of the world's highest motorable passes", "Exploring the centuries-old Thiksey Monastery"] },
  "Manali": { lat: 32.2396, lng: 77.1887, shortPitch: "Nestled in the Beas River valley, Manali is India's premier alpine resort town. It serves as a basecamp for extreme mountain adventures and high-altitude treks.", highlights: ["Paragliding over the lush Solang Valley", "Driving through the snow-walled Atal Tunnel", "Relaxing in the natural hot springs of Vashisht"] },
  "Munnar": { lat: 10.0889, lng: 77.0595, shortPitch: "A breathtakingly green hill station carpeted entirely in rolling emerald tea plantations. Munnar is a cool, misty sanctuary perched high in the Western Ghats.", highlights: ["Walking through endless, manicured tea estates", "Visiting the highest tea factory in the world", "Trekking to the dramatic viewpoints of Echo Point"] },
  "Hampi": { lat: 15.3350, lng: 76.4600, shortPitch: "An otherworldly landscape of surreal boulder formations interspersed with the colossal ruins of the Vijayanagara Empire. Hampi feels like stepping onto another planet.", highlights: ["Cycling through the sprawling, epic ruins of the Vijayanagara Empire", "Climbing Matanga Hill for a panoramic sunrise view", "Crossing the Tungabhadra river in a traditional coracle boat"] },
  "Mumbai": { lat: 19.0760, lng: 72.8777, shortPitch: "India's maximum city is a frenetic, fast-paced powerhouse of dreams, finance, and Bollywood. It is a cosmopolitan melting pot boasting spectacular Victorian Gothic architecture.", highlights: ["Walking the iconic Marine Drive promenade at night", "Admiring the Victorian Gothic architecture of CST railway station", "Taking a boat to the ancient Elephanta Caves"] },
  "Alleppey": { lat: 9.4981, lng: 76.3388, shortPitch: "The heart of Kerala's backwaters, Alleppey is a dreamy network of lush, palm-fringed canals. Drifting on a luxury houseboat here is one of India's most serene experiences.", highlights: ["Cruising the vast backwater canals on a traditional houseboat", "Enjoying freshly caught Karimeen fish cooked on board", "Watching village life unfold slowly along the riverbanks"] },
  "Munroe Island": { lat: 8.9892, lng: 76.6196, shortPitch: "A hidden gem in the Kerala backwaters, Munroe Island offers an intimate, untouched network of narrow canals. It is perfect for quiet canoe explorations away from the commercial houseboat routes.", highlights: ["Taking a silent, sunrise canoe ride through narrow mangrove canals", "Watching traditional coir weaving in a local village", "Enjoying the absolute tranquility of untouched backwaters"] },
  "Kabini": { lat: 11.8596, lng: 76.2655, shortPitch: "Forming the heart of the Nilgiri Biosphere, these contiguous forests hold the world's highest concentration of Asian elephants. The lush landscape provides world-class sightings of tigers and leopards.", highlights: ["Taking a boat safari to see giant herds of Asian elephants", "Tracking the elusive black panther in the dense teak forests", "Staying in luxury lodges right on the edge of the Kabini reservoir"] },
  "Bundi": { lat: 25.4305, lng: 75.6499, shortPitch: "An underrated Rajasthani town famous for its spectacular stepwells, blue houses, and exquisite miniature paintings. Bundi is a quiet, authentic alternative to the busier tourist hubs.", highlights: ["Exploring the decaying, atmospheric ruins of Taragarh Fort", "Admiring the incredibly detailed miniature paintings of Garh Palace", "Discovering the ancient, ornate stepwells scattered across town"] },
  "South Goa": { lat: 15.2993, lng: 74.1240, shortPitch: "Characterized by serene, palm-fringed luxury beaches, South Goa is the antithesis of the crowded northern party scenes. It offers world-class resorts, pristine sands, and absolute relaxation.", highlights: ["Relaxing on the pristine, quiet white sands of Palolem Beach", "Staying in ultra-luxury, colonial-style beach resorts", "Exploring lush, abandoned Portuguese forts"] },
  "Ranthambore": { lat: 26.0173, lng: 76.2215, shortPitch: "One of the best places in the world to photograph wild tigers in their natural habitat. Ranthambore blends spectacular wildlife viewing with crumbling, ancient jungle ruins.", highlights: ["Going on early morning tiger safaris in the dry deciduous forest", "Photographing tigers prowling through 10th-century temple ruins", "Visiting the colossal Ranthambore Fort within the park"] },
  "Delhi": { lat: 28.6139, lng: 77.2090, shortPitch: "The chaotic, vibrant capital of India, bridging two distinct worlds. Old Delhi's labyrinthine Mughal bazaars contrast sharply with New Delhi's grand, tree-lined colonial boulevards.", highlights: ["Exploring the massive sandstone marvel of the Red Fort", "Eating legendary street food in the chaotic alleys of Chandni Chowk", "Wandering through the serene, magnificent Humayun's Tomb"] },
  "Gulmarg": { lat: 34.0484, lng: 74.3805, shortPitch: "A pristine winter wonderland boasting some of the highest and finest ski slopes in Asia. Gulmarg offers deep powder snow and breathtaking views of the Himalayas.", highlights: ["Skiing deep powder snow on the massive Apharwat Peak", "Riding the Gulmarg Gondola, one of the world's highest cable cars", "Staying in a cozy, snow-covered luxury alpine lodge"] },
  "Tirthan Valley": { lat: 31.6380, lng: 77.3436, shortPitch: "An off-the-radar Himalayan gem defined by crystal trout streams and traditional wooden architecture. Serving as the gateway to the Great Himalayan National Park, it offers unmatched tranquility.", highlights: ["Fly-fishing for rainbow trout in the pristine Tirthan River", "Trekking deep into the Great Himalayan National Park", "Staying in a traditional, intricately carved wooden homestay"] },
  "Varanasi": { lat: 25.3176, lng: 82.9739, shortPitch: "One of the oldest continuously inhabited cities in the world, Varanasi is India's spiritual epicenter. The intense, raw devotion on the banks of the River Ganges is an awakening experience.", highlights: ["Taking a silent sunrise boat ride along the ancient ghats", "Witnessing the hypnotic, fire-lit evening Ganga Aarti ceremony", "Navigating the intensely chaotic, sacred alleys of the old city"] },
  "Rishikesh": { lat: 30.0869, lng: 78.2676, shortPitch: "The Yoga Capital of the World, nestled in the Himalayan foothills where the Ganges runs clear. It blends profound spirituality with adrenaline-pumping white water rafting.", highlights: ["Practicing yoga and meditation at world-renowned ashrams", "White water rafting down the turbulent, ice-cold Ganges", "Attending the deeply spiritual evening Aarti by the river"] },
  "Jaisalmer": { lat: 26.9157, lng: 70.9083, shortPitch: "A golden mirage rising from the stark Thar Desert, defined by its massive, living fort. Jaisalmer offers a mystical, camel-led journey into the heart of Rajasthan's dunes.", highlights: ["Sleeping under the stars on a luxury desert camel safari", "Wandering the narrow alleys of the massive, living Jaisalmer Fort", "Admiring the impossibly intricate sandstone carvings of the Patwon Ki Haveli"] },
  "Jaipur": { lat: 26.9124, lng: 75.7873, shortPitch: "The iconic Pink City, forming a crucial point of the Golden Triangle. Jaipur is a sensory overload of bustling bazaars, stunning palaces, and formidable hilltop forts.", highlights: ["Riding an elephant up to the colossal, magnificent Amber Fort", "Photographing the incredibly ornate, honeycomb facade of the Hawa Mahal", "Shopping for exquisite textiles and jewelry in the vibrant old city"] }
};

async function backfill() {
  console.log('Starting Backfill process...');

  const dataPath = './prisma/data.json';
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  
  let dbUpdates = 0;
  
  // 1. Fetch DB records
  const dbDestinations = await prisma.destination.findMany();
  const dbMissing = dbDestinations.filter(dest => {
    return !dest.latitude || !dest.longitude || !dest.shortPitch || dest.shortPitch.length < 10 || !dest.topHighlights || dest.topHighlights.length < 3;
  });

  console.log(`Found ${dbMissing.length} destinations missing data in the database.`);

  for (const record of dbMissing) {
    const patch = missingDataMap[record.id];
    if (patch) {
      // Update DB
      await prisma.destination.update({
        where: { id: record.id },
        data: {
          latitude: patch.lat,
          longitude: patch.lng,
          shortPitch: patch.shortPitch,
          topHighlights: patch.highlights
        }
      });
      dbUpdates++;
      
      // Update data.json if it exists there, else append
      const jsonIndex = data.findIndex((d: any) => d.id === record.id);
      if (jsonIndex >= 0) {
        data[jsonIndex].latitude = patch.lat;
        data[jsonIndex].longitude = patch.lng;
        data[jsonIndex].shortPitch = patch.shortPitch;
        data[jsonIndex].topHighlights = patch.highlights;
      } else {
        data.push({
          ...record,
          latitude: patch.lat,
          longitude: patch.lng,
          shortPitch: patch.shortPitch,
          topHighlights: patch.highlights
        });
      }
    }
  }

  // 2. Overwrite prisma/data.json
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  console.log(`Overwrote prisma/data.json. Total DB updates: ${dbUpdates}`);
}

backfill()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
