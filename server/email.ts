/**
 * Email Service Module
 * Sends booking confirmation and payment receipt emails via Manus notification API
 */

import { notifyOwner } from "./_core/notification";

export interface BookingConfirmationData {
  unsubscribeUrl?: string;
  userEmail: string;
  userName: string;
  stationName: string;
  stationAddress: string;
  reservationDate: string;
  reservationTime: string;
  duration: number;
  chargerType: string;
  totalCost: number;
  currency: string;
  paymentMethod: string;
  bookingReference: string;
}

export interface PaymentReceiptData {
  unsubscribeUrl?: string;
  userEmail: string;
  userName: string;
  bookingReference: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  timestamp: string;
  stationName: string;
}

export interface RefundNotificationData {
  userEmail: string;
  userName: string;
  bookingReference: string;
  refundAmount: number;
  currency: string;
  status: "approved" | "rejected";
  reason?: string;
  unsubscribeUrl?: string;
}

/**
 * Builds a standard unsubscribe footer appended to transactional emails.
 */
function unsubscribeFooter(url?: string): string {
  if (!url) return "";
  return `\n\n----------------------------------------\nDon't want to receive these emails? You can update your notification preferences or unsubscribe here:\n${url}\n`;
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmationEmail(data: BookingConfirmationData): Promise<boolean> {
  try {
    const emailContent = `
Dear ${data.userName},

Your EcoBelle Volt charging reservation has been confirmed!

BOOKING DETAILS
Booking Reference: ${data.bookingReference}
Station: ${data.stationName}
Address: ${data.stationAddress}
Date: ${data.reservationDate}
Time: ${data.reservationTime}
Duration: ${data.duration} hours
Charger Type: ${data.chargerType}

PAYMENT SUMMARY
Amount: ${data.currency} ${data.totalCost.toFixed(2)}
Payment Method: ${data.paymentMethod}

Next Steps:
1. Arrive at the station 10 minutes before your reservation time
2. Use your booking reference to access the charger
3. Keep your phone handy for any updates

If you need to cancel or modify your reservation, please visit your account dashboard or contact our support team at +233 59 560 2717.

Thank you for choosing EcoBelle Volt. Together, we're powering a greener Ghana!

Best regards,
EcoBelle Volt Team
Charge Green. Drive Clean.
${unsubscribeFooter(data.unsubscribeUrl)}
    `;

    // Send via Manus notification API
    const result = await notifyOwner({
      title: `Booking Confirmation: ${data.bookingReference}`,
      content: emailContent,
    });

    if (result) {
      console.log(`[Email] Booking confirmation sent to ${data.userEmail}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("[Email] Failed to send booking confirmation:", error);
    return false;
  }
}

/**
 * Send payment receipt email
 */
export async function sendPaymentReceiptEmail(data: PaymentReceiptData): Promise<boolean> {
  try {
    const emailContent = `
Dear ${data.userName},

Your payment has been received and processed successfully!

PAYMENT RECEIPT
Transaction ID: ${data.transactionId}
Booking Reference: ${data.bookingReference}
Amount: ${data.currency} ${data.amount.toFixed(2)}
Payment Method: ${data.paymentMethod}
Date: ${data.timestamp}
Station: ${data.stationName}

Your receipt has been saved to your account dashboard and is available for download at any time.

If you have any questions about this charge, please contact our support team at +233 59 560 2717 or email support@ecobellevolt.com.

Thank you for your business!

Best regards,
EcoBelle Volt Team
Charge Green. Drive Clean.
${unsubscribeFooter(data.unsubscribeUrl)}
    `;

    const result = await notifyOwner({
      title: `Payment Receipt: ${data.transactionId}`,
      content: emailContent,
    });

    if (result) {
      console.log(`[Email] Payment receipt sent to ${data.userEmail}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("[Email] Failed to send payment receipt:", error);
    return false;
  }
}

/**
 * Send refund notification email
 */
export async function sendRefundNotificationEmail(data: RefundNotificationData): Promise<boolean> {
  try {
    const statusMessage = data.status === "approved"
      ? `Your refund of ${data.currency} ${data.refundAmount.toFixed(2)} has been approved and will be processed to your original payment method within 3-5 business days.`
      : `Your refund request has been reviewed and unfortunately could not be processed. Reason: ${data.reason || "Does not meet refund criteria"}`;

    const emailContent = `
Dear ${data.userName},

We have an update regarding your refund request.

REFUND STATUS: ${data.status.toUpperCase()}
Booking Reference: ${data.bookingReference}
Refund Amount: ${data.currency} ${data.refundAmount.toFixed(2)}

${statusMessage}

If you have any questions about this decision, please contact our support team at +233 59 560 2717 or email support@ecobellevolt.com.

Best regards,
EcoBelle Volt Team
Charge Green. Drive Clean.
${unsubscribeFooter(data.unsubscribeUrl)}
    `;

    const result = await notifyOwner({
      title: `Refund ${data.status === "approved" ? "Approved" : "Rejected"}: ${data.bookingReference}`,
      content: emailContent,
    });

    if (result) {
      console.log(`[Email] Refund notification sent to ${data.userEmail}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("[Email] Failed to send refund notification:", error);
    return false;
  }
}

/**
 * Send support ticket confirmation
 */
export async function sendSupportTicketEmail(
  userEmail: string,
  userName: string,
  ticketId: string,
  subject: string
): Promise<boolean> {
  try {
    const emailContent = `
Dear ${userName},

Thank you for contacting EcoBelle Volt support. We have received your inquiry and assigned it ticket ID: ${ticketId}.

Subject: ${subject}

Our support team will review your request and respond within 24 hours. You can check the status of your ticket anytime by logging into your account dashboard.

For urgent matters, please call us at +233 59 560 2717.

Best regards,
EcoBelle Volt Support Team
Charge Green. Drive Clean.
    `;

    const result = await notifyOwner({
      title: `Support Ticket Confirmation: ${ticketId}`,
      content: emailContent,
    });

    if (result) {
      console.log(`[Email] Support ticket confirmation sent to ${userEmail}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("[Email] Failed to send support ticket email:", error);
    return false;
  }
}
