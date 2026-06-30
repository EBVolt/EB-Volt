/**
 * EB Volt Branded Charger Illustration Component
 * Displays chargers with the EB Volt logo and branding
 */

interface ChargerIllustrationProps {
  type?: "dc-fast" | "ac-level2" | "home";
  size?: "small" | "medium" | "large";
  animated?: boolean;
}

export function ChargerIllustration({
  type = "dc-fast",
  size = "medium",
  animated = false,
}: ChargerIllustrationProps) {
  const sizeMap = {
    small: { width: 120, height: 120 },
    medium: { width: 200, height: 200 },
    large: { width: 300, height: 300 },
  };

  const dimensions = sizeMap[size];

  return (
    <svg
      width={dimensions.width}
      height={dimensions.height}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={animated ? "animate-pulse" : ""}
    >
      {/* Background circle */}
      <circle cx="100" cy="100" r="95" fill="oklch(0.52 0.18 145 / 0.1)" stroke="oklch(0.52 0.18 145)" strokeWidth="2" />

      {/* Charger post */}
      <rect x="80" y="40" width="40" height="80" rx="8" fill="oklch(0.25 0.08 240)" />

      {/* Charger head */}
      <rect x="75" y="35" width="50" height="25" rx="6" fill="oklch(0.52 0.18 145)" />

      {/* Charging port */}
      <circle cx="100" cy="50" r="6" fill="oklch(0.98 0.01 240)" />

      {/* Cable connector */}
      <path d="M 100 56 Q 90 70 85 85" stroke="oklch(0.52 0.18 145)" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* EB Volt Logo - Leaf with lightning */}
      <g transform="translate(100, 120)">
        {/* Leaf shape */}
        <path
          d="M -8 -5 Q -12 0 -10 8 Q -5 12 0 12 Q 5 12 10 8 Q 12 0 8 -5 Q 0 -8 -8 -5"
          fill="oklch(0.52 0.18 145)"
        />
        {/* Lightning bolt inside leaf */}
        <path d="M -2 -2 L 0 2 L -1 2 L 2 6 L -2 0 L 0 0 L -2 -2" fill="oklch(0.98 0.01 240)" />
      </g>

      {/* Charging indicator lights */}
      {type === "dc-fast" && (
        <>
          <circle cx="85" cy="75" r="3" fill="oklch(0.22 0.18 145)" opacity="0.6" />
          <circle cx="115" cy="75" r="3" fill="oklch(0.22 0.18 145)" opacity="0.6" />
          <circle cx="85" cy="90" r="3" fill="oklch(0.22 0.18 145)" opacity="0.8" />
          <circle cx="115" cy="90" r="3" fill="oklch(0.22 0.18 145)" opacity="0.8" />
        </>
      )}

      {type === "ac-level2" && (
        <>
          <circle cx="90" cy="80" r="2.5" fill="oklch(0.22 0.18 145)" opacity="0.6" />
          <circle cx="110" cy="80" r="2.5" fill="oklch(0.22 0.18 145)" opacity="0.6" />
        </>
      )}

      {/* Type label */}
      <text
        x="100"
        y="165"
        textAnchor="middle"
        fontSize="10"
        fontWeight="600"
        fill="oklch(0.25 0.08 240)"
        fontFamily="'Space Grotesk', sans-serif"
      >
        {type === "dc-fast" ? "DC FAST" : type === "ac-level2" ? "AC LEVEL 2" : "HOME"}
      </text>
    </svg>
  );
}

/**
 * Station Card with Charger Illustration
 */
interface StationCardWithChargerProps {
  name: string;
  location: string;
  chargerType: "dc-fast" | "ac-level2";
  available: number;
  total: number;
  power: number;
  onClick?: () => void;
}

export function StationCardWithCharger({
  name,
  location,
  chargerType,
  available,
  total,
  power,
  onClick,
}: StationCardWithChargerProps) {
  return (
    <div
      className="p-6 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg"
      style={{
        background: "oklch(0.96 0.01 240)",
        border: "1px solid oklch(0.88 0.02 240)",
      }}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Charger illustration */}
        <div className="flex-shrink-0">
          <ChargerIllustration type={chargerType} size="small" />
        </div>

        {/* Station info */}
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1" style={{ color: "oklch(0.25 0.08 240)", fontFamily: "'Space Grotesk', sans-serif" }}>
            {name}
          </h3>
          <p className="text-sm mb-3" style={{ color: "oklch(0.45 0.05 240)" }}>
            {location}
          </p>

          <div className="flex items-center gap-4 text-sm">
            <div>
              <p style={{ color: "oklch(0.45 0.05 240)" }}>Available</p>
              <p className="font-bold" style={{ color: "oklch(0.52 0.18 145)" }}>
                {available}/{total}
              </p>
            </div>
            <div>
              <p style={{ color: "oklch(0.45 0.05 240)" }}>Power</p>
              <p className="font-bold" style={{ color: "oklch(0.52 0.18 145)" }}>
                {power}kW
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
