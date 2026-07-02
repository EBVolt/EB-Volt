/* ============================================================
   Booking Analytics Dashboard Component
   Displays real-time reservation counts, revenue metrics, and station performance
   ============================================================ */
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { TrendingUp, DollarSign, Zap, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function BookingAnalyticsDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [chartData, setChartData] = useState<any[]>([]);
  const [topStations, setTopStations] = useState<any[]>([]);



  // Fetch daily revenue data
  const { data: dailyRevenue, isLoading: revenueLoading } = trpc.admin.getDailyRevenue.useQuery(
    { days: 30 },
    { enabled: isAuthenticated && user?.role === "admin", staleTime: 60000 }
  );

  // Fetch top performing stations
  const { data: performingStations, isLoading: stationsLoading } = trpc.admin.getTopPerformingStations.useQuery(
    { limit: 10 },
    { enabled: isAuthenticated && user?.role === "admin", staleTime: 60000 }
  );

  // Fetch overall revenue metrics
  const { data: metrics, isLoading: metricsLoading } = trpc.admin.getRevenueMetrics.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin", staleTime: 60000 }
  );

  useEffect(() => {
    if (dailyRevenue) {
      setChartData(dailyRevenue);
    }
  }, [dailyRevenue]);

  useEffect(() => {
    if (performingStations) {
      setTopStations(performingStations);
    }
  }, [performingStations]);

  const isLoading = revenueLoading || stationsLoading || metricsLoading;

  const formatRevenue = (value: unknown): string => {
    if (typeof value === "number") return value.toFixed(2);
    return "0.00";
  };

  const getNumericValue = (value: unknown): number => {
    if (typeof value === "number") return value;
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Revenue Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Revenue */}
        <Card className="p-6" style={{ border: "1px solid oklch(0.9 0.01 240)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: "oklch(0.62 0.01 240)", fontSize: "0.875rem" }}>Total Revenue</p>
              <p
                className="text-3xl font-bold mt-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.72 0.18 145)" }}
              >
                GHS {isLoading ? "-" : formatRevenue(metrics?.totalRevenue)}
              </p>
              <p style={{ color: "oklch(0.62 0.01 240)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                All time earnings
              </p>
            </div>
            <DollarSign size={32} style={{ color: "oklch(0.72 0.18 145)", opacity: 0.3 }} />
          </div>
        </Card>

        {/* Today's Revenue */}
        <Card className="p-6" style={{ border: "1px solid oklch(0.9 0.01 240)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: "oklch(0.62 0.01 240)", fontSize: "0.875rem" }}>Today's Revenue</p>
              <p
                className="text-3xl font-bold mt-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.55 0.18 145)" }}
              >
                GHS {isLoading ? "-" : formatRevenue(metrics?.todayRevenue)}
              </p>
              <p style={{ color: "oklch(0.62 0.01 240)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                Current day earnings
              </p>
            </div>
            <TrendingUp size={32} style={{ color: "oklch(0.55 0.18 145)", opacity: 0.3 }} />
          </div>
        </Card>

        {/* Average Revenue */}
        <Card className="p-6" style={{ border: "1px solid oklch(0.9 0.01 240)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: "oklch(0.62 0.01 240)", fontSize: "0.875rem" }}>Average per Booking</p>
              <p
                className="text-3xl font-bold mt-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.7 0.15 40)" }}
              >
                GHS {isLoading ? "-" : formatRevenue(metrics?.avgBookingValue)}
              </p>
              <p style={{ color: "oklch(0.62 0.01 240)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                Per transaction average
              </p>
            </div>
            <Zap size={32} style={{ color: "oklch(0.7 0.15 40)", opacity: 0.3 }} />
          </div>
        </Card>
      </div>

      {/* Daily Revenue Chart */}
      <Card className="p-6" style={{ border: "1px solid oklch(0.9 0.01 240)" }}>
        <h3
          className="text-lg font-bold mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}
        >
          Revenue Trend (Last 30 Days)
        </h3>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center" style={{ color: "oklch(0.62 0.01 240)" }}>
            Loading chart data...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center" style={{ color: "oklch(0.62 0.01 240)" }}>
            No revenue data available
          </div>
        ) : (
          <div className="h-64 flex items-end gap-1">
            {chartData.map((point, idx) => {
              const revenueNum = getNumericValue(point.revenue);
              const maxRevenue = Math.max(...chartData.map((p) => getNumericValue(p.revenue)), 1);
              const height = (revenueNum / maxRevenue) * 100;
              return (
                <div
                  key={idx}
                  className="flex-1 rounded-t-md transition-all hover:opacity-80 group relative"
                  style={{
                    height: `${height}%`,
                    background: "oklch(0.72 0.18 145)",
                    minHeight: "4px",
                  }}
                  title={`${point.date}: GHS ${formatRevenue(revenueNum)}`}
                >
                  <div
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    style={{ background: "oklch(0.25 0.08 240)", color: "oklch(0.97 0 0)" }}
                  >
                    {point.date}: GHS {formatRevenue(revenueNum)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-4 flex justify-between text-xs" style={{ color: "oklch(0.62 0.01 240)" }}>
          <span>{chartData[0]?.date || "N/A"}</span>
          <span>{chartData[chartData.length - 1]?.date || "N/A"}</span>
        </div>
      </Card>

      {/* Top Performing Stations */}
      <Card className="p-6" style={{ border: "1px solid oklch(0.9 0.01 240)" }}>
        <h3
          className="text-lg font-bold mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}
        >
          Top Performing Stations
        </h3>
        {isLoading ? (
          <div style={{ color: "oklch(0.62 0.01 240)" }}>Loading station data...</div>
        ) : topStations.length === 0 ? (
          <div style={{ color: "oklch(0.62 0.01 240)" }}>No station data available</div>
        ) : (
          <div className="space-y-3">
            {topStations.map((station, idx) => {
              const bookingCount = getNumericValue(station.bookingCount);
              const totalRevenue = getNumericValue(station.totalRevenue);
              return (
                <div
                  key={station.stationId}
                  className="p-4 rounded-lg flex items-center justify-between"
                  style={{ background: "oklch(0.98 0 0)", border: "1px solid oklch(0.9 0.01 240)" }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                      style={{ background: "oklch(0.72 0.18 145)", color: "oklch(0.97 0 0)" }}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} style={{ color: "oklch(0.72 0.18 145)" }} />
                        <p className="font-medium" style={{ color: "oklch(0.25 0.08 240)" }}>
                          {station.stationName}
                        </p>
                      </div>
                      <p style={{ color: "oklch(0.62 0.01 240)", fontSize: "0.875rem" }}>
                        {bookingCount} booking{bookingCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className="font-bold"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.72 0.18 145)" }}
                    >
                      GHS {formatRevenue(totalRevenue)}
                    </p>
                    <p style={{ color: "oklch(0.62 0.01 240)", fontSize: "0.875rem" }}>Revenue</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
