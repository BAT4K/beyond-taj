export function validateItinerary(prefs: { destinations: string[], durationDays: number, travelMonth: string }): string[] {
  const warnings: string[] = [];
  const { destinations, durationDays, travelMonth } = prefs;

  // Rule 1 (Geography)
  const geoAlertDests = destinations.filter(d => d.includes('Leh') || d.includes('Goa'));
  if (durationDays < 10 && geoAlertDests.length >= 2 && geoAlertDests.some(d => d.includes('Leh')) && geoAlertDests.some(d => d.includes('Goa'))) {
    const leh = geoAlertDests.find(d => d.includes('Leh'));
    const goa = geoAlertDests.find(d => d.includes('Goa'));
    warnings.push(`High Friction Route: Combining the extreme North (${leh}) and South (${goa}) in under 10 days requires intense flight layovers. Consider focusing on a single region.`);
  }

  // Rule 2 (Heatwave)
  const heatwaveTargets = ['Delhi', 'Rajasthan', 'Udaipur', 'Jaisalmer', 'Jaipur', 'Jodhpur'];
  const heatDests = destinations.filter(d => heatwaveTargets.some(hw => d.includes(hw)));
  if ((travelMonth === 'May' || travelMonth === 'June') && heatDests.length > 0) {
    const list = new Intl.ListFormat('en').format(heatDests);
    warnings.push(`Extreme Climate Alert: May and June bring severe heatwaves to ${list} (often exceeding 45°C / 113°F). Outdoor sightseeing is highly restrictive during midday.`);
  }

  // Rule 3 (Winter Closures)
  const winterTargets = ['Manali', 'Leh', 'Spiti', 'Gulmarg'];
  const winterDests = destinations.filter(d => winterTargets.some(wt => d.includes(wt)));
  const winterMonths = ['November', 'December', 'January', 'February', 'March'];
  if (winterMonths.includes(travelMonth) && winterDests.length > 0) {
    const list = new Intl.ListFormat('en').format(winterDests);
    warnings.push(`Winter Pass Closures: High-altitude roads in ${list} often close due to heavy snowfall. Your itinerary will be heavily restricted to accessible zones.`);
  }


  return warnings;
}
