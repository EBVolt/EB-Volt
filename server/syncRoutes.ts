/**
 * Sync Routes
 *
 * Express routes for the offline-first transaction queue.
 * POST /api/sync/submit — receives a queued item from the client,
 * deduplicates by clientRef (idempotency key), and persists to the
 * queued_transactions table.
 */
import { Router, Request, Response } from "express";
import { getDb } from "./db";
import { queuedTransactions } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const syncRouter = Router();

interface SyncSubmitBody {
  clientRef: string;
  stationId?: number;
  stationName?: string;
  amount: string;
  phoneNumber: string;
  kind: string;
  clientCreatedAt: string;
}

syncRouter.post("/submit", async (req: Request, res: Response) => {
  try {
    // Auth check: require session cookie (same as tRPC context)
    // We rely on the cookie-based session; if no user in context, reject.
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const body = req.body as SyncSubmitBody;

    // Validate required fields
    if (!body.clientRef || !body.amount || !body.phoneNumber) {
      return res.status(400).json({ error: "Missing required fields: clientRef, amount, phoneNumber" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database unavailable" });
    }

    // Idempotency check: if clientRef already exists, return 409 (duplicate)
    const existing = await db
      .select({ id: queuedTransactions.id })
      .from(queuedTransactions)
      .where(eq(queuedTransactions.clientRef, body.clientRef))
      .limit(1);

    if (existing.length > 0) {
      return res.status(409).json({ error: "Already synced", id: existing[0].id });
    }

    // Insert the queued transaction
    const result = await db.insert(queuedTransactions).values({
      userId,
      clientRef: body.clientRef,
      stationId: body.stationId || null,
      stationName: body.stationName || null,
      amount: body.amount,
      currency: "GHS",
      phoneNumber: body.phoneNumber,
      kind: body.kind || "charging_payment",
      status: "synced",
      clientCreatedAt: new Date(body.clientCreatedAt),
    });

    return res.status(201).json({
      success: true,
      id: (result as any).insertId,
      clientRef: body.clientRef,
    });
  } catch (error: any) {
    console.error("[Sync] Submit failed:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/** GET /api/sync/queue — returns the user's synced queue items (last 50). */
syncRouter.get("/queue", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database unavailable" });
    }

    const items = await db
      .select()
      .from(queuedTransactions)
      .where(eq(queuedTransactions.userId, userId))
      .orderBy(queuedTransactions.createdAt)
      .limit(50);

    return res.json({ items });
  } catch (error: any) {
    console.error("[Sync] Queue fetch failed:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export { syncRouter };
