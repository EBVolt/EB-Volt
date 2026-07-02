/* ============================================================
   Notification Dispatcher
   Centralizes preference-aware sending of email and SMS
   notifications with delivery logging.
   ============================================================ */

import {
  checkNotificationPreference,
  logNotification,
  getOrCreateUnsubscribeToken,
  NotificationCategory,
} from "./db";
import {
  sendBookingConfirmationEmail,
  sendPaymentReceiptEmail,
  sendRefundNotificationEmail,
  BookingConfirmationData,
  PaymentReceiptData,
  RefundNotificationData,
} from "./email";
import {
  sendBookingConfirmationSMS,
  sendPaymentReceiptSMS,
  sendRefundApprovalSMS,
  sendRefundRejectionSMS,
} from "./sms";

/**
 * Builds an unsubscribe URL for a user + category. The origin should be
 * provided by the frontend (window.location.origin) to avoid hardcoding domains.
 * When no origin is available, unsubscribe links are omitted.
 */
async function buildUnsubscribeUrl(
  userId: number | null | undefined,
  category: NotificationCategory,
  origin?: string
): Promise<string | undefined> {
  if (!userId || !origin) return undefined;
  const token = await getOrCreateUnsubscribeToken(userId);
  if (!token) return undefined;
  return `${origin}/unsubscribe?token=${encodeURIComponent(token)}&category=${category}`;
}

/**
 * Dispatch a booking confirmation across email and SMS channels,
 * respecting each user's notification preferences and logging outcomes.
 */
export async function dispatchBookingConfirmation(params: {
  userId?: number | null;
  origin?: string;
  email?: BookingConfirmationData;
  sms?: {
    phoneNumber: string;
    stationName: string;
    bookingDate: string;
    bookingTime: string;
    cost: number;
  };
}) {
  const category: NotificationCategory = "booking_confirmation";

  // Email channel
  if (params.email?.userEmail) {
    const optedIn = await checkNotificationPreference(params.userId, "email", category);
    if (!optedIn) {
      await logNotification({
        userId: params.userId,
        channel: "email",
        category,
        recipient: params.email.userEmail,
        status: "skipped",
        skipReason: "user_opted_out",
        subject: `Booking Confirmation: ${params.email.bookingReference}`,
      });
    } else {
      const unsubscribeUrl = await buildUnsubscribeUrl(params.userId, category, params.origin);
      const ok = await sendBookingConfirmationEmail({ ...params.email, unsubscribeUrl });
      await logNotification({
        userId: params.userId,
        channel: "email",
        category,
        recipient: params.email.userEmail,
        status: ok ? "sent" : "failed",
        errorMessage: ok ? undefined : "Email provider returned failure",
        subject: `Booking Confirmation: ${params.email.bookingReference}`,
      });
    }
  }

  // SMS channel
  if (params.sms?.phoneNumber) {
    const optedIn = await checkNotificationPreference(params.userId, "sms", category);
    if (!optedIn) {
      await logNotification({
        userId: params.userId,
        channel: "sms",
        category,
        recipient: params.sms.phoneNumber,
        status: "skipped",
        skipReason: "user_opted_out",
      });
    } else {
      const ok = await sendBookingConfirmationSMS(
        params.sms.phoneNumber,
        params.sms.stationName,
        params.sms.bookingDate,
        params.sms.bookingTime,
        params.sms.cost
      );
      await logNotification({
        userId: params.userId,
        channel: "sms",
        category,
        recipient: params.sms.phoneNumber,
        status: ok ? "sent" : "failed",
        errorMessage: ok ? undefined : "SMS provider returned failure",
      });
    }
  }
}

/**
 * Dispatch a payment receipt across email and SMS channels.
 */
