import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface RefundManagementProps {
  isAdmin?: boolean;
}

export default function RefundManagement({ isAdmin = true }: RefundManagementProps) {
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [selectedRefundId, setSelectedRefundId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");

  // Fetch all refunds
  const { data: refunds, isLoading, refetch } = trpc.admin.getAllRefunds.useQuery(
    undefined,
    { enabled: isAdmin }
  );

  // Approve refund mutation
  const approveMutation = trpc.admin.approveRefund.useMutation({
    onSuccess: () => {
      toast.success("Refund approved successfully");
      refetch();
      setSelectedRefundId(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to approve refund");
    },
  });

  // Reject refund mutation
  const rejectMutation = trpc.admin.rejectRefund.useMutation({
    onSuccess: () => {
      toast.success("Refund rejected successfully");
      refetch();
      setSelectedRefundId(null);
      setRejectionReason("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reject refund");
    },
  });

  const filteredRefunds = refunds?.filter((refund) => {
    if (statusFilter === "all") return true;
    return refund.status === statusFilter;
  }) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={20} style={{ color: "oklch(0.7 0.15 40)" }} />;
      case "approved":
        return <CheckCircle size={20} style={{ color: "oklch(0.55 0.18 145)" }} />;
      case "rejected":
        return <XCircle size={20} style={{ color: "oklch(0.6 0.2 0)" }} />;
      default:
        return <AlertCircle size={20} style={{ color: "oklch(0.62 0.01 240)" }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "oklch(0.7 0.15 40)";
      case "approved":
        return "oklch(0.55 0.18 145)";
      case "rejected":
        return "oklch(0.6 0.2 0)";
      default:
        return "oklch(0.62 0.01 240)";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}
        >
          Refund Management
        </h2>
        <p style={{ color: "oklch(0.62 0.01 240)" }}>
          Review and process user refund requests
        </p>
      </div>

      {/* Status Filter */}
      <div className="flex gap-4 items-center">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48" style={{ borderColor: "oklch(0.9 0.01 240)" }}>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Refunds</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <span style={{ color: "oklch(0.62 0.01 240)" }}>
          Showing {filteredRefunds.length} refund{filteredRefunds.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Refunds Table */}
      <Card style={{ border: "1px solid oklch(0.9 0.01 240)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid oklch(0.9 0.01 240)", background: "oklch(0.98 0 0)" }}>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "oklch(0.62 0.01 240)" }}>
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "oklch(0.62 0.01 240)" }}>
                  Reservation ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "oklch(0.62 0.01 240)" }}>
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "oklch(0.62 0.01 240)" }}>
                  Reason
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "oklch(0.62 0.01 240)" }}>
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "oklch(0.62 0.01 240)" }}>
                  Requested
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "oklch(0.62 0.01 240)" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center" style={{ color: "oklch(0.62 0.01 240)" }}>
                    Loading refunds...
                  </td>
                </tr>
              ) : filteredRefunds.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center" style={{ color: "oklch(0.62 0.01 240)" }}>
                    No refunds found
                  </td>
                </tr>
              ) : (
                filteredRefunds.map((refund) => (
                  <tr
                    key={refund.id}
                    style={{ borderBottom: "1px solid oklch(0.9 0.01 240)" }}
                    className="hover:bg-opacity-50"
                  >
                    <td className="px-6 py-4" style={{ color: "oklch(0.25 0.08 240)" }}>
                      <div className="font-medium">User #{refund.userId}</div>
                      <div style={{ color: "oklch(0.62 0.01 240)", fontSize: "0.875rem" }}>
                        ID: {refund.userId}
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ color: "oklch(0.62 0.01 240)" }}>
                      #{refund.reservationId}
                    </td>
                    <td className="px-6 py-4 font-semibold" style={{ color: "oklch(0.72 0.18 145)" }}>
                      ₵{refund.refundAmount}
                    </td>
                    <td className="px-6 py-4" style={{ color: "oklch(0.62 0.01 240)" }}>
                      <div className="max-w-xs truncate">{refund.reason || "No reason provided"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(refund.status)}
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            background: `${getStatusColor(refund.status)}20`,
                            color: getStatusColor(refund.status),
                          }}
                        >
                          {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ color: "oklch(0.62 0.01 240)", fontSize: "0.875rem" }}>
                      {new Date(refund.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {refund.status === "pending" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => approveMutation.mutate({ refundId: refund.id, origin: window.location.origin })}
                            disabled={approveMutation.isPending}
                            style={{
                              background: "oklch(0.55 0.18 145)",
                              color: "white",
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedRefundId(refund.id)}
                            style={{
                              borderColor: "oklch(0.6 0.2 0)",
                              color: "oklch(0.6 0.2 0)",
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span style={{ color: "oklch(0.62 0.01 240)", fontSize: "0.875rem" }}>
                          {refund.status === "approved" ? "✓ Processed" : "✗ Rejected"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Rejection Modal */}
      {selectedRefundId && (
        <Card
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
        >
          <Card
            className="w-full max-w-md p-6"
            style={{
              background: "oklch(0.97 0 0)",
              border: "1px solid oklch(0.9 0.01 240)",
            }}
          >
            <h3
              className="text-lg font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}
            >
              Reject Refund
            </h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 border rounded-lg mb-4"
              style={{
                borderColor: "oklch(0.9 0.01 240)",
                color: "oklch(0.25 0.08 240)",
              }}
              rows={4}
            />
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  if (!rejectionReason.trim()) {
                    toast.error("Please provide a rejection reason");
                    return;
                  }
                  rejectMutation.mutate({
                    refundId: selectedRefundId,
                    rejectionReason,
                    origin: window.location.origin,
                  });
                }}
                disabled={rejectMutation.isPending}
                style={{
                  background: "oklch(0.6 0.2 0)",
                  color: "white",
                }}
              >
                Confirm Rejection
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedRefundId(null);
                  setRejectionReason("");
                }}
                style={{
                  borderColor: "oklch(0.9 0.01 240)",
                  color: "oklch(0.62 0.01 240)",
                }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </Card>
      )}
    </div>
  );
}
