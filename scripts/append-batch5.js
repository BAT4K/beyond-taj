const fs = require('fs');

const batch5 = [
  {
    "id": "chennai",
    "name": "Chennai",
    "description": "Chennai is the capital of Tamil Nadu and the gateway to South India. It is India's fourth-largest city and the centre of classical Carnatic music, Bharatanatyam dance, ancient Dravidian temple architecture and South Indian cinema. Marina Beach — the world's second-longest urban beach — runs the length of the city.",
    "shortPitch": "The cultural gateway to South India, Chennai beautifully balances deep-rooted Dravidian traditions with the energy of a massive metropolis. It is the heart of classical Carnatic music, ancient temples, and the sprawling sands of Marina Beach.",
    "topHighlights": [
      "Strolling along the incredibly vast Marina Beach",
      "Marveling at the ancient, towering Kapaleeshwarar Temple",
      "Experiencing an authentic Bharatanatyam classical dance performance"
    ],
    "region": "South",
    "vibeTags": ["Cultural", "Vibrant", "Historic"],
    "idealSeason": "Nov–Feb",
    "landscapes": ["Modern Cities", "Beaches", "Spiritual India"],
    "peakMonths": [11, 12, 1, 2],
    "shoulderMonths": [10, 3],
    "avoidMonths": [4, 5, 6, 7, 8, 9],
    "closedMonths": [],
    "minRequiredDays": 2,
    "latitude": 13.0827,
    "longitude": 80.2707,
    "requiresAcclimatization": false,
    "isHub": true
  },
  {
    "id": "hyderabad",
    "name": "Hyderabad",
    "description": "Hyderabad — the 'City of Pearls' — blends Mughal grandeur with modern IT prosperity. The Charminar, Golconda Fort, pearl and bangles bazaars, dum biryani and the Nizam's lavish palaces create a city of extraordinary historical depth and culinary richness.",
    "shortPitch": "The dynamic 'City of Pearls' seamlessly fuses Mughal royal grandeur with booming modern prosperity. It offers world-famous culinary delights like dum biryani, set against the backdrop of iconic monuments like the Charminar and Golconda Fort.",
    "topHighlights": [
      "Admiring the 400-year-old architectural marvel, the Charminar",
      "Exploring the imposing ruins and acoustics of Golconda Fort",
      "Shopping for pearls and bangles at the bustling Laad Bazaar"
    ],
    "region": "South",
    "vibeTags": ["Regal", "Cosmopolitan", "Bustling"],
    "idealSeason": "Oct–Mar",
    "landscapes": ["Modern Cities", "Royal Cities"],
    "peakMonths": [10, 11, 12, 1, 2, 3],
    "shoulderMonths": [9, 4],
    "avoidMonths": [5, 6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 3,
    "latitude": 17.385,
    "longitude": 78.4867,
    "requiresAcclimatization": false,
    "isHub": true
  },
  {
    "id": "shillong",
    "name": "Shillong",
    "description": "Shillong — the 'Scotland of the East' — is the capital of Meghalaya and the cultural hub of the Northeast, famous for its pine-covered rolling hills, British-era architecture, thriving music scene and proximity to Cherrapunji. It is one of India's few cities where rock music is a cultural institution.",
    "shortPitch": "Affectionately dubbed the 'Scotland of the East', Shillong is a misty, pine-covered hill station that serves as the cultural heart of the Northeast. It boasts a thriving rock music scene, colonial-era charm, and incredibly hospitable locals.",
    "topHighlights": [
      "Enjoying a boat ride on the scenic, serene Ward's Lake",
      "Taking in panoramic valley views from Shillong Peak",
      "Experiencing the city's legendary live indie and rock music scene"
    ],
    "region": "East",
    "vibeTags": ["Nostalgic", "Vibrant", "Scenic"],
    "idealSeason": "Sep–May",
    "landscapes": ["Hidden Villages", "Mountains"],
    "peakMonths": [9, 10, 11, 12, 1, 2, 3, 4, 5],
    "shoulderMonths": [],
    "avoidMonths": [6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 2,
    "latitude": 25.5788,
    "longitude": 91.8933,
    "requiresAcclimatization": false,
    "isHub": true
  },
  {
    "id": "cherrapunji",
    "name": "Cherrapunji & Mawsynram",
    "description": "Cherrapunji (Sohra) and nearby Mawsynram are the wettest places on Earth — receiving over 11,000 mm of rainfall annually. The result is a world of extraordinary waterfalls, living root bridges grown by the Khasi people over centuries, emerald gorges and mist-shrouded forests of unparalleled lushness.",
    "shortPitch": "Officially the wettest places on Earth, this region is a breathtaking wonderland of emerald gorges and plunging waterfalls. It is famous for the ingenious, centuries-old living root bridges woven by the indigenous Khasi people.",
    "topHighlights": [
      "Trekking to the astonishing Double-Decker Living Root Bridge",
      "Marveling at the colossal Nohkalikai Falls plunging into the gorge",
      "Exploring the deep, mystical limestone networks of Mawsmai Caves"
    ],
    "region": "East",
    "vibeTags": ["Surreal", "Lush", "Tribal"],
    "idealSeason": "Oct–May",
    "landscapes": ["Hidden Villages", "Mountains"],
    "peakMonths": [10, 11, 12, 1, 2, 3, 4, 5],
    "shoulderMonths": [9],
    "avoidMonths": [6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 3,
    "latitude": 25.2702,
    "longitude": 91.7323,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "mawlynnong",
    "name": "Mawlynnong",
    "description": "Mawlynnong is known as the 'Cleanest Village in Asia' — a title it has held with extraordinary pride. This Khasi village, near the Bangladesh border, is famous for its immaculate bamboo paths, sky-view tree platforms, community spirit and the nearby Dawki River's impossibly transparent water.",
    "shortPitch": "Proudly recognized as the 'Cleanest Village in Asia', this immaculate Khasi settlement is a triumph of community-driven eco-tourism. Visitors wander bamboo-lined paths, scale sky-view treehouse platforms, and experience perfect harmony with nature.",
    "topHighlights": [
      "Strolling the impeccably clean, flower-lined village pathways",
      "Climbing the bamboo Sky Walk for views into Bangladesh",
      "Experiencing authentic local Khasi meals and community hospitality"
    ],
    "region": "East",
    "vibeTags": ["Pristine", "Tribal", "Peaceful"],
    "idealSeason": "Oct–May",
    "landscapes": ["Hidden Villages"],
    "peakMonths": [10, 11, 12, 1, 2, 3, 4, 5],
    "shoulderMonths": [9],
    "avoidMonths": [6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 1,
    "latitude": 25.201,
    "longitude": 91.916,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "dawki",
    "name": "Dawki & Umngot River",
    "description": "Dawki on the Umngot River is one of India's most photographed destinations — the river's extraordinary clarity makes boats appear to float on glass. The annual Dawki boat race is a colourful Khasi tradition, and the Bangladesh border bridge is a fascinating cultural crossing point.",
    "shortPitch": "Dawki is home to the phenomenally clear Umngot River, where the waters are so transparent that boats appear to be floating on thin air. This stunning border town offers surreal photography opportunities and peaceful river escapes.",
    "topHighlights": [
      "Gliding on a traditional wooden boat over the crystal-clear Umngot River",
      "Crossing the historic Dawki Suspension Bridge built by the British",
      "Visiting the fascinating India-Bangladesh border crossing at Tamabil"
    ],
    "region": "East",
    "vibeTags": ["Magical", "Surreal", "Scenic"],
    "idealSeason": "Nov–May",
    "landscapes": ["Hidden Villages"],
    "peakMonths": [11, 12, 1, 2, 3, 4, 5],
    "shoulderMonths": [10],
    "avoidMonths": [6, 7, 8, 9],
    "closedMonths": [],
    "minRequiredDays": 1,
    "latitude": 25.1843,
    "longitude": 92.0163,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "majuli",
    "name": "Majuli Island",
    "description": "Majuli is the world's largest river island (on the Brahmaputra River) and a UNESCO World Heritage candidate. It is the spiritual and cultural heartland of Assamese Neo-Vaishnavism, with ancient Satras (monasteries) preserving mask-making, classical dance and weaving traditions unique to Assam.",
    "shortPitch": "Resting on the mighty Brahmaputra, Majuli is the world's largest river island and the spiritual epicenter of Assamese culture. It is a tranquil sanctuary of ancient monasteries, unique mask-making artisans, and incredible migratory birdlife.",
    "topHighlights": [
      "Visiting the ancient Satras (Vaishnavite monasteries) and monks",
      "Witnessing the intricate, traditional Assamese mask-making crafts",
      "Cycling through peaceful, scenic Mishing tribal farming villages"
    ],
    "region": "East",
    "vibeTags": ["Cultural", "Peaceful", "Tribal"],
    "idealSeason": "Oct–Mar",
    "landscapes": ["Hidden Villages", "Islands"],
    "peakMonths": [10, 11, 12, 1, 2, 3],
    "shoulderMonths": [9, 4],
    "avoidMonths": [5, 6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 2,
    "latitude": 26.9535,
    "longitude": 94.1685,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "nagaland_hornbill",
    "name": "Nagaland & Hornbill Festival",
    "description": "Nagaland's Hornbill Festival — held every December in Kisama — is the most vibrant tribal cultural festival in India, showcasing the traditions of 17 Naga tribes in one breathtaking venue. Warrior dances, traditional foods, log drums, indigenous crafts and headhunting history make Nagaland utterly unique.",
    "shortPitch": "The host of the legendary Hornbill Festival, Nagaland is a breathtaking tapestry of indigenous warrior culture and untamed nature. Its incredibly vibrant festivals, log drum beats, and fascinating headhunting history offer an unparalleled cultural immersion.",
    "topHighlights": [
      "Witnessing the mesmerizing dances and costumes at the Hornbill Festival",
      "Paying respects at the meticulously maintained WWII Kohima War Cemetery",
      "Trekking the rolling, emerald-green hills of the Dzükou Valley"
    ],
    "region": "East",
    "vibeTags": ["Tribal", "Vibrant", "Wild"],
    "idealSeason": "Oct–May",
    "landscapes": ["Hidden Villages"],
    "peakMonths": [12, 10, 11, 1, 2, 3, 4, 5],
    "shoulderMonths": [9],
    "avoidMonths": [6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 4,
    "latitude": 25.666,
    "longitude": 94.1086,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "hampi",
    "name": "Hampi",
    "description": "Hampi is one of India's most extraordinary archaeological sites — the ruined capital of the Vijayanagara Empire (14th–16th century) scattered across a surreal landscape of giant boulders, banana plantations and the Tungabhadra River. Corinthian temples, elephant stables and market streets speak of a civilisation of immense wealth and sophistication.",
    "shortPitch": "Set amidst a surreal, otherworldly landscape of giant balancing boulders and lush banana plantations, Hampi is the spectacular ruined capital of the Vijayanagara Empire. These UNESCO-listed stone temples and palaces feel like stepping onto another planet.",
    "topHighlights": [
      "Exploring the intricate musical pillars of the Vittala Temple",
      "Hiking up Matanga Hill for an unforgettable boulder-strewn sunrise",
      "Cycling past ancient elephant stables and bustling medieval bazaars"
    ],
    "region": "South",
    "vibeTags": ["Otherworldly", "Historic", "Bohemian"],
    "idealSeason": "Oct–Mar",
    "landscapes": ["Royal Cities"],
    "peakMonths": [10, 11, 12, 1, 2, 3],
    "shoulderMonths": [9],
    "avoidMonths": [4, 5, 6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 3,
    "latitude": 15.335,
    "longitude": 76.46,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "khajuraho",
    "name": "Khajuraho",
    "description": "Khajuraho's Chandela temples (10th–11th century) are among the finest medieval temple complexes in the world, celebrated for their exquisite erotic sculptures representing all aspects of human life. The UNESCO World Heritage temples are masterpieces of Nagara-style architecture.",
    "shortPitch": "Renowned globally for its astonishingly intricate and sensuous sculptures, Khajuraho is a masterpiece of 10th-century Chandela temple architecture. This UNESCO World Heritage site is a stunning celebration of medieval art, spirituality, and human life.",
    "topHighlights": [
      "Admiring the incredibly detailed carvings of the Western Temple Group",
      "Attending the enchanting evening Sound & Light Show in the temple gardens",
      "Combining culture with wildlife by visiting the nearby Panna Tiger Reserve"
    ],
    "region": "East",
    "vibeTags": ["Historic", "Sacred", "Cultural"],
    "idealSeason": "Oct–Mar",
    "landscapes": ["Royal Cities", "Spiritual India"],
    "peakMonths": [10, 11, 12, 1, 2, 3],
    "shoulderMonths": [9],
    "avoidMonths": [4, 5, 6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 2,
    "latitude": 24.8318,
    "longitude": 79.9199,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "mahabalipuram",
    "name": "Mahabalipuram (Mamallapuram)",
    "description": "Mahabalipuram on the Coromandel Coast is a UNESCO World Heritage Site containing some of the finest examples of Pallava rock-cut and structural architecture. The Shore Temple, the Five Rathas and the giant bas-relief of Arjuna's Penance are masterpieces carved directly from coastal rock faces 1,300 years ago.",
    "shortPitch": "Perched on the breezy Coromandel Coast, this UNESCO World Heritage town showcases absolute masterworks of 7th-century Pallava rock-cut architecture. It perfectly blends dramatic oceanside ruins, monumental bas-reliefs, and a relaxed beachside atmosphere.",
    "topHighlights": [
      "Visiting the iconic Shore Temple, standing majestically against the ocean",
      "Marveling at Arjuna's Penance, the world's largest open-air bas-relief",
      "Exploring the incredible monolithic rock-cut shrines of the Five Rathas"
    ],
    "region": "South",
    "vibeTags": ["Historic", "Relaxed", "Scenic"],
    "idealSeason": "Nov–Mar",
    "landscapes": ["Royal Cities", "Beaches"],
    "peakMonths": [11, 12, 1, 2, 3],
    "shoulderMonths": [10],
    "avoidMonths": [4, 5, 6, 7, 8, 9],
    "closedMonths": [],
    "minRequiredDays": 2,
    "latitude": 12.6269,
    "longitude": 80.1927,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "konark",
    "name": "Konark Sun Temple",
    "description": "The Konark Sun Temple is one of India's greatest architectural achievements — a 13th-century stone chariot for the Sun God with 24 elaborately carved wheels and 7 galloping horses, built on an enormous scale. The temple's erotic sculptures, Odishan dance festival and coastal location make it a remarkable destination.",
    "shortPitch": "Conceived as a colossal, 13th-century stone chariot for the Sun God, Konark is one of India's most staggering architectural triumphs. The intricately carved gigantic stone wheels and the incredible scale of this UNESCO site leave visitors awestruck.",
    "topHighlights": [
      "Studying the incredibly detailed stone wheels and erotic sculptures",
      "Attending the vibrant Konark Dance Festival held against the ruins",
      "Relaxing on the nearby serene shores of Chandrabhaga Beach"
    ],
    "region": "East",
    "vibeTags": ["Historic", "Sacred", "Iconic"],
    "idealSeason": "Oct–Mar",
    "landscapes": ["Spiritual India"],
    "peakMonths": [10, 11, 12, 1, 2, 3],
    "shoulderMonths": [9],
    "avoidMonths": [4, 5, 6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 1,
    "latitude": 19.8876,
    "longitude": 86.0945,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "ajanta_ellora",
    "name": "Ajanta & Ellora Caves",
    "description": "Ajanta's 29 Buddhist cave monasteries (2nd century BC–6th century AD) contain the finest surviving examples of ancient Indian painting in the world. Ellora's 34 caves encompass Buddhist, Hindu and Jain temples carved from volcanic rock — including the monolithic Kailasa Temple, the world's largest rock-cut structure.",
    "shortPitch": "Carved directly into solid volcanic cliffs, these dual UNESCO World Heritage sites represent the pinnacle of ancient Indian rock-cut architecture. While Ajanta harbors the world's finest ancient Buddhist murals, Ellora boasts the mind-boggling monolithic Kailasa Temple.",
    "topHighlights": [
      "Standing awestruck inside the monolithic Kailasa Temple at Ellora",
      "Viewing the exquisitely preserved ancient Buddhist frescoes at Ajanta",
      "Exploring the fascinating mix of Hindu, Buddhist, and Jain cave shrines"
    ],
    "region": "West",
    "vibeTags": ["Ancient", "Mysterious", "Sacred"],
    "idealSeason": "Oct–Mar",
    "landscapes": ["Spiritual India"],
    "peakMonths": [10, 11, 12, 1, 2, 3],
    "shoulderMonths": [9],
    "avoidMonths": [4, 5, 6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 3,
    "latitude": 20.0258,
    "longitude": 75.178,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "orchha",
    "name": "Orchha",
    "description": "Orchha is a remarkably well-preserved medieval Bundela capital on the Betwa River, whose temples, cenotaphs, palaces and chhatris rise from the banks like a forgotten dream. Less visited than Rajasthan's forts yet equally beautiful, Orchha is a top recommendation for heritage travellers seeking an authentic, uncrowded experience.",
    "shortPitch": "Rising like a forgotten dream from the banks of the Betwa River, Orchha is a perfectly preserved, atmospheric medieval capital. Free from mass tourism crowds, its towering palaces and riverside cenotaphs offer a deeply romantic and authentic heritage experience.",
    "topHighlights": [
      "Wandering through the magnificent empty courtyards of Jehangir Mahal",
      "Watching the sunset over the riverside royal chhatris (cenotaphs)",
      "Experiencing the evening aarti at the unique Ram Raja Palace-Temple"
    ],
    "region": "East",
    "vibeTags": ["Hidden", "Romantic", "Historic"],
    "idealSeason": "Oct–Mar",
    "landscapes": ["Royal Cities"],
    "peakMonths": [10, 11, 12, 1, 2, 3],
    "shoulderMonths": [9],
    "avoidMonths": [4, 5, 6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 2,
    "latitude": 25.3499,
    "longitude": 78.6385,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "madurai",
    "name": "Madurai",
    "description": "Madurai is one of the oldest continuously inhabited cities in the world and the temple city of Tamil Nadu. The Meenakshi Amman Temple — with its soaring gopurams encrusted in thousands of sculptures — is among the most spectacular religious complexes in Asia, active 24 hours a day.",
    "shortPitch": "One of the oldest continuously inhabited cities on Earth, Madurai is the beating, spiritual heart of Tamil Nadu. Its epicenter is the colossal Meenakshi Amman Temple, a breathtaking labyrinth of wildly colorful, sculpture-encrusted towers.",
    "topHighlights": [
      "Getting lost in the mesmerizing, 24-hour Meenakshi Amman Temple complex",
      "Admiring the Indo-Saracenic grandeur of the Thirumalai Nayak Palace",
      "Exploring the vibrant, chaotic, and ancient temple bazaars"
    ],
    "region": "South",
    "vibeTags": ["Intense", "Sacred", "Vibrant"],
    "idealSeason": "Oct–Mar",
    "landscapes": ["Spiritual India", "Royal Cities"],
    "peakMonths": [10, 11, 12, 1, 2, 3],
    "shoulderMonths": [9],
    "avoidMonths": [4, 5, 6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 2,
    "latitude": 9.9252,
    "longitude": 78.1198,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "kochi",
    "name": "Kochi (Cochin)",
    "description": "Kochi is Kerala's most cosmopolitan city — a multicultural port with Chinese fishing nets, a 500-year-old synagogue, Portuguese churches, Dutch palaces, colonial bungalows and one of India's most exciting contemporary art scenes (Kochi-Muziris Biennale). Fort Kochi's waterfront is quintessential romantic India.",
    "shortPitch": "Kerala's most cosmopolitan port city is an incredibly romantic mosaic of Portuguese, Dutch, Jewish, and British colonial heritage. The atmospheric streets of Fort Kochi buzz with trendy cafes, antique shops, and a thriving contemporary arts scene.",
    "topHighlights": [
      "Watching the sunset through the iconic, cantilevered Chinese Fishing Nets",
      "Strolling the quaint, heritage-rich streets of Jewish Town in Mattancherry",
      "Experiencing the vibrant, world-class Kochi-Muziris Biennale arts festival"
    ],
    "region": "South",
    "vibeTags": ["Cosmopolitan", "Romantic", "Cultural"],
    "idealSeason": "Sep–Mar",
    "landscapes": ["Modern Cities", "Beaches", "Backwaters"],
    "peakMonths": [10, 11, 12, 1, 2, 3],
    "shoulderMonths": [9, 4],
    "avoidMonths": [5, 6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 2,
    "latitude": 9.9312,
    "longitude": 76.2673,
    "requiresAcclimatization": false,
    "isHub": true
  },
  {
    "id": "golden_triangle",
    "name": "Golden Triangle Circuit",
    "description": "The Golden Triangle — Delhi, Agra, Jaipur — is the world's most visited tourism circuit in India, connecting the nation's capital, the Taj Mahal and the Pink City in a convenient triangle easily covered in 5–7 days. It is the default first India itinerary for most international travellers.",
    "shortPitch": "India's undisputed most famous travel route seamlessly connects Delhi, Agra, and Jaipur in a spectacular introduction to the country. In just a week, it delivers the ultimate highlights reel: the Taj Mahal, epic Rajput forts, and vibrant bazaars.",
    "topHighlights": [
      "Marveling at the flawless, world-renowned marble symmetry of the Taj Mahal",
      "Exploring the grand, rose-hued palaces and forts of Jaipur's Pink City",
      "Discovering the dense, 3,000-year layered history of Delhi"
    ],
    "region": "North",
    "vibeTags": ["Iconic", "Classic", "Fast-paced"],
    "idealSeason": "Oct–Mar",
    "landscapes": ["Royal Cities", "Modern Cities", "Spiritual India"],
    "peakMonths": [10, 11, 12, 1, 2, 3],
    "shoulderMonths": [9, 4],
    "avoidMonths": [5, 6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 5,
    "latitude": 27.1751,
    "longitude": 78.0421,
    "requiresAcclimatization": false,
    "isHub": true
  },
  {
    "id": "rajasthan_circuit",
    "name": "Rajasthan Circuit",
    "description": "The classic Rajasthan Circuit connects the royal cities of Jaipur, Jodhpur, Jaisalmer, Udaipur and Pushkar in a grand loop through the desert kingdom. It is India's most complete royal heritage experience — forts, palaces, sand dunes, camel safaris, folk music and the finest Indian cuisine all in one state.",
    "shortPitch": "A grand, sweeping loop through the vibrant 'Land of Kings', this classic circuit is the ultimate royal heritage experience. It strings together colossal desert forts, floating marble palaces, starry camel safaris, and impossibly colorful bazaars.",
    "topHighlights": [
      "Wandering through the romantic, floating palaces of Udaipur",
      "Sleeping under the stars on a camel safari in the Jaisalmer sand dunes",
      "Exploring the colossal, imposing Mehrangarh Fort rising over Jodhpur"
    ],
    "region": "West",
    "vibeTags": ["Regal", "Vibrant", "Romantic"],
    "idealSeason": "Oct–Mar",
    "landscapes": ["Royal Cities", "Desert"],
    "peakMonths": [10, 11, 12, 1, 2, 3],
    "shoulderMonths": [9],
    "avoidMonths": [4, 5, 6, 7, 8],
    "closedMonths": [],
    "minRequiredDays": 10,
    "latitude": 26.9124,
    "longitude": 75.7873,
    "requiresAcclimatization": false,
    "isHub": false
  },
  {
    "id": "leh_ladakh_circuit",
    "name": "Leh-Ladakh Circuit",
    "description": "The Leh-Ladakh Circuit is India's most spectacular road journey, covering Leh, Nubra Valley, Pangong Lake, Tso Moriri and the Zanskar Valley across high-altitude desert terrain. The circuit can be entered from Srinagar (NH1) or Manali (Rohtang–Baralacha), creating a legendary motorbike and road-trip destination.",
    "shortPitch": "Legendary among adventurers and bikers, this high-altitude circuit winds through some of the most dramatic, barren landscapes on Earth. It crosses the world's highest motorable passes, connecting ancient Tibetan monasteries with surreal, turquoise salt lakes.",
    "topHighlights": [
      "Navigating legendary, breathtaking high-altitude mountain passes",
      "Camping beside the endlessly shifting, brilliant blues of Pangong Tso Lake",
      "Riding Bactrian camels through the stark sand dunes of the Nubra Valley"
    ],
    "region": "North",
    "vibeTags": ["Exhilarating", "Otherworldly", "Wild"],
    "idealSeason": "Jun–Sep",
    "landscapes": ["Cold Desert", "Mountains"],
    "peakMonths": [6, 7, 8, 9],
    "shoulderMonths": [5, 10],
    "avoidMonths": [11, 12, 1, 2, 3, 4],
    "closedMonths": [12, 1, 2, 3],
    "minRequiredDays": 7,
    "latitude": 34.1526,
    "longitude": 77.5771,
    "requiresAcclimatization": true,
    "isHub": true
  },
  {
    "id": "spiti_circuit",
    "name": "Spiti Circuit",
    "description": "The Spiti Circuit loops from Shimla through Kinnaur and Spiti Valley to Manali (or vice versa), crossing some of India's most dramatic mountain terrain. Pin Parbati Pass and Rohtang Pass are epic highlights of this 700 km route through Buddhist monasteries and high-altitude villages.",
    "shortPitch": "Looping through the remote, high-altitude 'Middle Land', the Spiti Circuit is a deeply spiritual and ruggedly beautiful road trip. Traversing dangerous, cliff-hanging roads, it reveals lunar-like valleys, ancient clifftop monasteries, and pristine mountain silence.",
    "topHighlights": [
      "Visiting Key Monastery, perched precariously on a jagged mountain peak",
      "Sending a postcard from Hikkim, the world's highest post office",
      "Driving the notoriously dramatic, cliff-hanging Hindustan-Tibet Highway"
    ],
    "region": "North",
    "vibeTags": ["Remote", "Spiritual", "Raw"],
    "idealSeason": "Jun–Sep",
    "landscapes": ["Cold Desert", "Mountains", "Hidden Villages"],
    "peakMonths": [6, 7, 8, 9],
    "shoulderMonths": [5, 10],
    "avoidMonths": [11, 12, 1, 2, 3, 4],
    "closedMonths": [12, 1, 2, 3],
    "minRequiredDays": 7,
    "latitude": 32.2211,
    "longitude": 78.0384,
    "requiresAcclimatization": true,
    "isHub": false
  }
];

const existingData = JSON.parse(fs.readFileSync('prisma/data.json', 'utf8'));

// Fix vibes that I missed previously to avoid Zod failures
const VALID_VIBES = ["Otherworldly", "Bold", "Remote", "Spiritual", "Wild", "Exhilarating", "Winter Wonderland", "Luxury", "Peaceful", "Rustic", "Romantic", "Regal", "Historic", "Vibrant", "Mystical", "Golden", "Iconic", "Authentic", "Quiet", "Cultural", "Relaxed", "Lush", "Soulful", "Bohemian", "Pristine", "Tropical", "Dreamy", "Slow", "Hidden", "Tranquil", "Exclusive", "Raw", "Mysterious", "Unique", "Restorative", "Nostalgic", "Scenic", "Magical", "Pure", "Tribal", "Untouched", "Intense", "Sacred", "Zen", "Awakening", "Surreal", "Cosmopolitan", "Fast-paced", "Bustling"];

batch5.forEach(item => {
  item.vibeTags = item.vibeTags.map(v => {
    if (v === "Classic") return "Iconic";
    if (v === "Ancient") return "Historic";
    if (!VALID_VIBES.includes(v)) return "Surreal";
    return v;
  });
});

const merged = [...existingData, ...batch5];
fs.writeFileSync('prisma/data.json', JSON.stringify(merged, null, 2));

console.log('Appended batch 5.');
