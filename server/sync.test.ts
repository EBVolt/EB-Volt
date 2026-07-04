/**
 * Tests for the offline sync endpoint (/api/sync/submit)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module
const mockGetDb = vi.fn();
vi.mock("./db", () => ({
  getDb: () => mockGetDb(),
}));

// Mock drizzle schema
vi.mock("../drizzle/schema", () => ({
  queuedTransactions: {
    id: "id",
    clientRef: "client_ref",
    userId: "user_id",
    createdAt: "createdAt",
  },
}));

// Mock drizzle-orm
vi.mock("drizzle-orm", () => ({
  eq: (col: any, val: any) => ({ col, val }),
}));

// Import after mocks
import { syncRouter } from "./syncRoutes";
import express from "express";
import request from "supertest";

function createApp(userId: number | null = 1) {
  const app = express();
  app.use(express.json());
  // Fake auth middleware
  app.use((req, _res, next) => {
    (req as any).userId = userId;
    next();
  });
  app.use("/api/sync", syncRouter);
  return app;
}

describe("POST /api/sync/submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    const app = createApp(null);
    const res = await request(app).post("/api/sync/submit").send({
      clientRef: "abc123",
      amount: "50.00",
      phoneNumber: "0501234567",
    });
    expect(res.status).toBe(401);
  });

  it("returns 400 when required fields are missing", async () => {
    const app = createApp(1);
    const res = await request(app).post("/api/sync/submit").send({
      clientRef: "abc123",
      // missing amount and phoneNumber
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Missing required fields");
  });

  it("returns 409 for duplicate clientRef (idempotency)", async () => {
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: 42 }]),
        }),
      }),
    });
    mockGetDb.mockResolvedValue({
      select: mockSelect,
      insert: vi.fn(),
    });

    const app = createApp(1);
    const res = await request(app).post("/api/sync/submit").send({
      clientRef: "duplicate-ref",
      amount: "50.00",
      phoneNumber: "0501234567",
      kind: "charging_payment",
      clientCreatedAt: new Date().toISOString(),
    });
    expect(res.status).toBe(409);
    expect(res.body.error).toBe("Already synced");
  });

  it("returns 201 for a new queued item", async () => {
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]), // No existing record
        }),
      }),
    });
    const mockInsert = vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue({ insertId: 99 }),
    });
    mockGetDb.mockResolvedValue({
      select: mockSelect,
      insert: mockInsert,
    });

    const app = createApp(1);
    const res = await request(app).post("/api/sync/submit").send({
      clientRef: "new-ref-123",
      stationId: 5,
      stationName: "EB Volt Accra East",
      amount: "75.00",
      phoneNumber: "0501234567",
      kind: "charging_payment",
      clientCreatedAt: new Date().toISOString(),
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.clientRef).toBe("new-ref-123");
  });

  it("returns 503 when database is unavailable", async () => {
    mockGetDb.mockResolvedValue(null);

    const app = createApp(1);
    const res = await request(app).post("/api/sync/submit").send({
      clientRef: "some-ref",
      amount: "50.00",
      phoneNumber: "0501234567",
      clientCreatedAt: new Date().toISOString(),
    });
    expect(res.status).toBe(503);
  });
});

describe("GET /api/sync/queue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    const app = createApp(null);
    const res = await request(app).get("/api/sync/queue");
    expect(res.status).toBe(401);
  });

  it("returns user queue items", async () => {
    const mockItems = [
      { id: 1, clientRef: "ref-1", amount: "50.00", status: "synced" },
      { id: 2, clientRef: "ref-2", amount: "30.00", status: "synced" },
    ];
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue(mockItems),
          }),
        }),
      }),
    });
    mockGetDb.mockResolvedValue({
      select: mockSelect,
    });

    const app = createApp(1);
    const res = await request(app).get("/api/sync/queue");
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(2);
  });
});
