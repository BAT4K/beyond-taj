type ValidatorDestination = {
  name: string;
  latitude?: number;
  longitude?: number;
};

export function validateItinerary(prefs: { destinations: (ValidatorDestination | string)[], durationDays: number, travelMonth: string }): string[] {
  const warnings: string[] = [];
  const { destinations, durationDays, travelMonth } = prefs;

  const normalizedDests = destinations.map(d => typeof d === 'string' ? { name: d } : d);
  const destNames = normalizedDests.map(d => d.name);

  // Rule 1 (Geography) is now handled server-side by the Haversine engine in the validate-route API.

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
