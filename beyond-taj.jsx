import { useState, useEffect, useRef } from "react";

const INDIA_SCENES = [
  { name: "Udaipur", color: "#1a0a00", accent: "#f5a623" },
  { name: "Rann of Kutch", color: "#0a0a1a", accent: "#c8b8ff" },
  { name: "Kashmir", color: "#001a0a", accent: "#7ee8a2" },
  { name: "Ladakh", color: "#0a0010", accent: "#a8edea" },
  { name: "Kerala Backwaters", color: "#001208", accent: "#56ab2f" },
  { name: "Jaisalmer", color: "#1a0800", accent: "#f7971e" },
  { name: "Meghalaya", color: "#001a0a", accent: "#43e97b" },
];

const LANDSCAPE_TYPES = [
  { id: "mountains", icon: "🏔️", title: "Mountains", desc: "Snow peaks, pine forests, Himalayan roads and peaceful valleys" },
  { id: "beaches", icon: "🏖️", title: "Beaches", desc: "Tropical coastlines, golden sand, turquoise waves" },
  { id: "islands", icon: "🏝️", title: "Islands", desc: "Coral atolls, remote paradises, crystal lagoons" },
  { id: "cold_desert", icon: "🌌", title: "Cold Desert", desc: "Moonscape terrain, Ladakh roads, starlit Spiti valleys" },
  { id: "royal_cities", icon: "🏰", title: "Royal Cities", desc: "Forts, palaces, Mughal grandeur, painted havelis" },
  { id: "spiritual", icon: "🪔", title: "Spiritual India", desc: "Sacred ghats, ancient temples, ashrams and rituals" },
  { id: "wildlife", icon: "🐯", title: "Wildlife & Jungle", desc: "Tiger reserves, dense forests, rare biodiversity" },
  { id: "backwaters", icon: "⛵", title: "Backwaters", desc: "Kerala lagoons, houseboat drifts, lush canals" },
  { id: "plantations", icon: "🌿", title: "Tea Plantations", desc: "Rolling green hills, mist and the scent of Darjeeling" },
  { id: "desert", icon: "🐪", title: "Desert", desc: "Camel safaris, sand dunes, folk music under the stars" },
  { id: "modern_cities", icon: "🌆", title: "Modern Cities", desc: "Cyber hubs, street food, cosmopolitan culture" },
  { id: "hidden_villages", icon: "🏡", title: "Hidden Villages", desc: "Tribal cultures, ancient crafts, untouched landscapes" },
  { id: "food_culture", icon: "🍛", title: "Food & Culture", desc: "Regional cuisines, spice markets, cooking traditions" },
  { id: "historical", icon: "🕌", title: "Historical Gems", desc: "UNESCO sites, ancient ruins, living heritage" },
];

