import { Zap, TrendingUp, Gauge } from "lucide-react";

interface ReservationStatsProps {
  totalBookings: number;
  averageCost: number;
  totalKwh: number;
  isLoading?: boolean;
}

export default function ReservationStats({
  totalBookings,
  averageCost,
  totalKwh,
  isLoading = false,
}: ReservationStatsProps) {
  const stats = [
    {
      label: "Total Bookings",
      value: totalBookings,
      unit: "",
      icon: TrendingUp,
      color: "oklch(0.72 0.18 145)",
      bgColor: "oklch(0.55 0.18 145 / 0.1)",
    },
    {
      label: "Average Cost",
      value: averageCost.toFixed(2),
      unit: "GHS",
      icon: Zap,
      color: "oklch(0.75 0.18 50)",
      bgColor: "oklch(0.65 0.18 50 / 0.1)",
    },
    {
      label: "Total kWh Charged",
      value: totalKwh.toFixed(1),
      unit: "kWh",
      icon: Gauge,
      color: "oklch(0.72 0.18 145)",
      bgColor: "oklch(0.55 0.18 145 / 0.1)",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-6 rounded-xl border animate-pulse"
            style={{
              background: "oklch(0.17 0.012 240)",
              border: "1px solid oklch(1 0 0 / 8%)",
            }}
          >
            <div className="h-4 w-24 rounded bg-gray-700 mb-3" />
            <div className="h-8 w-32 rounded bg-gray-700" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="p-6 rounded-xl border transition-all hover:border-opacity-50"
            style={{
              background: stat.bgColor,
              border: `1px solid ${stat.color}33`,
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: "oklch(0.62 0.01 240)" }}
                >
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <p
                    className="text-3xl font-bold"
                    style={{ color: stat.color, fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {stat.value}
                  </p>
                  {stat.unit && (
                    <p className="text-sm" style={{ color: "oklch(0.62 0.01 240)" }}>
                      {stat.unit}
                    </p>
                  )}
                </div>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ background: `${stat.color}20` }}
              >
                <Icon size={24} style={{ color: stat.color }} />
              </div>
            </div>

            {/* Subtle trend indicator */}
            <div
              className="text-xs py-2 px-3 rounded-lg inline-block"
              style={{
                background: `${stat.color}15`,
                color: stat.color,
              }}
            >
              {idx === 0 && totalBookings > 0 && `${totalBookings} sessions`}
              {idx === 1 && averageCost > 0 && "Per session average"}
              {idx === 2 && totalKwh > 0 && "Energy consumed"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
