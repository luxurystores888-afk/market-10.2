import express from 'express';
import { z } from 'zod';
import { validateBody, paymentSchema } from '../validation.ts';
import { apiLimiter } from '../middleware/index.ts';
import { blockDisposableEmail } from '../middleware/disposableEmail.ts';
import { verifyTurnstile } from '../middleware/turnstile.ts';
import { antiBotGuard } from '../middleware/antibot.ts';
import { paymentGatewayManager } from '../services/paymentGatewayManager.ts';
import { storage } from '../storage.ts';

export const paymentRoutes = express.Router();

// Validation schemas
const initiatePaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().min(3).max(3, 'Currency must be 3-letter code'),
  gatewayId: z.string().min(1, 'Gateway ID is required'),
  customerInfo: z.object({
    email: z.string().email().optional(),
    name: z.string().optional(),
    address: z.any().optional()
  }).optional(),
  metadata: z.record(z.any()).optional()
});

const checkStatusSchema = z.object({
  gatewayId: z.string().min(1, 'Gateway ID is required'),
  transactionId: z.string().min(1, 'Transaction ID is required')
});

const processRefundSchema = z.object({
  gatewayId: z.string().min(1, 'Gateway ID is required'),
  transactionId: z.string().min(1, 'Transaction ID is required'),
  amount: z.number().positive('Amount must be positive').optional()
});

/**
 * GET /api/payment/methods
 * Get available payment methods for a country/currency
 */
paymentRoutes.get('/methods', apiLimiter, async (req, res) => {
  try {
    const country = req.query.country as string || '*';
    const currency = req.query.currency as string || 'USD';

    const methods = paymentGatewayManager.getAvailablePaymentMethods(country, currency);
    
    res.json({
      success: true,
      paymentMethods: methods,
      country,
      currency
    });
  } catch (error) {
    console.error('Failed to get payment methods:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve payment methods'
    });
  }
});

/**
 * GET /api/payment/gateways
 * Get all registered payment gateways (admin only)
 */
paymentRoutes.get('/gateways', apiLimiter, async (req, res) => {
  try {
    const gateways = paymentGatewayManager.getAllGateways();
    
    res.json({
      success: true,
      gateways: gateways.map(gateway => ({
        ...gateway,
        config: gateway.config ? { ...gateway.config, secretKey: undefined } : {} // Hide sensitive data
      }))
    });
  } catch (error) {
    console.error('Failed to get payment gateways:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve payment gateways'
    });
  }
});

/**
 * POST /api/payment/initiate
 * Initiate a payment through selected gateway
 */
paymentRoutes.post('/initiate', apiLimiter, antiBotGuard, blockDisposableEmail, verifyTurnstile, validateBody(initiatePaymentSchema), async (req, res) => {
  try {
    const paymentData = req.body;
    
    // Verify order exists
    const order = await storage.getOrder(paymentData.orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Process payment through gateway
    const result = await paymentGatewayManager.processPayment(paymentData.gatewayId, paymentData);
    
    // Save transaction record
    if (result.success && result.transactionId) {
      await storage.createPaymentTransaction({
        id: result.transactionId,
        orderId: paymentData.orderId,
        amount: paymentData.amount.toString(),
        currency: paymentData.currency,
        gatewayId: paymentData.gatewayId,
        status: 'pending',
        transactionId: result.transactionId,
        gatewayResponse: result.metadata || {},
        fees: "0" // Calculate based on gateway fees
      });
    }

    res.json({
      success: result.success,
      transactionId: result.transactionId,
      paymentUrl: result.paymentUrl,
      qrCode: result.qrCode,
      walletAddress: result.walletAddress,
      error: result.error,
      metadata: result.metadata
    });
  } catch (error) {
    console.error('Payment initiation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Payment processing failed'
    });
  }
});

/**
 * POST /api/payment/status
 * Check payment status
 */
paymentRoutes.post('/status', apiLimiter, validateBody(checkStatusSchema), async (req, res) => {
  try {
    const { gatewayId, transactionId } = req.body;
    
    const status = await paymentGatewayManager.getTransactionStatus(gatewayId, transactionId);
    
    // Update local transaction record
    await storage.updatePaymentTransactionStatus(transactionId, status.status);
    
    res.json({
      success: true,
      status: status.status,
      transactionId: status.transactionId,
      confirmations: status.confirmations,
      metadata: status.metadata
    });
  } catch (error) {
    console.error('Failed to check payment status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check payment status'
    });
  }
});

/**
 * POST /api/payment/refund
 * Process refund
 */
paymentRoutes.post('/refund', apiLimiter, validateBody(processRefundSchema), async (req, res) => {
  try {
    const { gatewayId, transactionId, amount } = req.body;
    
    const result = await paymentGatewayManager.processRefund(gatewayId, transactionId, amount);
    
    if (result.success) {
      // Update transaction status
      await storage.updatePaymentTransactionStatus(transactionId, 'refunded');
    }

    res.json({
      success: result.success,
      refundId: result.refundId,
      amount: result.amount,
      error: result.error
    });
  } catch (error) {
    console.error('Refund processing failed:', error);
    res.status(500).json({
      success: false,
      error: 'Refund processing failed'
    });
  }
});

/**
 * POST /api/payment/webhook/:gatewayId
 * Handle payment gateway webhooks
 */
paymentRoutes.post('/webhook/:gatewayId', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const { gatewayId } = req.params;
    const signature = req.headers['x-signature'] as string || req.headers['stripe-signature'] as string;
    
    // Note: Webhook handling would be implemented based on specific gateway requirements
    console.log(`Webhook received for gateway ${gatewayId}`);
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook processing failed:', error);
    res.status(400).send('Webhook processing failed');
  }
});

/**
 * PUT /api/payment/gateway/:gatewayId/status
 * Enable/disable payment gateway (admin only)
 */
paymentRoutes.put('/gateway/:gatewayId/status', apiLimiter, async (req, res) => {
  try {
    const { gatewayId } = req.params;
    const { enabled } = req.body;
    
    paymentGatewayManager.updateGatewayStatus(gatewayId, enabled);
    
    res.json({
      success: true,
      message: `Gateway ${gatewayId} ${enabled ? 'enabled' : 'disabled'}`
    });
  } catch (error) {
    console.error('Failed to update gateway status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update gateway status'
    });
  }
});

paymentRoutes.post('/eternal-loop', async (req, res) => {
  res.json({ subscribed: true });
});

paymentRoutes.post('/vortex-sub', async (req, res) => {
  // Auto-enroll
  res.json({ subscribed: true });
});

// Add webhook simulation for test mode
paymentRoutes.post('/webhook', (req, res) => {
  console.log('Webhook received - Process payment');
  res.json({ received: true });
});