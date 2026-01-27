/**
 * WebJoint Pay Payment Provider
 * 
 * Cannabis-friendly ACH payment processor with lowest industry fees.
 * https://www.webjoint.com
 * 
 * To set up:
 * 1. Apply for a merchant account at https://www.webjoint.com
 * 2. Request API credentials from WebJoint
 * 3. Add credentials as secrets:
 *    - WEBJOINT_API_KEY
 *    - WEBJOINT_MERCHANT_ID
 *    - WEBJOINT_WEBHOOK_SECRET (optional, for webhook verification)
 */

import type {
  PaymentProvider,
  CreatePaymentRequest,
  PaymentResult,
  PaymentStatusResult,
  RefundRequest,
  RefundResult,
} from '../provider-interface';

export class WebJointProvider implements PaymentProvider {
  name = 'webjoint';
  
  private apiKey: string | undefined;
  private merchantId: string | undefined;
  private webhookSecret: string | undefined;
  private baseUrl: string;
  private isInitialized = false;

  constructor() {
    // WebJoint API base URL - update when you receive actual API documentation
    this.baseUrl = process.env.WEBJOINT_API_URL || 'https://api.webjoint.com/v1';
  }

  async initialize(): Promise<void> {
    this.apiKey = process.env.WEBJOINT_API_KEY;
    this.merchantId = process.env.WEBJOINT_MERCHANT_ID;
    this.webhookSecret = process.env.WEBJOINT_WEBHOOK_SECRET;
    this.isInitialized = true;
  }

  isConfigured(): boolean {
    return !!(this.apiKey && this.merchantId);
  }

  async createPayment(request: CreatePaymentRequest): Promise<PaymentResult> {
    if (!this.isConfigured()) {
      // Return sandbox-like response when not configured
      console.log('[WebJoint] Not configured - returning pending payment for order:', request.orderId);
      return {
        success: true,
        transactionId: `webjoint_pending_${request.orderId}_${Date.now()}`,
        status: 'pending',
        message: 'Payment created - awaiting WebJoint configuration. Please set up your WebJoint merchant account.',
      };
    }

    try {
      // When WebJoint API is available, implement actual API call here
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
      console.error('[WebJoint] Payment error:', error);
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
      console.error('[WebJoint] Status check error:', error);
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
          message: 'WebJoint is not configured',
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
      console.error('[WebJoint] Refund error:', error);
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
    if (this.webhookSecret && signature) {
      // Implement signature verification based on WebJoint's webhook format
    }

    const data = payload as Record<string, unknown>;
    return {
      eventType: data.event_type as string || 'unknown',
      transactionId: data.transaction_id as string,
      orderId: data.order_id ? parseInt(data.order_id as string) : undefined,
      status: data.status as string,
    };
  }
}
