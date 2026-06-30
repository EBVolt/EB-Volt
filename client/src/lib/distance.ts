/**
 * Distance calculation utilities for EcoBelle Volt
 * Uses Haversine formula to calculate great-circle distance between two points
 */

interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Calculate distance between two geographic coordinates using Haversine formula
 * @param from Starting coordinates
 * @param to Destination coordinates
 * @returns Distance in kilometers
 */
export function calculateDistance(from: Coordinates, to: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 * @param km Distance in kilometers
 * @returns Formatted distance string
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}

/**
 * Get distance category for UI styling
 * @param km Distance in kilometers
 * @returns Category: 'very-close', 'close', 'moderate', 'far'
 */
export function getDistanceCategory(km: number): "very-close" | "close" | "moderate" | "far" {
  if (km < 0.5) return "very-close";
  if (km < 2) return "close";
  if (km < 5) return "moderate";
  return "far";
}
