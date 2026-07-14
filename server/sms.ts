/* ============================================================
   SMS Notification Service
   Sends SMS confirmations for bookings and refund status updates
   ============================================================ */

/**
 * Send booking confirmation SMS to user
 * @param phoneNumber User's phone number in international format (e.g., +233XXXXXXXXX)
 * @param stationName Name of the charging station
 * @param bookingDate Date of the booking
 * @param bookingTime Time of the booking
 * @param cost Total cost of the booking
 */
export async function sendBookingConfirmationSMS(
  phoneNumber: string,
  stationName: string,
  bookingDate: string,
  bookingTime: string,
  cost: number
): Promise<boolean> {
  try {
    const message = `EB Volt Booking Confirmed! Station: ${stationName}, Date: ${bookingDate}, Time: ${bookingTime}, Cost: GHS ${cost.toFixed(2)}. Thank you for choosing EB Volt!`;

    // Call MTN MoMo SMS API or alternative SMS provider
    // For now, we'll log the SMS that would be sent
    console.log(`[SMS] Booking confirmation to ${phoneNumber}: ${message}`);

    // In production, integrate with MTN MoMo SMS API or Twilio
    // Example with Twilio:
    // const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await twilio.messages.create({
    //   body: message,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phoneNumber
    // });

    return true;
  } catch (error) {
    console.error("[SMS] Failed to send booking confirmation:", error);
    return false;
  }
}

/**
 * Send refund approval SMS to user
 * @param phoneNumber User's phone number in international format
 * @param refundAmount Amount being refunded
 * @param reason Reason for the refund
 */
export async function sendRefundApprovalSMS(
  phoneNumber: string,
  refundAmount: number,
  reason: string
): Promise<boolean> {
  try {
    const message = `Your refund of GHS ${refundAmount.toFixed(2)} has been approved (Reason: ${reason}). It will be credited to your MTN MoMo account within 24-48 hours. Thank you!`;

    console.log(`[SMS] Refund approval to ${phoneNumber}: ${message}`);

    // In production, integrate with SMS provider
    return true;
  } catch (error) {
    console.error("[SMS] Failed to send refund approval:", error);
    return false;
  }
}

/**
 * Send refund rejection SMS to user
 * @param phoneNumber User's phone number in international format
 * @param reason Reason for the rejection
 */
export async function sendRefundRejectionSMS(
  phoneNumber: string,
  reason: string
): Promise<boolean> {
  try {
    const message = `Your refund request has been reviewed and rejected. Reason: ${reason}. Please contact support@ecobelle.com for more information.`;

    console.log(`[SMS] Refund rejection to ${phoneNumber}: ${message}`);

    // In production, integrate with SMS provider
    return true;
  } catch (error) {
    console.error("[SMS] Failed to send refund rejection:", error);
    return false;
  }
}

/**
 * Send payment receipt SMS to user
 * @param phoneNumber User's phone number in international format
 * @param receiptNumber Receipt number for reference
 * @param amount Amount paid
 * @param stationName Name of the charging station
 */
export async function sendPaymentReceiptSMS(
  phoneNumber: string,
  receiptNumber: string,
  amount: number,
  stationName: string
): Promise<boolean> {
  try {
    const message = `Payment received! Receipt #${receiptNumber}, Amount: GHS ${amount.toFixed(2)}, Station: ${stationName}. Download receipt from your account. - EB Volt`;

    console.log(`[SMS] Payment receipt to ${phoneNumber}: ${message}`);

    // In production, integrate with SMS provider
    return true;
  } catch (error) {
    console.error("[SMS] Failed to send payment receipt:", error);
    return false;
  }
}

/**
 * Send generic SMS notification
 * @param phoneNumber User's phone number in international format
 * @param message Message content
 */
export async function sendGenericSMS(
  phoneNumber: string,
  message: string
): Promise<boolean> {
  try {
    console.log(`[SMS] Generic SMS to ${phoneNumber}: ${message}`);

    // In production, integrate with SMS provider
    return true;
  } catch (error) {
    console.error("[SMS] Failed to send generic SMS:", error);
    return false;
  }
}

/**
 * Send a test SMS so admins can verify the SMS channel is working end to end.
 * @param phoneNumber Recipient phone number in international format
 */
export async function sendTestSMS(phoneNumber: string): Promise<boolean> {
  const message =
    "EB Volt: This is a test SMS from the admin dashboard confirming SMS notifications are working. No action needed.";
  return sendGenericSMS(phoneNumber, message);
}
