import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  emailBookingConfirmation: boolean("emailBookingConfirmation").default(true).notNull(),
  emailPaymentReceipt: boolean("emailPaymentReceipt").default(true).notNull(),
  emailRefundStatus: boolean("emailRefundStatus").default(true).notNull(),
  emailPromotions: boolean("emailPromotions").default(false).notNull(),
  smsBookingConfirmation: boolean("smsBookingConfirmation").default(true).notNull(),
  smsPaymentReceipt: boolean("smsPaymentReceipt").default(true).notNull(),
  smsRefundStatus: boolean("smsRefundStatus").default(true).notNull(),
  smsPromotions: boolean("smsPromotions").default(false).notNull(),
  unsubscribeToken: varchar("unsubscribeToken", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Charging stations table - stores EcoBelle Volt charging locations
 */
export const chargingStations = mysqlTable("charging_stations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  chargerType: varchar("charger_type", { length: 50 }).notNull(), // DC Fast, AC Level 2, etc.
  totalSlots: int("total_slots").default(4).notNull(),
  availableSlots: int("available_slots").default(4).notNull(),
  pricePerKwh: text("price_per_kwh").notNull(), // Store as string to preserve precision
  amenities: text("amenities"), // JSON array: WiFi, Cafe, Restroom, Parking
  rating: text("rating"), // Average rating
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChargingStation = typeof chargingStations.$inferSelect;
export type InsertChargingStation = typeof chargingStations.$inferInsert;

/**
 * Charging reservations table - stores user booking information
 */
export const chargingReservations = mysqlTable("charging_reservations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  stationId: int("station_id").notNull(),
  reservationDate: timestamp("reservation_date").notNull(),
  durationMinutes: int("duration_minutes").notNull(),
  estimatedCost: text("estimated_cost").notNull(), // Store as string for precision
  status: mysqlEnum("status", ["pending", "confirmed", "active", "completed", "cancelled"]).default("pending").notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(), // For MoMo payment
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChargingReservation = typeof chargingReservations.$inferSelect;
export type InsertChargingReservation = typeof chargingReservations.$inferInsert;

/**
 * Payment transactions table - tracks all MTN MoMo payments
 */
export const paymentTransactions = mysqlTable("payment_transactions", {
  id: int("id").autoincrement().primaryKey(),
  reservationId: int("reservation_id").notNull(),
  userId: int("user_id").notNull(),
  amount: text("amount").notNull(), // Store as string for precision
  currency: varchar("currency", { length: 3 }).default("GHS").notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  transactionId: varchar("transaction_id", { length: 255 }).unique(), // MTN MoMo transaction ID
  referenceId: varchar("reference_id", { length: 255 }).unique(), // Our internal reference
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed", "cancelled"]).default("pending").notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).default("MTN_MOMO").notNull(),
  momoTransactionRef: varchar("momo_transaction_ref", { length: 255 }), // MoMo reference code
  errorMessage: text("error_message"), // Error details if payment fails
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type InsertPaymentTransaction = typeof paymentTransactions.$inferInsert;

/**
 * Refund requests table - tracks refund requests for cancelled bookings
 */
export const refundRequests = mysqlTable("refund_requests", {
  id: int("id").autoincrement().primaryKey(),
  paymentTransactionId: int("payment_transaction_id").notNull(),
  reservationId: int("reservation_id").notNull(),
  userId: int("user_id").notNull(),
  refundAmount: text("refund_amount").notNull(), // Store as string for precision
  reason: text("reason").notNull(), // User-provided reason for cancellation
  status: mysqlEnum("status", ["pending", "approved", "rejected", "processed", "failed"]).default("pending").notNull(),
  refundTransactionId: varchar("refund_transaction_id", { length: 255 }), // MoMo refund transaction ID
  refundedAt: timestamp("refunded_at"), // When refund was processed
  rejectionReason: text("rejection_reason"), // Reason if refund was rejected
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RefundRequest = typeof refundRequests.$inferSelect;
export type InsertRefundRequest = typeof refundRequests.$inferInsert;

/**
 * Receipt records table - stores generated receipt information
 */
export const receipts = mysqlTable("receipts", {
  id: int("id").autoincrement().primaryKey(),
  paymentTransactionId: int("payment_transaction_id").notNull(),
  reservationId: int("reservation_id").notNull(),
  userId: int("user_id").notNull(),
  receiptNumber: varchar("receipt_number", { length: 50 }).unique().notNull(), // Unique receipt ID
  amount: text("amount").notNull(),
  currency: varchar("currency", { length: 3 }).default("GHS").notNull(),
  receiptUrl: text("receipt_url"), // URL to stored PDF receipt
  receiptFormat: varchar("receipt_format", { length: 20 }).default("pdf").notNull(),
  downloadCount: int("download_count").default(0).notNull(),
  lastDownloadedAt: timestamp("last_downloaded_at"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Receipt = typeof receipts.$inferSelect;
export type InsertReceipt = typeof receipts.$inferInsert;

/**
 * Favorite chargers table - stores user's bookmarked charging stations
 */
export const favoriteChargers = mysqlTable("favorite_chargers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  stationId: int("station_id").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FavoriteCharger = typeof favoriteChargers.$inferSelect;
export type InsertFavoriteCharger = typeof favoriteChargers.$inferInsert;

/**
 * Notifications table - stores booking confirmations and status updates
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // booking_confirmation, refund_approved, refund_rejected, payment_receipt
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  relatedReservationId: int("related_reservation_id"),
  relatedRefundId: int("related_refund_id"),
  isRead: boolean("is_read").default(false).notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Notification delivery logs - tracks all email and SMS dispatch attempts
 * for the admin notification dashboard and delivery analytics.
 */
export const notificationLogs = mysqlTable("notification_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id"),
  channel: mysqlEnum("channel", ["email", "sms"]).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // booking_confirmation, payment_receipt, refund_status, promotions
  recipient: varchar("recipient", { length: 320 }).notNull(), // email address or phone number
  status: mysqlEnum("status", ["sent", "failed", "skipped"]).notNull(),
  skipReason: varchar("skip_reason", { length: 255 }), // e.g. "user_opted_out", "no_contact_info"
  errorMessage: text("error_message"),
  subject: varchar("subject", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NotificationLog = typeof notificationLogs.$inferSelect;
export type InsertNotificationLog = typeof notificationLogs.$inferInsert;

/**
 * Charger status logs - tracks availability changes for admin management
 */
export const chargerStatusLogs = mysqlTable("charger_status_logs", {
  id: int("id").autoincrement().primaryKey(),
  stationId: int("station_id").notNull(),
  previousStatus: varchar("previous_status", { length: 50 }).notNull(), // available, busy, offline, maintenance
  newStatus: varchar("new_status", { length: 50 }).notNull(),
  changedBy: int("changed_by"), // admin user ID who made the change
  reason: text("reason"), // maintenance, system update, manual override, etc.
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChargerStatusLog = typeof chargerStatusLogs.$inferSelect;
export type InsertChargerStatusLog = typeof chargerStatusLogs.$inferInsert;

/**
 * Queued transactions table - server-side landing zone for payment intents that
 * were created on the client while offline and then synced when connectivity
 * returned. The clientRef is a client-generated idempotency key: replaying the
 * same queued item (e.g. after a flaky reconnect) is a no-op.
 */
export const queuedTransactions = mysqlTable("queued_transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  /** Client-generated idempotency key (unique). Prevents double-processing on replay. */
  clientRef: varchar("client_ref", { length: 64 }).notNull().unique(),
  stationId: int("station_id"),
  stationName: varchar("station_name", { length: 255 }),
  amount: text("amount").notNull(), // GHS amount, string for precision
  currency: varchar("currency", { length: 3 }).default("GHS").notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  /** Kind of queued action. Currently only charging payment intents. */
  kind: varchar("kind", { length: 40 }).default("charging_payment").notNull(),
  /** Server-side processing status after sync. */
  status: mysqlEnum("status", ["queued", "synced", "failed"]).default("synced").notNull(),
  /** When the action was originally created on the client (UTC ms captured as Date). */
  clientCreatedAt: timestamp("client_created_at").notNull(),
  errorMessage: text("error_message"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QueuedTransaction = typeof queuedTransactions.$inferSelect;
export type InsertQueuedTransaction = typeof queuedTransactions.$inferInsert;
