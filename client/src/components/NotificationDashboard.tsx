import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MessageSquare, CheckCircle2, XCircle, MinusCircle, TrendingUp } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  booking_confirmation: "Booking",
  payment_receipt: "Payment",
  refund_status: "Refund",
  promotions: "Promo",
};

const STATUS_STYLE: Record<string, { color: string; label: string }> = {
  sent: { color: "oklch(0.55 0.18 145)", label: "Sent" },
  failed: { color: "oklch(0.6 0.2 25)", label: "Failed" },
  skipped: { color: "oklch(0.65 0.02 240)", label: "Skipped" },
};

export default function NotificationDashboard() {
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const {
    data: metrics,
    isLoading: metricsLoading,
    isError: metricsError,
    refetch: refetchMetrics,
  } = trpc.admin.getNotificationMetrics.useQuery();

  const {
    data: logs,
    isLoading: logsLoading,
    isError: logsError,
    refetch: refetchLogs,
  } = trpc.admin.getNotificationLogs.useQuery({
    limit: 100,
    channel: channelFilter === "all" ? undefined : (channelFilter as "email" | "sms"),
    status: statusFilter === "all" ? undefined : (statusFilter as "sent" | "failed" | "skipped"),
  });

  const cardBorder = { border: "1px solid oklch(0.9 0.01 240)" };
  const heading = { fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" };

  const metricCards = [
    { label: "Delivery Rate", value: `${metrics?.deliveryRate ?? 0}%`, icon: TrendingUp, color: "oklch(0.55 0.18 145)" },
    { label: "Total Sent", value: metrics?.totalSent ?? 0, icon: CheckCircle2, color: "oklch(0.55 0.18 145)" },
    { label: "Failed", value: metrics?.totalFailed ?? 0, icon: XCircle, color: "oklch(0.6 0.2 25)" },
    { label: "Skipped (Opt-out)", value: metrics?.totalSkipped ?? 0, icon: MinusCircle, color: "oklch(0.65 0.02 240)" },
  ];

  if (metricsError || logsError) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6" style={heading}>
          Notification Delivery
        </h2>
        <Card className="p-8 flex flex-col items-center text-center gap-3" style={cardBorder}>
          <XCircle size={40} style={{ color: "oklch(0.6 0.2 25)" }} />
          <p className="font-semibold" style={heading}>
            Could not load notification data
          </p>
          <p className="text-sm" style={{ color: "oklch(0.62 0.01 240)" }}>
            There was a problem fetching delivery metrics or logs. Please try again.
          </p>
          <button
            onClick={() => {
              refetchMetrics();
              refetchLogs();
            }}
            className="mt-2 rounded-lg px-4 py-2 text-sm font-semibold text-white"
            style={{ background: "oklch(0.5 0.15 145)" }}
          >
            Retry
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={heading}>
        Notification Delivery
      </h2>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {metricCards.map((m) => (
          <Card key={m.label} className="p-6" style={cardBorder}>
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: "oklch(0.62 0.01 240)", fontSize: "0.875rem" }}>{m.label}</p>
                <p className="text-3xl font-bold mt-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: m.color }}>
                  {metricsLoading ? "…" : m.value}
                </p>
              </div>
              <m.icon size={32} style={{ color: m.color, opacity: 0.3 }} />
            </div>
          </Card>
        ))}
      </div>

      {/* Channel breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="p-6 flex items-center gap-4" style={cardBorder}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "oklch(0.95 0.03 240)" }}>
            <Mail size={22} style={{ color: "oklch(0.5 0.12 240)" }} />
          </div>
          <div>
            <p style={{ color: "oklch(0.62 0.01 240)", fontSize: "0.875rem" }}>Emails Delivered</p>
            <p className="text-2xl font-bold" style={heading}>{metricsLoading ? "…" : metrics?.emailSent ?? 0}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4" style={cardBorder}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "oklch(0.95 0.03 145)" }}>
            <MessageSquare size={22} style={{ color: "oklch(0.5 0.15 145)" }} />
          </div>
          <div>
            <p style={{ color: "oklch(0.62 0.01 240)", fontSize: "0.875rem" }}>SMS Delivered</p>
            <p className="text-2xl font-bold" style={heading}>{metricsLoading ? "…" : metrics?.smsSent ?? 0}</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <Select value={channelFilter} onValueChange={setChannelFilter}>
          <SelectTrigger className="w-40" style={{ borderColor: "oklch(0.9 0.01 240)" }}>
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40" style={{ borderColor: "oklch(0.9 0.01 240)" }}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="skipped">Skipped</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs table */}
      <Card style={cardBorder}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid oklch(0.9 0.01 240)", background: "oklch(0.98 0 0)" }}>
                {["Time", "Channel", "Category", "Recipient", "Status", "Detail"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-sm font-semibold" style={{ color: "oklch(0.62 0.01 240)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logsLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center" style={{ color: "oklch(0.62 0.01 240)" }}>
                    Loading notification logs…
                  </td>
                </tr>
              ) : !logs || logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center" style={{ color: "oklch(0.62 0.01 240)" }}>
                    No notifications logged yet. They will appear here as bookings, payments, and refunds are processed.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const st = STATUS_STYLE[log.status] ?? STATUS_STYLE.skipped;
                  return (
                    <tr key={log.id} style={{ borderBottom: "1px solid oklch(0.94 0.01 240)" }}>
                      <td className="px-4 py-3 text-sm" style={{ color: "oklch(0.62 0.01 240)" }}>
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm capitalize" style={{ color: "oklch(0.3 0.05 240)" }}>
                        {log.channel}
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: "oklch(0.3 0.05 240)" }}>
                        {CATEGORY_LABELS[log.category] ?? log.category}
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: "oklch(0.45 0.05 240)" }}>
                        {log.recipient}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: `${st.color}20`, color: st.color }}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "oklch(0.62 0.01 240)" }}>
                        {log.skipReason || log.errorMessage || log.subject || "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
