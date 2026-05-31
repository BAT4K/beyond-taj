import { z } from 'zod';

export const VALID_REGIONS = ["North", "West", "South", "Islands", "East", "Central", "Northeast"] as const;
export const VALID_LANDSCAPES = ["Mountains", "Beaches", "Islands", "Cold Desert", "Royal Cities", "Spiritual India", "Wildlife & Jungle", "Backwaters", "Tea Plantations", "Desert", "Modern Cities", "Hidden Villages"] as const;
export const VALID_VIBES = ["Otherworldly", "Bold", "Remote", "Spiritual", "Wild", "Exhilarating", "Winter Wonderland", "Luxury", "Peaceful", "Rustic", "Romantic", "Regal", "Historic", "Vibrant", "Mystical", "Golden", "Iconic", "Authentic", "Quiet", "Cultural", "Relaxed", "Lush", "Soulful", "Bohemian", "Pristine", "Tropical", "Dreamy", "Slow", "Hidden", "Tranquil", "Exclusive", "Raw", "Mysterious", "Unique", "Restorative", "Nostalgic", "Scenic", "Magical", "Pure", "Tribal", "Untouched", "Intense", "Sacred", "Zen", "Awakening", "Surreal", "Cosmopolitan", "Fast-paced", "Bustling"] as const;

export const DestinationSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  shortPitch: z.string(),
  topHighlights: z.array(z.string()),
  region: z.enum(VALID_REGIONS),
  vibeTags: z.array(z.enum(VALID_VIBES)).default([]),
  idealSeason: z.string().optional(),
  image: z.string().optional(),
  landscapes: z.array(z.enum(VALID_LANDSCAPES)).default([]).optional(),
  peakMonths: z.array(z.number().int().min(1).max(12)).default([]),
  shoulderMonths: z.array(z.number().int().min(1).max(12)).default([]),
  avoidMonths: z.array(z.number().int().min(1).max(12)).default([]),
  closedMonths: z.array(z.number().int().min(1).max(12)).default([]),
  minRequiredDays: z.number().int().positive().default(2).optional(),
  latitude: z.number().min(6.0).max(37.0).optional(),
  longitude: z.number().min(68.0).max(97.0).optional(),
  clusterId: z.string().nullable().optional(),
  compatibleClusters: z.array(z.string()).optional(),
  isHub: z.boolean().optional(),
  requiresAcclimatization: z.boolean().default(false).optional()
}).catchall(z.any());

export type Destination = z.infer<typeof DestinationSchema>;

export const TransitRouteSchema = z.object({
  originId: z.string(),
  destinationId: z.string(),
  fatigueCost: z.number()
}).catchall(z.any());

export type TransitRouteEdge = z.infer<typeof TransitRouteSchema>;

export const TripRequestSchema = z.object({
  travelMonth: z.string().optional(),
  selectedLandscapes: z.array(z.string()).optional(),
  days: z.number().default(7),
  selectedVibes: z.array(z.string()).optional()
}).catchall(z.any());

export type TripRequest = z.infer<typeof TripRequestSchema>;

// Shared Constants
export const DEFAULT_MIN_DAYS = 2;

export const MONTH_MAP: Record<string, number> = {
  "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
  "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12
};

export const FATIGUE_BUDGETS: Record<string, number> = {
  "luxury": 4,
  "balanced": 6,
  "backpacker": 8,
  "adventure": 9
};

// Pure Math Functions
export function getWeatherReason(m: number): string {
  if ([4, 5, 6].includes(m)) return "extreme summer heat waves";
  if ([7, 8, 9].includes(m)) return "heavy monsoons and risk of flooding/landslides";
  if ([11, 12, 1, 2, 3].includes(m)) return "extreme freezing temperatures and heavy snow";
  return "very poor seasonal conditions";
}

export function calculateWeatherFactor(destination: Destination, travelMonthStr?: string) {
  if (!travelMonthStr) return 1.0;
  
  const monthInt = MONTH_MAP[travelMonthStr];
  if (!monthInt) return 1.0;

  if (destination.closedMonths?.includes(monthInt)) return 0.0;
  if (destination.avoidMonths?.includes(monthInt)) return 0.1;
  if (destination.peakMonths?.includes(monthInt)) return 1.0;
  if (destination.shoulderMonths?.includes(monthInt)) return 0.75;
  
  return 1.0;
}

