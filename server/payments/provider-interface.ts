/**
 * Payment Provider Interface
 * 
 * This module defines a provider-agnostic payment interface that allows
 * easy switching between payment processors (Paybotic, WebJoint Pay, etc.)
 * 
 * To switch providers:
 * 1. Set PAYMENT_PROVIDER env var to the desired provider name
 * 2. Add the provider's API credentials as secrets
 */

export interface PaymentCustomer {
  email: string;
  name: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface PaymentLineItem {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number; // in cents
}

export interface CreatePaymentRequest {
  amount: number; // in cents
  currency: string;
  customer: PaymentCustomer;
  orderId: number;
  lineItems: PaymentLineItem[];
  paymentMethod: 'ach' | 'debit' | 'cash';
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'requires_action';
  message?: string;
  redirectUrl?: string; // For payment methods requiring redirect
  error?: {
    code: string;
    message: string;
  };
}

export interface RefundRequest {
  transactionId: string;
  amount?: number; // Optional partial refund amount in cents
  reason?: string;
}

export interface RefundResult {
  success: boolean;
  refundId?: string;
  status: 'pending' | 'completed' | 'failed';
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaymentStatusResult {
  transactionId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  amount: number;
  paidAt?: Date;
}

export interface PaymentProvider {
  name: string;
  
  /**
   * Initialize the payment provider with credentials
   */
  initialize(): Promise<void>;
  
  /**
   * Check if the provider is properly configured
   */
  isConfigured(): boolean;
  
  /**
   * Create a new payment
   */
  createPayment(request: CreatePaymentRequest): Promise<PaymentResult>;
  
  /**
   * Get the status of an existing payment
   */
  getPaymentStatus(transactionId: string): Promise<PaymentStatusResult>;
  
  /**
   * Process a refund
   */
  refund(request: RefundRequest): Promise<RefundResult>;
  
  /**
   * Handle webhook callbacks from the payment provider
   */
  handleWebhook(payload: unknown, signature?: string): Promise<{
    eventType: string;
    transactionId?: string;
    orderId?: number;
    status?: string;
  }>;
}

// Payment provider types for configuration
export type PaymentProviderName = 'paybotic' | 'webjoint' | 'sandbox';

// Configuration for switching providers
export interface PaymentConfig {
  provider: PaymentProviderName;
  sandboxMode: boolean;
}
