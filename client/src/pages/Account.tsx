/* ============================================================
   EcoBelle Volt — Account Dashboard Page
   Features: Reservation history, receipts, refund management
   ============================================================ */
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Download, 
  FileText, 
  Clock, 
  MapPin, 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  RefreshCw,
  ChevronDown,
  Zap
} from "lucide-react";
import { toast } from "sonner";

type Tab = "reservations" | "receipts" | "refunds";

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, { bg: string; color: string; border: string; label: string }> = {
    pending: { bg: "oklch(0.65 0.18 50 / 0.15)", color: "oklch(0.75 0.18 50)", border: "oklch(0.65 0.18 50 / 0.3)", label: "Pending" },
    confirmed: { bg: "oklch(0.55 0.18 145 / 0.15)", color: "oklch(0.72 0.18 145)", border: "oklch(0.55 0.18 145 / 0.3)", label: "Confirmed" },
    active: { bg: "oklch(0.55 0.18 145 / 0.15)", color: "oklch(0.72 0.18 145)", border: "oklch(0.55 0.18 145 / 0.3)", label: "Active" },
    completed: { bg: "oklch(0.55 0.18 145 / 0.15)", color: "oklch(0.72 0.18 145)", border: "oklch(0.55 0.18 145 / 0.3)", label: "Completed" },
    cancelled: { bg: "oklch(0.5 0 0 / 0.15)", color: "oklch(0.65 0 0)", border: "oklch(0.5 0 0 / 0.3)", label: "Cancelled" },
    processing: { bg: "oklch(0.65 0.18 50 / 0.15)", color: "oklch(0.75 0.18 50)", border: "oklch(0.65 0.18 50 / 0.3)", label: "Processing" },
    completed_payment: { bg: "oklch(0.55 0.18 145 / 0.15)", color: "oklch(0.72 0.18 145)", border: "oklch(0.55 0.18 145 / 0.3)", label: "Completed" },
    failed: { bg: "oklch(0.5 0 0 / 0.15)", color: "oklch(0.65 0 0)", border: "oklch(0.5 0 0 / 0.3)", label: "Failed" },
    approved: { bg: "oklch(0.55 0.18 145 / 0.15)", color: "oklch(0.72 0.18 145)", border: "oklch(0.55 0.18 145 / 0.3)", label: "Approved" },
    rejected: { bg: "oklch(0.5 0 0 / 0.15)", color: "oklch(0.65 0 0)", border: "oklch(0.5 0 0 / 0.3)", label: "Rejected" },
    processed: { bg: "oklch(0.55 0.18 145 / 0.15)", color: "oklch(0.72 0.18 145)", border: "oklch(0.55 0.18 145 / 0.3)", label: "Processed" },
  };
  const s = styles[status] || styles.pending;
  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {s.label}
    </span>
  );
};