const DESTINATIONS_BY_TYPE = {
  mountains: [
    { id: "kashmir", name: "Kashmir", desc: "Alpine lakes, snow meadows, shikaras on Dal Lake", vibe: "Ethereal & peaceful", season: "Apr–Oct" },
    { id: "manali", name: "Manali", desc: "Adventure hub, pine forests, Rohtang Pass", vibe: "Wild & exhilarating", season: "Mar–Jun" },
    { id: "spiti", name: "Spiti Valley", desc: "Remote monasteries, ancient villages at 12,000ft", vibe: "Raw & spiritual", season: "Jun–Sep" },
    { id: "darjeeling", name: "Darjeeling", desc: "Toy train, tea estates, Kanchenjunga views", vibe: "Romantic & colonial", season: "Mar–May" },
    { id: "sikkim", name: "Sikkim", desc: "Buddhist monasteries, rhododendrons, mountain kingdoms", vibe: "Mystical & serene", season: "Mar–Jun" },
  ],
  beaches: [
    { id: "goa", name: "Goa", desc: "Party beaches, Portuguese forts, seafood shacks", vibe: "Vibrant & festive", season: "Nov–Feb" },
    { id: "varkala", name: "Varkala", desc: "Clifftop cafes, Kerala coast, yoga retreats", vibe: "Soulful & relaxed", season: "Oct–Mar" },
    { id: "kovalam", name: "Kovalam", desc: "Lighthouse beach, Ayurvedic spas, calm waters", vibe: "Tranquil & healing", season: "Oct–Feb" },
    { id: "puri", name: "Puri", desc: "Sacred Hindu beach, Jagannath temple, sunrise", vibe: "Spiritual & cultural", season: "Oct–Mar" },
  ],
  islands: [
    { id: "andaman", name: "Andaman", desc: "Untouched coral, turquoise bays, WWII history", vibe: "Remote & pristine", season: "Nov–Apr" },
    { id: "lakshadweep", name: "Lakshadweep", desc: "Tiny coral atolls, lagoons so blue they hurt", vibe: "Surreal & exclusive", season: "Oct–May" },
  ],
  cold_desert: [
    { id: "ladakh", name: "Ladakh", desc: "World's highest roads, monasteries, star-filled skies", vibe: "Otherworldly & bold", season: "Jun–Sep" },
    { id: "spiti2", name: "Spiti", desc: "Cold desert monasteries, ancient pin valley", vibe: "Austere & spiritual", season: "Jun–Sep" },
    { id: "nubra", name: "Nubra Valley", desc: "Double-humped camels, sand dunes at 10,000ft", vibe: "Surreal & vast", season: "Jun–Sep" },
  ],
  royal_cities: [
    { id: "jaisalmer", name: "Jaisalmer", desc: "Golden fort city, havelis, sunset camel rides", vibe: "Majestic & golden", season: "Oct–Feb" },
    { id: "udaipur", name: "Udaipur", desc: "City of lakes, marble palaces, royal romance", vibe: "Romantic & regal", season: "Oct–Mar" },
    { id: "jaipur", name: "Jaipur", desc: "Pink city, Amber Fort, artisan bazaars", vibe: "Colourful & grand", season: "Oct–Feb" },
    { id: "hampi", name: "Hampi", desc: "Ancient Vijayanagara ruins, boulders, river", vibe: "Mystical & ancient", season: "Oct–Feb" },
  ],
  spiritual: [
    { id: "varanasi", name: "Varanasi", desc: "Oldest living city, Ganga aarti, ancient ghats", vibe: "Profound & transformative", season: "Oct–Feb" },
    { id: "rishikesh", name: "Rishikesh", desc: "Yoga capital, Ganga rafting, Himalayan foothills", vibe: "Energising & spiritual", season: "Sep–Jun" },
    { id: "amritsar", name: "Amritsar", desc: "Golden Temple, Wagah border, langar tradition", vibe: "Stirring & communal", season: "Oct–Mar" },
  ],
  wildlife: [
    { id: "ranthambore", name: "Ranthambore", desc: "Best tiger spotting in India, fort ruins", vibe: "Thrilling & primal", season: "Oct–Jun" },
    { id: "kaziranga", name: "Kaziranga", desc: "One-horned rhinos, Assam tea, Brahmaputra banks", vibe: "Wild & immersive", season: "Nov–Apr" },
    { id: "sundarbans", name: "Sundarbans", desc: "Royal Bengal tigers, mangrove labyrinth", vibe: "Untamed & haunting", season: "Sep–Mar" },
  ],
  backwaters: [
    { id: "alleppey", name: "Alleppey", desc: "Houseboat capital, village life on water", vibe: "Dreamy & slow", season: "Nov–Feb" },
    { id: "vembanad", name: "Vembanad Lake", desc: "Largest lake in Kerala, bird sanctuary", vibe: "Peaceful & vast", season: "Nov–Feb" },
  ],
  plantations: [
    { id: "munnar", name: "Munnar", desc: "Endless tea carpets, misty hills, waterfalls", vibe: "Lush & restorative", season: "Sep–May" },
    { id: "coorg", name: "Coorg", desc: "Coffee estates, Scottish-like rolling hills", vibe: "Calm & aristocratic", season: "Oct–May" },
    { id: "wayanad", name: "Wayanad", desc: "Spice forests, tribal culture, hidden caves", vibe: "Secret & verdant", season: "Oct–May" },
  ],
  desert: [
    { id: "jaisalmer_d", name: "Jaisalmer Desert", desc: "Sam sand dunes, camel camps, folk musicians", vibe: "Mystical & endless", season: "Oct–Feb" },
    { id: "rann", name: "Rann of Kutch", desc: "White salt desert, Rann Utsav festival, full moon", vibe: "Surreal & otherworldly", season: "Oct–Feb" },
    { id: "pushkar", name: "Pushkar", desc: "Sacred lake, camel fair, rooftop cafes", vibe: "Mystical & vibrant", season: "Oct–Feb" },
  ],
  modern_cities: [
    { id: "bangalore", name: "Bengaluru", desc: "India's Silicon Valley, craft beer, startups", vibe: "Electric & cosmopolitan", season: "Year-round" },
    { id: "mumbai", name: "Mumbai", desc: "Bollywood, sea links, street food royalty", vibe: "Intense & cinematic", season: "Oct–Mar" },
    { id: "hyderabad", name: "Hyderabad", desc: "Biryani, tech city, Charminar, pearls", vibe: "Royal meets modern", season: "Oct–Mar" },
  ],
  hidden_villages: [
    { id: "ziro", name: "Ziro Valley", desc: "Apatani tribe, pine forests, music festival", vibe: "Untouched & tribal", season: "Sep–Oct" },
    { id: "mawlynnong", name: "Mawlynnong", desc: "Asia's cleanest village, living root bridges", vibe: "Magical & pure", season: "Oct–Feb" },
  ],
  food_culture: [
    { id: "kolkata", name: "Kolkata", desc: "Rosogolla, street food culture, colonial charm", vibe: "Rich & intellectual", season: "Oct–Feb" },
    { id: "chettinad", name: "Chettinad", desc: "India's spiciest cuisine, palatial mansions", vibe: "Bold & aristocratic", season: "Oct–Mar" },
  ],
  historical: [
    { id: "agra", name: "Agra", desc: "Taj Mahal, Agra Fort, Mughal grandeur", vibe: "Timeless & romantic", season: "Oct–Mar" },
    { id: "khajuraho", name: "Khajuraho", desc: "Erotic temple sculptures, UNESCO heritage", vibe: "Artistic & ancient", season: "Oct–Mar" },
    { id: "ajanta_ellora", name: "Ajanta & Ellora", desc: "Rock-cut caves, Buddhist paintings, 2000yr old art", vibe: "Humbling & ancient", season: "Nov–Feb" },
  ],
};

const DAYS_TO_MAX_DESTINATIONS = (days) => {
  if (days <= 7) return 2;
  if (days <= 10) return 3;
  if (days <= 14) return 4;
  if (days <= 21) return 6;
  return 9;
};

const DISTANT_PAIRS = [
  ["kashmir", "kanyakumari"], ["ladakh", "andaman"], ["ladakh", "lakshadweep"],
  ["kashmir", "andaman"], ["kashmir", "lakshadweep"], ["spiti", "andaman"],
  ["andaman", "jaisalmer"], ["lakshadweep", "ladakh"], ["kashmir", "kovalam"],
];

