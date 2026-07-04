/**
 * useOfflineQueue hook
 *
 * Provides reactive connectivity state and queue management
 * for the offline-first transaction system.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { enqueue, getAllQueued, type QueuedItem } from "@/lib/offlineQueue";
import { onConnectivityChange, syncNow, startSyncEngine } from "@/lib/syncEngine";

export function useOfflineQueue() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queue, setQueue] = useState<QueuedItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const engineStarted = useRef(false);

  // Start sync engine once
  useEffect(() => {
    if (engineStarted.current) return;
    engineStarted.current = true;
    const cleanup = startSyncEngine();
    return cleanup;
  }, []);

  // Listen for connectivity changes
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const unsub = onConnectivityChange((online) => {
      setIsOnline(online);
      // Refresh queue after connectivity change
      refreshQueue();
    });
    return unsub;
  }, []);

  // Refresh queue state from IndexedDB
  const refreshQueue = useCallback(async () => {
    const items = await getAllQueued();
    setQueue(items);
  }, []);

  // Load queue on mount
  useEffect(() => {
    refreshQueue();
  }, [refreshQueue]);

  // Periodically refresh queue state (every 5s)
  useEffect(() => {
    const id = setInterval(refreshQueue, 5000);
    return () => clearInterval(id);
  }, [refreshQueue]);

  // Enqueue a new payment intent
  const addToQueue = useCallback(
    async (item: { stationId?: number; stationName?: string; amount: string; phoneNumber: string }) => {
      const clientRef = await enqueue({
        ...item,
        kind: "charging_payment",
      });
      await refreshQueue();
      return clientRef;
    },
    [refreshQueue]
  );

  // Manual sync trigger
  const triggerSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      const result = await syncNow();
      await refreshQueue();
      return result;
    } finally {
      setIsSyncing(false);
    }
  }, [refreshQueue]);

  const pendingCount = queue.filter((q) => q.status === "pending" || q.status === "syncing").length;
  const syncedCount = queue.filter((q) => q.status === "synced").length;
  const failedCount = queue.filter((q) => q.status === "failed").length;

  return {
    isOnline,
    queue,
    pendingCount,
    syncedCount,
    failedCount,
    isSyncing,
    addToQueue,
    triggerSync,
    refreshQueue,
  };
}
