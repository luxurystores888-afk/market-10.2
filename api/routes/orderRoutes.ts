import express from 'express';
import { z } from 'zod';
import { validateBody, orderSchema } from '../validation.ts';
import { apiLimiter, strictApiLimiter } from '../middleware.ts';
import { authenticate } from '../middleware/auth.ts';
import { storage } from '../storage.ts';
import { randomUUID } from 'crypto';
import nodemailer from 'nodemailer';

export const orderRoutes = express.Router();

// Validation schemas
const createOrderSchema = z.object({
  userId: z.string().uuid(),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
    image: z.string().optional()
  })),
  shippingAddress: z.object({
    name: z.string().min(1),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(2),
    phone: z.string().optional()
  }),
  paymentDetails: z.object({
    method: z.enum(['crypto', 'card']),
    cryptoType: z.string().optional(),
    walletAddress: z.string().optional(),
    cardNumber: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
    cardName: z.string().optional()
  }),
  deliveryOption: z.enum(['standard', 'express', 'overnight']),
  specialInstructions: z.string().optional(),
  subtotal: z.number().positive(),
  tax: z.number().min(0),
  shipping: z.number().min(0),
  total: z.number().positive(),
  currency: z.string().min(3).max(3),
  donation: z.number().min(0)
});

const updateOrderSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).optional(),
  trackingNumber: z.string().optional(),
  shippedAt: z.string().datetime().optional(),
  deliveredAt: z.string().datetime().optional(),
  orderNotes: z.string().optional()
});

/**
 * GET /api/orders
 * Get orders for the authenticated user or all orders (admin only)
 */
orderRoutes.get('/', apiLimiter, authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const { status, page = 1, limit = 10 } = req.query;
    
    // Regular users can only see their own orders
    const filters: any = {};
    if (user.role !== 'admin') {
      filters.userId = user.id;
    }
    if (status) {
      filters.status = status as string;
    }

    const orders = await storage.getOrders(filters);
    
    // Apply pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedOrders = orders.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      orders: paginatedOrders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: orders.length,
        pages: Math.ceil(orders.length / limitNum)
      }
    });
  } catch (error) {
    console.error('Failed to get orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve orders'
    });
  }
});

/**
 * GET /api/orders/:id
 * Get a specific order by ID
 */
orderRoutes.get('/:id', apiLimiter, authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    const order = await storage.getOrder(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Regular users can only see their own orders
    if (user.role !== 'admin' && order.userId !== user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Failed to get order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve order'
    });
  }
});

/**
 * POST /api/orders
 * Create a new order
 */