const isDistantPair = (selected) => {
  const ids = selected.map(d => d.id.toLowerCase());
  return DISTANT_PAIRS.some(([a, b]) => ids.some(i => i.includes(a)) && ids.some(i => i.includes(b)));
};

const STYLE_TYPES = [
  { id: "luxury", icon: "👑", label: "Luxury Explorer", desc: "5-star stays, private transport, curated premium experiences", price: "₹30,000–60,000/day" },
  { id: "balanced", icon: "⚖️", label: "Balanced Traveler", desc: "Comfortable travel without overspending — best of both worlds", price: "₹8,000–18,000/day" },
  { id: "backpacker", icon: "🎒", label: "Backpacker", desc: "Buses, trains, hostels, street food — travel like a local", price: "₹2,000–5,000/day" },
  { id: "adventure", icon: "🧭", label: "Adventure Nomad", desc: "Road trips, hidden villages, raw mountain experiences", price: "₹5,000–12,000/day" },
];

const WHAT_YOU_GET = [
  "Complete custom day-by-day itinerary",
  "Hidden gems most tourists never find",
  "Anti-scam guide for transport & markets",
  "Cultural etiquette & temple rules",
  "Optimal route planning by distance",
  "Bus, train & transport recommendations",
  "WhatsApp support during your trip",
  "Food guide — street to fine dining",
  "Seasonal & weather advice",
  "Emergency contact & safety tips",
];

