import { Request, Response } from 'express';

// 🔥 FLEXIBLE PAYMENT GATEWAY ARCHITECTURE
// This system allows you to easily add ANY payment gateway

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'crypto' | 'traditional' | 'mobile' | 'bank' | 'other';
  enabled: boolean;
  config: Record<string, any>;
  supportedCurrencies: string[];
  countries: string[];
  fees: {
    fixed: number;
    percentage: number;
  };
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  gatewayId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  transactionId?: string;
  gatewayResponse?: Record<string, any>;
  fees: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentGateway {
  id: string;
  name: string;
  type: PaymentMethod['type'];
  enabled: boolean;
  
  // Core payment operations
  processPayment(data: PaymentRequest): Promise<PaymentResult>;
  checkStatus(transactionId: string): Promise<PaymentStatus>;
  refund(transactionId: string, amount?: number): Promise<RefundResult>;
  
  // Optional features
  setupWebhooks?(): Promise<void>;
  validateWebhook?(payload: any, signature: string): boolean;
  handleWebhook?(payload: any): Promise<void>;
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  customerInfo: {
    email?: string;
    name?: string;
    address?: any;
  };
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  qrCode?: string;
  walletAddress?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface PaymentStatus {
  status: PaymentTransaction['status'];
  transactionId: string;
  confirmations?: number;
  metadata?: Record<string, any>;
}

export interface RefundResult {
  success: boolean;
  refundId?: string;
  amount: number;
  error?: string;
}

// 🌟 PAYMENT GATEWAY REGISTRY
class PaymentGatewayManager {
  private gateways: Map<string, PaymentGateway> = new Map();
  private activeGateways: Map<string, PaymentMethod> = new Map();

  // Register a new payment gateway
  registerGateway(gateway: PaymentGateway, config: PaymentMethod) {
    this.gateways.set(gateway.id, gateway);
    this.activeGateways.set(gateway.id, config);
    console.log(`✅ Payment gateway registered: ${gateway.name}`);
  }

  // Get available payment methods for a country/currency
  getAvailablePaymentMethods(country: string, currency: string): PaymentMethod[] {
    return Array.from(this.activeGateways.values())
      .filter(method => 
        method.enabled && 
        method.countries.includes(country) && 
        method.supportedCurrencies.includes(currency)
      );
  }

  // Process payment through specific gateway
  async processPayment(gatewayId: string, paymentData: PaymentRequest): Promise<PaymentResult> {
    const gateway = this.gateways.get(gatewayId);
    if (!gateway) {
      throw new Error(`Payment gateway not found: ${gatewayId}`);
    }

    if (!this.activeGateways.get(gatewayId)?.enabled) {
      throw new Error(`Payment gateway disabled: ${gatewayId}`);
    }

    try {
      return await gateway.processPayment(paymentData);
    } catch (error) {
      console.error(`Payment failed for gateway ${gatewayId}:`, error);
      throw error;
    }
  }

  // Get transaction status
  async getTransactionStatus(gatewayId: string, transactionId: string): Promise<PaymentStatus> {
    const gateway = this.gateways.get(gatewayId);
    if (!gateway) {
      throw new Error(`Payment gateway not found: ${gatewayId}`);
    }

    return await gateway.checkStatus(transactionId);
  }

  // Process refund
  async processRefund(gatewayId: string, transactionId: string, amount?: number): Promise<RefundResult> {
    const gateway = this.gateways.get(gatewayId);
    if (!gateway || !gateway.refund) {
      throw new Error(`Refund not supported for gateway: ${gatewayId}`);
    }

    return await gateway.refund(transactionId, amount);
  }

  // List all registered gateways
  getAllGateways(): PaymentMethod[] {
    return Array.from(this.activeGateways.values());
  }

  // Enable/disable gateway
  updateGatewayStatus(gatewayId: string, enabled: boolean) {
    const method = this.activeGateways.get(gatewayId);
    if (method) {
      method.enabled = enabled;
      console.log(`Payment gateway ${gatewayId} ${enabled ? 'enabled' : 'disabled'}`);
    }
  }

  // Update gateway configuration
  updateGatewayConfig(gatewayId: string, config: Partial<PaymentMethod>) {
    const method = this.activeGateways.get(gatewayId);
    if (method) {
      Object.assign(method, config);
      console.log(`Payment gateway ${gatewayId} configuration updated`);
    }
  }
}

// 💰 CRYPTO PAYMENT GATEWAY IMPLEMENTATION
export class CryptoPaymentGateway implements PaymentGateway {
  id = 'crypto';
  name = 'Cryptocurrency Payments';
  type: PaymentMethod['type'] = 'crypto';
  enabled = true;

  private supportedCryptos = [
    { symbol: 'BTC', name: 'Bitcoin', network: 'bitcoin' },
    { symbol: 'ETH', name: 'Ethereum', network: 'ethereum' },
    { symbol: 'MATIC', name: 'Polygon', network: 'polygon' },
    { symbol: 'USDC', name: 'USD Coin', network: 'ethereum' },
    { symbol: 'USDT', name: 'Tether', network: 'ethereum' },
    { symbol: 'BNB', name: 'BNB Chain', network: 'bsc' },
    { symbol: 'ADA', name: 'Cardano', network: 'cardano' },
    { symbol: 'SOL', name: 'Solana', network: 'solana' }
  ];

  async processPayment(data: PaymentRequest): Promise<PaymentResult> {
    try {
      // In production, integrate with actual crypto payment processor
      // For now, we'll create a mock implementation
      
      const transactionId = `crypto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const walletAddress = this.generateWalletAddress(data.currency);
      
      // Calculate crypto amount based on current exchange rates
      const cryptoAmount = await this.convertToCrypto(data.amount, data.currency);
      
      return {
        success: true,
        transactionId,
        walletAddress,
        metadata: {
          cryptoAmount,
          network: this.getNetworkForCurrency(data.currency),
          confirmationsRequired: this.getRequiredConfirmations(data.currency),
          expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Crypto payment processing failed: ${error}`
      };
    }
  }

  async checkStatus(transactionId: string): Promise<PaymentStatus> {
    // Mock implementation - in production, check actual blockchain
    const isConfirmed = Math.random() > 0.3; // 70% chance of confirmation
    
    return {
      status: isConfirmed ? 'completed' : 'pending',
      transactionId,
      confirmations: isConfirmed ? 6 : Math.floor(Math.random() * 3),
      metadata: {
        blockHeight: isConfirmed ? Math.floor(Math.random() * 1000000) : undefined,
        gasUsed: isConfirmed ? Math.floor(Math.random() * 50000) + 21000 : undefined
      }
    };
  }

  async refund(transactionId: string, amount?: number): Promise<RefundResult> {
    // Crypto refunds require manual processing
    return {
      success: false,
      amount: amount || 0,
      error: 'Crypto refunds require manual processing. Please contact support.'
    };
  }

  private generateWalletAddress(currency: string): string {
    // Mock wallet address generation
    const prefixes: Record<string, string> = {
      'BTC': '1',
      'ETH': '0x',
      'MATIC': '0x',
      'USDC': '0x',
      'USDT': '0x',
      'BNB': 'bnb',
      'ADA': 'addr1',
      'SOL': 'sol'
    };
    
    const prefix = prefixes[currency] || '0x';
    const randomHex = Math.random().toString(16).substr(2, 40);
    
    return prefix + randomHex;
  }

  private async convertToCrypto(usdAmount: number, currency: string): Promise<number> {
    // Mock exchange rates - in production, use real-time rates from CoinGecko/CoinMarketCap
    const rates: Record<string, number> = {
      'BTC': 45000,
      'ETH': 2400,
      'MATIC': 0.85,
      'USDC': 1.00,
      'USDT': 1.00,
      'BNB': 320,
      'ADA': 0.45,
      'SOL': 85
    };
    
    const rate = rates[currency] || 1;
    return usdAmount / rate;
  }

  private getNetworkForCurrency(currency: string): string {
    const networks: Record<string, string> = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'MATIC': 'polygon',
      'USDC': 'ethereum',
      'USDT': 'ethereum',
      'BNB': 'bsc',
      'ADA': 'cardano',
      'SOL': 'solana'
    };
    
    return networks[currency] || 'ethereum';
  }

  private getRequiredConfirmations(currency: string): number {
    const confirmations: Record<string, number> = {
      'BTC': 3,
      'ETH': 12,
      'MATIC': 20,
      'USDC': 12,
      'USDT': 12,
      'BNB': 15,
      'ADA': 5,
      'SOL': 32
    };
    
    return confirmations[currency] || 12;
  }
}

