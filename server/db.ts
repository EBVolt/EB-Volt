import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Charging Stations Queries
 */
export async function getChargingStations() {
  const db = await getDb();
  if (!db) return [];
  
  const { chargingStations } = await import("../drizzle/schema");
  return db.select().from(chargingStations);
}

export async function getChargingStationById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const { chargingStations } = await import("../drizzle/schema");
  const result = await db.select().from(chargingStations).where(eq(chargingStations.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Charging Reservations Queries
 */
export async function createReservation(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { chargingReservations } = await import("../drizzle/schema");
  const result = await db.insert(chargingReservations).values(data);
  return result;
}

export async function getReservationById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const { chargingReservations } = await import("../drizzle/schema");
  const result = await db.select().from(chargingReservations).where(eq(chargingReservations.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getUserReservations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const { chargingReservations } = await import("../drizzle/schema");
  return db.select().from(chargingReservations).where(eq(chargingReservations.userId, userId));
}

/**
 * Payment Transactions Queries
 */
export async function createPaymentTransaction(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { paymentTransactions } = await import("../drizzle/schema");
  const result = await db.insert(paymentTransactions).values(data);
  return result;
}

export async function getPaymentTransaction(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const { paymentTransactions } = await import("../drizzle/schema");
  const result = await db.select().from(paymentTransactions).where(eq(paymentTransactions.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getPaymentByReferenceId(referenceId: string) {
  const db = await getDb();
  if (!db) return null;
  
  const { paymentTransactions } = await import("../drizzle/schema");
  const result = await db.select().from(paymentTransactions).where(eq(paymentTransactions.referenceId, referenceId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updatePaymentStatus(id: number, status: string, transactionId?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { paymentTransactions } = await import("../drizzle/schema");
  const updateData: any = { status, updatedAt: new Date() };
  if (transactionId) {
    updateData.transactionId = transactionId;
  }
  
  return db.update(paymentTransactions).set(updateData).where(eq(paymentTransactions.id, id));
}

/**
 * Refund Requests Queries
 */
export async function createRefundRequest(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { refundRequests } = await import("../drizzle/schema");
  return db.insert(refundRequests).values(data);
}

export async function getRefundRequest(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const { refundRequests } = await import("../drizzle/schema");
  const result = await db.select().from(refundRequests).where(eq(refundRequests.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getUserRefundRequests(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const { refundRequests } = await import("../drizzle/schema");
  return db.select().from(refundRequests).where(eq(refundRequests.userId, userId));
}

export async function updateRefundStatus(id: number, status: string, approvedBy?: number, notes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { refundRequests } = await import("../drizzle/schema");
  const updateData: any = { status, updatedAt: new Date() };
  if (approvedBy) {
    updateData.approvedBy = approvedBy;
  }
  if (notes) {
    updateData.adminNotes = notes;
  }
  if (status === "approved" || status === "rejected") {
    updateData.processedAt = new Date();
  }
  
  return db.update(refundRequests).set(updateData).where(eq(refundRequests.id, id));
}

export async function getAllRefunds() {
  const db = await getDb();
  if (!db) return [];
  
  const { refundRequests } = await import("../drizzle/schema");
  return db.select().from(refundRequests).orderBy(desc(refundRequests.createdAt));
}

/**
 * Receipt Queries
 */
export async function createReceipt(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { receipts } = await import("../drizzle/schema");
  return db.insert(receipts).values(data);
}

export async function getReceipt(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const { receipts } = await import("../drizzle/schema");
  const result = await db.select().from(receipts).where(eq(receipts.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getReceiptByNumber(receiptNumber: string) {
  const db = await getDb();
  if (!db) return null;
  
  const { receipts } = await import("../drizzle/schema");
  const result = await db.select().from(receipts).where(eq(receipts.receiptNumber, receiptNumber)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getUserReceipts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const { receipts } = await import("../drizzle/schema");
  return db.select().from(receipts).where(eq(receipts.userId, userId));
}

export async function incrementReceiptDownloadCount(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { receipts } = await import("../drizzle/schema");
  return db.update(receipts).set({ 
    downloadCount: (receipts.downloadCount as any) + 1,
    lastDownloadedAt: new Date(),
    updatedAt: new Date()
  }).where(eq(receipts.id, id));
}

/**
 * Favorite Chargers Queries
 */
export async function addFavoriteCharger(userId: number, stationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { favoriteChargers } = await import("../drizzle/schema");
  return db.insert(favoriteChargers).values({ userId, stationId });
}

export async function removeFavoriteCharger(userId: number, stationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { favoriteChargers } = await import("../drizzle/schema");
  return db.delete(favoriteChargers)
    .where(
      and(
        eq(favoriteChargers.userId, userId),
        eq(favoriteChargers.stationId, stationId)
      )
    );
}

export async function getUserFavoriteChargers(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const { favoriteChargers } = await import("../drizzle/schema");
  return db.select().from(favoriteChargers).where(eq(favoriteChargers.userId, userId));
}

export async function isFavoriteCharger(userId: number, stationId: number) {
  const db = await getDb();
  if (!db) return false;
  
  const { favoriteChargers } = await import("../drizzle/schema");
  const result = await db.select().from(favoriteChargers)
    .where(
      and(
        eq(favoriteChargers.userId, userId),
        eq(favoriteChargers.stationId, stationId)
      )
    )
    .limit(1);
  return result.length > 0;
}

/**
 * Notifications Queries
 */
export async function createNotification(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { notifications } = await import("../drizzle/schema");
  return db.insert(notifications).values(data);
}

export async function getUserNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const { notifications } = await import("../drizzle/schema");
  return db.select().from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy((n) => n.createdAt);
}

export async function markNotificationAsRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { notifications } = await import("../drizzle/schema");
  return db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
}

export async function getUnreadNotificationCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  
  const { notifications } = await import("../drizzle/schema");
  const result = await db.select({ count: sql`COUNT(*)` })
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      )
    );
  return result[0]?.count || 0;
}


// ── Charger Status Management ──

export async function getAllChargingStations() {
  const db = await getDb();
  if (!db) return [];
  
  const { chargingStations } = await import("../drizzle/schema");
  return db.select().from(chargingStations);
}

export async function updateChargerStatus(
  stationId: number,
  newStatus: string,
  changedBy: number,
  reason?: string
) {
  const db = await getDb();
  if (!db) return null;
  
  const { chargingStations, chargerStatusLogs } = await import("../drizzle/schema");
  
  // Get current status
  const station = await db.select().from(chargingStations).where(eq(chargingStations.id, stationId)).limit(1);
  const currentStatus = station[0]?.availableSlots === 0 ? "offline" : station[0]?.availableSlots === station[0]?.totalSlots ? "available" : "busy";
  
  // Log the status change
  await db.insert(chargerStatusLogs).values({
    stationId,
    previousStatus: currentStatus,
    newStatus,
    changedBy,
    reason,
  });
  
  // Update available slots based on new status
  let availableSlots = station[0]?.totalSlots || 4;
  if (newStatus === "offline") {
    availableSlots = 0;
  } else if (newStatus === "maintenance") {
    availableSlots = 0;
  }
  
  return db.update(chargingStations)
    .set({ availableSlots, updatedAt: new Date() })
    .where(eq(chargingStations.id, stationId));
}

export async function getChargerStatusLogs(stationId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  
  const { chargerStatusLogs } = await import("../drizzle/schema");
  return db.select()
    .from(chargerStatusLogs)
    .where(eq(chargerStatusLogs.stationId, stationId))
    .orderBy(desc(chargerStatusLogs.createdAt))
    .limit(limit);
}

export async function getChargerStats() {
  const db = await getDb();
  if (!db) return { total: 0, available: 0, busy: 0, offline: 0 };
  
  const { chargingStations } = await import("../drizzle/schema");
  const stations = await db.select().from(chargingStations);
  
  const stats = {
    total: stations.length,
    available: stations.filter(s => s.availableSlots === s.totalSlots).length,
    busy: stations.filter(s => s.availableSlots > 0 && s.availableSlots < s.totalSlots).length,
    offline: stations.filter(s => s.availableSlots === 0).length,
  };
  
  return stats;
}
