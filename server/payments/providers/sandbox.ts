/**
 * Sandbox Payment Provider
 * 
 * A test/development payment provider that simulates payment processing
 * without connecting to any real payment service. Use this for development
 * and testing purposes.
 */

import type {
  PaymentProvider,
  CreatePaymentRequest,
  PaymentResult,
  PaymentStatusResult,
  RefundRequest,
  RefundResult,
} from '../provider-interface';

// In-memory storage for sandbox payments
const sandboxPayments = new Map<string, {
  transactionId: string;
  orderId: number;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  createdAt: Date;
  paidAt?: Date;
}>();

export class SandboxProvider implements PaymentProvider {
  name = 'sandbox';

  async initialize(): Promise<void> {
    console.log('[Sandbox] Payment provider initialized in sandbox mode');
  }

  isConfigured(): boolean {
    return true; // Sandbox is always configured
  }

  async createPayment(request: CreatePaymentRequest): Promise<PaymentResult> {
    const transactionId = `sandbox_${request.orderId}_${Date.now()}`;
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Determine initial status based on payment method
    // Cash payments are always pending until customer pays in-store
    // ACH and debit in sandbox are pending because no real payment was processed
    const isCash = request.paymentMethod === 'cash';
    const initialStatus = 'pending'; // All sandbox payments start as pending - no real payment processed
    
    // Store the payment
    sandboxPayments.set(transactionId, {
      transactionId,
      orderId: request.orderId,
      amount: request.amount,
      status: initialStatus,
      createdAt: new Date(),
      paidAt: undefined, // Not paid until verified
    });

    console.log(`[Sandbox] Payment created: ${transactionId} for $${(request.amount / 100).toFixed(2)} - Status: ${initialStatus}`);

    const message = isCash 
      ? 'Order placed successfully. Please pay when you pick up your order.'
      : 'Order placed successfully. Payment is pending - you will receive confirmation once payment is verified. (Sandbox mode - configure a payment provider for live payments)';

    return {
      success: true,
      transactionId,
      status: initialStatus,
      message,
    };
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentStatusResult> {
    const payment = sandboxPayments.get(transactionId);
    
    if (!payment) {
      return {
        transactionId,
        status: 'pending',
        amount: 0,
      };
    }

    return {
      transactionId: payment.transactionId,
      status: payment.status,
      amount: payment.amount,
      paidAt: payment.paidAt,
    };
  }

  async refund(request: RefundRequest): Promise<RefundResult> {
    const payment = sandboxPayments.get(request.transactionId);
    
    if (!payment) {
      return {
        success: false,
        status: 'failed',
        error: {
          code: 'PAYMENT_NOT_FOUND',
          message: 'Payment not found',
        },
      };
    }

    // Update payment status
    payment.status = 'refunded';
    sandboxPayments.set(request.transactionId, payment);

    const refundId = `refund_${Date.now()}`;
    console.log(`[Sandbox] Refund processed: ${refundId} for transaction ${request.transactionId}`);

    return {
      success: true,
      refundId,
      status: 'completed',
      message: 'Sandbox refund completed successfully',
    };
  }

  async handleWebhook(payload: unknown): Promise<{
    eventType: string;
    transactionId?: string;
    orderId?: number;
    status?: string;
  }> {
    const data = payload as Record<string, unknown>;
    return {
      eventType: data.event_type as string || 'sandbox_event',
      transactionId: data.transaction_id as string,
      orderId: data.order_id ? parseInt(data.order_id as string) : undefined,
      status: data.status as string,
    };
  }
}
