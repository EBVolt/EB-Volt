/**
 * Offline Transaction Queue
 *
 * Persists payment intents to IndexedDB when the user is offline,
 * then syncs them to the server when connectivity returns.
 * Each queued item carries a client-generated idempotency key (clientRef)
 * so replayed syncs never cause double-charges.
 */
import { openDB, DBSchema, IDBPDatabase } from "idb";
import { nanoid } from "nanoid";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface QueuedItem {
  /** Client-generated unique key (idempotency). */
  clientRef: string;
  stationId?: number;
  stationName?: string;
  amount: string;
  phoneNumber: string;
  kind: "charging_payment";
  /** ISO string of when the user initiated the action. */
  createdAt: string;
  /** Local queue status. */
  status: "pending" | "syncing" | "synced" | "failed";
  /** Server error message if sync failed. */
  errorMessage?: string;
}

// ─── IndexedDB Schema ───────────────────────────────────────────────────────

interface OfflineQueueDB extends DBSchema {
  queue: {
    key: string; // clientRef
    value: QueuedItem;
    indexes: { "by-status": string };
  };
}

const DB_NAME = "ebvolt-offline-queue";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<OfflineQueueDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<OfflineQueueDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore("queue", { keyPath: "clientRef" });
        store.createIndex("by-status", "status");
      },
    });
  }
  return dbPromise;
}

// ─── Public API ─────────────────────────────────────────────────────────────

/** Enqueue a new payment intent locally. Returns the generated clientRef. */
export async function enqueue(item: Omit<QueuedItem, "clientRef" | "status" | "createdAt">): Promise<string> {
  const db = await getDB();
  const clientRef = nanoid();
  const record: QueuedItem = {
    ...item,
    clientRef,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  await db.put("queue", record);
  return clientRef;
}

/** Get all items in the local queue (newest first). */
export async function getAllQueued(): Promise<QueuedItem[]> {
  const db = await getDB();
  const all = await db.getAll("queue");
  return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** Get only pending (un-synced) items. */
export async function getPending(): Promise<QueuedItem[]> {
  const db = await getDB();
  return db.getAllFromIndex("queue", "by-status", "pending");
}

/** Mark an item as syncing/synced/failed. */
export async function updateStatus(clientRef: string, status: QueuedItem["status"], errorMessage?: string) {
  const db = await getDB();
  const item = await db.get("queue", clientRef);
  if (!item) return;
  item.status = status;
  if (errorMessage) item.errorMessage = errorMessage;
  await db.put("queue", item);
}

/** Remove synced items older than 24 hours to keep the store clean. */
export async function pruneOld() {
  const db = await getDB();
  const all = await db.getAll("queue");
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  for (const item of all) {
    if (item.status === "synced" && new Date(item.createdAt).getTime() < cutoff) {
      await db.delete("queue", item.clientRef);
    }
  }
}

/** Clear all items (useful for testing). */
export async function clearAll() {
  const db = await getDB();
  await db.clear("queue");
}
