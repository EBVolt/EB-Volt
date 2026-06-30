/**
 * BoltMarker Component
 * SVG-based EB Volt green bolt logo marker for Google Maps
 */

export function createBoltMarkerSVG(status: "available" | "busy" | "offline" = "available"): string {
  const statusColors = {
    available: "#22c55e", // Green
    busy: "#f97316",      // Orange
    offline: "#6b7280",   // Grey
  };

  const color = statusColors[status];

  // SVG with green bolt/lightning icon
  const svg = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer circle background -->
      <circle cx="20" cy="20" r="18" fill="white" stroke="${color}" stroke-width="2"/>
      
      <!-- Inner bolt/lightning icon -->
      <g transform="translate(20, 20)">
        <!-- Lightning bolt path -->
        <path
          d="M 0 -8 L -3 -1 L 2 -1 L -4 8 L 0 2 L -2 2 Z"
          fill="${color}"
          stroke="${color}"
          stroke-width="0.5"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
      </g>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function getBoltMarkerIcon(status: "available" | "busy" | "offline" = "available") {
  const statusColors = {
    available: "#22c55e", // Green
    busy: "#f97316",      // Orange
    offline: "#6b7280",   // Grey
  };

  const color = statusColors[status];

  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 12,
    fillColor: "white",
    fillOpacity: 1,
    strokeColor: color,
    strokeWeight: 2,
  };
}

export default function BoltMarker({ status = "available" }: { status?: "available" | "busy" | "offline" }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      {/* Outer circle background */}
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="white"
        stroke={status === "available" ? "#22c55e" : status === "busy" ? "#f97316" : "#6b7280"}
        strokeWidth="2"
      />

      {/* Inner bolt/lightning icon */}
      <g transform="translate(20, 20)">
        {/* Lightning bolt path */}
        <path
          d="M 0 -8 L -3 -1 L 2 -1 L -4 8 L 0 2 L -2 2 Z"
          fill={status === "available" ? "#22c55e" : status === "busy" ? "#f97316" : "#6b7280"}
          stroke={status === "available" ? "#22c55e" : status === "busy" ? "#f97316" : "#6b7280"}
          strokeWidth="0.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
