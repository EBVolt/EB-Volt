import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { AlertCircle, CheckCircle, Zap, Wifi } from "lucide-react";
import { useEffect, useState } from 'react';
import { toast } from "sonner";
import RefundManagement from "@/components/RefundManagement";
import BookingAnalyticsDashboard from "@/components/BookingAnalyticsDashboard";
import NotificationDashboard from "@/components/NotificationDashboard";
import UssdAdminPanel from "@/components/UssdAdminPanel";

export default function AdminDashboard() {
  useEffect(() => { document.title = "Admin Dashboard - EB Volt"; }, []);
  const { user, isAuthenticated } = useAuth();
  const [selectedStationId, setSelectedStationId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch charger stats
  const { data: stats, isLoading: statsLoading } = trpc.admin.getChargerStats.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  // Fetch all chargers
  const { data: chargers, isLoading: chargersLoading, refetch: refetchChargers } = trpc.admin.getAllChargers.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  // Fetch charger logs
  const { data: logs } = trpc.admin.getChargerLogs.useQuery(
    { stationId: selectedStationId || 0 },
    { enabled: selectedStationId !== null && isAuthenticated && user?.role === "admin" }
  );

  // Update charger status mutation
  const updateStatusMutation = trpc.admin.updateChargerStatus.useMutation({
    onSuccess: () => {
      toast.success("Charger status updated successfully");
      refetchChargers();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update charger status");
    },
  });

  // Check authorization
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.97 0 0)" }}>
        <div className="text-center">
          <AlertCircle size={48} style={{ color: "oklch(0.72 0.18 145)", margin: "0 auto 16px" }} />
          <h1 className="text-2xl font-bold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>
            Access Denied
          </h1>
          <p style={{ color: "oklch(0.62 0.01 240)" }}>
            You must be an admin to access this dashboard.
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (availableSlots: number, totalSlots: number) => {
    if (availableSlots === 0) return "oklch(0.6 0.2 0)"; // Red for offline
    if (availableSlots === totalSlots) return "oklch(0.55 0.18 145)"; // Green for available
    return "oklch(0.7 0.15 40)"; // Orange for busy
  };

  const getStatusLabel = (availableSlots: number, totalSlots: number) => {
    if (availableSlots === 0) return "Offline";
    if (availableSlots === totalSlots) return "Available";
    return "Busy";
  };

  const filteredChargers = chargers?.filter((charger) => {
    if (statusFilter === "all") return true;
    const label = getStatusLabel(charger.availableSlots, charger.totalSlots);
    return label.toLowerCase() === statusFilter.toLowerCase();
  }) || [];

  return (
    <div style={{ background: "oklch(0.97 0 0)", minHeight: "100vh" }}>
      {/* Header */}
      <div
        className="sticky top-16 z-40 border-b"
        style={{
          background: "oklch(0.97 0 0)",
          borderColor: "oklch(0.9 0.01 240)",
        }}
      >
        <div className="container py-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}
          >
            Admin Dashboard
          </h1>
          <p style={{ color: "oklch(0.62 0.01 240)" }}>
            Manage charger availability and monitor station status
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Chargers", value: stats?.total || 0, icon: Zap, color: "oklch(0.72 0.18 145)" },
            { label: "Available", value: stats?.available || 0, icon: CheckCircle, color: "oklch(0.55 0.18 145)" },
            { label: "Busy", value: stats?.busy || 0, icon: Wifi, color: "oklch(0.7 0.15 40)" },
            { label: "Offline", value: stats?.offline || 0, icon: AlertCircle, color: "oklch(0.6 0.2 0)" },
          ].map((stat) => (
            <Card key={stat.label} className="p-6" style={{ border: "1px solid oklch(0.9 0.01 240)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: "oklch(0.62 0.01 240)", fontSize: "0.875rem" }}>{stat.label}</p>
                  <p
                    className="text-3xl font-bold mt-2"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: stat.color }}
                  >
                    {stat.value}
                  </p>
                </div>
                <stat.icon size={32} style={{ color: stat.color, opacity: 0.3 }} />
              </div>
            </Card>
          ))}
        </div>

        {/* Filter and Controls */}
        <div className="mb-6 flex gap-4 items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48" style={{ borderColor: "oklch(0.9 0.01 240)" }}>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Chargers</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="busy">Busy</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
          <span style={{ color: "oklch(0.62 0.01 240)" }}>
            Showing {filteredChargers.length} charger{filteredChargers.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Chargers Table */}
        <Card style={{ border: "1px solid oklch(0.9 0.01 240)" }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid oklch(0.9 0.01 240)", background: "oklch(0.98 0 0)" }}>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "oklch(0.62 0.01 240)" }}>
                    Station Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "oklch(0.62 0.01 240)" }}>
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "oklch(0.62 0.01 240)" }}>
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "oklch(0.62 0.01 240)" }}>
                    Available Slots
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "oklch(0.62 0.01 240)" }}>
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "oklch(0.62 0.01 240)" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {chargersLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center" style={{ color: "oklch(0.62 0.01 240)" }}>
                      Loading chargers...
                    </td>
                  </tr>
                ) : filteredChargers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center" style={{ color: "oklch(0.62 0.01 240)" }}>
                      No chargers found
                    </td>
                  </tr>
                ) : (
                  filteredChargers.map((charger) => {
                    const status = getStatusLabel(charger.availableSlots, charger.totalSlots);
                    const statusColor = getStatusColor(charger.availableSlots, charger.totalSlots);
                    return (
                      <tr
                        key={charger.id}
                        style={{ borderBottom: "1px solid oklch(0.9 0.01 240)" }}
                        className="hover:bg-opacity-50"
                      >
                        <td className="px-6 py-4 font-medium" style={{ color: "oklch(0.25 0.08 240)" }}>
                          {charger.name}
                        </td>
                        <td className="px-6 py-4" style={{ color: "oklch(0.62 0.01 240)" }}>
                          {charger.location}
                        </td>
                        <td className="px-6 py-4" style={{ color: "oklch(0.62 0.01 240)" }}>
                          {charger.chargerType}
                        </td>
                        <td className="px-6 py-4" style={{ color: "oklch(0.62 0.01 240)" }}>
                          {charger.availableSlots}/{charger.totalSlots}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{ background: `${statusColor}20`, color: statusColor }}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Select
                              value={status.toLowerCase()}
                              onValueChange={(newStatus) => {
                                updateStatusMutation.mutate({
                                  stationId: charger.id,
                                  newStatus: newStatus as "available" | "busy" | "offline" | "maintenance",
                                  reason: "Manual status update",
                                });
                              }}
                            >
                              <SelectTrigger className="w-32" style={{ borderColor: "oklch(0.9 0.01 240)" }}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="busy">Busy</SelectItem>
                                <SelectItem value="offline">Offline</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedStationId(charger.id)}
                              style={{
                                borderColor: "oklch(0.72 0.18 145)",
                                color: "oklch(0.72 0.18 145)",
                              }}
                            >
                              View Logs
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Status Logs */}
        {selectedStationId && logs && (
          <Card className="mt-8" style={{ border: "1px solid oklch(0.9 0.01 240)" }}>
            <div className="p-6">
              <h2
                className="text-xl font-bold mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}
              >
                Status Change History
              </h2>
              <div className="space-y-3">
                {logs.length === 0 ? (
                  <p style={{ color: "oklch(0.62 0.01 240)" }}>No status changes recorded</p>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-lg"
                      style={{ background: "oklch(0.98 0 0)", border: "1px solid oklch(0.9 0.01 240)" }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p style={{ color: "oklch(0.62 0.01 240)", fontSize: "0.875rem" }}>
                            {new Date(log.createdAt).toLocaleString()}
                          </p>
                          <p className="mt-1" style={{ color: "oklch(0.25 0.08 240)" }}>
                            <span style={{ color: "oklch(0.6 0.2 0)" }}>{log.previousStatus}</span>
                            {" → "}
                            <span style={{ color: "oklch(0.55 0.18 145)" }}>{log.newStatus}</span>
                          </p>
                          {log.reason && (
                            <p style={{ color: "oklch(0.62 0.01 240)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                              Reason: {log.reason}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Booking Analytics Section */}
        <div className="mt-12">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}
          >
            Booking Analytics
          </h2>
          <BookingAnalyticsDashboard />
        </div>

        {/* Notification Delivery Section */}
        <div className="mt-12">
          <NotificationDashboard />
        </div>

        {/* Refund Management Section */}
        <div className="mt-12">
          <RefundManagement isAdmin={user?.role === "admin"} />
        </div>

        {/* USSD Payment System Section */}
        <div className="mt-12">
          <UssdAdminPanel />
        </div>
      </div>
    </div>
  );
}
