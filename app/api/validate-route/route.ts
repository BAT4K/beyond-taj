import { NextResponse } from 'next/server';

const geoMap: Record<string, { lat: number; lng: number }> = {
  "Leh-Ladakh": { lat: 34.1526, lng: 77.5771 },
  "Spiti Valley": { lat: 32.2461, lng: 78.0349 },
  "Manali": { lat: 32.2396, lng: 77.1887 },
  "Gulmarg": { lat: 34.0484, lng: 74.3805 },
  "Tirthan Valley": { lat: 31.6380, lng: 77.3436 },
  "Udaipur": { lat: 24.5854, lng: 73.7125 },
  "Jodhpur": { lat: 26.2389, lng: 73.0243 },
  "Jaisalmer": { lat: 26.9157, lng: 70.9083 },
  "Jaipur": { lat: 26.9124, lng: 75.7873 },
  "Bundi": { lat: 25.4305, lng: 75.6499 },
  "Mysore": { lat: 12.2958, lng: 76.6394 },
  "South Goa": { lat: 15.2993, lng: 74.1240 },
  "Gokarna": { lat: 14.5398, lng: 74.3180 },
  "Varkala": { lat: 8.7338, lng: 76.7059 },
  "Havelock Island (Swaraj Dweep)": { lat: 11.9761, lng: 92.9876 },
  "Alleppey": { lat: 9.4981, lng: 76.3388 },
  "Munroe Island": { lat: 8.9892, lng: 76.6196 },
  "Ranthambore": { lat: 26.0173, lng: 76.2215 },
  "Jawai": { lat: 25.1011, lng: 73.3228 },
  "Kabini": { lat: 11.9421, lng: 76.2690 },
  "Kaziranga": { lat: 26.5775, lng: 93.1711 },
  "Munnar": { lat: 10.0889, lng: 77.0595 },
  "Darjeeling": { lat: 27.0360, lng: 88.2627 },
  "Meghalaya (Shillong & Sohra)": { lat: 25.5788, lng: 91.8831 },
  "Ziro Valley": { lat: 27.5562, lng: 93.8340 },
  "Varanasi": { lat: 25.3176, lng: 82.9739 },
  "Rishikesh": { lat: 30.0869, lng: 78.2676 },
  "Hampi": { lat: 15.3350, lng: 76.4600 },
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Delhi": { lat: 28.7041, lng: 77.1025 },
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { selectedDays, travelStyle, destinationNames } = body;

    if (
      typeof selectedDays !== 'number' ||
      typeof travelStyle !== 'string' ||
      !Array.isArray(destinationNames)
    ) {
      return NextResponse.json(
        { error: 'Invalid payload: required fields are selectedDays (number), travelStyle (string), and destinationNames (string[])' },
        { status: 400 }
      );
    }

    const warnings: string[] = [];

    // Dynamic Coordinate-Based Validation
    if (selectedDays <= 7 && destinationNames.length >= 2) {
      let maxDist = 0;
      for (let i = 0; i < destinationNames.length; i++) {
        for (let j = i + 1; j < destinationNames.length; j++) {
          const loc1 = geoMap[destinationNames[i]];
          const loc2 = geoMap[destinationNames[j]];
          
          if (loc1 && loc2) {
            const dist = calculateDistance(loc1.lat, loc1.lng, loc2.lat, loc2.lng);
            if (dist > maxDist) maxDist = dist;
          }
        }
      }

      if (maxDist > 800) {
        warnings.push("Heads up! These destinations are geographically far apart. Covering this distance in a short trip will result in heavy transit times.");
      }
    }

    const isValid = warnings.length === 0;

    return NextResponse.json({
      isValid,
      warnings
    });
  } catch (error) {
    console.error('Validation API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
