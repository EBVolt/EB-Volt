import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
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