import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";

export interface MonthlySpendingData {
  month: string;
  cost: number;
  bookings: number;
}

interface SpendingChartProps {
  data: MonthlySpendingData[];
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="p-3 rounded-lg border"
        style={{
          background: "oklch(0.17 0.012 240)",
          border: "1px solid oklch(0.55 0.18 145 / 0.3)",
        }}
      >
        <p style={{ color: "oklch(0.95 0 0)", fontSize: "0.875rem" }}>
          {payload[0]?.payload?.month}
        </p>
        <p style={{ color: "oklch(0.75 0.18 50)", fontSize: "0.875rem" }}>
          Cost: GHS {payload[0]?.value?.toFixed(2)}
        </p>
        {payload[0]?.payload?.bookings && (
          <p style={{ color: "oklch(0.72 0.18 145)", fontSize: "0.875rem" }}>
            Bookings: {payload[0]?.payload?.bookings}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function SpendingChart({ data, isLoading = false }: SpendingChartProps) {
  if (isLoading) {
    return (
      <div
        className="p-6 rounded-xl border animate-pulse"
        style={{
          background: "oklch(0.17 0.012 240)",
          border: "1px solid oklch(1 0 0 / 8%)",
        }}
      >
        <div className="h-6 w-40 rounded bg-gray-700 mb-4" />
        <div className="h-64 w-full rounded bg-gray-700" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className="p-8 rounded-xl border text-center"
        style={{
          background: "oklch(0.17 0.012 240)",
          border: "1px solid oklch(1 0 0 / 8%)",
        }}
      >
        <p style={{ color: "oklch(0.62 0.01 240)" }}>
          No spending data available for the selected period
        </p>
      </div>
    );
  }

  return (
    <div
      className="p-6 rounded-xl border"
      style={{
        background: "oklch(0.17 0.012 240)",
        border: "1px solid oklch(1 0 0 / 8%)",
      }}
    >
      <h3
        className="text-lg font-semibold mb-6"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0 0)" }}
      >
        Monthly Spending Trend
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="oklch(1 0 0 / 12%)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            stroke="oklch(0.62 0.01 240)"
            style={{ fontSize: "0.875rem" }}
          />
          <YAxis
            stroke="oklch(0.62 0.01 240)"
            style={{ fontSize: "0.875rem" }}
            label={{ value: "Cost (GHS)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            iconType="line"
            formatter={(value) => (
              <span style={{ color: "oklch(0.62 0.01 240)", fontSize: "0.875rem" }}>
                {value}
              </span>
            )}
          />

          {/* Cost Line */}
          <Line
            type="monotone"
            dataKey="cost"
            stroke="oklch(0.75 0.18 50)"
            strokeWidth={3}
            dot={{
              fill: "oklch(0.75 0.18 50)",
              r: 5,
            }}
            activeDot={{
              r: 7,
            }}
            name="Spending (GHS)"
            isAnimationActive={true}
          />

          {/* Bookings Bar */}
          <Bar
            dataKey="bookings"
            fill="oklch(0.55 0.18 145 / 0.4)"
            name="Bookings"
            yAxisId="right"
            radius={[4, 4, 0, 0]}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Chart Footer */}
      <div className="mt-6 pt-6 border-t" style={{ borderColor: "oklch(1 0 0 / 8%)" }}>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p style={{ color: "oklch(0.62 0.01 240)" }}>Total Spending</p>
            <p
              className="text-lg font-semibold mt-1"
              style={{ color: "oklch(0.75 0.18 50)" }}
            >
              GHS {data.reduce((sum, d) => sum + d.cost, 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p style={{ color: "oklch(0.62 0.01 240)" }}>Avg Monthly</p>
            <p
              className="text-lg font-semibold mt-1"
              style={{ color: "oklch(0.72 0.18 145)" }}
            >
              GHS {(data.reduce((sum, d) => sum + d.cost, 0) / data.length).toFixed(2)}
            </p>
          </div>
          <div>
            <p style={{ color: "oklch(0.62 0.01 240)" }}>Total Bookings</p>
            <p
              className="text-lg font-semibold mt-1"
              style={{ color: "oklch(0.72 0.18 145)" }}
            >
              {data.reduce((sum, d) => sum + d.bookings, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
