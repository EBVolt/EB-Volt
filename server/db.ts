import { eq } from "drizzle-orm";
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

export async function updateRefundStatus(id: number, status: string, refundTransactionId?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { refundRequests } = await import("../drizzle/schema");
  const updateData: any = { status, updatedAt: new Date() };
  if (refundTransactionId) {
    updateData.refundTransactionId = refundTransactionId;
  }
  if (status === "processed") {
    updateData.refundedAt = new Date();
  }
  
  return db.update(refundRequests).set(updateData).where(eq(refundRequests.id, id));
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
