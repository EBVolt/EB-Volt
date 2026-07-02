import { useEffect, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, MailX, AlertCircle, Undo2 } from "lucide-react";

type Category =
  | "booking_confirmation"
  | "payment_receipt"
  | "refund_status"
  | "promotions"
  | "all";

const CATEGORY_LABELS: Record<Category, string> = {
  booking_confirmation: "Booking Confirmations",
  payment_receipt: "Payment Receipts",
  refund_status: "Refund Status Updates",
  promotions: "Promotions & Offers",
  all: "All Notifications",
};

export default function Unsubscribe() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const token = params.get("token") || "";
  const categoryParam = (params.get("category") as Category) || "promotions";

  const [category, setCategory] = useState<Category>(
    ["booking_confirmation", "payment_receipt", "refund_status", "promotions", "all"].includes(categoryParam)
      ? categoryParam
      : "promotions"
  );
  const [done, setDone] = useState(false);
  const [resubscribed, setResubscribed] = useState(false);

  const infoQuery = trpc.account.getUnsubscribeInfo.useQuery(
    { token },
    { enabled: !!token, retry: false }
  );

  const unsubscribeMutation = trpc.account.unsubscribe.useMutation({
    onSuccess: () => {
      setResubscribed(false);
      setDone(true);
    },
  });

  const resubscribeMutation = trpc.account.resubscribe.useMutation({
    onSuccess: () => setResubscribed(true),
  });

  useEffect(() => {
    document.title = "Unsubscribe | EcoBelle Volt";
  }, []);

  const bg = { background: "oklch(0.98 0.01 240)" };
  const heading = { fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={bg}>
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border" style={{ borderColor: "oklch(0.9 0.02 240)" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "oklch(0.95 0.03 145)" }}>
            <MailX size={22} style={{ color: "oklch(0.5 0.15 145)" }} />
          </div>
          <h1 className="text-2xl font-bold" style={heading}>
            Notification Preferences
          </h1>
        </div>

        {!token && (
          <div className="flex items-start gap-2 rounded-lg p-4" style={{ background: "oklch(0.97 0.05 25)" }}>
            <AlertCircle size={18} style={{ color: "oklch(0.6 0.2 25)" }} className="mt-0.5" />
            <p className="text-sm" style={{ color: "oklch(0.45 0.1 25)" }}>
              This unsubscribe link is missing its token and cannot be used. Please use the link from your email.
            </p>
          </div>
        )}

        {token && infoQuery.isLoading && (
          <div className="flex items-center gap-2 text-sm" style={{ color: "oklch(0.45 0.05 240)" }}>
            <Loader2 className="animate-spin" size={16} /> Verifying your link...
          </div>
        )}

        {token && infoQuery.data && !infoQuery.data.valid && (
          <div className="flex items-start gap-2 rounded-lg p-4" style={{ background: "oklch(0.97 0.05 25)" }}>
            <AlertCircle size={18} style={{ color: "oklch(0.6 0.2 25)" }} className="mt-0.5" />
            <p className="text-sm" style={{ color: "oklch(0.45 0.1 25)" }}>
              This unsubscribe link is invalid or has expired. You can manage preferences from your account settings instead.
            </p>
          </div>
        )}

        {token && infoQuery.data?.valid && !done && (
          <>
            <p className="text-sm mb-4" style={{ color: "oklch(0.45 0.05 240)" }}>
              Manage notifications for <span className="font-semibold">{infoQuery.data.email}</span>. Choose what you'd like to stop receiving.
            </p>
            <label className="text-sm font-semibold mb-2 block" style={{ color: "oklch(0.35 0.05 240)" }}>
              Unsubscribe from
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full rounded-lg border p-3 text-sm mb-6 bg-white"
              style={{ borderColor: "oklch(0.9 0.02 240)", color: "oklch(0.3 0.05 240)" }}
            >
              {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>

            <Button
              onClick={() => unsubscribeMutation.mutate({ token, category })}
              disabled={unsubscribeMutation.isPending}
              className="w-full font-semibold text-white"
              style={{ background: "oklch(0.5 0.15 145)" }}
            >
              {unsubscribeMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={16} /> Updating...
                </>
              ) : (
                "Confirm Unsubscribe"
              )}
            </Button>
            {unsubscribeMutation.isError && (
              <p className="text-sm mt-3" style={{ color: "oklch(0.6 0.2 25)" }}>
                {unsubscribeMutation.error?.message || "Something went wrong. Please try again."}
              </p>
            )}
          </>
        )}

        {done && !resubscribed && (
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <CheckCircle2 size={48} style={{ color: "oklch(0.55 0.18 145)" }} />
            <p className="text-lg font-semibold" style={heading}>
              You're all set
            </p>
            <p className="text-sm" style={{ color: "oklch(0.45 0.05 240)" }}>
              You've been unsubscribed from {CATEGORY_LABELS[category]}. Changed your mind? You can re-enable it with one click below.
            </p>
            <Button
              variant="outline"
              onClick={() => resubscribeMutation.mutate({ token, category })}
              disabled={resubscribeMutation.isPending}
              className="mt-1 bg-white font-semibold"
              style={{ borderColor: "oklch(0.5 0.15 145)", color: "oklch(0.45 0.15 145)" }}
            >
              {resubscribeMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={16} /> Re-enabling...
                </>
              ) : (
                <>
                  <Undo2 className="mr-2" size={16} /> Re-enable {CATEGORY_LABELS[category]}
                </>
              )}
            </Button>
            {resubscribeMutation.isError && (
              <p className="text-sm" style={{ color: "oklch(0.6 0.2 25)" }}>
                {resubscribeMutation.error?.message || "Could not re-enable. Please try again."}
              </p>
            )}
            <a href="/account" className="mt-2 text-sm font-semibold underline" style={{ color: "oklch(0.5 0.15 145)" }}>
              Go to Account Settings
            </a>
          </div>
        )}

        {done && resubscribed && (
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <CheckCircle2 size={48} style={{ color: "oklch(0.55 0.18 145)" }} />
            <p className="text-lg font-semibold" style={heading}>
              Notifications re-enabled
            </p>
            <p className="text-sm" style={{ color: "oklch(0.45 0.05 240)" }}>
              You'll continue to receive {CATEGORY_LABELS[category]} from EcoBelle Volt. You can change this anytime from your account settings.
            </p>
            <a href="/account" className="mt-2 text-sm font-semibold underline" style={{ color: "oklch(0.5 0.15 145)" }}>
              Go to Account Settings
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
