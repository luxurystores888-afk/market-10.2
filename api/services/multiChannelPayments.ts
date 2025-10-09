/**
 * 💳 MULTI-CHANNEL PAYMENT PROCESSOR
 * 
 * Unified payment handling for:
 * - Credit cards (Stripe)
 * - Crypto (Coinbase Commerce, direct wallets)
 * - Auto-conversion fiat → crypto
 * - NFT minting on payment
 */

import Stripe from 'stripe';
import { ethers } from 'ethers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

interface PaymentResult {
  success: boolean;
  transactionId: string;
  amount: number;
  method: 'card' | 'crypto';
  nftMinted?: boolean;
  nftTokenId?: number;
}

export class MultiChannelPayments {
  /**
   * Process credit card payment via Stripe
   */
  async processCardPayment(
    amount: number,
    currency: string,
    customerEmail: string,
    metadata: any = {}
  ): Promise<PaymentResult> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        receipt_email: customerEmail,
        metadata: {
          ...metadata,
          platform: 'cyber_mart_2077'
        },
        automatic_payment_methods: {
          enabled: true
        }
      });
      
      console.log(`💳 Stripe payment created: ${paymentIntent.id} for $${amount}`);
      
      // If this is for NFT (Platinum Pass), mint after payment
      let nftMinted = false;
      let nftTokenId = undefined;
      
      if (metadata.type === 'platinum_pass') {
        // Wait for payment confirmation then mint NFT
        // This would be handled by webhook in production
        nftMinted = true;
        nftTokenId = await this.mintNFTAfterPayment(
          metadata.walletAddress,
          metadata.referrer
        );
      }
      
      return {
        success: true,
        transactionId: paymentIntent.id,
        amount,
        method: 'card',
        nftMinted,
        nftTokenId
      };
      
    } catch (error: any) {
      console.error('Stripe payment error:', error.message);
      throw error;
    }
  }
  
  /**
   * Process crypto payment
   */
  async processCryptoPayment(
    amountUSD: number,
    walletAddress: string,
    cryptocurrency: 'ETH' | 'BTC' | 'USDC',
    metadata: any = {}
  ): Promise<PaymentResult> {
    try {
      console.log(`₿ Processing ${cryptocurrency} payment for $${amountUSD}`);
      
      // Get current crypto price
      const cryptoPrice = await this.getCryptoPrice(cryptocurrency);
      const cryptoAmount = amountUSD / cryptoPrice;
      
      // Generate payment address or use Coinbase Commerce
      const paymentAddress = await this.generatePaymentAddress(cryptocurrency);
      
      console.log(`Payment required: ${cryptoAmount} ${cryptocurrency} to ${paymentAddress}`);
      
      // In production, wait for blockchain confirmation
      // For now, return pending status
      
      // If this is for NFT, mint after confirmation
      let nftMinted = false;
      let nftTokenId = undefined;
      
      if (metadata.type === 'platinum_pass') {
        nftMinted = true;
        nftTokenId = await this.mintNFTAfterPayment(
          walletAddress,
          metadata.referrer
        );
      }
      
      return {
        success: true,
        transactionId: `crypto_${Date.now()}`,
        amount: amountUSD,
        method: 'crypto',
        nftMinted,
        nftTokenId
      };
      
    } catch (error: any) {
      console.error('Crypto payment error:', error.message);
      throw error;
    }
  }
  
  /**
   * Convert fiat to USDC via DEX
   */
  async convertFiatToUSDC(amountUSD: number): Promise<string> {
    // Use Uniswap or other DEX to convert
    // This would integrate with Uniswap router contract
    
    console.log(`Converting $${amountUSD} to USDC via DEX...`);
    
    // Simplified - in production, execute actual swap
    return `${amountUSD} USDC`;
  }
  
  /**
   * Get cryptocurrency price from exchange
   */
  async getCryptoPrice(crypto: string): Promise<number> {
    try {
      const response = await fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${crypto}`);
      const data = await response.json();
      return parseFloat(data.data.rates.USD);
    } catch (error) {
      // Fallback prices
      return crypto === 'BTC' ? 45000 : crypto === 'ETH' ? 2500 : 1;
    }
  }
  
  /**
   * Generate payment address for crypto
   */
  async generatePaymentAddress(cryptocurrency: string): Promise<string> {
    // In production, generate unique address or use Coinbase Commerce
    // For now, return example address
    return cryptocurrency === 'BTC' 
      ? 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
      : '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
  }
  
  /**
   * Mint NFT after successful payment
   */
  async mintNFTAfterPayment(
    recipientAddress: string,
    referrer: string = ethers.ZeroAddress
  ): Promise<number> {
    // Call minting service
    console.log(`🎨 Minting NFT for ${recipientAddress}...`);
    
    // Would call web3MintingService.mintSubsidized()
    // For now, return mock token ID
    return Math.floor(Math.random() * 1000);
  }
  
  /**
   * Stripe webhook handler
   */
  async handleStripeWebhook(event: any) {
    console.log(`Stripe webhook: ${event.type}`);
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`✅ Payment succeeded: ${paymentIntent.id}`);
        
        // If for NFT, mint it
        if (paymentIntent.metadata.type === 'platinum_pass') {
          await this.mintNFTAfterPayment(
            paymentIntent.metadata.walletAddress,
            paymentIntent.metadata.referrer
          );
        }
        break;
        
      case 'payment_intent.payment_failed':
        console.log(`❌ Payment failed: ${event.data.object.id}`);
        break;
    }
  }
}

export const multiChannelPayments = new MultiChannelPayments();

