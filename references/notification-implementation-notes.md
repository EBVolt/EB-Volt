# Notification System Implementation Notes (session state)

## Schema (drizzle/schema.ts users table) notification preference defaults
- emailBookingConfirmation: default true
- emailPaymentReceipt: default true
- emailRefundStatus: default true
- emailPromotions: default FALSE
- smsBookingConfirmation: default true
- smsPaymentReceipt: default true
- smsRefundStatus: default true
- smsPromotions: default FALSE
- unsubscribeToken: varchar(64), nullable
- notification_logs table: id, userId, channel(email|sms), category(varchar), recipient, status(sent|failed|skipped), skipReason, errorMessage, subject, createdAt

## Key server files
- server/db.ts: checkNotificationPreference, logNotification, getNotificationLogs, getNotificationMetrics,
  getOrCreateUnsubscribeToken, getUserByUnsubscribeToken, applyUnsubscribe, preferenceField (private)
- server/notificationDispatcher.ts: dispatchBookingConfirmation, dispatchPaymentReceipt, dispatchRefundStatus
  (all accept optional `origin` for unsubscribe URL building via buildUnsubscribeUrl)
- server/email.ts: sendBookingConfirmationEmail, sendPaymentReceiptEmail, sendRefundNotificationEmail
  (all data interfaces have optional unsubscribeUrl); RefundNotificationData requires: userEmail, userName,
  bookingReference, refundAmount, currency, status(approved|rejected), reason?, unsubscribeUrl?
- server/sms.ts: sendBookingConfirmationSMS, sendPaymentReceiptSMS, sendRefundApprovalSMS, sendRefundRejectionSMS

## Routers (server/routers.ts)
- charging.createReservation: accepts origin, dispatches booking confirmation
- payment.checkPaymentStatus: accepts origin, dispatches payment receipt on completion
- admin.approveRefund / rejectRefund: accept origin, dispatch refund status
- admin.getNotificationMetrics, admin.getNotificationLogs (admin-gated)
- account.getUnsubscribeInfo (public query), account.unsubscribe (public mutation)

## Client
- client/src/pages/Unsubscribe.tsx: public page at route /unsubscribe (registered in App.tsx)
- client/src/components/NotificationDashboard.tsx: admin metrics + logs table, has error/retry state
- Integrated into AdminDashboard.tsx (Notification Delivery section)
- MoMoPaymentWidget passes origin into checkPaymentStatus; RefundManagement passes origin into approve/reject

## Test status
- server/notifications.test.ts integration tests (skip when no DATABASE_URL)
- KNOWN ISSUE being fixed: test "applies unsubscribe for a single category and channel" asserts SMS promotions
  still enabled after unsubscribing email promotions, BUT smsPromotions defaults to FALSE, so assertion is wrong.
  FIX: use a transactional category (default true on both channels) e.g. booking_confirmation or refund_status,
  OR explicitly enable smsPromotions before the test. Chose to switch the test to a category with both channels
  defaulting true so opt-out-of-one-channel behavior is properly validated.

## Checkpoints
- Latest delivered checkpoint before this work: 4bd6a88f (profile settings page)
