import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import {
  getDb,
  getUserById,
  checkNotificationPreference,
  logNotification,
  getNotificationMetrics,
  getNotificationLogs,
  getOrCreateUnsubscribeToken,
  getUserByUnsubscribeToken,
  applyUnsubscribe,
} from "./db";
import { dispatchRefundStatus } from "./notificationDispatcher";
import { users, notificationLogs } from "../drizzle/schema";

/**
 * These are integration tests that exercise the real database using a
 * temporary test user. If the database is not configured (no DATABASE_URL),
 * the suite is skipped so CI without a DB does not fail.
 */

const hasDb = !!process.env.DATABASE_URL;
const d = hasDb ? describe : describe.skip;

let testUserId: number;
const testEmail = `vitest_notify_${Date.now()}@example.com`;
const testOpenId = `vitest_notify_${Date.now()}`;

d("notification workflow (integration)", () => {
  beforeAll(async () => {
    const db = await getDb();
    if (!db) return;
    const result: any = await db.insert(users).values({
      openId: testOpenId,
      email: testEmail,
      name: "Vitest Notify User",
      loginMethod: "manus",
      role: "user",
      phoneNumber: "233500000000",
    });
    testUserId = result.insertId ?? result[0]?.insertId;
    // Fallback: look up by openId if insertId not surfaced
    if (!testUserId) {
      const rows = await db.select().from(users).where(eq(users.openId, testOpenId)).limit(1);
      testUserId = rows[0]!.id;
    }
  });

  afterAll(async () => {
    const db = await getDb();
    if (!db) return;
    await db.delete(notificationLogs).where(eq(notificationLogs.userId, testUserId));
    await db.delete(users).where(eq(users.id, testUserId));
  });

  it("defaults new users to opted-in for transactional categories", async () => {
    const optedInEmail = await checkNotificationPreference(testUserId, "email", "booking_confirmation");
    const optedInSms = await checkNotificationPreference(testUserId, "sms", "refund_status");
    expect(optedInEmail).toBe(true);
    expect(optedInSms).toBe(true);
  });

  it("treats missing user as opted-in so critical mails are not dropped", async () => {
    const result = await checkNotificationPreference(999999999, "email", "payment_receipt");
    expect(result).toBe(true);
  });

  it("generates a stable unsubscribe token and resolves it back to the user", async () => {
    const token1 = await getOrCreateUnsubscribeToken(testUserId);
    const token2 = await getOrCreateUnsubscribeToken(testUserId);
    expect(token1).toBeTruthy();
    expect(token1).toBe(token2); // stable, not regenerated

    const user = await getUserByUnsubscribeToken(token1!);
    expect(user?.id).toBe(testUserId);
  });

  it("applies unsubscribe for a single category and channel", async () => {
    // booking_confirmation defaults to enabled on BOTH email and SMS, so it
    // cleanly proves that disabling one channel leaves the other untouched.
    await applyUnsubscribe(testUserId, "booking_confirmation", "email");
    const optedIn = await checkNotificationPreference(testUserId, "email", "booking_confirmation");
    expect(optedIn).toBe(false);

    // SMS booking confirmation should still be enabled since only email was disabled
    const smsOptedIn = await checkNotificationPreference(testUserId, "sms", "booking_confirmation");
    expect(smsOptedIn).toBe(true);
  });

  it("records notification logs and reflects them in metrics", async () => {
    await logNotification({
      userId: testUserId,
      channel: "email",
      category: "booking_confirmation",
      recipient: testEmail,
      status: "sent",
      subject: "Vitest booking",
    });
    await logNotification({
      userId: testUserId,
      channel: "sms",
      category: "refund_status",
      recipient: "233500000000",
      status: "failed",
      errorMessage: "provider down",
    });

    const logs = await getNotificationLogs({ limit: 50 });
    const mine = logs.filter((l) => l.userId === testUserId);
    expect(mine.length).toBeGreaterThanOrEqual(2);

    const metrics = await getNotificationMetrics();
    expect(metrics.totalSent).toBeGreaterThanOrEqual(1);
    expect(metrics.totalFailed).toBeGreaterThanOrEqual(1);
    expect(metrics.deliveryRate).toBeGreaterThanOrEqual(0);
    expect(metrics.deliveryRate).toBeLessThanOrEqual(100);
  });

  it("dispatcher skips a channel the user opted out of and logs the skip", async () => {
    // Opt the user out of email refund_status
    await applyUnsubscribe(testUserId, "refund_status", "email");

    await dispatchRefundStatus({
      userId: testUserId,
      status: "approved",
      email: {
        userEmail: testEmail,
        userName: "Vitest Notify User",
        bookingReference: "RES-TEST",
        refundAmount: 25,
        currency: "GHS",
        reason: "Test approval",
        status: "approved",
      },
    });

    const logs = await getNotificationLogs({ limit: 50, channel: "email", status: "skipped" });
    const skipped = logs.find(
      (l) => l.userId === testUserId && l.category === "refund_status"
    );
    expect(skipped).toBeTruthy();
    expect(skipped?.skipReason).toBe("user_opted_out");
  });
});