export default function Account() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("reservations");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Fetch data
  const reservationsQuery = trpc.account.getReservationHistory.useQuery();
  const receiptsQuery = trpc.account.getReceiptHistory.useQuery();
  const refundsQuery = trpc.refund.getUserRefunds.useQuery();
  const downloadReceiptMutation = trpc.account.downloadReceipt.useMutation();

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "oklch(0.12 0.015 240)" }}>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-4" style={{ borderColor: "oklch(0.55 0.18 145)" }} />
            <p className="text-sm" style={{ color: "oklch(0.62 0.01 240)" }}>Loading your account...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen" style={{ background: "oklch(0.12 0.015 240)" }}>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p style={{ color: "oklch(0.62 0.01 240)" }}>Please log in to view your account</p>
        </div>
      </div>
    );
  }

  const handleDownloadReceipt = async (receiptId: number) => {
    try {
      const result = await downloadReceiptMutation.mutateAsync({ receiptId });
      if (result.url) {
        window.open(result.url, "_blank");
        toast.success("Receipt downloaded successfully");
      }
    } catch (error) {
      toast.error("Failed to download receipt");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.12 0.015 240)" }}>
      <Navbar />

      <div style={{ paddingTop: "5rem" }} className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}>
              My Account
            </h1>
            <p style={{ color: "oklch(0.62 0.01 240)" }}>
              Welcome back, {user.name || user.email}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {(["reservations", "receipts", "refunds"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 rounded-lg font-medium capitalize transition-all"
                style={{
                  background: activeTab === tab ? "oklch(0.55 0.18 145 / 0.2)" : "oklch(0.17 0.012 240)",
                  color: activeTab === tab ? "oklch(0.72 0.18 145)" : "oklch(0.62 0.01 240)",
                  border: `1px solid ${activeTab === tab ? "oklch(0.55 0.18 145 / 0.4)" : "oklch(1 0 0 / 8%)"}`,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {tab === "reservations" && <Clock className="inline mr-2 w-4 h-4" />}
                {tab === "receipts" && <FileText className="inline mr-2 w-4 h-4" />}
                {tab === "refunds" && <RefreshCw className="inline mr-2 w-4 h-4" />}
                {tab}
              </button>
            ))}
          </div>

          {/* Reservations Tab */}
          {activeTab === "reservations" && (
            <div className="space-y-4">
              {reservationsQuery.isLoading ? (
                <p style={{ color: "oklch(0.62 0.01 240)" }}>Loading reservations...</p>
              ) : reservationsQuery.data && reservationsQuery.data.length > 0 ? (
                reservationsQuery.data.map((reservation: any) => (
                  <div
                    key={reservation.id}
                    className="p-4 rounded-xl border transition-all cursor-pointer"
                    style={{
                      background: "oklch(0.17 0.012 240)",
                      border: `1px solid ${expandedId === reservation.id ? "oklch(0.55 0.18 145 / 0.4)" : "oklch(1 0 0 / 8%)"}`,
                    }}
                    onClick={() => setExpandedId(expandedId === reservation.id ? null : reservation.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Zap className="w-5 h-5" style={{ color: "oklch(0.72 0.18 145)" }} />
                          <h3 className="font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0 0)" }}>
                            Reservation #{reservation.id}
                          </h3>
                          <StatusBadge status={reservation.status} />
                        </div>
                        <div className="flex items-center gap-2 text-sm" style={{ color: "oklch(0.62 0.01 240)" }}>
                          <MapPin className="w-4 h-4" />
                          Station {reservation.stationId}
                        </div>
                      </div>
                      <ChevronDown
                        className="w-5 h-5 transition-transform"
                        style={{
                          color: "oklch(0.62 0.01 240)",
                          transform: expandedId === reservation.id ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      />
                    </div>

                    {expandedId === reservation.id && (
                      <div className="mt-4 pt-4 border-t" style={{ borderColor: "oklch(1 0 0 / 8%)" }}>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p style={{ color: "oklch(0.62 0.01 240)" }}>Date</p>
                            <p style={{ color: "oklch(0.95 0 0)" }}>
                              {new Date(reservation.reservationDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p style={{ color: "oklch(0.62 0.01 240)" }}>Duration</p>
                            <p style={{ color: "oklch(0.95 0 0)" }}>{reservation.durationMinutes} minutes</p>
                          </div>
                          <div>
                            <p style={{ color: "oklch(0.62 0.01 240)" }}>Estimated Cost</p>
                            <p style={{ color: "oklch(0.72 0.18 145)" }}>GHS {reservation.estimatedCost}</p>
                          </div>
                          <div>
                            <p style={{ color: "oklch(0.62 0.01 240)" }}>Phone</p>
                            <p style={{ color: "oklch(0.95 0 0)" }}>{reservation.phoneNumber}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Clock size={32} style={{ color: "oklch(0.35 0.01 240)", margin: "0 auto 12px" }} />
                  <p style={{ color: "oklch(0.55 0.01 240)" }}>No reservations yet</p>
                </div>
              )}
            </div>
          )}

          {/* Receipts Tab */}
          {activeTab === "receipts" && (
            <div className="space-y-4">
              {receiptsQuery.isLoading ? (
                <p style={{ color: "oklch(0.62 0.01 240)" }}>Loading receipts...</p>
              ) : receiptsQuery.data && receiptsQuery.data.length > 0 ? (
                receiptsQuery.data.map((receipt: any) => (
                  <div
                    key={receipt.id}
                    className="p-4 rounded-xl border"
                    style={{
                      background: "oklch(0.17 0.012 240)",
                      border: "1px solid oklch(1 0 0 / 8%)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5" style={{ color: "oklch(0.72 0.18 145)" }} />
                        <div>
                          <h3 className="font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0 0)" }}>
                            Receipt {receipt.receiptNumber}
                          </h3>
                          <p className="text-sm" style={{ color: "oklch(0.62 0.01 240)" }}>
                            {new Date(receipt.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold" style={{ color: "oklch(0.72 0.18 145)" }}>
                          GHS {receipt.amount}
                        </p>
                        <button
                          onClick={() => handleDownloadReceipt(receipt.id)}
                          className="mt-2 px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1"
                          style={{
                            background: "oklch(0.55 0.18 145 / 0.15)",
                            color: "oklch(0.72 0.18 145)",
                            border: "1px solid oklch(0.55 0.18 145 / 0.25)",
                          }}
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <FileText size={32} style={{ color: "oklch(0.35 0.01 240)", margin: "0 auto 12px" }} />
                  <p style={{ color: "oklch(0.55 0.01 240)" }}>No receipts yet</p>
                </div>
              )}
            </div>
          )}

          {/* Refunds Tab */}
          {activeTab === "refunds" && (
            <div className="space-y-4">
              {refundsQuery.isLoading ? (
                <p style={{ color: "oklch(0.62 0.01 240)" }}>Loading refunds...</p>
              ) : refundsQuery.data && refundsQuery.data.length > 0 ? (
                refundsQuery.data.map((refund: any) => (
                  <div
                    key={refund.id}
                    className="p-4 rounded-xl border"
                    style={{
                      background: "oklch(0.17 0.012 240)",
                      border: "1px solid oklch(1 0 0 / 8%)",
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {refund.status === "approved" && <CheckCircle2 className="w-5 h-5" style={{ color: "oklch(0.72 0.18 145)" }} />}
                          {refund.status === "rejected" && <XCircle className="w-5 h-5" style={{ color: "oklch(0.65 0 0)" }} />}
                          {refund.status === "pending" && <AlertCircle className="w-5 h-5" style={{ color: "oklch(0.75 0.18 50)" }} />}
                          <h3 className="font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0 0)" }}>
                            Refund Request #{refund.id}
                          </h3>
                          <StatusBadge status={refund.status} />
                        </div>
                        <p className="text-sm mb-2" style={{ color: "oklch(0.62 0.01 240)" }}>
                          {refund.reason}
                        </p>
                        <p className="text-sm" style={{ color: "oklch(0.72 0.18 145)" }}>
                          <DollarSign className="inline w-4 h-4 mr-1" />
                          GHS {refund.refundAmount}
                        </p>
                      </div>
                      <div className="text-right text-sm" style={{ color: "oklch(0.62 0.01 240)" }}>
                        <p>{new Date(refund.createdAt).toLocaleDateString()}</p>
                        {refund.refundedAt && (
                          <p style={{ color: "oklch(0.72 0.18 145)" }}>
                            Refunded: {new Date(refund.refundedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <RefreshCw size={32} style={{ color: "oklch(0.35 0.01 240)", margin: "0 auto 12px" }} />
                  <p style={{ color: "oklch(0.55 0.01 240)" }}>No refund requests</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
