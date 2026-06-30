import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getChargingStations,
  getChargingStationById,
  createReservation,
  getReservationById,
  getUserReservations,
  createPaymentTransaction,
  getPaymentTransaction,
  getPaymentByReferenceId,
  updatePaymentStatus,
  createRefundRequest,
  getRefundRequest,
  getUserRefundRequests,
  updateRefundStatus,
  createReceipt,
  getReceipt,
  getReceiptByNumber,
  getUserReceipts,
  incrementReceiptDownloadCount,
} from "./db";
import { getMoMoService } from "./momo";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  charging: router({
    getStations: publicProcedure.query(async () => {
      return getChargingStations();
    }),

    getStationById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getChargingStationById(input.id);
      }),

    createReservation: protectedProcedure
      .input(
        z.object({
          stationId: z.number(),
          reservationDate: z.date(),
          durationMinutes: z.number(),
          estimatedCost: z.string(),
          phoneNumber: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const reservation = await createReservation({
          userId: ctx.user.id,
          stationId: input.stationId,
          reservationDate: input.reservationDate,
          durationMinutes: input.durationMinutes,
          estimatedCost: input.estimatedCost,
          phoneNumber: input.phoneNumber,
          status: "pending",
        });
        return reservation;
      }),

    getUserReservations: protectedProcedure.query(async ({ ctx }) => {
      return getUserReservations(ctx.user.id);
    }),
  }),

  payment: router({
    initiatePayment: protectedProcedure
      .input(
        z.object({
          reservationId: z.number(),
          amount: z.string(),
          phoneNumber: z.string(),
          description: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          const momo = getMoMoService();
          const referenceId = nanoid();

          // Create payment transaction record
          const transaction = await createPaymentTransaction({
            reservationId: input.reservationId,
            userId: ctx.user.id,
            amount: input.amount,
            currency: "GHS",
            phoneNumber: input.phoneNumber,
            referenceId,
            status: "pending",
            paymentMethod: "MTN_MOMO",
          });

          // Request payment from MoMo
          const momoResponse = await momo.requestPayment(
            input.phoneNumber,
            input.amount,
            referenceId,
            input.description
          );

          // Update transaction with MoMo transaction ID
          await updatePaymentStatus(
            (transaction as any).insertId as number,
            "processing",
            momoResponse.transactionId
          );

          return {
            success: true,
            transactionId: momoResponse.transactionId,
            referenceId,
            message: "Payment request sent to your phone",
          };
        } catch (error) {
          console.error("[Payment] Initiation failed:", error);
          throw new Error("Failed to initiate payment");
        }
      }),

    checkPaymentStatus: protectedProcedure
      .input(z.object({ referenceId: z.string() }))
      .query(async ({ input }) => {
        try {
          const transaction = await getPaymentByReferenceId(input.referenceId);
          if (!transaction) {
            throw new Error("Payment not found");
          }

          const momo = getMoMoService();
          const status = await momo.checkPaymentStatus(
            transaction.transactionId || "",
            input.referenceId
          );

          // Update transaction status if changed
          const newStatus = status.status === "COMPLETED" ? "completed" : status.status === "FAILED" ? "failed" : "pending";
          if (newStatus !== transaction.status) {
            await updatePaymentStatus(
              transaction.id,
              newStatus
            );
          }

          return {
            status: status.status,
            amount: status.amount,
            currency: status.currency,
          };
        } catch (error) {
          console.error("[Payment] Status check failed:", error);
          throw new Error("Failed to check payment status");
        }
      }),

    getTransaction: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const transaction = await getPaymentTransaction(input.id);
        if (!transaction || transaction.userId !== ctx.user.id) {
          throw new Error("Transaction not found or unauthorized");
        }
        return transaction;
      }),
  }),

  account: router({
    getReservationHistory: protectedProcedure
      .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        const reservations = await getUserReservations(ctx.user.id);
        const limit = input?.limit || 10;
        const offset = input?.offset || 0;
        return reservations.slice(offset, offset + limit);
      }),

    getReceiptHistory: protectedProcedure
      .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        const receipts = await getUserReceipts(ctx.user.id);
        const limit = input?.limit || 10;
        const offset = input?.offset || 0;
        return receipts.slice(offset, offset + limit);
      }),

    downloadReceipt: protectedProcedure
      .input(z.object({ receiptId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const receipt = await getReceipt(input.receiptId);
        if (!receipt || receipt.userId !== ctx.user.id) {
          throw new Error("Receipt not found or unauthorized");
        }
        await incrementReceiptDownloadCount(input.receiptId);
        return { success: true, url: receipt.receiptUrl };
      }),
  }),

  refund: router({
    requestRefund: protectedProcedure
      .input(
        z.object({
          reservationId: z.number(),
          reason: z.string().min(10, "Reason must be at least 10 characters"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          const reservation = await getReservationById(input.reservationId);
          if (!reservation || reservation.userId !== ctx.user.id) {
            throw new Error("Reservation not found or unauthorized");
          }

          // Get the associated payment transaction
          const payment = await getPaymentTransaction(reservation.id);
          if (!payment) {
            throw new Error("Payment not found for this reservation");
          }

          // Create refund request
          const refundRequest = await createRefundRequest({
            paymentTransactionId: payment.id,
            reservationId: input.reservationId,
            userId: ctx.user.id,
            refundAmount: payment.amount,
            reason: input.reason,
            status: "pending",
          });

          return {
            success: true,
            refundId: (refundRequest as any).insertId,
            message: "Refund request submitted. We will process it within 24 hours.",
          };
        } catch (error) {
          console.error("[Refund] Request failed:", error);
          throw new Error("Failed to request refund");
        }
      }),

    getRefundStatus: protectedProcedure
      .input(z.object({ refundId: z.number() }))
      .query(async ({ ctx, input }) => {
        const refund = await getRefundRequest(input.refundId);
        if (!refund || refund.userId !== ctx.user.id) {
          throw new Error("Refund not found or unauthorized");
        }
        return refund;
      }),

    getUserRefunds: protectedProcedure.query(async ({ ctx }) => {
      return getUserRefundRequests(ctx.user.id);
    }),
  }),

  admin: router({
    getChargerStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }
      const { getChargerStats } = await import("./db");
      return getChargerStats();
    }),

    getAllChargers: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }
      const { getAllChargingStations } = await import("./db");
      return getAllChargingStations();
    }),

    updateChargerStatus: protectedProcedure
      .input(z.object({
        stationId: z.number(),
        newStatus: z.enum(["available", "busy", "offline", "maintenance"]),
        reason: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        const { updateChargerStatus } = await import("./db");
        return updateChargerStatus(
          input.stationId,
          input.newStatus,
          ctx.user.id,
          input.reason
        );
      }),

    getChargerLogs: protectedProcedure
      .input(z.object({ stationId: z.number() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        const { getChargerStatusLogs } = await import("./db");
        return getChargerStatusLogs(input.stationId);
      }),

    getAllRefunds: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }
      const { getAllRefunds } = await import("./db");
      return getAllRefunds();
    }),

    approveRefund: protectedProcedure
      .input(z.object({
        refundId: z.number(),
        approvalNotes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        const { updateRefundStatus, getRefundRequest } = await import("./db");
        const refund = await getRefundRequest(input.refundId);
        if (!refund) throw new Error("Refund not found");
        await updateRefundStatus(input.refundId, "approved", ctx.user.id, input.approvalNotes);
        return { success: true };
      }),

    rejectRefund: protectedProcedure
      .input(z.object({
        refundId: z.number(),
        rejectionReason: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        const { updateRefundStatus } = await import("./db");
        await updateRefundStatus(input.refundId, "rejected", ctx.user.id, input.rejectionReason);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;


// Note: Analytics endpoints added separately to avoid JSON parsing issues
// Add these to the admin router in routers.ts:
// getDailyRevenue, getTopPerformingStations, getRevenueMetrics
