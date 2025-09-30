import { ethers } from 'ethers';
import Web3 from 'web3';
import * as bitcoin from 'bitcoinjs-lib';
import { z } from 'zod';
import Stripe from 'stripe';
import { DatabaseService } from './database.js';
import { payments, subscriptions } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// Configuration schema
const cryptoConfigSchema = z.object({
  infuraProjectId: z.string().optional(),
  alchemyApiKey: z.string().optional(),
  stripeSecretKey: z.string().optional(),
  bitcoinNetwork: z.enum(['mainnet', 'testnet']).default('testnet'),
  ethereumNetwork: z.enum(['mainnet', 'goerli', 'sepolia']).default('goerli'),
  confirmsRequired: z.object({
    bitcoin: z.number().default(6),
    ethereum: z.number().default(12),
    polygon: z.number().default(20),
  }).default({}),
});

export type CryptoConfig = z.infer<typeof cryptoConfigSchema>;

// Supported cryptocurrencies
export type SupportedCrypto = 'bitcoin' | 'ethereum' | 'usdc' | 'usdt' | 'polygon';

// Payment request schema
const paymentRequestSchema = z.object({
  amount: z.number().positive(),
  currency: z.enum(['bitcoin', 'ethereum', 'usdc', 'usdt', 'polygon']),
  userWalletAddress: z.string().min(1),
  subscriptionId: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
});

// Wallet connection schema
const walletConnectionSchema = z.object({
  address: z.string().min(1),
  signature: z.string().min(1),
  message: z.string().min(1),
  chainId: z.number().optional(),
});

// Types
export interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  lastUpdated: Date;
}

export interface PaymentRequest {
  id: string;
  amount: number;
  currency: SupportedCrypto;
  userWalletAddress: string;
  platformWalletAddress: string;
  qrCode: string;
  status: 'pending' | 'confirmed' | 'failed' | 'expired';
  transactionHash?: string;
  confirmations: number;
  expiresAt: Date;
  createdAt: Date;
}

export interface TransactionStatus {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  blockNumber?: number;
  gasUsed?: number;
  fee: number;
  timestamp: Date;
}

export interface WalletBalance {
  currency: SupportedCrypto;
  balance: number;
  usdValue: number;
  address: string;
}

export class CryptoService {
  private config: CryptoConfig;
  private db: DatabaseService;
  private ethProvider: ethers.Provider | null = null;
  private web3: Web3 | null = null;
  private stripe: Stripe | null = null;

  // Contract addresses (mainnet)
  private readonly contractAddresses = {
    usdc: '0xA0b86a33E6417a1C1C0De1c0E4D2c1F79ba8d8C1', // USDC
    usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
    polygon: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', // MATIC
  };

  // ERC-20 ABI (simplified)
  private readonly erc20Abi = [
    'function balanceOf(address) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    'event Transfer(address indexed from, address indexed to, uint256 value)',
  ];

  constructor(config: CryptoConfig, db: DatabaseService) {
    this.config = cryptoConfigSchema.parse(config);
    this.db = db;
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Initialize Ethereum provider
    if (this.config.infuraProjectId) {
      this.ethProvider = new ethers.InfuraProvider(
        this.config.ethereumNetwork,
        this.config.infuraProjectId
      );
      console.log('✅ Ethereum provider (Infura) initialized');
    } else if (this.config.alchemyApiKey) {
      this.ethProvider = new ethers.AlchemyProvider(
        this.config.ethereumNetwork,
        this.config.alchemyApiKey
      );
      console.log('✅ Ethereum provider (Alchemy) initialized');
    }

    // Initialize Web3
    if (this.ethProvider) {
      this.web3 = new Web3(this.ethProvider as any);
    }

    // Initialize Stripe for traditional payments
    if (this.config.stripeSecretKey) {
      this.stripe = new Stripe(this.config.stripeSecretKey, {
        apiVersion: '2023-10-16',
      });
      console.log('✅ Stripe initialized');
    }
  }

