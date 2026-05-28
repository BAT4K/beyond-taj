import { validateItinerary } from './utils/travelValidator';

const destinations = [
  { name: 'Delhi', latitude: 28.6139, longitude: 77.2090 },
  { name: 'South Goa', latitude: 15.2993, longitude: 74.1240 }
];

const warnings = validateItinerary({
  destinations: destinations,
  durationDays: 7,
  travelMonth: 'August'
});

console.log("Warnings:", warnings);
