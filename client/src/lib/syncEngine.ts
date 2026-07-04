/**
 * Sync Engine
 *
 * Monitors navigator.onLine + periodic heartbeat.
 * When online, drains the offline queue by POSTing each pending item
 * to /api/trpc/sync.submitQueued (via tRPC) with its clientRef as
 * the idempotency key.
 */
import { getPending, updateStatus, pruneOld, getAllQueued, type QueuedItem } from "./offlineQueue";

type SyncCallback = (online: boolean) => void;

let listeners: SyncCallback[] = [];
let syncing = false;
let intervalId: ReturnType<typeof setInterval> | null = null;

/** Subscribe to connectivity changes. Returns unsubscribe fn. */
export function onConnectivityChange(cb: SyncCallback): () => void {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

function notify(online: boolean) {
  listeners.forEach((cb) => cb(online));
}

/** Attempt to sync all pending items to the server. */
export async function syncNow(): Promise<{ synced: number; failed: number }> {
  if (syncing) return { synced: 0, failed: 0 };
  syncing = true;
  let syncedCount = 0;
  let failedCount = 0;

  try {
    // Get pending + failed items (retry failed on manual trigger)
    const allItems = await getAllQueued();
    const pending = allItems.filter(i => i.status === "pending" || i.status === "failed");
    for (const item of pending) {
      await updateStatus(item.clientRef, "syncing");
      try {
        const res = await fetch("/api/sync/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            clientRef: item.clientRef,
            stationId: item.stationId,
            stationName: item.stationName,
            amount: item.amount,
            phoneNumber: item.phoneNumber,
            kind: item.kind,
            clientCreatedAt: item.createdAt,
          }),
        });
        if (res.ok) {
          await updateStatus(item.clientRef, "synced");
          syncedCount++;
        } else {
          const body = await res.json().catch(() => ({ error: "Unknown error" }));
          // 409 = duplicate (already synced) — treat as success
          if (res.status === 409) {
            await updateStatus(item.clientRef, "synced");
            syncedCount++;
          } else {
            await updateStatus(item.clientRef, "failed", body.error || `HTTP ${res.status}`);
            failedCount++;
          }
        }
      } catch (err: any) {
        await updateStatus(item.clientRef, "failed", err.message || "Network error");
        failedCount++;
      }
    }
    // Prune old synced items
    await pruneOld();
  } finally {
    syncing = false;
  }
  return { synced: syncedCount, failed: failedCount };
}

/** Start listening for connectivity changes and auto-syncing. */
export function startSyncEngine() {
  const handleOnline = () => {
    notify(true);
    syncNow();
  };
  const handleOffline = () => {
    notify(false);
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  // Periodic sync attempt every 30s when online
  intervalId = setInterval(() => {
    if (navigator.onLine) {
      syncNow();
    }
  }, 30_000);

  // Initial sync if online
  if (navigator.onLine) {
    syncNow();
  }

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
    if (intervalId) clearInterval(intervalId);
  };
}
