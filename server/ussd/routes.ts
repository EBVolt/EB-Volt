/**
 * USSD Routes
 *
 * Webhook endpoints for USSD aggregator integration.
 *
 * POST /api/ussd/callback — Main USSD session handler (aggregator webhook)
 * POST /api/ussd/reconcile — Payment reconciliation callback from aggregator
 * GET  /api/ussd/sessions — Admin: list recent USSD sessions
 * GET  /api/ussd/intents  — Admin: list payment intents
 */
import { Router, Request, Response } from "express";
import { getDb } from "../db";
import { ussdSessions, ussdPaymentIntents } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { processUssdInput, getInitialResponse, type SessionData } from "./stateMachine";
import { nanoid } from "nanoid";

const ussdRouter = Router();

/**
 * Generate a short, human-friendly reference code for USSD display.
 * Format: EBV-XXXXXX (6 alphanumeric chars)
 */
function generateReferenceCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No ambiguous chars (0/O, 1/I/L)
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `EBV-${code}`;
}

/**
 * POST /api/ussd/callback
 *
 * Standard USSD aggregator webhook format (Africa's Talking / Hubtel / Nsano style):
 * Body: { sessionId, phoneNumber, text, serviceCode }
 *
 * - `text` contains the full input chain separated by `*` (e.g. "1*3*50*1")
 * - First request has text="" (new session)
 * - Response format: "CON <text>" to continue or "END <text>" to terminate
 */
ussdRouter.post("/callback", async (req: Request, res: Response) => {
  try {
    const { sessionId, phoneNumber, text, serviceCode } = req.body;

    if (!sessionId || !phoneNumber) {
      return res.status(400).send("END Invalid request");
    }

    const msisdn = phoneNumber.replace(/^\+/, "");
    const db = await getDb();
    if (!db) {
      return res.status(200).send("END Service temporarily unavailable. Please try again later.");
    }

    // Parse the text input chain
    const inputs = text ? text.split("*") : [];

    // Check if session exists
    const existingSessions = await db
      .select()
      .from(ussdSessions)
      .where(eq(ussdSessions.sessionId, sessionId))
      .limit(1);

    let session = existingSessions[0];

    if (!session) {
      // New session — create and return main menu
      await db.insert(ussdSessions).values({
        sessionId,
        msisdn,
        menuState: "main_menu",
        sessionData: JSON.stringify({}),
        status: "active",
      });

      const initial = getInitialResponse();
      return res.status(200).send(`${initial.type} ${initial.text}`);
    }

    // Existing session — process the latest input
    const latestInput = inputs[inputs.length - 1] || "";
    const currentData: SessionData = session.sessionData ? JSON.parse(session.sessionData) : {};

    const { nextState, response, updatedData } = processUssdInput(
      session.menuState,
      latestInput,
      currentData
    );

    // If payment is confirmed, create a payment intent
    let finalData = updatedData;
    let finalResponse = response;

    if (nextState === "payment_confirmed" && updatedData.amount) {
      const referenceCode = generateReferenceCode();
      finalData = { ...updatedData, referenceCode };

      // Create payment intent
      await db.insert(ussdPaymentIntents).values({
        referenceCode,
        msisdn,
        amount: updatedData.amount,
        currency: "GHS",
        stationId: updatedData.stationId || null,
        stationName: updatedData.stationName || null,
        status: "pending",
      });

      // Update response text with the real reference code
      finalResponse = {
        ...response,
        text: response.text.replace("Ref: PENDING", `Ref: ${referenceCode}`),
      };
    }

    // Update session state
    const newStatus = response.type === "END" ? "completed" : "active";
    await db
      .update(ussdSessions)
      .set({
        menuState: nextState,
        sessionData: JSON.stringify(finalData),
        status: newStatus,
      })
      .where(eq(ussdSessions.id, session.id));

    // If payment intent was created, link it to the session
    if (nextState === "payment_confirmed" && finalData.referenceCode) {
      const intents = await db
        .select()
        .from(ussdPaymentIntents)
        .where(eq(ussdPaymentIntents.referenceCode, finalData.referenceCode))
        .limit(1);
      if (intents[0]) {
        await db
          .update(ussdSessions)
          .set({ paymentIntentId: intents[0].id })
          .where(eq(ussdSessions.id, session.id));
      }
    }

    return res.status(200).send(`${finalResponse.type} ${finalResponse.text}`);
  } catch (error: any) {
    console.error("[USSD] Callback error:", error);
    return res.status(200).send("END An error occurred. Please try again.");
  }
});

/**
 * POST /api/ussd/reconcile
 *
 * Called by the payment aggregator when a MoMo collection succeeds or fails.
 * Body: { referenceCode, transactionId, status, amount }
 */
ussdRouter.post("/reconcile", async (req: Request, res: Response) => {
  try {
    const { referenceCode, transactionId, status, amount } = req.body;

    if (!referenceCode) {
      return res.status(400).json({ error: "Missing referenceCode" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database unavailable" });
    }

    // Find the payment intent
    const intents = await db
      .select()
      .from(ussdPaymentIntents)
      .where(eq(ussdPaymentIntents.referenceCode, referenceCode))
      .limit(1);

    if (!intents[0]) {
      return res.status(404).json({ error: "Payment intent not found" });
    }

    const intent = intents[0];

    // Idempotency: if already completed, return success
    if (intent.status === "completed") {
      return res.status(200).json({ success: true, message: "Already reconciled" });
    }

    // Update intent status
    const newStatus = status === "COMPLETED" || status === "completed" ? "completed" : "failed";
    await db
      .update(ussdPaymentIntents)
      .set({
        status: newStatus,
        aggregatorTransactionId: transactionId || null,
        errorMessage: newStatus === "failed" ? `Aggregator status: ${status}` : null,
      })
      .where(eq(ussdPaymentIntents.id, intent.id));

    return res.status(200).json({
      success: true,
      referenceCode,
      status: newStatus,
    });
  } catch (error: any) {
    console.error("[USSD] Reconcile error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/ussd/sessions — Admin endpoint: list recent USSD sessions
 */
ussdRouter.get("/sessions", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database unavailable" });

    const sessions = await db
      .select()
      .from(ussdSessions)
      .orderBy(desc(ussdSessions.createdAt))
      .limit(100);

    return res.json({ sessions });
  } catch (error: any) {
    console.error("[USSD] Sessions fetch error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/ussd/intents — Admin endpoint: list USSD payment intents
 */
ussdRouter.get("/intents", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database unavailable" });

    const intents = await db
      .select()
      .from(ussdPaymentIntents)
      .orderBy(desc(ussdPaymentIntents.createdAt))
      .limit(100);

    return res.json({ intents });
  } catch (error: any) {
    console.error("[USSD] Intents fetch error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export { ussdRouter };
