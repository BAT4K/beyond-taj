export function validateItinerary(prefs: { destinations: string[], durationDays: number, travelMonth: string }): string[] {
  const warnings: string[] = [];
  const { destinations, durationDays, travelMonth } = prefs;

  // Rule 1 (Geography)
  if (durationDays < 10 && destinations.includes('Leh-Ladakh') && destinations.includes('Goa')) {
    warnings.push("High Friction Route: Combining the extreme North (Leh) and South (Goa) in under 10 days requires intense flight layovers. Consider focusing on a single region.");
  }

  // Rule 2 (Heatwave)
  if ((travelMonth === 'May' || travelMonth === 'June') && (destinations.includes('Delhi') || destinations.includes('Rajasthan') || destinations.includes('Udaipur') || destinations.includes('Jaisalmer'))) {
    warnings.push("Extreme Climate Alert: May and June bring severe heatwaves to this region (often exceeding 45°C / 113°F). Outdoor sightseeing is highly restrictive during midday.");
  }

  // Rule 3 (Winter Closures)
  const winterMonths = ['November', 'December', 'January', 'February', 'March'];
  if (winterMonths.includes(travelMonth) && (destinations.includes('Manali') || destinations.includes('Leh-Ladakh'))) {
    warnings.push("Winter Pass Closures: High-altitude roads in these regions often close due to heavy snowfall. Your itinerary will be heavily restricted to accessible zones.");
  }

  // Rule 4 (Positive Reinforcement)
  if ((travelMonth === 'July' || travelMonth === 'August') && destinations.includes('Leh-Ladakh')) {
    warnings.push("Optimal Timing: You have selected the ideal window for Leh-Ladakh with clear, accessible routes.");
  }

  return warnings;
}
