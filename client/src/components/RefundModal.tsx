import { useState } from "react";
import { X, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface RefundModalProps {
  isOpen: boolean;
  reservationId: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RefundModal({ isOpen, reservationId, onClose, onSuccess }: RefundModalProps) {
  const [reason, setReason] = useState("");
  const [step, setStep] = useState<"form" | "success">("form");
  const requestRefundMutation = trpc.refund.requestRefund.useMutation();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reason.trim() || reason.length < 10) {
      toast.error("Please provide a reason (at least 10 characters)");
      return;
    }

    try {
      const result = await requestRefundMutation.mutateAsync({
        reservationId,
        reason,
      });

      toast.success(result.message);
      setStep("success");
      setTimeout(() => {
        onSuccess?.();
        onClose();
        setStep("form");
        setReason("");
      }, 2000);
    } catch (error) {
      toast.error("Failed to request refund");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "oklch(0 0 0 / 0.7)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{
          background: "oklch(0.17 0.012 240)",
          border: "1px solid oklch(1 0 0 / 10%)",
          boxShadow: "0 24px 64px oklch(0 0 0 / 0.5)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}>
            {step === "form" ? "Request Refund" : "Refund Requested"}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: "oklch(0.62 0.01 240)" }}>
            <X size={20} />
          </button>
        </div>

        {step === "form" ? (
          <div className="space-y-4">
            {/* Warning */}
            <div
              className="p-3 rounded-lg flex gap-3"
              style={{ background: "oklch(0.65 0.18 50 / 0.1)", border: "1px solid oklch(0.65 0.18 50 / 0.3)" }}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "oklch(0.75 0.18 50)" }} />
              <p className="text-sm" style={{ color: "oklch(0.75 0.18 50)" }}>
                Approved refunds are processed to your MTN MoMo account, usually within a few business days.
              </p>
            </div>

            {/* Reason Input */}
            <div>
              <label className="text-sm font-medium block mb-2" style={{ color: "oklch(0.72 0.18 145)", fontFamily: "'Space Grotesk', sans-serif" }}>
                Reason for Refund
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please explain why you want to cancel this booking..."
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                rows={4}
                style={{
                  background: "oklch(0.12 0.015 240)",
                  border: "1px solid oklch(1 0 0 / 12%)",
                  color: "oklch(0.95 0 0)",
                }}
              />
              <p className="text-xs mt-1" style={{ color: "oklch(0.62 0.01 240)" }}>
                {reason.length}/10 characters minimum
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all"
                style={{
                  background: "oklch(0.12 0.015 240)",
                  color: "oklch(0.62 0.01 240)",
                  border: "1px solid oklch(1 0 0 / 12%)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={requestRefundMutation.isPending || reason.length < 10}
                className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                style={{
                  background: requestRefundMutation.isPending || reason.length < 10 ? "oklch(0.55 0.18 145 / 0.5)" : "oklch(0.55 0.18 145 / 1)",
                  color: "oklch(0.97 0 0)",
                  opacity: requestRefundMutation.isPending || reason.length < 10 ? 0.6 : 1,
                }}
              >
                {requestRefundMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Request Refund"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <CheckCircle2 size={48} style={{ color: "oklch(0.72 0.18 145)", margin: "0 auto 16px" }} />
            <h4 className="text-lg font-semibold mb-2" style={{ color: "oklch(0.95 0 0)" }}>
              Refund Request Submitted
            </h4>
            <p style={{ color: "oklch(0.62 0.01 240)" }}>
              Once approved, your refund will be processed to your MoMo account, usually within a few business days.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
