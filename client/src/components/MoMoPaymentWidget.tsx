import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2, Phone, WifiOff, CloudUpload } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useOfflineQueue } from "@/hooks/useOfflineQueue";

interface MoMoPaymentWidgetProps {
  reservationId: number;
  amount: string;
  estimatedCost: string;
  stationId?: number;
  stationName?: string;
  onPaymentSuccess?: (transactionId: string) => void;
  onPaymentFailed?: (error: string) => void;
  onPaymentQueued?: (clientRef: string) => void;
}

export function MoMoPaymentWidget({
  reservationId,
  amount,
  estimatedCost,
  stationId,
  stationName,
  onPaymentSuccess,
  onPaymentFailed,
  onPaymentQueued,
}: MoMoPaymentWidgetProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending" | "completed" | "failed" | "queued">("idle");
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);

  const { isOnline, addToQueue } = useOfflineQueue();

  const initiatePaymentMutation = trpc.payment.initiatePayment.useMutation();
  const checkStatusQuery = trpc.payment.checkPaymentStatus.useQuery(
    { referenceId: referenceId || "", origin: window.location.origin },
    {
      enabled: paymentStatus === "pending" && !!referenceId,
      refetchInterval: 3000, // Poll every 3 seconds
    }
  );

  const handleInitiatePayment = async () => {
    if (!phoneNumber.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    setIsProcessing(true);

    // If offline, queue the transaction locally
    if (!isOnline) {
      try {
        const clientRef = await addToQueue({
          stationId,
          stationName,
          amount,
          phoneNumber,
        });
        setPaymentStatus("queued");
        toast.success("Payment queued! It will be processed when you reconnect.");
        onPaymentQueued?.(clientRef);
      } catch (err) {
        toast.error("Failed to queue payment locally");
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // Online: proceed with normal MoMo payment flow
    setPaymentStatus("pending");

    try {
      const result = await initiatePaymentMutation.mutateAsync({
        reservationId,
        amount,
        phoneNumber,
        description: `Charging Reservation - GHS ${estimatedCost}`,
      });

      setReferenceId(result.referenceId);
      toast.success("Payment request sent! Check your phone for the MoMo prompt.");
      setPollCount(0);
    } catch (error) {
      // If the request failed due to network, queue it
      if (!navigator.onLine) {
        try {
          const clientRef = await addToQueue({
            stationId,
            stationName,
            amount,
            phoneNumber,
          });
          setPaymentStatus("queued");
          toast.success("Connection lost. Payment queued for later sync.");
          onPaymentQueued?.(clientRef);
        } catch {
          setPaymentStatus("failed");
          toast.error("Failed to queue payment");
        }
      } else {
        setPaymentStatus("failed");
        const errorMessage = error instanceof Error ? error.message : "Failed to initiate payment";
        toast.error(errorMessage);
        onPaymentFailed?.(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle payment status updates
  if (checkStatusQuery.data && paymentStatus === "pending") {
    if (checkStatusQuery.data.status === "COMPLETED") {
      setPaymentStatus("completed");
      toast.success("Payment completed successfully!");
      onPaymentSuccess?.(referenceId || "");
    } else if (checkStatusQuery.data.status === "FAILED") {
      setPaymentStatus("failed");
      toast.error("Payment failed. Please try again.");
      onPaymentFailed?.("Payment was declined");
    }

    // Stop polling after 60 seconds
    setPollCount(prev => {
      if (prev > 20) {
        setPaymentStatus("failed");
        toast.error("Payment request timed out. Please try again.");
        return 0;
      }
      return prev + 1;
    });
  }

  return (
    <Card className="w-full border-green-500/30 bg-gradient-to-br from-slate-900 to-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-green-500" />
          <div>
            <CardTitle className="text-lg text-white">MTN Mobile Money Payment</CardTitle>
            <CardDescription className="text-slate-400">
              {isOnline ? "Fast and secure payment via MoMo" : "Offline mode - payment will be queued"}
            </CardDescription>
          </div>
          {!isOnline && <WifiOff className="w-4 h-4 text-amber-400 ml-auto" />}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Offline notice */}
        {!isOnline && paymentStatus === "idle" && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex gap-2 items-start">
            <WifiOff className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300">
              You are currently offline. Your payment will be securely queued on this device and processed automatically when connectivity returns.
            </p>
          </div>
        )}

        {/* Amount Display */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-green-500/20">
          <p className="text-sm text-slate-400 mb-1">Amount to Pay</p>
          <p className="text-2xl font-bold text-green-500">GHS {estimatedCost}</p>
        </div>

        {/* Phone Number Input */}
        {(paymentStatus === "idle") && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Mobile Money Phone Number
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">+233</span>
                <Input
                  type="tel"
                  placeholder="501234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isProcessing}
                  className="pl-12 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Enter your MTN MoMo number (without country code)
            </p>
          </div>
        )}

        {/* Status Messages */}
        {paymentStatus === "pending" && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-3">
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-400">Payment Processing</p>
              <p className="text-sm text-blue-300 mt-1">
                A payment prompt has been sent to your phone. Please complete the transaction.
              </p>
              <p className="text-xs text-blue-300 mt-2">
                Reference ID: {referenceId?.substring(0, 8)}...
              </p>
            </div>
          </div>
        )}

        {paymentStatus === "queued" && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex gap-3">
            <CloudUpload className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-300">Payment Queued</p>
              <p className="text-sm text-amber-200 mt-1">
                Your payment has been saved locally and will be processed automatically when you reconnect to the internet.
              </p>
            </div>
          </div>
        )}

        {paymentStatus === "completed" && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-400">Payment Successful</p>
              <p className="text-sm text-green-300 mt-1">
                Your charging reservation has been confirmed. You can now proceed to the charging station.
              </p>
            </div>
          </div>
        )}

        {paymentStatus === "failed" && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-400">Payment Failed</p>
              <p className="text-sm text-red-300 mt-1">
                Please check your balance and try again, or use another payment method.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {paymentStatus === "idle" && (
            <Button
              onClick={handleInitiatePayment}
              disabled={!phoneNumber.trim() || isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isOnline ? "Sending Request..." : "Queuing..."}
                </>
              ) : (
                <>
                  {isOnline ? <Phone className="w-4 h-4 mr-2" /> : <CloudUpload className="w-4 h-4 mr-2" />}
                  {isOnline ? "Pay with MoMo" : "Queue Payment for Later"}
                </>
              )}
            </Button>
          )}

          {paymentStatus === "completed" && (
            <Button
              onClick={() => {
                setPaymentStatus("idle");
                setPhoneNumber("");
                setReferenceId(null);
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              Make Another Payment
            </Button>
          )}

          {paymentStatus === "failed" && (
            <Button
              onClick={() => {
                setPaymentStatus("idle");
                setPhoneNumber("");
                setReferenceId(null);
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              Try Again
            </Button>
          )}

          {paymentStatus === "queued" && (
            <Button
              onClick={() => {
                setPaymentStatus("idle");
                setPhoneNumber("");
              }}
              className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold"
            >
              Queue Another Payment
            </Button>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
          <p className="text-xs text-slate-400">
            {isOnline
              ? "🔒 Your payment is secured by MTN Mobile Money encryption. Your phone number is never stored."
              : "🔒 Queued payments are encrypted locally on your device and synced securely when you reconnect."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