// 🏦 TRADITIONAL PAYMENT GATEWAY (Template for any gateway)
export class TraditionalPaymentGateway implements PaymentGateway {
  id: string;
  name: string;
  type: PaymentMethod['type'] = 'traditional';
  enabled = false;

  constructor(
    id: string,
    name: string,
    private config: {
      apiKey?: string;
      secretKey?: string;
      webhookSecret?: string;
      sandboxMode?: boolean;
      [key: string]: any;
    }
  ) {
    this.id = id;
    this.name = name;
  }

  async processPayment(data: PaymentRequest): Promise<PaymentResult> {
    // Template implementation - customize for specific payment gateway
    try {
      // Example: Stripe, PayPal, Square, Razorpay, etc.
      const paymentUrl = `https://${this.id}-checkout.example.com/pay/${data.orderId}`;
      
      return {
        success: true,
        transactionId: `${this.id}_${Date.now()}`,
        paymentUrl,
        metadata: {
          redirectRequired: true,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `${this.name} payment processing failed: ${error}`
      };
    }
  }

  async checkStatus(transactionId: string): Promise<PaymentStatus> {
    // Template implementation
    return {
      status: 'pending',
      transactionId
    };
  }

  async refund(transactionId: string, amount?: number): Promise<RefundResult> {
    // Template implementation
    return {
      success: true,
      refundId: `ref_${transactionId}`,
      amount: amount || 0
    };
  }

  setupWebhooks = async () => {
    // Setup webhook endpoints for this gateway
    console.log(`Setting up webhooks for ${this.name}`);
  };

  validateWebhook = (payload: any, signature: string): boolean => {
    // Validate webhook signature
    return true;
  };

  handleWebhook = async (payload: any) => {
    // Handle webhook events
    console.log(`Handling webhook for ${this.name}:`, payload);
  };
}

// 📱 MOBILE PAYMENT GATEWAY (Template)
export class MobilePaymentGateway implements PaymentGateway {
  id: string;
  name: string;
  type: PaymentMethod['type'] = 'mobile';
  enabled = false;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  async processPayment(data: PaymentRequest): Promise<PaymentResult> {
    // Template for mobile payments (Apple Pay, Google Pay, Mobile Money, etc.)
    return {
      success: true,
      transactionId: `mobile_${Date.now()}`,
      metadata: {
        deepLink: `${this.id}://pay?amount=${data.amount}&order=${data.orderId}`,
        qrCode: `data:image/svg+xml;base64,${Buffer.from('<svg>QR Code</svg>').toString('base64')}`
      }
    };
  }

