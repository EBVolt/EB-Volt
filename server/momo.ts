/**
 * MTN Mobile Money (MoMo) Payment Service
 * Handles payment collection, disbursement, and transaction management
 * API Documentation: https://momodeveloper.mtn.com/
 */

import axios, { AxiosInstance } from "axios";
import { nanoid } from "nanoid";
import { ENV } from "./_core/env";

interface MoMoConfig {
  apiKey: string;
  primaryKey: string;
  secondaryKey?: string;
  userId: string;
  apiHost: string;
}

interface PaymentRequest {
  amount: string;
  currency: string;
  externalId: string;
  payer: {
    partyIdType: "MSISDN"; // Mobile phone number
    partyId: string; // Phone number in format 256701234567
  };
  payerMessage: string;
  payeeNote: string;
}

interface PaymentResponse {
  momoTransactionId: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  amount: string;
  currency: string;
  externalId: string;
  payer: {
    partyIdType: string;
    partyId: string;
  };
  timestamp: string;
}

interface TransactionStatus {
  status: "PENDING" | "COMPLETED" | "FAILED";
  amount: string;
  currency: string;
  externalId: string;
  financialTransactionId: string;
  reason?: string;
}

class MoMoPaymentService {
  private client: AxiosInstance;
  private config: MoMoConfig;
  private authToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: MoMoConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.apiHost,
      timeout: 30000,
    });
  }

  /**
   * Get or refresh authorization token
   * Required for all API calls
   */
  private async getAuthToken(): Promise<string> {
    // Return cached token if still valid
    if (this.authToken && Date.now() < this.tokenExpiry) {
      return this.authToken;
    }

    try {
      const response = await this.client.post(
        "/collection/v1_0/bc-authorize",
        {},
        {
          headers: {
            "X-Reference-Id": nanoid(),
            "Ocp-Apim-Subscription-Key": this.config.primaryKey,
            Authorization: `Basic ${Buffer.from(`${this.config.userId}:${this.config.apiKey}`).toString("base64")}`,
          },
        }
      );

      this.authToken = response.data.access_token || "";
      if (!this.authToken) {
        throw new Error("No access token in response");
      }
      // Token typically valid for 3600 seconds, refresh after 3500 seconds
      this.tokenExpiry = Date.now() + 3500 * 1000;

      return this.authToken;
    } catch (error) {
      console.error("[MoMo] Authorization failed:", error);
      throw new Error("Failed to authorize with MTN MoMo API");
    }
  }

  /**
   * Request payment from customer
   * Initiates a payment collection request to the customer's phone
   */
  async requestPayment(
    phoneNumber: string,
    amount: string,
    externalId: string,
    description: string
  ): Promise<{ transactionId: string; status: string }> {
    try {
      const token = await this.getAuthToken();
      const referenceId = nanoid();

      // Format phone number: remove +, add country code if needed
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const paymentRequest: PaymentRequest = {
        amount,
        currency: "GHS",
        externalId,
        payer: {
          partyIdType: "MSISDN",
          partyId: formattedPhone,
        },
        payerMessage: `EB Volt: ${description}`,
        payeeNote: "EB Volt Charging Payment",
      };

      const response = await this.client.post(
        "/collection/v1_0/requesttopay",
        paymentRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Reference-Id": referenceId,
            "Ocp-Apim-Subscription-Key": this.config.primaryKey,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        transactionId: referenceId,
        status: "PENDING",
      };
    } catch (error) {
      console.error("[MoMo] Payment request failed:", error);
      throw new Error("Failed to initiate payment request");
    }
  }

  /**
   * Check payment status
   * Polls the status of a payment request
   */
  async checkPaymentStatus(
    transactionId: string,
    externalId: string
  ): Promise<TransactionStatus> {
    try {
      const token = await this.getAuthToken();

      const response = await this.client.get(
        `/collection/v1_0/requesttopay/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Ocp-Apim-Subscription-Key": this.config.primaryKey,
          },
        }
      );

      return {
        status: response.data.status === "SUCCESSFUL" ? "COMPLETED" : response.data.status,
        amount: response.data.amount,
        currency: response.data.currency,
        externalId: response.data.externalId,
        financialTransactionId: response.data.financialTransactionId,
        reason: response.data.reason,
      };
    } catch (error) {
      console.error("[MoMo] Status check failed:", error);
      throw new Error("Failed to check payment status");
    }
  }

  /**
   * Transfer funds to a recipient (disbursement)
   * Used for refunds or payouts to drivers/partners
   */
  async transferFunds(
    phoneNumber: string,
    amount: string,
    externalId: string,
    description: string
  ): Promise<{ transactionId: string; status: string }> {
    try {
      const token = await this.getAuthToken();
      const referenceId = nanoid();
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const transferRequest = {
        amount,
        currency: "GHS",
        externalId,
        payee: {
          partyIdType: "MSISDN",
          partyId: formattedPhone,
        },
        payerMessage: `EB Volt: ${description}`,
        payeeNote: "EB Volt Transfer",
      };

      const response = await this.client.post(
        "/disbursement/v1_0/transfer",
        transferRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Reference-Id": referenceId,
            "Ocp-Apim-Subscription-Key": this.config.primaryKey,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        transactionId: referenceId,
        status: "PENDING",
      };
    } catch (error) {
      console.error("[MoMo] Transfer failed:", error);
      throw new Error("Failed to initiate transfer");
    }
  }

  /**
   * Get account balance
   * Check available balance in MoMo account
   */
  async getAccountBalance(): Promise<{ balance: string; currency: string }> {
    try {
      const token = await this.getAuthToken();

      const response = await this.client.get(
        "/collection/v1_0/account/balance",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Ocp-Apim-Subscription-Key": this.config.primaryKey,
          },
        }
      );

      return {
        balance: response.data.availableBalance,
        currency: response.data.currency,
      };
    } catch (error) {
      console.error("[MoMo] Balance check failed:", error);
      throw new Error("Failed to fetch account balance");
    }
  }

  /**
   * Format phone number for MoMo API
   * Converts various formats to standard MSISDN format
   */
  private formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, "");

    // If starts with 0, replace with country code 233 (Ghana)
    if (cleaned.startsWith("0")) {
      cleaned = "233" + cleaned.substring(1);
    }

    // If doesn't start with country code, assume Ghana (233)
    if (!cleaned.startsWith("233") && !cleaned.startsWith("+")) {
      cleaned = "233" + cleaned;
    }

    return cleaned;
  }
}

// Initialize MoMo service with environment variables
export function initializeMoMoService(): MoMoPaymentService {
  const config: MoMoConfig = {
    apiKey: process.env.MTN_MOMO_API_KEY || "",
    primaryKey: process.env.MTN_MOMO_PRIMARY_KEY || "",
    secondaryKey: process.env.MTN_MOMO_SECONDARY_KEY,
    userId: process.env.MTN_MOMO_USER_ID || "",
    apiHost: process.env.MTN_MOMO_API_HOST || "https://sandbox.momodeveloper.mtn.com",
  };

  if (!config.apiKey || !config.primaryKey || !config.userId) {
    throw new Error("Missing required MTN MoMo configuration");
  }

  return new MoMoPaymentService(config);
}

// Export singleton instance
let momoService: MoMoPaymentService | null = null;

export function getMoMoService(): MoMoPaymentService {
  if (!momoService) {
    momoService = initializeMoMoService();
  }
  return momoService;
}

export type { MoMoConfig, PaymentRequest, PaymentResponse, TransactionStatus };
