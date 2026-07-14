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
  getDailyRevenue,
  getTopPerformingStations,
  getRevenueMetrics,
} from "./db";
import { getMoMoService } from "./momo";
import { nanoid } from "nanoid";
import { getUserById } from "./db";

import {
  dispatchBookingConfirmation,
  dispatchPaymentReceipt,
  dispatchRefundStatus,
} from "./notificationDispatcher";


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
          origin: z.string().optional(),
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

        const station = await getChargingStationById(input.stationId);
        const user = await getUserById(ctx.user.id);

        if (station && user) {
          const resDate = new Date(input.reservationDate).toLocaleDateString();
          const resTime = new Date(input.reservationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const bookingReference = `RES-${(reservation as any).insertId}`;

          // Dispatch booking confirmation across channels (preference-aware + logged)
          await dispatchBookingConfirmation({
            userId: user.id,
            origin: input.origin,
            email: {
              userEmail: user.email || "customer@ecobellevolt.com",
              userName: user.name || "Valued Customer",
              stationName: station.name,
              stationAddress: station.location,
              reservationDate: resDate,
              reservationTime: resTime,
              duration: input.durationMinutes / 60,
              chargerType: station.chargerType,
              totalCost: parseFloat(input.estimatedCost),
              currency: "GHS",
              paymentMethod: "MTN_MOMO",
              bookingReference,
            },
            sms: user.phoneNumber
              ? {
                  phoneNumber: user.phoneNumber,
                  stationName: station.name,
                  bookingDate: resDate,
                  bookingTime: resTime,
                  cost: parseFloat(input.estimatedCost),
                }
              : undefined,
          }).catch(err => console.error("[Notify] Failed to dispatch booking confirmation:", err));
        }

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
      .input(z.object({ referenceId: z.string(), origin: z.string().optional() }))
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

            // Send payment receipt email and SMS when completed
            if (newStatus === "completed") {
              const user = await getUserById(transaction.userId);
              const reservation = await getReservationById(transaction.reservationId);
              const station = reservation ? await getChargingStationById(reservation.stationId) : null;

              if (user) {
                await dispatchPaymentReceipt({
                  userId: user.id,
                  origin: input.origin,
                  email: user.email
                    ? {
                        userEmail: user.email,
                        userName: user.name || "Valued Customer",
                        bookingReference: input.referenceId,
                        amount: parseFloat(transaction.amount),
                        currency: transaction.currency,
                        paymentMethod: transaction.paymentMethod,
                        transactionId: transaction.transactionId || "",
                        timestamp: new Date().toISOString(),
                        stationName: station?.name || "EB Volt Station",
                      }
                    : undefined,
                  sms: user.phoneNumber
                    ? {
                        phoneNumber: user.phoneNumber,
                        receiptNumber: input.referenceId,
                        amount: parseFloat(transaction.amount),
                        stationName: station?.name || "EB Volt Station",
                      }
                    : undefined,
                }).catch(err => console.error("[Notify] Failed to dispatch payment receipt:", err));
              }
            }
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

    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return getUserById(ctx.user.id);
    }),

    updateProfile: protectedProcedure
      .input(
        z.object({
          name: z.string().optional(),
          email: z.string().email().optional(),
          phoneNumber: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { updateUserProfile } = await import("./db");
        await updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),

    getNotificationPreferences: protectedProcedure.query(async ({ ctx }) => {
      const user = await getUserById(ctx.user.id);
      if (!user) throw new Error("User not found");
      return {
        emailBookingConfirmation: user.emailBookingConfirmation,
        emailPaymentReceipt: user.emailPaymentReceipt,
        emailRefundStatus: user.emailRefundStatus,
        emailPromotions: user.emailPromotions,
        smsBookingConfirmation: user.smsBookingConfirmation,
        smsPaymentReceipt: user.smsPaymentReceipt,
        smsRefundStatus: user.smsRefundStatus,
        smsPromotions: user.smsPromotions,
      };
    }),

    getUnsubscribeInfo: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const { getUserByUnsubscribeToken } = await import("./db");
        const user = await getUserByUnsubscribeToken(input.token);
        if (!user) {
          return { valid: false as const };
        }
        return {
          valid: true as const,
          email: user.email,
          preferences: {
            emailBookingConfirmation: user.emailBookingConfirmation,
            emailPaymentReceipt: user.emailPaymentReceipt,
            emailRefundStatus: user.emailRefundStatus,
            emailPromotions: user.emailPromotions,
            smsBookingConfirmation: user.smsBookingConfirmation,
            smsPaymentReceipt: user.smsPaymentReceipt,
            smsRefundStatus: user.smsRefundStatus,
            smsPromotions: user.smsPromotions,
          },
        };
      }),

    unsubscribe: publicProcedure
      .input(
        z.object({
          token: z.string(),
          category: z.enum([
            "booking_confirmation",
            "payment_receipt",
            "refund_status",
            "promotions",
            "all",
          ]),
          channel: z.enum(["email", "sms"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { getUserByUnsubscribeToken, applyUnsubscribe } = await import("./db");
        const user = await getUserByUnsubscribeToken(input.token);
        if (!user) {
          throw new Error("Invalid or expired unsubscribe link");
        }
        await applyUnsubscribe(user.id, input.category, input.channel);
        return { success: true };
      }),

    resubscribe: publicProcedure
      .input(
        z.object({
          token: z.string(),
          category: z.enum([
            "booking_confirmation",
            "payment_receipt",
            "refund_status",
            "promotions",
            "all",
          ]),
          channel: z.enum(["email", "sms"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { getUserByUnsubscribeToken, applyResubscribe } = await import("./db");
        const user = await getUserByUnsubscribeToken(input.token);
        if (!user) {
          throw new Error("Invalid or expired link");
        }
        await applyResubscribe(user.id, input.category, input.channel);
        return { success: true };
      }),

    updateNotificationPreferences: protectedProcedure
      .input(
        z.object({
          emailBookingConfirmation: z.boolean().optional(),
          emailPaymentReceipt: z.boolean().optional(),
          emailRefundStatus: z.boolean().optional(),
          emailPromotions: z.boolean().optional(),
          smsBookingConfirmation: z.boolean().optional(),
          smsPaymentReceipt: z.boolean().optional(),
          smsRefundStatus: z.boolean().optional(),
          smsPromotions: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { updateNotificationPreferences } = await import("./db");
        await updateNotificationPreferences(ctx.user.id, input);
        return { success: true };
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

    getNotificationMetrics: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }
      const { getNotificationMetrics } = await import("./db");
      return getNotificationMetrics();
    }),

    getNotificationLogs: protectedProcedure
      .input(
        z.object({
          limit: z.number().min(1).max(500).optional(),
          channel: z.enum(["email", "sms"]).optional(),
          status: z.enum(["sent", "failed", "skipped"]).optional(),
          startDate: z.number().optional(),
          endDate: z.number().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        const { getNotificationLogs } = await import("./db");
        return getNotificationLogs({
          limit: input.limit,
          channel: input.channel,
          status: input.status,
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          endDate: input.endDate ? new Date(input.endDate) : undefined,
        });
      }),

    sendTestNotification: protectedProcedure
      .input(z.object({ channel: z.enum(["email", "sms"]) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        const { logNotification, getUserById } = await import("./db");
        const admin = await getUserById(ctx.user.id);

        if (input.channel === "email") {
          const recipient = admin?.email || ctx.user.email;
          if (!recipient) {
            throw new Error("No email address on file for your admin account");
          }
          const { sendTestEmail } = await import("./email");
          const ok = await sendTestEmail(recipient, admin?.name || "Admin");
          await logNotification({
            userId: ctx.user.id,
            channel: "email",
            category: "promotions",
            recipient,
            status: ok ? "sent" : "failed",
            subject: "Test Email Notification",
            errorMessage: ok ? undefined : "Provider returned a failure",
          });
          return { success: ok, recipient };
        }

        const recipient = admin?.phoneNumber;
        if (!recipient) {
          throw new Error("No phone number on file. Add one in Profile Settings to test SMS.");
        }
        const { sendTestSMS } = await import("./sms");
        const ok = await sendTestSMS(recipient);
        await logNotification({
          userId: ctx.user.id,
          channel: "sms",
          category: "promotions",
          recipient,
          status: ok ? "sent" : "failed",
          subject: "Test SMS Notification",
          errorMessage: ok ? undefined : "Provider returned a failure",
        });
        return { success: ok, recipient };
      }),

    approveRefund: protectedProcedure
      .input(z.object({
        refundId: z.number(),
        approvalNotes: z.string().optional(),
        origin: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        const { updateRefundStatus, getRefundRequest, getUserById } = await import("./db");
        const refund = await getRefundRequest(input.refundId);
        if (!refund) throw new Error("Refund not found");
        
        await updateRefundStatus(input.refundId, "approved", ctx.user.id, input.approvalNotes);
        
        // Dispatch approval notification (preference-aware + logged)
        try {
          const user = await getUserById(refund.userId);
          if (user) {
            await dispatchRefundStatus({
              userId: user.id,
              origin: input.origin,
              status: "approved",
              email: user.email
                ? {
                    userEmail: user.email,
                    userName: user.name || "Valued Customer",
                    bookingReference: `RES-${refund.reservationId}`,
                    refundAmount: parseFloat(refund.refundAmount),
                    currency: "GHS",
                    status: "approved",
                  }
                : undefined,
              sms: user.phoneNumber
                ? {
                    phoneNumber: user.phoneNumber,
                    refundAmount: parseFloat(refund.refundAmount),
                    reason: input.approvalNotes || "Refund approved",
                  }
                : undefined,
            });
          }
        } catch (err) {
          console.error("[Refund] Error sending approval notifications:", err);
        }
        
        return { success: true };
      }),

    rejectRefund: protectedProcedure
      .input(z.object({
        refundId: z.number(),
        rejectionReason: z.string(),
        origin: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        const { updateRefundStatus, getRefundRequest, getUserById } = await import("./db");
        const refund = await getRefundRequest(input.refundId);
        if (!refund) throw new Error("Refund not found");
        
        await updateRefundStatus(input.refundId, "rejected", ctx.user.id, input.rejectionReason);
        
        // Dispatch rejection notification (preference-aware + logged)
        try {
          const user = await getUserById(refund.userId);
          if (user) {
            await dispatchRefundStatus({
              userId: user.id,
              origin: input.origin,
              status: "rejected",
              email: user.email
                ? {
                    userEmail: user.email,
                    userName: user.name || "Valued Customer",
                    bookingReference: `RES-${refund.reservationId}`,
                    refundAmount: parseFloat(refund.refundAmount),
                    currency: "GHS",
                    status: "rejected",
                    reason: input.rejectionReason,
                  }
                : undefined,
              sms: user.phoneNumber
                ? {
                    phoneNumber: user.phoneNumber,
                    refundAmount: parseFloat(refund.refundAmount),
                    reason: input.rejectionReason,
                  }
                : undefined,
            });
          }
        } catch (err) {
          console.error("[Refund] Error sending rejection notifications:", err);
        }
        
        return { success: true };
      }),

    getDailyRevenue: protectedProcedure
      .input(z.object({ days: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        return getDailyRevenue(input.days || 30);
      }),

    getTopPerformingStations: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        return getTopPerformingStations(input.limit || 10);
      }),

    getRevenueMetrics: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }
      return getRevenueMetrics();
    }),
  }),
});

export type AppRouter = typeof appRouter;
