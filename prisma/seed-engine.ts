import prisma from '../lib/prisma';

async function main() {
  console.log('Seeding Intelligence Engine (Phase 1)...');

  // 1. Create Clusters
  const northMountain = await prisma.destinationCluster.upsert({
    where: { id: 'north_mountain' },
    update: { compatibleClusters: [] },
    create: {
      id: 'north_mountain',
      name: 'North Mountain Circuit',
      hubCities: ['Delhi', 'Chandigarh'],
      compatibleClusters: [],
    },
  });

  const rajasthan = await prisma.destinationCluster.upsert({
    where: { id: 'rajasthan' },
    update: { compatibleClusters: [] },
    create: {
      id: 'rajasthan',
      name: 'Rajasthan Royal Circuit',
      hubCities: ['Delhi', 'Jaipur'],
      compatibleClusters: [],
    },
  });
  
  const transitHub = await prisma.destinationCluster.upsert({
    where: { id: 'transit_hub' },
    update: {},
    create: {
      id: 'transit_hub',
      name: 'Major Transit Hubs',
      hubCities: [],
      compatibleClusters: ['north_mountain', 'rajasthan'],
    },
  });

  // 2. Create Core Destinations
  const destinationsData = [
    // Transit Hub
    {
      id: 'Delhi',
      name: 'Delhi',
      description: 'The capital city and major transit hub.',
      region: 'North India',
      idealSeason: 'October to March',
      vibeTags: ['chaotic', 'historic'],
      minRequiredDays: 2,
      latitude: 28.7041,
      longitude: 77.1025,
      clusterId: 'transit_hub',
      altitude: 216,
      requiresAcclimatization: false,
      metadata: { energy_type: 'chaotic', pace_type: 'fast' }
    },
    // North Mountain
    {
      id: 'Manali',
      name: 'Manali',
      description: 'High-altitude Himalayan resort town.',
      region: 'Himachal Pradesh',
      idealSeason: 'April to June',
      vibeTags: ['mountains', 'adventure'],
      minRequiredDays: 3,
      latitude: 32.2396,
      longitude: 77.1887,
      clusterId: 'north_mountain',
      altitude: 2050,
      requiresAcclimatization: false,
      metadata: { energy_type: 'restorative', pace_type: 'slow_forced' }
    },
    {
      id: 'Leh-Ladakh',
      name: 'Leh-Ladakh',
      description: 'High-desert city in the Himalayas.',
      region: 'Jammu & Kashmir',
      idealSeason: 'June to September',
      vibeTags: ['cold_desert', 'spiritual'],
      minRequiredDays: 5,
      latitude: 34.1526,
      longitude: 77.5771,
      clusterId: 'north_mountain',
      altitude: 3500,
      requiresAcclimatization: true,
      metadata: { energy_type: 'demanding', pace_type: 'slow_forced' }
    },
    {
      id: 'Spiti Valley',
      name: 'Spiti Valley',
      description: 'Cold desert mountain valley.',
      region: 'Himachal Pradesh',
      idealSeason: 'June to September',
      vibeTags: ['cold_desert', 'remote'],
      minRequiredDays: 4,
      latitude: 32.2461,
      longitude: 78.0349,
      clusterId: 'north_mountain',
      altitude: 3800,
      requiresAcclimatization: true,
      metadata: { energy_type: 'demanding', pace_type: 'slow_forced' }
    },
    // Rajasthan
    {
      id: 'Jaipur',
      name: 'Jaipur',
      description: 'The Pink City of India.',
      region: 'Rajasthan',
      idealSeason: 'October to March',
      vibeTags: ['royal', 'historic'],
      minRequiredDays: 2,
      latitude: 26.9124,
      longitude: 75.7873,
      clusterId: 'rajasthan',
      altitude: 431,
      requiresAcclimatization: false,
      metadata: { energy_type: 'chaotic', pace_type: 'fast' }
    },
    {
      id: 'Jodhpur',
      name: 'Jodhpur',
      description: 'The Blue City of India.',
      region: 'Rajasthan',
      idealSeason: 'October to March',
      vibeTags: ['royal', 'desert'],
      minRequiredDays: 2,
      latitude: 26.2389,
      longitude: 73.0243,
      clusterId: 'rajasthan',
      altitude: 231,
      requiresAcclimatization: false,
      metadata: { energy_type: 'balanced', pace_type: 'medium' }
    },
    {
      id: 'Udaipur',
      name: 'Udaipur',
      description: 'The City of Lakes.',
      region: 'Rajasthan',
      idealSeason: 'October to March',
      vibeTags: ['royal', 'romantic'],
      minRequiredDays: 3,
      latitude: 24.5854,
      longitude: 73.7125,
      clusterId: 'rajasthan',
      altitude: 598,
      requiresAcclimatization: false,
      metadata: { energy_type: 'restorative', pace_type: 'slow' }
    },
    {
      id: 'Jaisalmer',
      name: 'Jaisalmer',
      description: 'The Golden City in the Thar Desert.',
      region: 'Rajasthan',
      idealSeason: 'October to March',
      vibeTags: ['desert', 'remote'],
      minRequiredDays: 3,
      latitude: 26.9157,
      longitude: 70.9083,
      clusterId: 'rajasthan',
      altitude: 225,
      requiresAcclimatization: false,
      metadata: { energy_type: 'balanced', pace_type: 'medium' }
    }
  ];

  for (const dest of destinationsData) {
    await prisma.destination.upsert({
      where: { id: dest.id },
      update: { ...dest, updatedAt: new Date() },
      create: { ...dest, updatedAt: new Date() },
    });
  }

  // 3. Create Bidirectional Transit Edges (Directed Graph)
  const edges = [
    // Delhi to North Mountain
    { originId: 'Delhi', destinationId: 'Manali', travelMode: 'Road', durationHours: 12, distanceKm: 530, fatigueCost: 7, isFlight: false },
    { originId: 'Manali', destinationId: 'Delhi', travelMode: 'Road', durationHours: 12, distanceKm: 530, fatigueCost: 6, isFlight: false }, // Driving down is slightly less fatiguing
    
    { originId: 'Delhi', destinationId: 'Leh-Ladakh', travelMode: 'Flight', durationHours: 1.5, distanceKm: 600, fatigueCost: 4, isFlight: true }, // Flight itself is easy, but altitude shock costs more later
    { originId: 'Leh-Ladakh', destinationId: 'Delhi', travelMode: 'Flight', durationHours: 1.5, distanceKm: 600, fatigueCost: 2, isFlight: true }, // Going down to Delhi is a relief
    
    // Intra-North Mountain
    { originId: 'Manali', destinationId: 'Leh-Ladakh', travelMode: 'Road', durationHours: 14, distanceKm: 430, fatigueCost: 9, isFlight: false, seasonal: true, openMonths: [6,7,8,9] }, // Grueling climb
    { originId: 'Leh-Ladakh', destinationId: 'Manali', travelMode: 'Road', durationHours: 14, distanceKm: 430, fatigueCost: 7, isFlight: false, seasonal: true, openMonths: [6,7,8,9] }, // Grueling but descending
    
    { originId: 'Manali', destinationId: 'Spiti Valley', travelMode: 'Road', durationHours: 8, distanceKm: 200, fatigueCost: 8, isFlight: false, seasonal: true, openMonths: [6,7,8,9] },
    { originId: 'Spiti Valley', destinationId: 'Manali', travelMode: 'Road', durationHours: 8, distanceKm: 200, fatigueCost: 6, isFlight: false, seasonal: true, openMonths: [6,7,8,9] },
    
    // Delhi to Rajasthan
    { originId: 'Delhi', destinationId: 'Jaipur', travelMode: 'Road', durationHours: 4.5, distanceKm: 280, fatigueCost: 3, isFlight: false },
    { originId: 'Jaipur', destinationId: 'Delhi', travelMode: 'Road', durationHours: 4.5, distanceKm: 280, fatigueCost: 3, isFlight: false },
    
    { originId: 'Delhi', destinationId: 'Udaipur', travelMode: 'Flight', durationHours: 1.5, distanceKm: 600, fatigueCost: 3, isFlight: true },
    { originId: 'Udaipur', destinationId: 'Delhi', travelMode: 'Flight', durationHours: 1.5, distanceKm: 600, fatigueCost: 3, isFlight: true },

    { originId: 'Delhi', destinationId: 'Jodhpur', travelMode: 'Flight', durationHours: 1.2, distanceKm: 550, fatigueCost: 3, isFlight: true },
    { originId: 'Jodhpur', destinationId: 'Delhi', travelMode: 'Flight', durationHours: 1.2, distanceKm: 550, fatigueCost: 3, isFlight: true },

    // Intra-Rajasthan
    { originId: 'Jaipur', destinationId: 'Jodhpur', travelMode: 'Road', durationHours: 6, distanceKm: 330, fatigueCost: 4, isFlight: false },
    { originId: 'Jodhpur', destinationId: 'Jaipur', travelMode: 'Road', durationHours: 6, distanceKm: 330, fatigueCost: 4, isFlight: false },
    
    { originId: 'Jodhpur', destinationId: 'Udaipur', travelMode: 'Road', durationHours: 5, distanceKm: 250, fatigueCost: 4, isFlight: false },
    { originId: 'Udaipur', destinationId: 'Jodhpur', travelMode: 'Road', durationHours: 5, distanceKm: 250, fatigueCost: 4, isFlight: false },
    
    { originId: 'Jodhpur', destinationId: 'Jaisalmer', travelMode: 'Road', durationHours: 4.5, distanceKm: 280, fatigueCost: 3, isFlight: false },
    { originId: 'Jaisalmer', destinationId: 'Jodhpur', travelMode: 'Road', durationHours: 4.5, distanceKm: 280, fatigueCost: 3, isFlight: false },
    
    { originId: 'Udaipur', destinationId: 'Jaipur', travelMode: 'Road', durationHours: 7, distanceKm: 400, fatigueCost: 5, isFlight: false },
    { originId: 'Jaipur', destinationId: 'Udaipur', travelMode: 'Road', durationHours: 7, distanceKm: 400, fatigueCost: 5, isFlight: false },
  ];

  for (const edge of edges) {
    const id = `${edge.originId}_${edge.destinationId}_${edge.travelMode}`.toLowerCase().replace(/ /g, '_');
    await prisma.transitRoute.upsert({
      where: {
        originId_destinationId: {
          originId: edge.originId,
          destinationId: edge.destinationId,
        }
      },
      update: {
        ...edge,
        id, // ensure id is consistent
      },
      create: {
        id,
        ...edge
      }
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