export async function dispatchPaymentReceipt(params: {
  userId?: number | null;
  origin?: string;
  email?: PaymentReceiptData;
  sms?: {
    phoneNumber: string;
    receiptNumber: string;
    amount: number;
    stationName: string;
  };
}) {
  const category: NotificationCategory = "payment_receipt";

  if (params.email?.userEmail) {
    const optedIn = await checkNotificationPreference(params.userId, "email", category);
    if (!optedIn) {
      await logNotification({
        userId: params.userId,
        channel: "email",
        category,
        recipient: params.email.userEmail,
        status: "skipped",
        skipReason: "user_opted_out",
        subject: `Payment Receipt: ${params.email.transactionId}`,
      });
    } else {
      const unsubscribeUrl = await buildUnsubscribeUrl(params.userId, category, params.origin);
      const ok = await sendPaymentReceiptEmail({ ...params.email, unsubscribeUrl });
      await logNotification({
        userId: params.userId,
        channel: "email",
        category,
        recipient: params.email.userEmail,
        status: ok ? "sent" : "failed",
        errorMessage: ok ? undefined : "Email provider returned failure",
        subject: `Payment Receipt: ${params.email.transactionId}`,
      });
    }
  }

  if (params.sms?.phoneNumber) {
    const optedIn = await checkNotificationPreference(params.userId, "sms", category);
    if (!optedIn) {
      await logNotification({
        userId: params.userId,
        channel: "sms",
        category,
        recipient: params.sms.phoneNumber,
        status: "skipped",
        skipReason: "user_opted_out",
      });
    } else {
      const ok = await sendPaymentReceiptSMS(
        params.sms.phoneNumber,
        params.sms.receiptNumber,
        params.sms.amount,
        params.sms.stationName
      );
      await logNotification({
        userId: params.userId,
        channel: "sms",
        category,
        recipient: params.sms.phoneNumber,
        status: ok ? "sent" : "failed",
        errorMessage: ok ? undefined : "SMS provider returned failure",
      });
    }
  }
}

/**
 * Dispatch a refund status notification (approved/rejected) across channels.
 */
export async function dispatchRefundStatus(params: {
  userId?: number | null;
  origin?: string;
  status: "approved" | "rejected";
  email?: RefundNotificationData;
  sms?: {
    phoneNumber: string;
    refundAmount: number;
    reason: string;
  };
}) {
  const category: NotificationCategory = "refund_status";

  if (params.email?.userEmail) {
    const optedIn = await checkNotificationPreference(params.userId, "email", category);
    if (!optedIn) {
      await logNotification({
        userId: params.userId,
        channel: "email",
        category,
        recipient: params.email.userEmail,
        status: "skipped",
        skipReason: "user_opted_out",
        subject: `Refund ${params.status}: ${params.email.bookingReference}`,
      });
    } else {
      const unsubscribeUrl = await buildUnsubscribeUrl(params.userId, category, params.origin);
      const ok = await sendRefundNotificationEmail({ ...params.email, unsubscribeUrl });
      await logNotification({
        userId: params.userId,
        channel: "email",
        category,
        recipient: params.email.userEmail,
        status: ok ? "sent" : "failed",
        errorMessage: ok ? undefined : "Email provider returned failure",
        subject: `Refund ${params.status}: ${params.email.bookingReference}`,
      });
    }
  }

  if (params.sms?.phoneNumber) {
    const optedIn = await checkNotificationPreference(params.userId, "sms", category);
    if (!optedIn) {
      await logNotification({
        userId: params.userId,
        channel: "sms",
        category,
        recipient: params.sms.phoneNumber,
        status: "skipped",
        skipReason: "user_opted_out",
      });
    } else {
      const ok =
        params.status === "approved"
          ? await sendRefundApprovalSMS(params.sms.phoneNumber, params.sms.refundAmount, params.sms.reason)
          : await sendRefundRejectionSMS(params.sms.phoneNumber, params.sms.reason);
      await logNotification({
        userId: params.userId,
        channel: "sms",
        category,
        recipient: params.sms.phoneNumber,
        status: ok ? "sent" : "failed",
        errorMessage: ok ? undefined : "SMS provider returned failure",
      });
    }
  }
}
