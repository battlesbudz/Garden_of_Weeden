/**
 * Payment Service
 * 
 * Central service that manages payment provider selection and provides
 * a unified interface for payment operations.
 * 
 * Configuration:
 * - Set PAYMENT_PROVIDER env var to: 'paybotic', 'webjoint', or 'sandbox'
 * - Default is 'sandbox' for development
 */

import type {
  PaymentProvider,
  PaymentProviderName,
  CreatePaymentRequest,
  PaymentResult,
  PaymentStatusResult,
  RefundRequest,
  RefundResult,
} from './provider-interface';

import { PayboticProvider } from './providers/paybotic';
import { WebJointProvider } from './providers/webjoint';
import { SandboxProvider } from './providers/sandbox';

class PaymentService {
  private provider: PaymentProvider | null = null;
  private providerName: PaymentProviderName = 'sandbox';

  async initialize(): Promise<void> {
    const configuredProvider = (process.env.PAYMENT_PROVIDER || 'sandbox') as PaymentProviderName;
    this.providerName = configuredProvider;

    switch (configuredProvider) {
      case 'paybotic':
        this.provider = new PayboticProvider();
        break;
      case 'webjoint':
        this.provider = new WebJointProvider();
        break;
      case 'sandbox':
      default:
        this.provider = new SandboxProvider();
        break;
    }

    await this.provider.initialize();
    console.log(`[PaymentService] Initialized with provider: ${this.provider.name}`);
    
    if (!this.provider.isConfigured()) {
      console.log(`[PaymentService] Warning: ${this.provider.name} is not fully configured. Using sandbox mode for payments.`);
    }
  }

  getProvider(): PaymentProvider {
    if (!this.provider) {
      throw new Error('Payment service not initialized. Call initialize() first.');
    }
    return this.provider;
  }

  getProviderName(): string {
    return this.provider?.name || 'unknown';
  }

  isConfigured(): boolean {
    return this.provider?.isConfigured() || false;
  }

  async createPayment(request: CreatePaymentRequest): Promise<PaymentResult> {
    const provider = this.getProvider();
    return provider.createPayment(request);
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentStatusResult> {
    const provider = this.getProvider();
    return provider.getPaymentStatus(transactionId);
  }

  async refund(request: RefundRequest): Promise<RefundResult> {
    const provider = this.getProvider();
    return provider.refund(request);
  }

  async handleWebhook(payload: unknown, signature?: string): Promise<{
    eventType: string;
    transactionId?: string;
    orderId?: number;
    status?: string;
  }> {
    const provider = this.getProvider();
    return provider.handleWebhook(payload, signature);
  }
}

// Singleton instance
export const paymentService = new PaymentService();
