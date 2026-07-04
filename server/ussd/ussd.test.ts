/**
 * Tests for USSD state machine and reconciliation endpoint
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { processUssdInput, getInitialResponse, type SessionData } from "./stateMachine";

describe("USSD State Machine", () => {
  describe("getInitialResponse", () => {
    it("returns the main menu with CON type", () => {
      const response = getInitialResponse();
      expect(response.type).toBe("CON");
      expect(response.text).toContain("Welcome to EB Volt");
      expect(response.text).toContain("1. Pay for Charging");
      expect(response.text).toContain("2. Check Balance/Status");
      expect(response.text).toContain("3. Help");
    });
  });

  describe("main_menu state", () => {
    it("navigates to station selection on input 1", () => {
      const result = processUssdInput("main_menu", "1", {});
      expect(result.nextState).toBe("select_station");
      expect(result.response.type).toBe("CON");
      expect(result.response.text).toContain("Select charging station");
      expect(result.response.text).toContain("Accra East");
    });

    it("shows balance info and ends on input 2", () => {
      const result = processUssdInput("main_menu", "2", {});
      expect(result.response.type).toBe("END");
      expect(result.response.text).toContain("active");
    });

    it("shows help info and ends on input 3", () => {
      const result = processUssdInput("main_menu", "3", {});
      expect(result.response.type).toBe("END");
      expect(result.response.text).toContain("Help");
    });

    it("shows error on invalid input", () => {
      const result = processUssdInput("main_menu", "9", {});
      expect(result.nextState).toBe("main_menu");
      expect(result.response.type).toBe("CON");
      expect(result.response.text).toContain("Invalid option");
    });
  });

  describe("select_station state", () => {
    it("selects station 1 and moves to amount selection", () => {
      const result = processUssdInput("select_station", "1", {});
      expect(result.nextState).toBe("select_amount");
      expect(result.response.type).toBe("CON");
      expect(result.response.text).toContain("Select amount");
      expect(result.updatedData.stationId).toBe(1);
      expect(result.updatedData.stationName).toContain("Accra East");
    });

    it("rejects invalid station number", () => {
      const result = processUssdInput("select_station", "99", {});
      expect(result.nextState).toBe("select_station");
      expect(result.response.text).toContain("Invalid station");
    });

    it("rejects non-numeric input", () => {
      const result = processUssdInput("select_station", "abc", {});
      expect(result.nextState).toBe("select_station");
      expect(result.response.text).toContain("Invalid station");
    });
  });

  describe("select_amount state", () => {
    const stationData: SessionData = { stationId: 1, stationName: "Accra East (Lashibi)" };

    it("selects preset amount and moves to confirmation", () => {
      const result = processUssdInput("select_amount", "3", stationData); // GHS 50
      expect(result.nextState).toBe("confirm_payment");
      expect(result.response.type).toBe("CON");
      expect(result.response.text).toContain("GHS 50");
      expect(result.response.text).toContain("Confirm & Pay");
      expect(result.updatedData.amount).toBe("50");
    });

    it("accepts custom amount entry", () => {
      const result = processUssdInput("select_amount", "75", stationData);
      expect(result.nextState).toBe("confirm_payment");
      expect(result.updatedData.amount).toBe("75.00");
    });

    it("rejects amount over 1000", () => {
      const result = processUssdInput("select_amount", "5000", stationData);
      expect(result.nextState).toBe("select_amount");
      expect(result.response.text).toContain("Invalid amount");
    });

    it("rejects negative amount", () => {
      const result = processUssdInput("select_amount", "-10", stationData);
      expect(result.nextState).toBe("select_amount");
      expect(result.response.text).toContain("Invalid amount");
    });
  });

  describe("confirm_payment state", () => {
    const paymentData: SessionData = {
      stationId: 1,
      stationName: "Accra East (Lashibi)",
      amount: "50",
    };

    it("confirms payment on input 1", () => {
      const result = processUssdInput("confirm_payment", "1", paymentData);
      expect(result.nextState).toBe("payment_confirmed");
      expect(result.response.type).toBe("END");
      expect(result.response.text).toContain("Payment initiated");
      expect(result.response.text).toContain("GHS 50");
    });

    it("cancels payment on input 2", () => {
      const result = processUssdInput("confirm_payment", "2", paymentData);
      expect(result.nextState).toBe("main_menu");
      expect(result.response.type).toBe("END");
      expect(result.response.text).toContain("cancelled");
    });
  });

  describe("full flow simulation", () => {
    it("completes a full payment flow: menu -> station -> amount -> confirm", () => {
      // Step 1: Main menu -> Pay for Charging
      const step1 = processUssdInput("main_menu", "1", {});
      expect(step1.nextState).toBe("select_station");

      // Step 2: Select station 3 (Kumasi Central)
      const step2 = processUssdInput("select_station", "3", step1.updatedData);
      expect(step2.nextState).toBe("select_amount");
      expect(step2.updatedData.stationName).toContain("Kumasi");

      // Step 3: Select GHS 100
      const step3 = processUssdInput("select_amount", "4", step2.updatedData); // index 4 = GHS 100
      expect(step3.nextState).toBe("confirm_payment");
      expect(step3.updatedData.amount).toBe("100");

      // Step 4: Confirm
      const step4 = processUssdInput("confirm_payment", "1", step3.updatedData);
      expect(step4.nextState).toBe("payment_confirmed");
      expect(step4.response.type).toBe("END");
      expect(step4.response.text).toContain("Payment initiated");
    });
  });
});

// ---- Reconciliation endpoint tests ----
const mockGetDb = vi.fn();
vi.mock("../db", () => ({
  getDb: () => mockGetDb(),
}));

vi.mock("../../drizzle/schema", () => ({
  ussdSessions: { id: "id", sessionId: "session_id", msisdn: "msisdn", createdAt: "createdAt" },
  ussdPaymentIntents: {
    id: "id",
    referenceCode: "reference_code",
    status: "status",
    createdAt: "createdAt",
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: (col: any, val: any) => ({ col, val }),
  desc: (col: any) => ({ col, direction: "desc" }),
}));

vi.mock("nanoid", () => ({
  nanoid: () => "test12345678",
}));

import { ussdRouter } from "./routes";
import express from "express";
import request from "supertest";

function createUssdApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/ussd", ussdRouter);
  return app;
}

describe("POST /api/ussd/reconcile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when referenceCode is missing", async () => {
    const app = createUssdApp();
    const res = await request(app).post("/api/ussd/reconcile").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("referenceCode");
  });

  it("returns 404 when payment intent not found", async () => {
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });
    mockGetDb.mockResolvedValue({ select: mockSelect });

    const app = createUssdApp();
    const res = await request(app).post("/api/ussd/reconcile").send({
      referenceCode: "EBV-NOTFOUND",
      transactionId: "txn_123",
      status: "COMPLETED",
    });
    expect(res.status).toBe(404);
  });

  it("returns 200 for already-reconciled intent (idempotent)", async () => {
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: 1, referenceCode: "EBV-ABC123", status: "completed" }]),
        }),
      }),
    });
    mockGetDb.mockResolvedValue({ select: mockSelect });

    const app = createUssdApp();
    const res = await request(app).post("/api/ussd/reconcile").send({
      referenceCode: "EBV-ABC123",
      transactionId: "txn_456",
      status: "COMPLETED",
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Already reconciled");
  });

  it("updates intent to completed on successful reconciliation", async () => {
    const mockUpdate = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({}),
      }),
    });
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: 5, referenceCode: "EBV-XYZ789", status: "pending" }]),
        }),
      }),
    });
    mockGetDb.mockResolvedValue({ select: mockSelect, update: mockUpdate });

    const app = createUssdApp();
    const res = await request(app).post("/api/ussd/reconcile").send({
      referenceCode: "EBV-XYZ789",
      transactionId: "txn_789",
      status: "COMPLETED",
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe("completed");
  });

  it("updates intent to failed on failed reconciliation", async () => {
    const mockUpdate = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({}),
      }),
    });
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: 6, referenceCode: "EBV-FAIL01", status: "pending" }]),
        }),
      }),
    });
    mockGetDb.mockResolvedValue({ select: mockSelect, update: mockUpdate });

    const app = createUssdApp();
    const res = await request(app).post("/api/ussd/reconcile").send({
      referenceCode: "EBV-FAIL01",
      transactionId: "txn_fail",
      status: "FAILED",
    });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("failed");
  });
});
