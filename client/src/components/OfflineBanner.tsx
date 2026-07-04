/**
 * OfflineBanner
 *
 * Displays a slim, non-intrusive banner at the top of the viewport when
 * the user is offline or has pending queued transactions waiting to sync.
 */
import { WifiOff, CloudUpload, CheckCircle2, AlertTriangle } from "lucide-react";
import { useOfflineQueue } from "@/hooks/useOfflineQueue";

export function OfflineBanner() {
  const { isOnline, pendingCount, failedCount, isSyncing, triggerSync } = useOfflineQueue();

  // Nothing to show when online and no pending items
  if (isOnline && pendingCount === 0 && failedCount === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      <div className="pointer-events-auto">
        {/* Offline banner */}
        {!isOnline && (
          <div className="bg-amber-600 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium shadow-lg">
            <WifiOff className="w-4 h-4" />
            <span>You are offline. Transactions will be queued and synced when you reconnect.</span>
          </div>
        )}

        {/* Pending sync banner (online but items waiting) */}
        {isOnline && pendingCount > 0 && (
          <div className="bg-blue-600 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium shadow-lg">
            <CloudUpload className="w-4 h-4 animate-pulse" />
            <span>
              {isSyncing
                ? `Syncing ${pendingCount} queued transaction${pendingCount > 1 ? "s" : ""}...`
                : `${pendingCount} transaction${pendingCount > 1 ? "s" : ""} waiting to sync`}
            </span>
            {!isSyncing && (
              <button
                onClick={triggerSync}
                className="ml-2 px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded text-xs font-semibold transition-colors"
              >
                Sync Now
              </button>
            )}
          </div>
        )}

        {/* Failed items banner */}
        {isOnline && pendingCount === 0 && failedCount > 0 && (
          <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium shadow-lg">
            <AlertTriangle className="w-4 h-4" />
            <span>
              {failedCount} transaction{failedCount > 1 ? "s" : ""} failed to sync.
            </span>
            <button
              onClick={triggerSync}
              className="ml-2 px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded text-xs font-semibold transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
