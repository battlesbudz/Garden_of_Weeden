/**
 * Paybotic Payment Provider
 * 
 * Cannabis-friendly ACH and PIN debit payment processor.
 * https://paybotic.com
 * 
 * To set up:
 * 1. Apply for a merchant account at https://paybotic.com
 * 2. Request API credentials from Paybotic
 * 3. Add credentials as secrets:
 *    - PAYBOTIC_API_KEY
 *    - PAYBOTIC_MERCHANT_ID
 *    - PAYBOTIC_WEBHOOK_SECRET (optional, for webhook verification)
 */

import type {
  PaymentProvider,
  CreatePaymentRequest,
  PaymentResult,
  PaymentStatusResult,
  RefundRequest,
  RefundResult,
} from '../provider-interface';
import { createHmac, timingSafeEqual } from "crypto";

export class PayboticProvider implements PaymentProvider {
  name = 'paybotic';
  
  private apiKey: string | undefined;
  private merchantId: string | undefined;
  private webhookSecret: string | undefined;
  private baseUrl: string;
  private isInitialized = false;

  constructor() {
    // Paybotic API base URL - update when you receive actual API documentation
    this.baseUrl = process.env.PAYBOTIC_API_URL || 'https://api.paybotic.com/v1';
  }

  async initialize(): Promise<void> {
    this.apiKey = process.env.PAYBOTIC_API_KEY;
    this.merchantId = process.env.PAYBOTIC_MERCHANT_ID;
    this.webhookSecret = process.env.PAYBOTIC_WEBHOOK_SECRET;
    this.isInitialized = true;
  }

  isConfigured(): boolean {
    return !!(this.apiKey && this.merchantId);
  }

  async createPayment(request: CreatePaymentRequest): Promise<PaymentResult> {
    if (!this.isConfigured()) {
      // Return sandbox-like response when not configured
      console.log('[Paybotic] Not configured - returning pending payment for order:', request.orderId);
      return {
        success: true,
        transactionId: `paybotic_pending_${request.orderId}_${Date.now()}`,
        status: 'pending',
        message: 'Payment created - awaiting Paybotic configuration. Please set up your Paybotic merchant account.',
      };
    }

    try {
      // When Paybotic API is available, implement actual API call here
      // This is a placeholder for the actual implementation
      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Merchant-Id': this.merchantId!,
        },
        body: JSON.stringify({
          amount: request.amount,
          currency: request.currency,
          payment_method: request.paymentMethod,
          customer: {
            email: request.customer.email,
            name: request.customer.name,
            phone: request.customer.phone,
            address: request.customer.address,
          },
          order_id: request.orderId.toString(),
          line_items: request.lineItems.map(item => ({
            product_id: item.productId.toString(),
            name: item.name,
            quantity: item.quantity,
            unit_price: item.unitPrice,
          })),
          metadata: request.metadata,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          status: 'failed',
          error: {
            code: error.code || 'PAYMENT_FAILED',
            message: error.message || 'Payment failed',
          },
        };
      }

      const data = await response.json();
      return {
        success: true,
        transactionId: data.transaction_id,
        status: data.status === 'completed' ? 'completed' : 'processing',
        message: data.message,
        redirectUrl: data.redirect_url,
      };
    } catch (error) {
      console.error('[Paybotic] Payment error:', error);
      return {
        success: false,
        status: 'failed',
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error occurred',
        },
      };
    }
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentStatusResult> {
    if (!this.isConfigured()) {
      // Return placeholder status when not configured
      return {
        transactionId,
        status: 'pending',
        amount: 0,
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/payments/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Merchant-Id': this.merchantId!,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get payment status');
      }

      const data = await response.json();
      return {
        transactionId: data.transaction_id,
        status: data.status,
        amount: data.amount,
        paidAt: data.paid_at ? new Date(data.paid_at) : undefined,
      };
    } catch (error) {
      console.error('[Paybotic] Status check error:', error);
      return {
        transactionId,
        status: 'pending',
        amount: 0,
      };
    }
  }

  async refund(request: RefundRequest): Promise<RefundResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        status: 'failed',
        error: {
          code: 'NOT_CONFIGURED',
          message: 'Paybotic is not configured',
        },
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/refunds`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Merchant-Id': this.merchantId!,
        },
        body: JSON.stringify({
          transaction_id: request.transactionId,
          amount: request.amount,
          reason: request.reason,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          status: 'failed',
          error: {
            code: error.code || 'REFUND_FAILED',
            message: error.message || 'Refund failed',
          },
        };
      }

      const data = await response.json();
      return {
        success: true,
        refundId: data.refund_id,
        status: data.status,
        message: data.message,
      };
    } catch (error) {
      console.error('[Paybotic] Refund error:', error);
      return {
        success: false,
        status: 'failed',
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error occurred',
        },
      };
    }
  }

  async handleWebhook(payload: unknown, signature?: string): Promise<{
    eventType: string;
    transactionId?: string;
    orderId?: number;
    status?: string;
  }> {
    if (this.webhookSecret) {
      if (!signature) {
        throw new Error("Missing payment webhook signature");
      }

      const rawPayload = typeof payload === "string" ? payload : JSON.stringify(payload);
      const provided = signature.replace("sha256=", "");
      const expected = createHmac("sha256", this.webhookSecret).update(rawPayload).digest("hex");

      const expectedBuffer = Buffer.from(expected, "utf8");
      const providedBuffer = Buffer.from(provided, "utf8");
      if (expectedBuffer.length !== providedBuffer.length || !timingSafeEqual(expectedBuffer, providedBuffer)) {
        throw new Error("Invalid payment webhook signature");
      }
    }

    const data = typeof payload === "string" 
      ? JSON.parse(payload) as Record<string, unknown>
      : payload as Record<string, unknown>;
    return {
      eventType: data.event_type as string || 'unknown',
      transactionId: data.transaction_id as string,
      orderId: parseOrderId(data.order_id),
      status: data.status as string,
    };
  }
}

function parseOrderId(orderId: unknown): number | undefined {
  if (typeof orderId === "number" && Number.isInteger(orderId)) return orderId;
  if (typeof orderId === "string") {
    const parsed = parseInt(orderId, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}
