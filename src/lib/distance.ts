// Calculate distance between two coordinates using Haversine formula

// Current average U.S. gasoline price (updated Feb 2026)
export const CURRENT_GAS_PRICE = 2.93; // dollars per gallon
export const FUEL_EFFICIENCY_MPG = 25; // miles per gallon

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Estimate drive time based on distance
// Assuming average highway speed of 55 mph with breaks
export function estimateDriveTime(distanceMiles: number): number {
  const avgSpeed = 55; // mph including traffic and breaks
  return distanceMiles / avgSpeed;
}

export function formatDriveTime(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

// Filter destinations within max drive time (hours)
export function filterByDriveTime(
  userLat: number,
  userLon: number,
  destinations: { lat: number; lon: number }[],
  maxHours: number
): boolean[] {
  return destinations.map((dest) => {
    const distance = calculateDistance(userLat, userLon, dest.lat, dest.lon);
    const driveTime = estimateDriveTime(distance);
    return driveTime <= maxHours;
  });
}

// Calculate round-trip fuel cost
export function calculateFuelCost(
  distanceMiles: number,
  gasPricePerGallon: number = CURRENT_GAS_PRICE,
  mpg: number = FUEL_EFFICIENCY_MPG
): number {
  const roundTripDistance = distanceMiles * 2;
  const gallonsNeeded = roundTripDistance / mpg;
  return gallonsNeeded * gasPricePerGallon;
}

export function formatFuelCost(cost: number): string {
  return `$${cost.toFixed(0)}`;
}
