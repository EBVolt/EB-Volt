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
});

export type AppRouter = typeof appRouter;
