const fs = require('fs');

const batch6 = [
  {
    "id": "konkan_coast_circuit",
    "name": "Konkan Coast Circuit",
    "description": "The Konkan Coast stretches 700 km from Mumbai to Goa along Maharashtra and Karnataka's western coastline — a largely undiscovered treasure of pristine beaches, sea forts, mango groves, fish cuisine and colonial ports. The Konkan Railway makes it accessible for scenic journeys through tunnels and bridges.",
    "shortPitch": "Stretching along India's western edge, the Konkan Coast is an undiscovered treasure of pristine, empty beaches and spectacular cliffside sea forts. A journey on the scenic Konkan Railway reveals a deeply authentic coastal world of mango groves and legendary seafood.",
    "topHighlights": [
      "Taking a dramatic, scenic train ride on the legendary Konkan Railway",
      "Exploring the colossal, island-bound Sindhudurg Sea Fort",
      "Relaxing on the pristine, uncrowded sands of Tarkarli and Malvan"
    ],
    "region": "West",
    "vibeTags": ["Authentic", "Pristine", "Scenic"],
    "idealSeason": "Oct–Mar",
    "landscapes": ["Beaches", "Hidden Villages"],
    "peakMonths": [10, 11, 12, 1, 2, 3],
    "shoulderMonths": [9, 4],
    "avoidMonths": [5, 6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 5,
    "latitude": 16.0,
    "longitude": 73.5,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "kashmir_circuit",
    "name": "Kashmir Circuit",
    "description": "The Kashmir Circuit covers Srinagar, Gulmarg, Pahalgam, Sonamarg and Sonmarg — India's most scenically diverse mountain circuit, from Dal Lake houseboats to alpine ski slopes to glacier meadows. The circuit passes through some of the most photographed landscapes in Asia.",
    "shortPitch": "India's most breathtakingly beautiful mountain circuit crosses through the legendary 'Paradise on Earth'. From floating in a Dal Lake houseboat to skiing the alpine slopes of Gulmarg, it is an unforgettable journey through mist and snow.",
    "topHighlights": [
      "Drifting on a traditional Shikara boat across Srinagar's Dal Lake",
      "Taking the world's second-highest gondola up the snowy peaks of Gulmarg",
      "Trekking the lush, flower-strewn meadows of Pahalgam"
    ],
    "region": "North",
    "vibeTags": ["Romantic", "Scenic", "Dreamy"],
    "idealSeason": "Mar–Oct",
    "landscapes": ["Mountains"],
    "peakMonths": [4, 5, 6, 7, 8, 9, 10],
    "shoulderMonths": [3, 11],
    "avoidMonths": [12, 1, 2],
    "closedMonths": [],
    "minRequiredDays": 7,
    "latitude": 34.0837,
    "longitude": 74.7973,
    "requiresAcclimatization": false,
    "isHub": true
  },
  {
    "id": "sundarbans_region",
    "name": "Sundarbans Region",
    "description": "The Sundarbans mangrove delta at the mouth of the Ganges spans India and Bangladesh. The Indian side's Sundarbans National Park is a UNESCO World Heritage Site and home to the Bengal tiger, Irrawaddy dolphin, saltwater crocodile and Olive Ridley sea turtles. Village tourism and community-run boat safaris are emerging.",
    "shortPitch": "This mystical UNESCO World Heritage delta is an intricate network of tidal waterways and the world's largest mangrove forest. It offers a totally unique, community-driven eco-safari experience into the habitat of the elusive, swimming Bengal tiger.",
    "topHighlights": [
      "Cruising the dense, mysterious mangrove creeks by wooden boat",
      "Spotting saltwater crocodiles and rare dolphins in the delta",
      "Engaging with local village communities on an authentic eco-tour"
    ],
    "region": "East",
    "vibeTags": ["Mysterious", "Unique", "Untouched"],
    "idealSeason": "Oct–Mar",
    "landscapes": ["Wildlife & Jungle"],
    "peakMonths": [10, 11, 12, 1, 2, 3],
    "shoulderMonths": [9, 4],
    "avoidMonths": [5, 6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 3,
    "latitude": 21.9497,
    "longitude": 89.1833,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "dwarka_somnath",
    "name": "Dwarka & Somnath",
    "description": "Dwarka is one of the four sacred Hindu Dhams and the legendary kingdom of Lord Krishna. The Dwarkadhish Temple sits at the edge of the Arabian Sea. Nearby Somnath holds the first of 12 Jyotirlinga shrines of Lord Shiva, rebuilt numerous times after Islamic invasions and now a symbol of Hindu resilience.",
    "shortPitch": "Perched dramatically on the Arabian Sea, this deeply sacred coastal circuit links Lord Krishna's legendary kingdom of Dwarka with Somnath. Somnath's towering oceanfront temple is a breathtaking symbol of architectural resilience and spiritual devotion.",
    "topHighlights": [
      "Witnessing the powerful crashing waves against the Somnath Jyotirlinga Temple",
      "Taking a ferry across the sea to the ancient island of Bet Dwarka",
      "Experiencing the vibrant evening aarti at the Dwarkadhish Temple"
    ],
    "region": "West",
    "vibeTags": ["Sacred", "Resilient", "Historic"],
    "idealSeason": "Oct–Mar",
    "landscapes": ["Spiritual India", "Beaches"],
    "peakMonths": [10, 11, 12, 1, 2, 3],
    "shoulderMonths": [9],
    "avoidMonths": [4, 5, 6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 3,
    "latitude": 22.2442,
    "longitude": 68.9685,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "tiruvannamalai",
    "name": "Tiruvannamalai",
    "description": "Tiruvannamalai is one of Tamil Nadu's most spiritually potent destinations — home to Arunachaleswarar Temple (dedicated to Shiva as fire element) and the sacred Arunachala Hill. The Girivalam — a barefoot circumambulation of the hill — is performed by hundreds of thousands every full moon night.",
    "shortPitch": "A deeply potent spiritual epicenter in South India, Tiruvannamalai is dominated by the sacred Arunachala Hill and its colossal Shiva temple. It draws seekers from around the world to meditate in the ashram of Ramana Maharshi.",
    "topHighlights": [
      "Walking the sacred Girivalam barefoot path around Arunachala Hill",
      "Meditating in the peaceful, globally renowned Ramana Maharshi Ashram",
      "Exploring the massive courtyards of the Arunachaleswarar Temple"
    ],
    "region": "South",
    "vibeTags": ["Spiritual", "Zen", "Awakening"],
    "idealSeason": "Oct–Mar",
    "landscapes": ["Spiritual India"],
    "peakMonths": [10, 11, 12, 1, 2, 3],
    "shoulderMonths": [9],
    "avoidMonths": [4, 5, 6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 2,
    "latitude": 12.2253,
    "longitude": 79.0747,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "vrindavan_mathura",
    "name": "Vrindavan & Mathura",
    "description": "Mathura is the birthplace of Lord Krishna and Vrindavan the place of his childhood divine play (leela). The twin cities on the Yamuna River are among Hinduism's most sacred sites, with hundreds of colourful temples, the Holi festival (celebrated most exuberantly here) and year-round pilgrimage traffic.",
    "shortPitch": "The vibrant twin cities on the Yamuna River are the joyful epicenters of Krishna devotion. Boasting hundreds of colourful temples, this sacred corridor famously erupts into the most spectacular, exuberant Holi festival celebration in the world.",
    "topHighlights": [
      "Experiencing the intensely colorful and chaotic Holi festival (in spring)",
      "Visiting the sacred birthplace of Krishna at the Janmabhoomi Temple",
      "Attending the mesmerizing evening aarti at the Banke Bihari Temple"
    ],
    "region": "North",
    "vibeTags": ["Vibrant", "Sacred", "Intense"],
    "idealSeason": "Oct–Mar",
    "landscapes": ["Spiritual India"],
    "peakMonths": [10, 11, 12, 1, 2, 3],
    "shoulderMonths": [9],
    "avoidMonths": [4, 5, 6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 2,
    "latitude": 27.4924,
    "longitude": 77.6737,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "kutch",
    "name": "Kutch (Bhuj region)",
    "description": "Kutch is Gujarat's most distinctive cultural landscape — a semi-arid region of extraordinary artisan traditions. Bhuj, its capital, is the hub for embroidery, bandhani tie-dye, copper-bell making and Ahir mirror-work produced by communities that have preserved craft techniques for centuries. The Rann of Kutch salt desert lies on its edge.",
    "shortPitch": "A stark, semi-arid desert region in Gujarat, Kutch is incredibly rich in tribal heritage and artisan traditions. Its villages are living museums of intricate embroidery, ancient mirror-work, and centuries-old crafts, all bordering a vast white salt desert.",
    "topHighlights": [
      "Shopping directly from master artisans in remote craft villages like Nirona",
      "Exploring the beautiful Aina Mahal (Palace of Mirrors) in Bhuj",
      "Visiting the incredibly ancient Harappan ruins of Dholavira"
    ],
    "region": "West",
    "vibeTags": ["Tribal", "Authentic", "Artisanal"],
    "idealSeason": "Oct–Mar",
    "landscapes": ["Desert", "Hidden Villages"],
    "peakMonths": [10, 11, 12, 1, 2, 3],
    "shoulderMonths": [9],
    "avoidMonths": [4, 5, 6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 3,
    "latitude": 23.242,
    "longitude": 69.6669,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "lonar",
    "name": "Lonar Crater Lake",
    "description": "Lonar is a meteor-impact crater lake 50,000 years old — the third largest natural saline crater lake in the world. The lake's hyper-saline alkaline waters harbour unique pink algae and rare micro-organisms, while ancient temples ring the crater rim in a hauntingly beautiful forest setting.",
    "shortPitch": "Formed by a massive meteor impact 50,000 years ago, Lonar is a hauntingly beautiful, hyper-saline crater lake. Ringed by a lush forest and ancient, forgotten temples, it is a uniquely fascinating geological and historical wonder.",
    "topHighlights": [
      "Trekking down into the 50,000-year-old meteor impact crater",
      "Discovering the ancient, intricately carved Daitya Sudan Temple",
      "Spotting migratory flamingos on the lake's unique pinkish waters"
    ],
    "region": "West",
    "vibeTags": ["Mysterious", "Unique", "Ancient"],
    "idealSeason": "Oct–Mar",
    "landscapes": ["Hidden Villages"],
    "peakMonths": [10, 11, 12, 1, 2, 3],
    "shoulderMonths": [9],
    "avoidMonths": [4, 5, 6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 1,
    "latitude": 19.9765,
    "longitude": 76.5085,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "chettinad",
    "name": "Chettinad",
    "description": "Chettinad is the homeland of the Nattukotai Chettiar merchant community, famous for their palatial mansions (with Burma teak, Italian marble and Athangudi tiles), the most complex regional cuisine in India, and antique collecting traditions. The crumbling palaces of Karaikudi and Kanadukathan are a singular architectural heritage.",
    "shortPitch": "Once the homeland of incredibly wealthy merchants, Chettinad is a surreal landscape of crumbling, palatial mansions built with Burmese teak and Italian marble. It is a haven for architecture lovers, antique collectors, and gourmands.",
    "topHighlights": [
      "Wandering through massive, extravagantly decorated 19th-century mansions",
      "Tasting the intensely flavorful, world-renowned authentic Chettinad cuisine",
      "Hunting for unique vintage treasures in Karaikudi's antique markets"
    ],
    "region": "South",
    "vibeTags": ["Historic", "Nostalgic", "Decadent"],
    "idealSeason": "Nov–Feb",
    "landscapes": ["Hidden Villages", "Royal Cities"],
    "peakMonths": [11, 12, 1, 2],
    "shoulderMonths": [10, 3],
    "avoidMonths": [4, 5, 6, 7, 8, 9],
    "closedMonths": [],
    "minRequiredDays": 2,
    "latitude": 10.0716,
    "longitude": 78.7844,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "mandu",
    "name": "Mandu (Mandavgad)",
    "description": "Mandu is a plateau fort-city of the 15th-century Malwa Sultanate, where the love story of Sultan Baz Bahadur and his singer queen Rani Roopmati still echoes through the ruins. Dozens of Afghan-style palaces, mosques, pavilions and step-wells are scattered across a lush jungle plateau with dramatic gorge views.",
    "shortPitch": "Perched on a dramatic jungle plateau, Mandu is a vast, wildly romantic ruined city of the 15th-century Malwa Sultanate. Its Afghan-style palaces, step-wells, and pavilions offer an incredibly atmospheric, uncrowded heritage experience.",
    "topHighlights": [
      "Exploring the astonishing, boat-shaped Jahaz Mahal (Ship Palace)",
      "Enjoying dramatic gorge views from Rani Roopmati's Pavilion",
      "Wandering the peaceful, white-marble Hoshang Shah's Tomb"
    ],
    "region": "East",
    "vibeTags": ["Romantic", "Historic", "Quiet"],
    "idealSeason": "Jul–Mar",
    "landscapes": ["Royal Cities", "Hidden Villages"],
    "peakMonths": [7, 8, 9, 10, 11, 12, 1, 2, 3],
    "shoulderMonths": [],
    "avoidMonths": [4, 5, 6],
    "closedMonths": [],
    "minRequiredDays": 2,
    "latitude": 22.3377,
    "longitude": 75.4023,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "zanskar_circuit",
    "name": "Zanskar Circuit",
    "description": "The Zanskar Circuit — accessed via Kargil or Manali — is India's most adventurous mountain circuit, through one of the world's most remote valleys. The legendary Chadar Trek (frozen river), Phugtal Monastery and Zanskar River rafting attract only the most committed adventurers.",
    "shortPitch": "Hidden deep in the Himalayas, Zanskar is India's most rugged and fiercely remote mountain circuit. It rewards the most committed adventurers with ancient cliffside monasteries and the legendary winter Chadar Trek over a frozen river.",
    "topHighlights": [
      "Trekking across the frozen Zanskar River on the epic Chadar Trek",
      "Marveling at the spectacular, cliff-hanging Phugtal Monastery",
      "Navigating intense white-water rapids on the Zanskar River"
    ],
    "region": "North",
    "vibeTags": ["Extreme", "Remote", "Wild"],
    "idealSeason": "Jun–Sep",
    "landscapes": ["Cold Desert", "Mountains"],
    "peakMonths": [6, 7, 8, 9],
    "shoulderMonths": [1, 2],
    "avoidMonths": [10, 11, 12, 3, 4, 5],
    "closedMonths": [],
    "minRequiredDays": 7,
    "latitude": 33.4735,
    "longitude": 76.8378,
    "requiresAcclimatization": true,
    "isHub": false
  },
  {
    "id": "unakoti",
    "name": "Unakoti",
    "description": "Unakoti — meaning 'one less than a crore' — is a stunning hillside complex of giant rock carvings and sculptures dating to the 7th–9th centuries, hidden deep in the forests of Tripura. The massive 30-foot Shiva heads emerging from the jungle are among the most dramatic archaeological discoveries in Northeast India.",
    "shortPitch": "Hidden deep in the jungles of Tripura, Unakoti is a stunning, mysterious hillside covered in massive rock carvings from the 7th century. The giant, 30-foot stone faces of Shiva emerging from the forest are a dramatic, undiscovered marvel.",
    "topHighlights": [
      "Hiking through the lush jungle trail to discover giant rock-cut sculptures",
      "Standing in awe before the massive, 30-foot central Shiva head",
      "Cooling off by the picturesque, cascading Unakoti waterfall"
    ],
    "region": "East",
    "vibeTags": ["Mysterious", "Ancient", "Untouched"],
    "idealSeason": "Oct–Mar",
    "landscapes": ["Spiritual India", "Hidden Villages"],
    "peakMonths": [10, 11, 12, 1, 2, 3],
    "shoulderMonths": [9],
    "avoidMonths": [4, 5, 6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 1,
    "latitude": 24.3168,
    "longitude": 92.0163,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "aizawl_mizoram",
    "name": "Aizawl & Mizoram",
    "description": "Mizoram — one of India's least visited states — is a land of rolling bamboo-covered hills, deeply Christian culture, thriving choir traditions and one of India's highest literacy rates. Aizawl perches dramatically on a ridge at 1,132 m, and the Mizo people are among the most hospitable and unique communities in the subcontinent.",
    "shortPitch": "One of India's most remote and least-visited states, Mizoram is a rolling landscape of bamboo forests and deeply hospitable, choir-singing communities. The capital Aizawl sits dramatically on a high ridge, offering incredible serenity and cultural immersion.",
    "topHighlights": [
      "Enjoying sweeping, panoramic views from the high-ridge city of Aizawl",
      "Attending the vibrant, bamboo-focused Chapchar Kut spring festival",
      "Exploring the pristine, untamed forests of Phawngpui (Blue Mountain)"
    ],
    "region": "East",
    "vibeTags": ["Untouched", "Peaceful", "Tribal"],
    "idealSeason": "Oct–Mar",
    "landscapes": ["Hidden Villages", "Mountains"],
    "peakMonths": [10, 11, 12, 1, 2, 3],
    "shoulderMonths": [9],
    "avoidMonths": [4, 5, 6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 3,
    "latitude": 23.7271,
    "longitude": 92.7176,
    "requiresAcclimatization": false,
    "isHub": false
  }
];

const existingData = JSON.parse(fs.readFileSync('prisma/data.json', 'utf8'));

// Fix vibes that I missed previously to avoid Zod failures
const VALID_VIBES = ["Otherworldly", "Bold", "Remote", "Spiritual", "Wild", "Exhilarating", "Winter Wonderland", "Luxury", "Peaceful", "Rustic", "Romantic", "Regal", "Historic", "Vibrant", "Mystical", "Golden", "Iconic", "Authentic", "Quiet", "Cultural", "Relaxed", "Lush", "Soulful", "Bohemian", "Pristine", "Tropical", "Dreamy", "Slow", "Hidden", "Tranquil", "Exclusive", "Raw", "Mysterious", "Unique", "Restorative", "Nostalgic", "Scenic", "Magical", "Pure", "Tribal", "Untouched", "Intense", "Sacred", "Zen", "Awakening", "Surreal", "Cosmopolitan", "Fast-paced", "Bustling"];

batch6.forEach(item => {
  item.vibeTags = item.vibeTags.map(v => {
    if (v === "Artisanal") return "Rustic";
    if (v === "Resilient") return "Historic";
    if (v === "Ancient") return "Historic";
    if (v === "Decadent") return "Luxury";
    if (v === "Extreme") return "Exhilarating";
    if (!VALID_VIBES.includes(v)) return "Surreal";
    return v;
  });
});

const merged = [...existingData, ...batch6];
fs.writeFileSync('prisma/data.json', JSON.stringify(merged, null, 2));

console.log('Appended batch 6.');