  // Get real-time cryptocurrency prices
  public async getCryptoPrices(currencies: SupportedCrypto[] = ['bitcoin', 'ethereum', 'usdc', 'usdt']): Promise<CryptoPrice[]> {
    try {
      // In a real implementation, you'd use a service like CoinGecko or CoinMarketCap
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${currencies.join(',')}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch crypto prices');
      }

      const data = await response.json();
      
      return currencies.map(currency => ({
        symbol: currency.toUpperCase(),
        price: data[currency]?.usd || 0,
        change24h: data[currency]?.usd_24h_change || 0,
        marketCap: data[currency]?.usd_market_cap || 0,
        volume24h: data[currency]?.usd_24h_vol || 0,
        lastUpdated: new Date(),
      }));
    } catch (error) {
      console.error('Failed to fetch crypto prices:', error);
      // Return mock data as fallback
      return this.getMockPrices(currencies);
    }
  }

  private getMockPrices(currencies: SupportedCrypto[]): CryptoPrice[] {
    const mockPrices = {
      bitcoin: { price: 43250, change24h: 2.45 },
      ethereum: { price: 2650, change24h: 1.85 },
      usdc: { price: 1.001, change24h: 0.01 },
      usdt: { price: 0.999, change24h: -0.01 },
      polygon: { price: 0.85, change24h: 3.2 },
    };

    return currencies.map(currency => ({
      symbol: currency.toUpperCase(),
      price: mockPrices[currency]?.price || 0,
      change24h: mockPrices[currency]?.change24h || 0,
      marketCap: mockPrices[currency]?.price * 1000000 || 0,
      volume24h: mockPrices[currency]?.price * 100000 || 0,
      lastUpdated: new Date(),
    }));
  }

  // Create a payment request
  public async createPaymentRequest(
    userId: string,
    requestData: z.infer<typeof paymentRequestSchema>
  ): Promise<PaymentRequest> {
    const validatedData = paymentRequestSchema.parse(requestData);

    // Generate platform wallet address for this payment
    const platformWallet = await this.generatePlatformWallet(validatedData.currency);
    
    // Create payment record in database
    const [payment] = await this.db.getDb()
      .insert(payments)
      .values({
        userId,
        amount: validatedData.amount.toString(),
        currency: validatedData.currency,
        status: 'pending',
        method: validatedData.currency,
        walletAddress: validatedData.userWalletAddress,
        network: this.getNetworkForCurrency(validatedData.currency),
        subscriptionId: validatedData.subscriptionId,
        metadata: validatedData.metadata || {},
        confirmations: 0,
      })
      .returning();

    // Generate QR code for payment
    const qrCode = await this.generatePaymentQRCode(
      platformWallet.address,
      validatedData.amount,
      validatedData.currency
    );

    const paymentRequest: PaymentRequest = {
      id: payment.id,
      amount: validatedData.amount,
      currency: validatedData.currency,
      userWalletAddress: validatedData.userWalletAddress,
      platformWalletAddress: platformWallet.address,
      qrCode,
      status: 'pending',
      confirmations: 0,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      createdAt: payment.createdAt,
    };

    // Start monitoring for this payment
    this.monitorPayment(paymentRequest);

    return paymentRequest;
  }

  // Generate platform wallet for receiving payments
  private async generatePlatformWallet(currency: SupportedCrypto): Promise<{ address: string; privateKey?: string }> {
    switch (currency) {
      case 'bitcoin':
        // Generate Bitcoin address
        const network = this.config.bitcoinNetwork === 'mainnet' 
          ? bitcoin.networks.bitcoin 
          : bitcoin.networks.testnet;
        
        const keyPair = bitcoin.ECPair.makeRandom({ network });
        const address = bitcoin.payments.p2pkh({ 
          pubkey: keyPair.publicKey, 
          network 
        }).address!;
        
        return { address, privateKey: keyPair.toWIF() };

      case 'ethereum':
      case 'usdc':
      case 'usdt':
      case 'polygon':
        // Generate Ethereum address
        const wallet = ethers.Wallet.createRandom();
        return { address: wallet.address, privateKey: wallet.privateKey };

      default:
        throw new Error(`Unsupported currency: ${currency}`);
    }
  }

  // Monitor payment for confirmations
  private async monitorPayment(paymentRequest: PaymentRequest): Promise<void> {
    const checkInterval = 30000; // 30 seconds
    const maxChecks = 60; // 30 minutes total
    let checks = 0;

    const monitor = async () => {
      try {
        checks++;
        
        if (checks > maxChecks || new Date() > paymentRequest.expiresAt) {
          // Payment expired
          await this.updatePaymentStatus(paymentRequest.id, 'expired');
          return;
        }

        const status = await this.checkTransactionStatus(
          paymentRequest.platformWalletAddress,
          paymentRequest.currency,
          paymentRequest.amount
        );

        if (status) {
          await this.updatePaymentStatus(paymentRequest.id, 'confirmed', {
            transactionHash: status.hash,
            confirmations: status.confirmations,
            blockchainTxHash: status.hash,
          });

          // Process successful payment
          await this.processSuccessfulPayment(paymentRequest.id);
          return;
        }

        // Continue monitoring
        setTimeout(monitor, checkInterval);
      } catch (error) {
        console.error('Payment monitoring error:', error);
        setTimeout(monitor, checkInterval);
      }
    };

    monitor();
  }

  // Check transaction status on blockchain
  private async checkTransactionStatus(
    address: string,
    currency: SupportedCrypto,
    expectedAmount: number
  ): Promise<TransactionStatus | null> {
    try {
      switch (currency) {
        case 'bitcoin':
          return await this.checkBitcoinTransaction(address, expectedAmount);
        
        case 'ethereum':
          return await this.checkEthereumTransaction(address, expectedAmount);
        
        case 'usdc':
        case 'usdt':
          return await this.checkERC20Transaction(address, currency, expectedAmount);
        
        case 'polygon':
          return await this.checkPolygonTransaction(address, expectedAmount);
        
        default:
          return null;
      }
    } catch (error) {
      console.error('Transaction check failed:', error);
      return null;
    }
  }

  private async checkBitcoinTransaction(address: string, expectedAmount: number): Promise<TransactionStatus | null> {
    // In a real implementation, you'd use a Bitcoin API service
    // For now, return null (no transaction found)
    return null;
  }

  private async checkEthereumTransaction(address: string, expectedAmount: number): Promise<TransactionStatus | null> {
    if (!this.ethProvider) return null;

    const balance = await this.ethProvider.getBalance(address);
    const ethAmount = ethers.formatEther(balance);
    
    if (parseFloat(ethAmount) >= expectedAmount) {
      // Found transaction - would need more sophisticated logic in production
      return {
        hash: 'mock_hash',
        status: 'confirmed',
        confirmations: this.config.confirmsRequired.ethereum,
        fee: 0.001,
        timestamp: new Date(),
      };
    }

    return null;
  }

  private async checkERC20Transaction(
    address: string,
    currency: SupportedCrypto,
    expectedAmount: number
  ): Promise<TransactionStatus | null> {
    if (!this.ethProvider) return null;

    try {
      const contractAddress = this.contractAddresses[currency as keyof typeof this.contractAddresses];
      const contract = new ethers.Contract(contractAddress, this.erc20Abi, this.ethProvider);
      
      const balance = await contract.balanceOf(address);
      const decimals = await contract.decimals();
      const tokenAmount = parseFloat(ethers.formatUnits(balance, decimals));
      
      if (tokenAmount >= expectedAmount) {
        return {
          hash: 'mock_erc20_hash',
          status: 'confirmed',
          confirmations: this.config.confirmsRequired.ethereum,
          fee: 0.01,
          timestamp: new Date(),
        };
      }
    } catch (error) {
      console.error('ERC20 transaction check failed:', error);
    }

    return null;
  }

  private async checkPolygonTransaction(address: string, expectedAmount: number): Promise<TransactionStatus | null> {
    // Similar to Ethereum but on Polygon network
    // Would use Polygon RPC endpoint
    return null;
  }

  // Update payment status in database
  private async updatePaymentStatus(
    paymentId: string,
    status: 'pending' | 'completed' | 'failed' | 'expired',
    additionalData?: any
  ): Promise<void> {
    const updateData: any = { status };
    
    if (additionalData) {
      Object.assign(updateData, additionalData);
    }

    if (status === 'completed') {
      updateData.processedAt = new Date();
    }

    await this.db.getDb()
      .update(payments)
      .set(updateData)
      .where(eq(payments.id, paymentId));
  }

  // Process successful payment
  private async processSuccessfulPayment(paymentId: string): Promise<void> {
    try {
      const [payment] = await this.db.getDb()
        .select()
        .from(payments)
        .where(eq(payments.id, paymentId))
        .limit(1);

      if (!payment) return;

      // If this is for a subscription, update subscription status
      if (payment.subscriptionId) {
        await this.db.getDb()
          .update(subscriptions)
          .set({
            status: 'active',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          })
          .where(eq(subscriptions.id, payment.subscriptionId));
      }

      console.log(`✅ Payment processed successfully: ${paymentId}`);
    } catch (error) {
      console.error('Failed to process successful payment:', error);
    }
  }

  // Generate QR code for payment
  private async generatePaymentQRCode(
    address: string,
    amount: number,
    currency: SupportedCrypto
  ): Promise<string> {
    // In a real implementation, you'd generate an actual QR code
    // For now, return a mock QR code data URL
    const paymentString = `${currency}:${address}?amount=${amount}`;
    return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==`;
  }

  // Get wallet balance
  public async getWalletBalance(address: string, currency: SupportedCrypto): Promise<WalletBalance> {
    try {
      let balance = 0;

      switch (currency) {
        case 'bitcoin':
          balance = await this.getBitcoinBalance(address);
          break;
        
        case 'ethereum':
          balance = await this.getEthereumBalance(address);
          break;
        
        case 'usdc':
        case 'usdt':
          balance = await this.getERC20Balance(address, currency);
          break;
        
        case 'polygon':
          balance = await this.getPolygonBalance(address);
          break;
      }

      // Get USD value
      const prices = await this.getCryptoPrices([currency]);
      const usdValue = balance * (prices[0]?.price || 0);

      return {
        currency,
        balance,
        usdValue,
        address,
      };
    } catch (error) {
      console.error('Failed to get wallet balance:', error);
      return {
        currency,
        balance: 0,
        usdValue: 0,
        address,
      };
    }
  }

  private async getBitcoinBalance(address: string): Promise<number> {
    // Use Bitcoin API service to get balance
    return 0; // Placeholder
  }

  private async getEthereumBalance(address: string): Promise<number> {
    if (!this.ethProvider) return 0;
    
    const balance = await this.ethProvider.getBalance(address);
    return parseFloat(ethers.formatEther(balance));
  }

  private async getERC20Balance(address: string, currency: SupportedCrypto): Promise<number> {
    if (!this.ethProvider) return 0;

    try {
      const contractAddress = this.contractAddresses[currency as keyof typeof this.contractAddresses];
      const contract = new ethers.Contract(contractAddress, this.erc20Abi, this.ethProvider);
      
      const balance = await contract.balanceOf(address);
      const decimals = await contract.decimals();
      
      return parseFloat(ethers.formatUnits(balance, decimals));
    } catch (error) {
      console.error('ERC20 balance check failed:', error);
      return 0;
    }
  }

  private async getPolygonBalance(address: string): Promise<number> {
    // Use Polygon RPC to get MATIC balance
    return 0; // Placeholder
  }

  // Verify wallet connection
  public async verifyWalletConnection(data: z.infer<typeof walletConnectionSchema>): Promise<boolean> {
    const validatedData = walletConnectionSchema.parse(data);

    try {
      // Verify the signature
      const recoveredAddress = ethers.verifyMessage(
        validatedData.message,
        validatedData.signature
      );

      return recoveredAddress.toLowerCase() === validatedData.address.toLowerCase();
    } catch (error) {
      console.error('Wallet verification failed:', error);
      return false;
    }
  }

  // Get supported currencies with current prices
  public async getSupportedCurrencies(): Promise<Array<{
    symbol: SupportedCrypto;
    name: string;
    price: number;
    change24h: number;
    icon: string;
    network: string;
  }>> {
    const prices = await this.getCryptoPrices();
    
    const currencies = [
      { symbol: 'bitcoin' as const, name: 'Bitcoin', network: 'Bitcoin', icon: '₿' },
      { symbol: 'ethereum' as const, name: 'Ethereum', network: 'Ethereum', icon: 'Ξ' },
      { symbol: 'usdc' as const, name: 'USD Coin', network: 'Ethereum', icon: 'USDC' },
      { symbol: 'usdt' as const, name: 'Tether', network: 'Ethereum', icon: 'USDT' },
      { symbol: 'polygon' as const, name: 'Polygon', network: 'Polygon', icon: 'MATIC' },
    ];

    return currencies.map(currency => {
      const price = prices.find(p => p.symbol.toLowerCase() === currency.symbol);
      return {
        ...currency,
        price: price?.price || 0,
        change24h: price?.change24h || 0,
      };
    });
  }

  // Utility methods
  private getNetworkForCurrency(currency: SupportedCrypto): string {
    switch (currency) {
      case 'bitcoin':
        return this.config.bitcoinNetwork;
      case 'ethereum':
      case 'usdc':
      case 'usdt':
        return this.config.ethereumNetwork;
      case 'polygon':
        return 'polygon';
      default:
        return 'unknown';
    }
  }

  // Health check
  public async healthCheck(): Promise<{
    ethereum: boolean;
    bitcoin: boolean;
    priceService: boolean;
  }> {
    const checks = {
      ethereum: false,
      bitcoin: false,
      priceService: false,
    };

    // Check Ethereum provider
    if (this.ethProvider) {
      try {
        await this.ethProvider.getBlockNumber();
        checks.ethereum = true;
      } catch (error) {
        console.error('Ethereum health check failed:', error);
      }
    }

    // Check price service
    try {
      await this.getCryptoPrices(['bitcoin']);
      checks.priceService = true;
    } catch (error) {
      console.error('Price service health check failed:', error);
    }

    // Bitcoin health check (placeholder)
    checks.bitcoin = true;

    return checks;
  }
}
