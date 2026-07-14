/**
 * Google Maps Directions utilities for EB Volt
 * Handles route planning and navigation
 */

interface Coordinates {
  lat: number;
  lng: number;
}

interface DirectionsParams {
  origin: Coordinates;
  destination: Coordinates;
  travelMode?: google.maps.TravelMode;
}

/**
 * Open Google Maps with directions from origin to destination
 * @param origin Starting coordinates
 * @param destination End coordinates
 * @param travelMode Travel mode (default: DRIVING)
 */
export function openDirectionsInMaps(
  origin: Coordinates,
  destination: Coordinates,
  travelMode: google.maps.TravelMode = google.maps.TravelMode.DRIVING
): void {
  // Create Google Maps URL with directions
  const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=${getTravelModeString(travelMode)}`;
  window.open(url, "_blank");
}

/**
 * Convert Google Maps TravelMode to URL string
 */
function getTravelModeString(mode: google.maps.TravelMode): string {
  switch (mode) {
    case google.maps.TravelMode.DRIVING:
      return "driving";
    case google.maps.TravelMode.WALKING:
      return "walking";
    case google.maps.TravelMode.BICYCLING:
      return "bicycling";
    case google.maps.TravelMode.TRANSIT:
      return "transit";
    default:
      return "driving";
  }
}

/**
 * Calculate estimated travel time and distance (requires DirectionsService)
 * @param directionsService Google Maps DirectionsService instance
 * @param params Direction parameters
 */
export async function calculateRoute(
  directionsService: google.maps.DirectionsService,
  params: DirectionsParams
): Promise<google.maps.DirectionsResult | null> {
  try {
    const result = await directionsService.route({
      origin: params.origin,
      destination: params.destination,
      travelMode: params.travelMode || google.maps.TravelMode.DRIVING,
    });
    return result;
  } catch (error) {
    console.error("Error calculating route:", error);
    return null;
  }
}

/**
 * Format route information for display
 */
export function formatRouteInfo(route: google.maps.DirectionsResult): {
  distance: string;
  duration: string;
  steps: number;
} {
  if (!route.routes.length) {
    return { distance: "N/A", duration: "N/A", steps: 0 };
  }

  const leg = route.routes[0]!.legs[0];
  if (!leg) {
    return { distance: "N/A", duration: "N/A", steps: 0 };
  }

  return {
    distance: leg.distance?.text || "N/A",
    duration: leg.duration?.text || "N/A",
    steps: route.routes[0]!.legs[0]!.steps?.length || 0,
  };
}
