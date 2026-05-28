type ValidatorDestination = {
  name: string;
  latitude?: number;
  longitude?: number;
};

function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

export function validateItinerary(prefs: { destinations: (ValidatorDestination | string)[], durationDays: number, travelMonth: string }): string[] {
  const warnings: string[] = [];
  const { destinations, durationDays, travelMonth } = prefs;

  const normalizedDests = destinations.map(d => typeof d === 'string' ? { name: d } : d);
  const destNames = normalizedDests.map(d => d.name);

  // Rule 1 (Geography / Extreme Distance)
  if (normalizedDests.length >= 2) {
    let maxDist = 0;
    let farPair = ["", ""];
    
    for (let i = 0; i < normalizedDests.length; i++) {
      for (let j = i + 1; j < normalizedDests.length; j++) {
        const d1 = normalizedDests[i];
        const d2 = normalizedDests[j];
        if (d1.latitude !== undefined && d1.longitude !== undefined && d2.latitude !== undefined && d2.longitude !== undefined) {
          const dist = calculateHaversineDistance(d1.latitude, d1.longitude, d2.latitude, d2.longitude);
          if (dist > maxDist) {
            maxDist = dist;
            farPair = [d1.name, d2.name];
          }
        }
      }
    }

    console.log("[VALIDATOR] dests:", normalizedDests.map(d => `${d.name} (${d.latitude}, ${d.longitude})`));
    console.log("[VALIDATOR] maxDist:", maxDist, "farPair:", farPair);

    // For extreme distances (>1200km like Delhi to Goa), 10 days is the practical minimum
    if (maxDist > 1200 && durationDays < 10) {
      warnings.push(`High Friction Route: Combining ${farPair[0]} and ${farPair[1]} (over ${Math.round(maxDist)}km apart) in under 10 days requires intense flight layovers and transit days. Consider focusing on a single region.`);
    } 
    // For moderate-high distances (900-1200km), warn if the trip is under 8 days
    else if (maxDist > 900 && maxDist <= 1200 && durationDays < 8) {
      warnings.push(`High Friction Route: Combining ${farPair[0]} and ${farPair[1]} (over 900km apart) in under 8 days leaves very little time for actual exploration. Consider focusing on a single region.`);
    }
  }

  // Rule 2 (Heatwave)
  const heatwaveTargets = ['Delhi', 'Rajasthan', 'Udaipur', 'Jaisalmer', 'Jaipur', 'Jodhpur'];
  const heatDests = destNames.filter(d => heatwaveTargets.some(hw => d.includes(hw)));
  if ((travelMonth === 'May' || travelMonth === 'June') && heatDests.length > 0) {
    const list = new Intl.ListFormat('en').format(heatDests);
    warnings.push(`Extreme Climate Alert: May and June bring severe heatwaves to ${list} (often exceeding 45°C / 113°F). Outdoor sightseeing is highly restrictive during midday.`);
  }

  // Rule 3 (Winter Closures)
  const winterTargets = ['Manali', 'Leh', 'Spiti', 'Gulmarg'];
  const winterDests = destNames.filter(d => winterTargets.some(wt => d.includes(wt)));
  const winterMonths = ['November', 'December', 'January', 'February', 'March'];
  if (winterMonths.includes(travelMonth) && winterDests.length > 0) {
    const list = new Intl.ListFormat('en').format(winterDests);
    warnings.push(`Winter Pass Closures: High-altitude roads in ${list} often close due to heavy snowfall. Your itinerary will be heavily restricted to accessible zones.`);
  }

  return warnings;
}
