import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Mail,
  MessageSquare,
  CheckCircle2,
  XCircle,
  MinusCircle,
  TrendingUp,
  Download,
  Send,
} from "lucide-react";

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

// Converts a yyyy-mm-dd date input into a UTC-based epoch millisecond value.
// endOfDay pushes the timestamp to 23:59:59.999 so the range is inclusive.
function dateInputToEpoch(value: string, endOfDay = false): number | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  if (endOfDay) d.setHours(23, 59, 59, 999);
  else d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export default function NotificationDashboard() {
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const utils = trpc.useUtils();

  const {
    data: metrics,
    isLoading: metricsLoading,
    isError: metricsError,
    refetch: refetchMetrics,
  } = trpc.admin.getNotificationMetrics.useQuery();

  const logsInput = useMemo(
    () => ({
      limit: 200,
      channel: channelFilter === "all" ? undefined : (channelFilter as "email" | "sms"),
      status: statusFilter === "all" ? undefined : (statusFilter as "sent" | "failed" | "skipped"),
      startDate: dateInputToEpoch(startDate),
      endDate: dateInputToEpoch(endDate, true),
    }),
    [channelFilter, statusFilter, startDate, endDate]
  );

  const {
    data: logs,
    isLoading: logsLoading,
    isError: logsError,
    refetch: refetchLogs,
  } = trpc.admin.getNotificationLogs.useQuery(logsInput);

  const testSend = trpc.admin.sendTestNotification.useMutation({
    onSuccess: (res, variables) => {
      setFeedback({
        type: res.success ? "success" : "error",
        text: res.success
          ? `Test ${variables.channel.toUpperCase()} dispatched to ${res.recipient}.`
          : `Test ${variables.channel.toUpperCase()} could not be delivered.`,
      });
      utils.admin.getNotificationLogs.invalidate();
      utils.admin.getNotificationMetrics.invalidate();
    },
    onError: (err) => {
      setFeedback({ type: "error", text: err.message });
    },
  });

  const cardBorder = { border: "1px solid oklch(0.9 0.01 240)" };
  const heading = { fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" };

  const metricCards = [
    { label: "Delivery Rate", value: `${metrics?.deliveryRate ?? 0}%`, icon: TrendingUp, color: "oklch(0.55 0.18 145)" },
    { label: "Total Sent", value: metrics?.totalSent ?? 0, icon: CheckCircle2, color: "oklch(0.55 0.18 145)" },
    { label: "Failed", value: metrics?.totalFailed ?? 0, icon: XCircle, color: "oklch(0.6 0.2 25)" },
    { label: "Skipped (Opt-out)", value: metrics?.totalSkipped ?? 0, icon: MinusCircle, color: "oklch(0.65 0.02 240)" },
  ];

  function exportCsv() {
    if (!logs || logs.length === 0) return;
    const headers = ["Time", "Channel", "Category", "Recipient", "Status", "Detail"];
    const escape = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = logs.map((log) =>
      [
        new Date(log.createdAt).toISOString(),
        log.channel,
        CATEGORY_LABELS[log.category] ?? log.category,
        log.recipient,
        log.status,
        log.skipReason || log.errorMessage || log.subject || "",
      ]
        .map(escape)
        .join(",")
    );
    const csv = [headers.map(escape).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `notification-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

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
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold" style={heading}>
          Notification Delivery
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="bg-white"
            disabled={testSend.isPending}
            onClick={() => {
              setFeedback(null);
              testSend.mutate({ channel: "email" });
            }}
          >
            <Send size={15} className="mr-2" />
            Test Email
          </Button>
          <Button
            variant="outline"
            className="bg-white"
            disabled={testSend.isPending}
            onClick={() => {
              setFeedback(null);
              testSend.mutate({ channel: "sms" });
            }}
          >
            <MessageSquare size={15} className="mr-2" />
            Test SMS
          </Button>
        </div>
      </div>

      {feedback && (
        <div
          className="mb-4 rounded-lg px-4 py-3 text-sm"
          style={{
            background: feedback.type === "success" ? "oklch(0.95 0.05 145)" : "oklch(0.96 0.05 25)",
            color: feedback.type === "success" ? "oklch(0.4 0.15 145)" : "oklch(0.5 0.2 25)",
          }}
        >
          {feedback.text}
        </div>
      )}

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
      <div className="flex flex-wrap items-end gap-4 mb-4">
        <div>
          <label className="mb-1 block text-xs font-medium" style={{ color: "oklch(0.62 0.01 240)" }}>
            Channel
          </label>
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
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium" style={{ color: "oklch(0.62 0.01 240)" }}>
            Status
          </label>
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
        <div>
          <label className="mb-1 block text-xs font-medium" style={{ color: "oklch(0.62 0.01 240)" }}>
            From
          </label>
          <Input
            type="date"
            value={startDate}
            max={endDate || undefined}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-40 bg-white"
            style={{ borderColor: "oklch(0.9 0.01 240)" }}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium" style={{ color: "oklch(0.62 0.01 240)" }}>
            To
          </label>
          <Input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-40 bg-white"
            style={{ borderColor: "oklch(0.9 0.01 240)" }}
          />
        </div>
        {(startDate || endDate) && (
          <Button
            variant="outline"
            className="bg-white"
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
          >
            Clear dates
          </Button>
        )}
        <Button
          variant="outline"
          className="ml-auto bg-white"
          disabled={!logs || logs.length === 0}
          onClick={exportCsv}
        >
          <Download size={15} className="mr-2" />
          Export CSV
        </Button>
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
                    No notifications match the current filters. They will appear here as bookings, payments, and refunds are processed.
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
                        {log.skipReason || log.errorMessage || log.subject || "-"}
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