  async checkStatus(transactionId: string): Promise<PaymentStatus> {
    return { status: 'pending', transactionId };
  }

  async refund(transactionId: string, amount?: number): Promise<RefundResult> {
    return { success: true, refundId: `ref_${transactionId}`, amount: amount || 0 };
  }
}

// 🌟 INITIALIZE PAYMENT GATEWAY MANAGER
export const paymentGatewayManager = new PaymentGatewayManager();

// Register crypto gateway by default
const cryptoGateway = new CryptoPaymentGateway();
paymentGatewayManager.registerGateway(cryptoGateway, {
  id: 'crypto',
  name: 'Cryptocurrency Payments',
  type: 'crypto',
  enabled: true,
  config: {},
  supportedCurrencies: ['BTC', 'ETH', 'MATIC', 'USDC', 'USDT', 'BNB', 'ADA', 'SOL'],
  countries: ['*'], // Available worldwide
  fees: { fixed: 0, percentage: 0.5 }
});

// 🔧 EASY GATEWAY REGISTRATION FUNCTIONS
// Use these functions to add new payment gateways easily

export function addStripeGateway(apiKey: string, secretKey: string) {
  const stripe = new TraditionalPaymentGateway('stripe', 'Stripe', {
    apiKey,
    secretKey,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
  });
  
  paymentGatewayManager.registerGateway(stripe, {
    id: 'stripe',
    name: 'Stripe',
    type: 'traditional',
    enabled: true,
    config: { apiKey },
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL'],
    fees: { fixed: 0.30, percentage: 2.9 }
  });
}

export function addPayPalGateway(clientId: string, clientSecret: string) {
  const paypal = new TraditionalPaymentGateway('paypal', 'PayPal', {
    clientId,
    clientSecret
  });
  
  paymentGatewayManager.registerGateway(paypal, {
    id: 'paypal',
    name: 'PayPal',
    type: 'traditional',
    enabled: true,
    config: { clientId },
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    countries: ['*'],
    fees: { fixed: 0, percentage: 3.5 }
  });
}

export function addRazorpayGateway(keyId: string, keySecret: string) {
  const razorpay = new TraditionalPaymentGateway('razorpay', 'Razorpay', {
    keyId,
    keySecret
  });
  
  paymentGatewayManager.registerGateway(razorpay, {
    id: 'razorpay',
    name: 'Razorpay',
    type: 'traditional',
    enabled: true,
    config: { keyId },
    supportedCurrencies: ['INR'],
    countries: ['IN'],
    fees: { fixed: 0, percentage: 2.0 }
  });
}

export function addApplePayGateway() {
  const applePay = new MobilePaymentGateway('applepay', 'Apple Pay');
  
  paymentGatewayManager.registerGateway(applePay, {
    id: 'applepay',
    name: 'Apple Pay',
    type: 'mobile',
    enabled: true,
    config: {},
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD'],
    countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR'],
    fees: { fixed: 0, percentage: 1.0 }
  });
}

export function addCustomGateway(
  id: string,
  name: string,
  gateway: PaymentGateway,
  config: PaymentMethod
) {
  paymentGatewayManager.registerGateway(gateway, config);
  console.log(`✅ Custom payment gateway added: ${name}`);
}

export default paymentGatewayManager;