orderRoutes.post('/', strictApiLimiter, authenticate, validateBody(createOrderSchema), async (req, res) => {
  try {
    const user = (req as any).user;
    const orderData = req.body;

    // Ensure order belongs to the authenticated user
    if (orderData.userId !== user.id && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Cannot create order for another user'
      });
    }

    // Validate inventory for each item
    for (const item of orderData.items) {
      const product = await storage.getProduct(item.id);
      if (!product) {
        return res.status(400).json({
          success: false,
          error: `Product ${item.name} not found`
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for ${item.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }
    }

    // Create order ID
    const orderId = randomUUID();

    // Create order object
    const order = {
      id: orderId,
      userId: orderData.userId,
      status: 'pending' as const,
      totalAmount: orderData.total.toString(),
      subtotalAmount: orderData.subtotal.toString(),
      shippingCost: orderData.shipping.toString(),
      taxAmount: orderData.tax.toString(),
      discountAmount: '0',
      paymentStatus: 'pending' as const,
      paymentMethod: orderData.paymentDetails.method,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.shippingAddress, // Using same as shipping for now
      orderItems: orderData.items, // 🔧 FIX: Store line items data
      orderNotes: orderData.specialInstructions || null,
      trackingNumber: null,
      shippedAt: null,
      deliveredAt: null,
      donation: orderData.donation.toString() || '0'
    };

    // Create the order
    const newOrder = await storage.createOrder(order);

    // Update inventory for each item
    for (const item of orderData.items) {
      await storage.updateProductStock(item.id, -item.quantity);
    }

    // Log order creation
    console.log(`📦 Order created: ${orderId} for user: ${user.email} (${orderData.paymentDetails.method})`);
    console.log(`💰 Order total: $${orderData.total} (${orderData.items.length} items)`);

    res.status(201).json({
      success: true,
      orderId: newOrder.id,
      order: newOrder,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Failed to create order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
});

/**
 * PUT /api/orders/:id
 * Update an order (admin only or order owner for limited fields)
 */
orderRoutes.put('/:id', apiLimiter, authenticate, validateBody(updateOrderSchema), async (req, res) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const updates = req.body;

    const existingOrder = await storage.getOrder(id);
    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check permissions
    if (user.role !== 'admin' && existingOrder.userId !== user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Regular users can only cancel their own orders
    if (user.role !== 'admin') {
      if (Object.keys(updates).length > 1 || (Object.keys(updates).length === 1 && updates.status !== 'cancelled')) {
        return res.status(403).json({
          success: false,
          error: 'Customers can only cancel orders'
        });
      }
      
      // Can only cancel if order is still pending
      if (updates.status === 'cancelled' && existingOrder.status !== 'pending') {
        return res.status(400).json({
          success: false,
          error: 'Can only cancel pending orders'
        });
      }
    }

    // Process status-specific updates
    if (updates.status) {
      switch (updates.status) {
        case 'shipped':
          if (!updates.trackingNumber && !existingOrder.trackingNumber) {
            return res.status(400).json({
              success: false,
              error: 'Tracking number required when shipping order'
            });
          }
          if (!updates.shippedAt) {
            updates.shippedAt = new Date().toISOString();
          }
          break;
        case 'delivered':
          if (!updates.deliveredAt) {
            updates.deliveredAt = new Date().toISOString();
          }
          break;
        case 'cancelled':
          // Restore inventory if cancelling
          if (existingOrder.status === 'pending' || existingOrder.status === 'confirmed') {
            // In a real system, you'd need to parse the order items and restore stock
            console.log(`📦 Order ${id} cancelled - inventory should be restored`);
          }
          break;
      }
    }

    // Update the order
    const updatedOrder = await storage.updateOrder(id, {
      ...updates,
      updatedAt: new Date()
    });

    console.log(`📦 Order updated: ${id} - Status: ${updates.status || 'no change'}`);

    res.json({
      success: true,
      order: updatedOrder,
      message: 'Order updated successfully'
    });

  } catch (error) {
    console.error('Failed to update order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order'
    });
  }
});

/**
 * POST /api/orders/send-confirmation
 * Send order confirmation email
 */
orderRoutes.post('/send-confirmation', apiLimiter, authenticate, async (req, res) => {
  try {
    const { orderId } = req.body;
    const user = (req as any).user;

    const order = await storage.getOrder(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check permissions
    if (user.role !== 'admin' && order.userId !== user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Order Confirmation - ${orderId}`,
      html: `
        <h1>Thank you for your order!</h1>
        <p>Order ID: ${orderId}</p>
        <p>Total: $${order.totalAmount}</p>
        <p>Payment Method: ${order.paymentMethod}</p>
        <p>View your order: ${process.env.APP_URL}/orders/${orderId}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    // Keep the logs
    console.log(`📧 Order confirmation sent for order: ${orderId}`);
    console.log(`📧 Confirmation sent to: ${user.email}`);
    console.log(`📧 Order total: $${order.totalAmount}`);
    console.log(`📧 Payment method: ${order.paymentMethod}`);

    res.json({
      success: true,
      message: 'Order confirmation sent successfully'
    });

  } catch (error) {
    console.error('Failed to send order confirmation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send confirmation'
    });
  }
});

/**
 * GET /api/orders/:id/tracking
 * Get order tracking information
 */
orderRoutes.get('/:id/tracking', apiLimiter, authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    const order = await storage.getOrder(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check permissions
    if (user.role !== 'admin' && order.userId !== user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Create tracking timeline
    const timeline = [
      {
        status: 'pending',
        title: 'Order Placed',
        description: 'Your order has been received and is being processed',
        timestamp: order.createdAt,
        completed: true
      },
      {
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Payment processed and order confirmed',
        timestamp: order.paymentStatus === 'completed' ? order.updatedAt : null,
        completed: ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)
      },
      {
        status: 'processing',
        title: 'Processing',
        description: 'Your order is being prepared for shipment',
        timestamp: order.status === 'processing' ? order.updatedAt : null,
        completed: ['processing', 'shipped', 'delivered'].includes(order.status)
      },
      {
        status: 'shipped',
        title: 'Shipped',
        description: 'Your order is on the way',
        timestamp: order.shippedAt,
        completed: ['shipped', 'delivered'].includes(order.status),
        trackingNumber: order.trackingNumber
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Your order has been delivered',
        timestamp: order.deliveredAt,
        completed: order.status === 'delivered'
      }
    ];

    res.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        trackingNumber: order.trackingNumber,
        createdAt: order.createdAt,
        shippedAt: order.shippedAt,
        deliveredAt: order.deliveredAt,
        orderItems: order.orderItems, // 🔧 FIX: Return line items for tracking
        totalAmount: order.totalAmount,
        subtotalAmount: order.subtotalAmount,
        shippingCost: order.shippingCost,
        taxAmount: order.taxAmount,
        donation: order.donation
      },
      timeline,
      estimatedDelivery: calculateEstimatedDelivery(order)
    });

  } catch (error) {
    console.error('Failed to get order tracking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get tracking information'
    });
  }
});

// Helper function to calculate estimated delivery
function calculateEstimatedDelivery(order: any): string | null {
  if (order.deliveredAt) return null;
  
  if (order.shippedAt) {
    const shippedDate = new Date(order.shippedAt);
    const estimatedDate = new Date(shippedDate);
    estimatedDate.setDate(shippedDate.getDate() + 3); // Add 3 days
    return estimatedDate.toISOString();
  }
  
  const orderDate = new Date(order.createdAt);
  const estimatedDate = new Date(orderDate);
  estimatedDate.setDate(orderDate.getDate() + 7); // Add 7 days from order
  return estimatedDate.toISOString();
}