export function calculateLogisticsFactor(destinationId: string, lastSelectedNode: string, transitRoutes: TransitRouteEdge[]) {
  const route = transitRoutes.find(r => 
    (r.originId === lastSelectedNode && r.destinationId === destinationId) ||
    (r.destinationId === lastSelectedNode && r.originId === destinationId)
  );

  let fatigueCost = 10;
  if (route) {
    fatigueCost = route.fatigueCost;
  }
  
  const factor = 1.0 - (fatigueCost / 10.0);
  return Math.max(0, Math.min(1.0, factor));
}

export function calculateVibeFactor(destination: Destination, selectedVibes?: string[]) {
  if (!selectedVibes || selectedVibes.length === 0) return 1.0;
  if (!destination.vibeTags || !Array.isArray(destination.vibeTags)) return 0.0;
  
  let matchCount = 0;
  for (const v of selectedVibes) {
    if (destination.vibeTags.includes(v as any)) matchCount++;
  }
  
  if (matchCount === selectedVibes.length) return 1.0;
  if (matchCount > 0) return 0.5;
  return 0.0;
}

export function calculateLandscapeFactor(destination: Destination, selectedLandscapes?: string[]) {
  if (!selectedLandscapes || selectedLandscapes.length === 0) return 1.0;
  if (!destination.landscapes || !Array.isArray(destination.landscapes)) return 0.0;
  
  let matchCount = 0;
  for (const l of selectedLandscapes) {
    if (destination.landscapes.includes(l as any)) matchCount++;
  }
  
  if (matchCount === 0) return 0.0;
  return Math.min(1.0, matchCount * 0.5);
}

export function calculateMatchScore(
  destination: Destination, 
  userContext: TripRequest,
  lastSelectedNode?: string | null,
  transitRoutes?: TransitRouteEdge[]
) {
  const vibeFactor = calculateVibeFactor(destination, userContext.selectedVibes);
  const weatherFactor = calculateWeatherFactor(destination, userContext.travelMonth);
  const landscapeFactor = calculateLandscapeFactor(destination, userContext.selectedLandscapes);
  
  let logisticsFactor = 1.0;
  let hasLogistics = false;

  if (lastSelectedNode && transitRoutes && transitRoutes.length > 0) {
    logisticsFactor = calculateLogisticsFactor(destination.id, lastSelectedNode, transitRoutes);
    hasLogistics = true;
  }

  let vibeWeight = 0.15;
  let weatherWeight = 0.35;
  let landscapeWeight = 0.50;
  let logisticsWeight = 0.0;

  if (hasLogistics) {
    if (userContext.days <= 7) {
      logisticsWeight = 0.60;
      weatherWeight = 0.20;
      landscapeWeight = 0.15;
      vibeWeight = 0.05;
    } else if (userContext.days <= 14) {
      logisticsWeight = 0.40;
      weatherWeight = 0.30;
      landscapeWeight = 0.20;
      vibeWeight = 0.10;
    } else {
      logisticsWeight = 0.20;
      weatherWeight = 0.40;
      landscapeWeight = 0.25;
      vibeWeight = 0.15;
    }
  }

  const score = (
    (vibeFactor * vibeWeight) +
    (weatherFactor * weatherWeight) +
    (landscapeFactor * landscapeWeight) +
    (logisticsFactor * logisticsWeight)
  );

  return {
    score: score * 100,
    isDeadEnd: hasLogistics && logisticsFactor <= 0.0,
    weatherFactor,
    logisticsFactor
  };
}

export function calculateTripPacing(destinations: Destination[], days: number) {
  const sumMinDays = destinations.reduce((sum, d) => sum + (d.minRequiredDays || 2), 0);
  const slackDays = days - sumMinDays;
  const isPhysicallyPossible = sumMinDays <= days;
  
  // Pacing warning if too much slack
  const requiresPacingWarning = isPhysicallyPossible && slackDays >= 5 && days >= sumMinDays * 2;
  
  return {
    sumMinDays,
    slackDays,
    isPhysicallyPossible,
    requiresPacingWarning
  };
}
