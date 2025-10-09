import { z } from 'zod';

// Product validation schemas
export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal"),
  category: z.string().min(1).max(100).optional(),
  imageUrl: z.string().url().optional(),
  stock: z.number().int().min(0).optional(),
  status: z.enum(['active', 'inactive', 'draft']).optional(),
  tags: z.array(z.string()).optional()
});

export const updateProductSchema = createProductSchema.partial();

export const getProductsQuerySchema = z.object({
  category: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).refine(n => n > 0 && n <= 100, {
    message: "Limit must be between 1 and 100"
  }).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional()
});

export const productIdSchema = z.object({
  id: z.string().uuid()
});

// Analytics validation schemas
export const analyticsEventSchema = z.object({
  eventType: z.string().min(1).max(100),
  eventData: z.record(z.any()).optional(),
  userAgent: z.string().optional(),
  ipAddress: z.string().ip().optional(),
  referrer: z.string().url().optional()
});

// Generic validation middleware
export const validateBody = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

export const validateParams = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};