export default function BeyondTaj() {
  const [step, setStep] = useState(0); // 0=hero, 1=duration, 2=style, 3=landscapes, 4=destinations, 5=summary, 6=payment, 7=dashboard
  const [days, setDays] = useState(14);
  const [travelStyle, setTravelStyle] = useState(null);
  const [selectedLandscapes, setSelectedLandscapes] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [heroScene, setHeroScene] = useState(0);
  const [paymentDone, setPaymentDone] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [warnings, setWarnings] = useState([]);
  const [tripStatus, setTripStatus] = useState("pending");
  const heroRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setHeroScene(s => (s + 1) % INDIA_SCENES.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const w = [];
    const maxDest = DAYS_TO_MAX_DESTINATIONS(days);
    if (selectedDestinations.length > maxDest) {
      w.push(`You've selected ${selectedDestinations.length} destinations — for ${days} days, we recommend a max of ${maxDest} for a fulfilling experience.`);
    }
    if (isDistantPair(selectedDestinations)) {
      w.push("Some of your selected destinations are 3,000+ km apart. This will significantly increase travel time and budget.");
    }
    setWarnings(w);
  }, [selectedDestinations, days]);

  useEffect(() => {
    if (paymentDone) {
      const t = setTimeout(() => setTripStatus("in_progress"), 3000);
      const t2 = setTimeout(() => setTripStatus("completed"), 8000);
      return () => { clearTimeout(t); clearTimeout(t2); };
    }
  }, [paymentDone]);

  const toggleLandscape = (id) => {
    setSelectedLandscapes(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setSelectedDestinations([]);
  };

  const toggleDestination = (dest) => {
    setSelectedDestinations(prev => prev.some(d => d.id === dest.id) ? prev.filter(d => d.id !== dest.id) : [...prev, dest]);
  };

  const availableDestinations = [...new Map(
    selectedLandscapes.flatMap(l => DESTINATIONS_BY_TYPE[l] || []).map(d => [d.id, d])
  ).values()];

  const scene = INDIA_SCENES[heroScene];
  const styleInfo = STYLE_TYPES.find(s => s.id === travelStyle);

  const scrollToPlanner = () => setStep(1);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --gold: #c9a96e;
      --gold-light: #e8d5a3;
      --dark: #0a0806;
      --dark2: #12100e;
      --dark3: #1c1915;
      --cream: #f5f0e8;
      --muted: #8a8070;
      --serif: 'Cormorant Garamond', Georgia, serif;
      --sans: 'Jost', sans-serif;
    }
    body { background: var(--dark); color: var(--cream); font-family: var(--sans); font-weight: 300; }
    .hero {
      position: relative; min-height: 100vh; display: flex; flex-direction: column;
      align-items: center; justify-content: center; overflow: hidden;
    }
    .hero-bg {
      position: absolute; inset: 0; transition: background 2s ease;
      background: radial-gradient(ellipse at 30% 40%, ${scene.color}cc 0%, #000 100%);
    }
    .hero-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%);
    }
    .hero-content { position: relative; z-index: 2; text-align: center; padding: 2rem; max-width: 900px; }
    .hero-eyebrow {
      font-family: var(--sans); font-size: 11px; letter-spacing: 6px; text-transform: uppercase;
      color: var(--gold); opacity: 0.9; margin-bottom: 2rem;
    }
    .hero-title {
      font-family: var(--serif); font-size: clamp(3rem, 8vw, 7rem); font-weight: 300;
      line-height: 1.05; color: var(--cream); margin-bottom: 1.5rem;
    }
    .hero-title em { font-style: italic; color: var(--gold-light); }
    .hero-sub {
      font-family: var(--sans); font-weight: 300; font-size: 1rem; letter-spacing: 2px;
      color: rgba(245,240,232,0.65); margin-bottom: 3rem; line-height: 1.8;
    }
    .btn-primary {
      display: inline-block; background: transparent; border: 1px solid var(--gold);
      color: var(--gold-light); font-family: var(--sans); font-size: 12px; letter-spacing: 4px;
      text-transform: uppercase; padding: 1rem 2.5rem; cursor: pointer;
      transition: all 0.4s ease; position: relative; overflow: hidden;
    }
    .btn-primary:hover { background: var(--gold); color: var(--dark); }
    .scene-label {
      position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
      z-index: 2; font-family: var(--sans); font-size: 10px; letter-spacing: 5px;
      text-transform: uppercase; color: rgba(245,240,232,0.4);
    }
    .dots { display: flex; gap: 8px; justify-content: center; margin-top: 1.5rem; }
    .dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(201,169,110,0.3); transition: background 0.4s; cursor: pointer; }
    .dot.active { background: var(--gold); }
    .section { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; }
    .section-inner { width: 100%; max-width: 1000px; }
    .step-label { font-family: var(--sans); font-size: 10px; letter-spacing: 5px; color: var(--gold); text-transform: uppercase; margin-bottom: 1rem; }
    .step-title { font-family: var(--serif); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; color: var(--cream); margin-bottom: 0.5rem; line-height: 1.1; }
    .step-sub { font-family: var(--sans); font-size: 0.85rem; letter-spacing: 1px; color: var(--muted); margin-bottom: 3rem; }
    .slider-wrap { margin-bottom: 1rem; }
    .days-display { font-family: var(--serif); font-size: 5rem; font-weight: 300; color: var(--gold); line-height: 1; }
    .days-hint { font-size: 0.8rem; letter-spacing: 2px; color: var(--muted); margin-top: 0.5rem; }
    input[type=range] {
      width: 100%; max-width: 500px; height: 1px; background: rgba(201,169,110,0.3);
      outline: none; -webkit-appearance: none; margin: 2rem 0;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%;
      background: var(--gold); cursor: pointer; border: 2px solid var(--dark);
    }
    .style-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; }
    .style-card {
      border: 1px solid rgba(201,169,110,0.15); padding: 2rem 1.5rem; cursor: pointer;
      transition: all 0.4s; position: relative; overflow: hidden;
      background: rgba(255,255,255,0.02);
    }
    .style-card:hover { border-color: rgba(201,169,110,0.5); background: rgba(201,169,110,0.05); }
    .style-card.selected { border-color: var(--gold); background: rgba(201,169,110,0.08); }
    .style-card.selected::after {
      content: '✓'; position: absolute; top: 1rem; right: 1rem;
      color: var(--gold); font-size: 14px;
    }
    .style-icon { font-size: 2rem; margin-bottom: 1rem; display: block; }
    .style-name { font-family: var(--serif); font-size: 1.3rem; font-weight: 400; color: var(--cream); margin-bottom: 0.5rem; }
    .style-desc { font-size: 0.8rem; letter-spacing: 0.5px; color: var(--muted); line-height: 1.7; margin-bottom: 1rem; }
    .style-price { font-size: 0.75rem; letter-spacing: 1px; color: var(--gold); opacity: 0.7; }
    .landscape-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
    .landscape-card {
      border: 1px solid rgba(201,169,110,0.12); padding: 1.5rem 1rem; cursor: pointer;
      transition: all 0.3s; background: rgba(255,255,255,0.02); text-align: center;
    }
    .landscape-card:hover { border-color: rgba(201,169,110,0.4); transform: translateY(-2px); }
    .landscape-card.selected { border-color: var(--gold); background: rgba(201,169,110,0.1); }
    .landscape-icon { font-size: 1.8rem; margin-bottom: 0.75rem; display: block; }
    .landscape-title { font-family: var(--serif); font-size: 1.05rem; color: var(--cream); margin-bottom: 0.4rem; }
    .landscape-desc { font-size: 0.72rem; color: var(--muted); line-height: 1.6; }
    .dest-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.25rem; }
    .dest-card {
      border: 1px solid rgba(201,169,110,0.12); padding: 1.5rem; cursor: pointer;
      transition: all 0.3s; background: rgba(255,255,255,0.02); position: relative;
    }
    .dest-card:hover { border-color: rgba(201,169,110,0.5); background: rgba(201,169,110,0.04); }
    .dest-card.selected { border-color: var(--gold); background: rgba(201,169,110,0.1); }
    .dest-card.selected::after { content: '✓'; position: absolute; top: 1rem; right: 1rem; color: var(--gold); }
    .dest-name { font-family: var(--serif); font-size: 1.3rem; color: var(--cream); margin-bottom: 0.4rem; }
    .dest-desc { font-size: 0.78rem; color: var(--muted); line-height: 1.7; margin-bottom: 0.75rem; }
    .dest-meta { display: flex; gap: 1rem; font-size: 0.68rem; letter-spacing: 1px; color: rgba(201,169,110,0.6); }
    .warning-box {
      border: 1px solid rgba(201,169,110,0.4); background: rgba(201,169,110,0.06);
      padding: 1rem 1.5rem; margin-bottom: 1.5rem; font-size: 0.82rem;
      color: var(--gold-light); line-height: 1.7;
    }
    .warning-box::before { content: '⚠ '; }
    .nav-row { display: flex; gap: 1rem; margin-top: 3rem; flex-wrap: wrap; }
    .btn-ghost {
      background: transparent; border: 1px solid rgba(201,169,110,0.3); color: var(--muted);
      font-family: var(--sans); font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
      padding: 0.75rem 2rem; cursor: pointer; transition: all 0.3s;
    }
    .btn-ghost:hover { border-color: var(--gold); color: var(--gold); }
    .summary-card { border: 1px solid rgba(201,169,110,0.2); padding: 2.5rem; background: rgba(255,255,255,0.02); margin-bottom: 2rem; }
    .summary-row { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid rgba(201,169,110,0.08); }
    .summary-label { font-size: 0.75rem; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; }
    .summary-value { font-family: var(--serif); font-size: 1rem; color: var(--cream); }
    .price-big { font-family: var(--serif); font-size: 4rem; font-weight: 300; color: var(--gold); line-height: 1; }
    .price-note { font-size: 0.75rem; letter-spacing: 1px; color: var(--muted); }
    .benefits-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin: 2rem 0; }
    .benefit-item { display: flex; gap: 0.6rem; font-size: 0.8rem; color: var(--cream); align-items: flex-start; }
    .benefit-check { color: var(--gold); flex-shrink: 0; }
    .payment-form { max-width: 480px; }
    .form-group { margin-bottom: 1.5rem; }
    .form-label { display: block; font-size: 0.72rem; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-bottom: 0.75rem; }
    .form-input {
      width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(201,169,110,0.2);
      color: var(--cream); font-family: var(--sans); font-size: 0.9rem; padding: 0.9rem 1rem;
      outline: none; transition: border 0.3s;
    }
    .form-input:focus { border-color: var(--gold); }
    .form-input::placeholder { color: var(--muted); opacity: 0.6; }
    .card-row { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1rem; }
    .payment-methods { display: flex; gap: 1rem; margin: 1.5rem 0; }
    .pay-method { border: 1px solid rgba(201,169,110,0.2); padding: 0.5rem 1.2rem; font-size: 0.75rem; letter-spacing: 1px; color: var(--muted); cursor: pointer; transition: all 0.3s; }
    .pay-method:hover, .pay-method.active { border-color: var(--gold); color: var(--gold); }
    .secure-note { font-size: 0.72rem; color: var(--muted); margin-top: 1rem; text-align: center; letter-spacing: 1px; }
    .processing-state { text-align: center; padding: 4rem 2rem; }
    .spinner {
      width: 60px; height: 60px; border: 1px solid rgba(201,169,110,0.2);
      border-top-color: var(--gold); border-radius: 50%; margin: 0 auto 2rem;
      animation: spin 1.5s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .dashboard { max-width: 900px; margin: 0 auto; padding: 3rem 2rem; }
    .dash-header { border-bottom: 1px solid rgba(201,169,110,0.15); padding-bottom: 2rem; margin-bottom: 3rem; }
    .dash-status {
      display: inline-flex; align-items: center; gap: 0.5rem;
      font-size: 0.72rem; letter-spacing: 3px; text-transform: uppercase;
      padding: 0.4rem 1.2rem; border: 1px solid;
    }
    .status-pending { color: var(--gold); border-color: rgba(201,169,110,0.4); }
    .status-in_progress { color: #7ee8a2; border-color: rgba(126,232,162,0.4); }
    .status-completed { color: #a8edea; border-color: rgba(168,237,234,0.5); }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; animation: pulse 1.5s infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
    .dash-card { border: 1px solid rgba(201,169,110,0.15); padding: 1.5rem; background: rgba(255,255,255,0.02); }
    .dash-card-title { font-size: 0.7rem; letter-spacing: 3px; text-transform: uppercase; color: var(--gold); margin-bottom: 1rem; }
    .whatsapp-btn {
      display: flex; align-items: center; gap: 0.75rem; background: rgba(37,211,102,0.1);
      border: 1px solid rgba(37,211,102,0.4); color: #25d166; padding: 1rem 1.5rem;
      cursor: pointer; font-family: var(--sans); font-size: 0.85rem; letter-spacing: 2px;
      transition: all 0.3s; text-transform: uppercase;
    }
    .whatsapp-btn:hover { background: rgba(37,211,102,0.2); }
    .progress-track { display: flex; gap: 0; margin: 2rem 0; }
    .progress-step { flex: 1; padding: 1rem; text-align: center; font-size: 0.65rem; letter-spacing: 2px; text-transform: uppercase; border-top: 2px solid rgba(201,169,110,0.15); }
    .progress-step.done { border-top-color: var(--gold); color: var(--gold); }
    .progress-step.active { border-top-color: #7ee8a2; color: #7ee8a2; }
    .divider { height: 1px; background: rgba(201,169,110,0.1); margin: 2rem 0; }
    .tag { display: inline-block; border: 1px solid rgba(201,169,110,0.25); padding: 0.25rem 0.75rem; font-size: 0.7rem; letter-spacing: 1px; color: var(--muted); margin: 0.2rem; }
    .selection-count { font-size: 0.75rem; color: var(--gold); letter-spacing: 1px; margin-bottom: 1.5rem; }
    @media (max-width: 600px) {
      .style-grid { grid-template-columns: 1fr; }
      .landscape-grid { grid-template-columns: repeat(2, 1fr); }
      .dest-grid { grid-template-columns: 1fr; }
      .benefits-grid { grid-template-columns: 1fr; }
      .card-row { grid-template-columns: 1fr; }
      .dash-grid { grid-template-columns: 1fr; }
    }
  `;

  return (
    <div style={{ background: "var(--dark)", minHeight: "100vh", fontFamily: "var(--sans)" }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* HERO */}
      {step === 0 && (
        <div className="hero" ref={heroRef}>
          <div className="hero-bg" style={{ background: `radial-gradient(ellipse at 35% 45%, ${scene.color}dd 0%, #000000 100%)` }} />
          <div className="hero-overlay" />

          {/* Decorative corner lines */}
          <div style={{ position: "absolute", top: 40, left: 40, width: 40, height: 40, borderTop: "1px solid rgba(201,169,110,0.4)", borderLeft: "1px solid rgba(201,169,110,0.4)", zIndex: 2 }} />
          <div style={{ position: "absolute", top: 40, right: 40, width: 40, height: 40, borderTop: "1px solid rgba(201,169,110,0.4)", borderRight: "1px solid rgba(201,169,110,0.4)", zIndex: 2 }} />
          <div style={{ position: "absolute", bottom: 80, left: 40, width: 40, height: 40, borderBottom: "1px solid rgba(201,169,110,0.4)", borderLeft: "1px solid rgba(201,169,110,0.4)", zIndex: 2 }} />
          <div style={{ position: "absolute", bottom: 80, right: 40, width: 40, height: 40, borderBottom: "1px solid rgba(201,169,110,0.4)", borderRight: "1px solid rgba(201,169,110,0.4)", zIndex: 2 }} />

          <div className="hero-content">
            <div className="hero-eyebrow">A Cinematic Journey Through India</div>
            <h1 className="hero-title">
              Beyond<br /><em>the Taj</em>
            </h1>
            <p className="hero-sub">
              Discover the India most travelers never see.<br />
              Not just destinations. Real journeys.
            </p>
            <button className="btn-primary" onClick={scrollToPlanner}>
              Plan Your Journey
            </button>
            <div className="dots">
              {INDIA_SCENES.map((_, i) => (
                <div key={i} className={`dot ${i === heroScene ? "active" : ""}`} onClick={() => setHeroScene(i)} />
              ))}
            </div>
          </div>

          <div className="scene-label">Currently viewing · {scene.name}</div>

          {/* Why Beyond Taj strip */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, borderTop: "1px solid rgba(201,169,110,0.08)", background: "rgba(0,0,0,0.6)", padding: "1.2rem 2rem", display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap", zIndex: 3 }}>
            {["No tourist traps", "Hidden gems only", "Anti-scam protection", "24/7 WhatsApp support"].map(f => (
              <div key={f} style={{ fontSize: "0.7rem", letterSpacing: "2px", color: "rgba(201,169,110,0.6)", textTransform: "uppercase" }}>
                <span style={{ color: "var(--gold)", marginRight: "0.5rem" }}>—</span>{f}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1 — DURATION */}
      {step === 1 && (
        <div className="section" style={{ background: "linear-gradient(135deg, #0a0806 0%, #12100e 100%)" }}>
          <div className="section-inner">
            <div className="step-label">Step 01 of 04</div>
            <h2 className="step-title">How long are<br />you staying?</h2>
            <p className="step-sub">We'll optimize your route for your available time.</p>

            <div style={{ maxWidth: 500 }}>
              <div className="days-display">{days}</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: "1.2rem", color: "var(--muted)", marginTop: "0.25rem" }}>
                {days === 1 ? "day" : "days"} in India
              </div>
              <input
                type="range" min={3} max={45} value={days} step={1}
                onChange={e => setDays(Number(e.target.value))}
                style={{ marginTop: "2.5rem" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", letterSpacing: "2px", color: "var(--muted)", marginTop: "0.5rem" }}>
                <span>3 days</span><span>2 weeks</span><span>1 month</span><span>45 days</span>
              </div>

              <div className="divider" />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginTop: "1rem" }}>
                {[7, 14, 21, 30].map(d => (
                  <button key={d} onClick={() => setDays(d)} className="btn-ghost" style={{ padding: "0.75rem 0.5rem" }}>
                    {d} days
                  </button>
                ))}
              </div>

              <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "2rem", lineHeight: 1.8 }}>
                <span style={{ color: "var(--gold)" }}>Tip:</span> For {days} days, we recommend experiencing{" "}
                <strong style={{ color: "var(--cream)" }}>up to {DAYS_TO_MAX_DESTINATIONS(days)} regions</strong> for a fulfilling journey.
              </p>
            </div>

            <div className="nav-row">
              <button className="btn-ghost" onClick={() => setStep(0)}>← Back</button>
              <button className="btn-primary" onClick={() => setStep(2)}>Continue →</button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 — TRAVEL STYLE */}
      {step === 2 && (
        <div className="section" style={{ background: "linear-gradient(135deg, #0d0a06 0%, #1a1208 100%)" }}>
          <div className="section-inner">
            <div className="step-label">Step 02 of 04</div>
            <h2 className="step-title">How do you want<br />to <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>experience</em> India?</h2>
            <p className="step-sub">Your travel style shapes everything — route, stays, food, pace.</p>

            <div className="style-grid">
              {STYLE_TYPES.map(s => (
                <div key={s.id} className={`style-card ${travelStyle === s.id ? "selected" : ""}`} onClick={() => setTravelStyle(s.id)}>
                  <span className="style-icon">{s.icon}</span>
                  <div className="style-name">{s.label}</div>
                  <div className="style-desc">{s.desc}</div>
                  <div className="style-price">{s.price}</div>
                </div>
              ))}
            </div>

            <div className="nav-row">
              <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button className="btn-primary" onClick={() => setStep(3)} style={{ opacity: travelStyle ? 1 : 0.4, cursor: travelStyle ? "pointer" : "not-allowed" }}>
                Continue →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 — LANDSCAPES */}
      {step === 3 && (
        <div className="section" style={{ background: "linear-gradient(135deg, #060a08 0%, #0a1210 100%)" }}>
          <div className="section-inner">
            <div className="step-label">Step 03 of 04</div>
            <h2 className="step-title">What kind of India<br />do you want to <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>feel?</em></h2>
            <p className="step-sub">Select all that call to you. We'll find the places that match.</p>

            {selectedLandscapes.length > 0 && (
              <div className="selection-count">{selectedLandscapes.length} landscape type{selectedLandscapes.length > 1 ? "s" : ""} selected</div>
            )}

            <div className="landscape-grid">
              {LANDSCAPE_TYPES.map(l => (
                <div key={l.id} className={`landscape-card ${selectedLandscapes.includes(l.id) ? "selected" : ""}`} onClick={() => toggleLandscape(l.id)}>
                  <span className="landscape-icon">{l.icon}</span>
                  <div className="landscape-title">{l.title}</div>
                  <div className="landscape-desc">{l.desc}</div>
                </div>
              ))}
            </div>

            <div className="nav-row">
              <button className="btn-ghost" onClick={() => setStep(2)}>← Back</button>
              <button className="btn-primary" onClick={() => setStep(4)} style={{ opacity: selectedLandscapes.length > 0 ? 1 : 0.4, cursor: selectedLandscapes.length > 0 ? "pointer" : "not-allowed" }}>
                See Destinations →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4 — DESTINATIONS */}
      {step === 4 && (
        <div className="section" style={{ background: "linear-gradient(135deg, #080608 0%, #100a10 100%)" }}>
          <div className="section-inner">
            <div className="step-label">Step 04 of 04</div>
            <h2 className="step-title">Choose your<br /><em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>destinations</em></h2>
            <p className="step-sub">Based on your landscape choices — select what calls to you.</p>

            {warnings.map((w, i) => <div key={i} className="warning-box">{w}</div>)}

            {selectedDestinations.length > 0 && (
              <div className="selection-count">{selectedDestinations.length} destination{selectedDestinations.length > 1 ? "s" : ""} selected · {days} days available</div>
            )}

            <div className="dest-grid">
              {availableDestinations.map(d => (
                <div key={d.id} className={`dest-card ${selectedDestinations.some(s => s.id === d.id) ? "selected" : ""}`} onClick={() => toggleDestination(d)}>
                  <div className="dest-name">{d.name}</div>
                  <div className="dest-desc">{d.desc}</div>
                  <div className="dest-meta">
                    <span>✦ {d.vibe}</span>
                    <span>Best: {d.season}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="nav-row">
              <button className="btn-ghost" onClick={() => setStep(3)}>← Back</button>
              <button className="btn-primary" onClick={() => setStep(5)} style={{ opacity: selectedDestinations.length > 0 ? 1 : 0.4, cursor: selectedDestinations.length > 0 ? "pointer" : "not-allowed" }}>
                Review My Journey →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5 — SUMMARY */}
      {step === 5 && (
        <div className="section" style={{ background: "var(--dark2)" }}>
          <div className="section-inner" style={{ maxWidth: 760 }}>
            <div className="step-label">Your Journey Summary</div>
            <h2 className="step-title">Your India,<br /><em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>personalised</em></h2>
            <p className="step-sub" style={{ marginBottom: "2.5rem" }}>Here's what we'll craft for you.</p>

            <div className="summary-card">
              <div className="summary-row">
                <span className="summary-label">Duration</span>
                <span className="summary-value">{days} days in India</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Travel Style</span>
                <span className="summary-value">{styleInfo?.label || "—"}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Landscapes</span>
                <span className="summary-value" style={{ textAlign: "right", maxWidth: "60%" }}>
                  {selectedLandscapes.map(id => LANDSCAPE_TYPES.find(l => l.id === id)?.title).join(", ")}
                </span>
              </div>
              <div className="summary-row" style={{ borderBottom: "none" }}>
                <span className="summary-label">Destinations</span>
                <span className="summary-value" style={{ textAlign: "right", maxWidth: "65%" }}>
                  {selectedDestinations.map(d => d.name).join(" · ")}
                </span>
              </div>
            </div>

            {warnings.length > 0 && warnings.map((w, i) => <div key={i} className="warning-box">{w}</div>)}

            <div className="divider" />

            <div style={{ marginBottom: "2.5rem" }}>
              <div className="step-label" style={{ marginBottom: "0.5rem" }}>What you receive</div>
              <div className="benefits-grid">
                {WHAT_YOU_GET.map(b => (
                  <div key={b} className="benefit-item">
                    <span className="benefit-check">—</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--cream)", opacity: 0.85 }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="divider" />

            <div style={{ display: "flex", alignItems: "flex-end", gap: "1.5rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
              <div>
                <div className="price-note" style={{ marginBottom: "0.5rem" }}>One-time investment</div>
                <div className="price-big">$300</div>
                <div className="price-note" style={{ marginTop: "0.5rem" }}>Itinerary delivered within 2–3 hours</div>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.8, maxWidth: 300 }}>
                You're paying in USD. This covers full personalised planning, anti-scam guidance, cultural etiquette, transport recommendations, and WhatsApp support for your entire trip.
              </div>
            </div>

            <div className="nav-row">
              <button className="btn-ghost" onClick={() => setStep(4)}>← Edit Destinations</button>
              <button className="btn-primary" onClick={() => setStep(6)}>Proceed to Payment →</button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6 — PAYMENT */}
      {step === 6 && !paymentDone && (
        <div className="section" style={{ background: "var(--dark2)" }}>
          <div className="section-inner" style={{ maxWidth: 760 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
              <div>
                <div className="step-label">Secure Checkout</div>
                <h2 className="step-title" style={{ fontSize: "2.2rem" }}>Complete<br />your booking</h2>

                <div className="divider" style={{ margin: "1.5rem 0" }} />

                <div style={{ marginBottom: "2rem" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "2.5rem", color: "var(--gold)" }}>$300</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", letterSpacing: "1px", marginTop: "0.25rem" }}>Personalized India Itinerary + WhatsApp Support</div>
                </div>

                <div style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 2 }}>
                  {selectedDestinations.map(d => (
                    <div key={d.id}>→ {d.name}</div>
                  ))}
                </div>
              </div>

              <div className="payment-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <div className="payment-methods">
                    <div className="pay-method active">Card</div>
                    <div className="pay-method">PayPal</div>
                    <div className="pay-method">Stripe</div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input className="form-input" type="text" placeholder="4242 4242 4242 4242" maxLength={19} />
                </div>

                <div className="card-row">
                  <div className="form-group">
                    <label className="form-label">Expiry</label>
                    <input className="form-input" type="text" placeholder="MM / YY" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input className="form-input" type="text" placeholder="123" maxLength={4} />
                  </div>
                </div>

                <button className="btn-primary" style={{ width: "100%", marginTop: "0.5rem", padding: "1.2rem" }}
                  onClick={() => { setPaymentDone(true); setStep(7); }}>
                  Pay $300 · Secure Checkout
                </button>

                <p className="secure-note">🔒 SSL Encrypted · PCI Compliant · No data stored</p>
              </div>
            </div>

            <div className="nav-row">
              <button className="btn-ghost" onClick={() => setStep(5)}>← Back to Summary</button>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD */}
      {step === 7 && (
        <div style={{ background: "var(--dark)", minHeight: "100vh" }}>
          <div className="dashboard">
            <div className="dash-header">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <div className="step-label" style={{ marginBottom: "0.5rem" }}>Beyond Taj · Dashboard</div>
                  <h2 style={{ fontFamily: "var(--serif)", fontSize: "2.5rem", fontWeight: 300, color: "var(--cream)" }}>
                    {name ? `Welcome, ${name.split(" ")[0]}` : "Your Journey"}
                  </h2>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.5rem", letterSpacing: "1px" }}>{email}</div>
                </div>
                <div className={`dash-status status-${tripStatus}`}>
                  <div className="status-dot" />
                  {tripStatus === "pending" && "Processing"}
                  {tripStatus === "in_progress" && "In Progress"}
                  {tripStatus === "completed" && "Completed"}
                </div>
              </div>

              <div className="progress-track" style={{ marginTop: "2rem" }}>
                {["Received", "Planning", "Review", "Delivered"].map((s, i) => {
                  const done = (tripStatus === "completed" && i <= 3) || (tripStatus === "in_progress" && i <= 1) || (tripStatus === "pending" && i <= 0);
                  const active = (tripStatus === "in_progress" && i === 2) || (tripStatus === "pending" && i === 1);
                  return <div key={s} className={`progress-step ${done ? "done" : ""} ${active ? "active" : ""}`}>{s}</div>;
                })}
              </div>
            </div>

            {tripStatus !== "completed" && (
              <div className="processing-state">
                <div className="spinner" />
                <div style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", color: "var(--cream)", marginBottom: "0.75rem" }}>
                  {tripStatus === "pending" ? "Receiving your preferences..." : "Crafting your India experience..."}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", letterSpacing: "1px" }}>
                  Our travel specialists are personally reviewing your selections
                </div>
              </div>
            )}

            {tripStatus === "completed" && (
              <>
                <div style={{ border: "1px solid rgba(168,237,234,0.3)", background: "rgba(168,237,234,0.04)", padding: "1.5rem 2rem", marginBottom: "2rem" }}>
                  <div style={{ fontSize: "0.7rem", letterSpacing: "3px", color: "#a8edea", textTransform: "uppercase", marginBottom: "0.5rem" }}>✓ Itinerary Ready</div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1.2rem", color: "var(--cream)" }}>
                    Your personalized {days}-day India journey is ready to download
                  </div>
                </div>

                <div className="dash-grid">
                  <div className="dash-card">
                    <div className="dash-card-title">Your Trip</div>
                    <div style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", color: "var(--cream)", marginBottom: "0.5rem" }}>{days} Days</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: "1rem" }}>{styleInfo?.label}</div>
                    <div>{selectedDestinations.map(d => <span key={d.id} className="tag">{d.name}</span>)}</div>
                  </div>

                  <div className="dash-card">
                    <div className="dash-card-title">Landscapes</div>
                    <div>{selectedLandscapes.map(id => {
                      const l = LANDSCAPE_TYPES.find(x => x.id === id);
                      return <span key={id} className="tag">{l?.icon} {l?.title}</span>;
                    })}</div>
                  </div>

                  <div className="dash-card">
                    <div className="dash-card-title">Documents</div>
                    <button className="btn-primary" style={{ width: "100%", padding: "0.9rem", marginBottom: "0.75rem" }}>
                      ↓ Download Itinerary PDF
                    </button>
                    <button className="btn-ghost" style={{ width: "100%", padding: "0.75rem" }}>
                      ↓ Download Culture Guide
                    </button>
                  </div>

                  <div className="dash-card">
                    <div className="dash-card-title">Support</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.8, marginBottom: "1.25rem" }}>
                      Your dedicated travel specialist is available throughout your trip.
                    </div>
                    <div className="whatsapp-btn">
                      <span style={{ fontSize: "1.2rem" }}>💬</span>
                      Open WhatsApp Support
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="divider" />
            <div style={{ textAlign: "center" }}>
              <button className="btn-ghost" onClick={() => { setStep(0); setPaymentDone(false); setTravelStyle(null); setSelectedLandscapes([]); setSelectedDestinations([]); setTripStatus("pending"); }}>
                Plan Another Journey
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav indicator for steps 1-5 */}
      {step >= 1 && step <= 5 && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,8,6,0.95)", borderBottom: "1px solid rgba(201,169,110,0.1)", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: "1.1rem", color: "var(--gold)", letterSpacing: "2px" }}>
            Beyond Taj
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[1, 2, 3, 4, 5].map(s => (
              <div key={s} style={{ width: 24, height: 2, background: s <= step ? "var(--gold)" : "rgba(201,169,110,0.2)", transition: "background 0.4s" }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
