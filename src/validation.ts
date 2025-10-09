import { z } from 'zod';

// Errors
const errors = {
  en: { required: 'Field required' },
  ar: { required: 'الحقل مطلوب' }
};

// Product schema
export const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string().optional(),
  category: z.string().optional(),
  stock: z.number().int().min(0).default(0),
  imageUrl: z.string().url().optional()
});

// Order schema
export const orderSchema = z.object({
  userId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive()
  })),
  totalAmount: z.number().positive(),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string().optional(),
    zipCode: z.string(),
    country: z.string()
  }).optional(),
  paymentMethod: z.string().optional()
});

// Payment schema
export const paymentSchema = z.object({
  orderId: z.string(),
  amount: z.number().positive(),
  method: z.enum(['credit_card', 'crypto', 'paypal', 'stripe']),
  currency: z.string().default('USD')
});

export type ProductInput = z.infer<typeof productSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
