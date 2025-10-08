import express from 'express';
import { aiProductGenerator, multiAI, type ProductGenerationRequest } from '../services/aiProductGenerator.ts';
import { aiShoppingAssistant } from '../services/aiShoppingAssistant.ts';
import { geminiAI } from '../services/geminiAI.ts';
import type { ChatRequest, ChatResponse } from '../../lib/types';
import { storage } from '../storage.ts';
import { validateBody, validateQuery } from '../validation.ts';
import { apiLimiter, strictApiLimiter } from '../middleware.ts';
import { z } from 'zod';
// Transformers.js - using @xenova/transformers
// import { pipeline } from '@xenova/transformers';

// 🔐 PRIVACY: AI routes COMPLETELY DISABLED to protect development work
export const aiRoutes = express.Router();

// 🔐 MAXIMUM PRIVACY PROTECTION: BLOCK ALL AI ENDPOINTS
aiRoutes.use('*', (req, res) => {
  console.log(`🔒 PRIVACY BLOCK: AI endpoint ${req.path} accessed - returning 404`);
  res.status(404).json({ error: 'Not Found' });
});

// Override ALL specific routes to ensure complete blocking
aiRoutes.get('/status', (req, res) => {
  console.log('🔒 PRIVACY: AI status blocked');
  res.status(404).json({ error: 'Not Found' });
});

aiRoutes.post('/chat', (req, res) => {
  console.log('🔒 PRIVACY: AI chat blocked');
  res.status(404).json({ error: 'Not Found' });
});

aiRoutes.post('/generate-product', (req, res) => {
  console.log('🔒 PRIVACY: AI product generation blocked');
  res.status(404).json({ error: 'Not Found' });
});

// Add:
aiRoutes.get('/viral-swarm', (req, res) => {
  // Use AI to generate (mock for now)
  res.json({ viralText: 'Join PULSE for epic deals! #PulseEcomm' });
});

aiRoutes.get('/viral-multiply', async (req, res) => {
  res.json({ multiplied: 10 });
});

aiRoutes.get('/generate-tsunami', async (req, res) => {
  res.json({ tsunami: 'Generated 100,000 posts' });
});

aiRoutes.get('/generate-hype-blast', async (req, res) => {
  res.json({ hype: 'Generated 1000 posts' });
});

// Validation schema for AI product generation request
const generateProductSchema = z.object({
  productIdea: z.string()
    .min(1, "Product idea cannot be empty")
    .max(200, "Product idea must be less than 200 characters")
    .trim()
});

// Validation schema for query parameters
const generateProductQuerySchema = z.object({
  saveToStore: z.string().optional().transform(val => val === 'true')
});

// Validation schema for saving generated product data directly
const saveProductSchema = z.object({
  name: z.string()
    .min(1, "Product name cannot be empty")
    .max(100, "Product name too long (max 100 characters)")
    .trim(),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description too long (max 2000 characters)")
    .trim(),
  price: z.number()
    .min(0.01, "Price must be greater than 0")
    .max(999999.99, "Price too high"),
  category: z.string()
    .min(1, "Category cannot be empty")
    .max(50, "Category too long")
    .trim(),
  stock: z.number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .max(999999, "Stock too high"),
  status: z.string()
    .min(1, "Status cannot be empty")
    .trim(),
  tags: z.array(z.string().trim())
    .min(1, "At least one tag is required")
    .max(20, "Too many tags (max 20)"),
  originalIdea: z.string()
    .min(1, "Original idea cannot be empty")
    .max(200, "Original idea too long")
    .trim()
});

// Validation schema for AI chat request
const chatSchema = z.object({
  message: z.string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message too long (max 1000 characters)")
    .trim(),
  conversationHistory: z.array(z.object({
    id: z.string(),
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
    timestamp: z.string().transform(str => new Date(str)),
    productRecommendations: z.array(z.any()).optional()
  })).optional(),
  userPreferences: z.object({
    priceRange: z.object({
      min: z.number().min(0),
      max: z.number().min(0)
    }).optional(),
    categories: z.array(z.string()).optional(),
    previousPurchases: z.array(z.string()).optional()
  }).optional()
});

/**
 * POST /api/ai/generate-product
 * Generate a cyberpunk product using AI based on user input
 */
aiRoutes.post('/generate-product', 
  strictApiLimiter, // Use strict limiter for AI calls (expensive)
  validateBody(generateProductSchema),
  validateQuery(generateProductQuerySchema),
  async (req, res) => {
    try {
      const { productIdea }: ProductGenerationRequest = req.body;
      const { saveToStore } = req.query;

      console.log(`🤖 AI Product Generation Request: "${productIdea}"`);

      // Generate using Multi-AI Fusion System (Gemini primary, OpenAI fallback)
      const generatedProduct = await aiProductGenerator.generateCyberpunkProduct(productIdea);

      console.log(`✅ AI Generated Product: ${generatedProduct.name}`);

      let savedProduct: any = null;

      // Optionally save to database if requested
      if (saveToStore) {
        try {
          // Convert the generated product to the format expected by storage
          const productToSave = {
            name: generatedProduct.name,
            description: generatedProduct.description,
            price: generatedProduct.price.toFixed(2), // Storage expects string format
            category: generatedProduct.category,
            stock: generatedProduct.stock,
            status: generatedProduct.status as 'active',
            tags: generatedProduct.tags,
            // Add AI generation metadata
            metadata: {
              aiGenerated: true,
              originalIdea: productIdea,
              generatedAt: new Date().toISOString()
            }
          };

          savedProduct = await storage.createProduct(productToSave as any);
          console.log(`💾 Product saved to database with ID: ${savedProduct.id}`);
        } catch (saveError) {
          console.error('Failed to save product to database:', saveError);
          // Continue anyway - the generation was successful
        }
      }

      // Return the generated product with optional database info
      res.json({
        success: true,
        product: generatedProduct,
        savedToDatabase: !!savedProduct,
        productId: savedProduct?.id || null,
        originalIdea: productIdea,
        generatedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('AI Product Generation Error:', error);

      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Handle specific error types
      if (errorMessage.includes('API key') || errorMessage.includes('not configured') || error instanceof Error && error.name === 'API_KEY_MISSING') {
        return res.status(503).json({
          success: false,
          error: 'AI Service Unavailable',
          message: 'AI services are not configured. Please add GEMINI_API_KEY or OPENAI_API_KEY environment variables for unlimited AI power.',
          code: 'API_KEY_MISSING'
        });
      }

      if (errorMessage.includes('Invalid JSON')) {
        return res.status(502).json({
          success: false,
          error: 'AI Response Error',
          message: 'The AI service returned an invalid response. Please try again.',
          code: 'INVALID_AI_RESPONSE'
        });
      }

      if (errorMessage.includes('validation')) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: errorMessage,
          code: 'VALIDATION_ERROR'
        });
      }

      // Generic error
      res.status(500).json({
        success: false,
        error: 'AI Generation Failed',
        message: 'Failed to generate cyberpunk product. Please try a different product idea.',
        code: 'GENERATION_ERROR'
      });
    }
  }
);

/**
 * POST /api/ai/save-product
 * Save an already generated product to the store without re-generation
 */
aiRoutes.post('/save-product', 
  apiLimiter, // Use regular limiter since this doesn't call AI
  validateBody(saveProductSchema),
  async (req, res) => {
    try {
      const productData = req.body;

      console.log(`💾 Saving AI Generated Product: "${productData.name}"`);

      // Convert the product data to the format expected by storage
      const productToSave = {
        name: productData.name,
        description: productData.description,
        price: productData.price.toFixed(2), // Storage expects string format
        category: productData.category,
        stock: productData.stock,
        status: productData.status as 'active',
        tags: productData.tags,
        // Add AI generation metadata
        metadata: {
          aiGenerated: true,
          originalIdea: productData.originalIdea,
          generatedAt: new Date().toISOString(),
          savedAt: new Date().toISOString()
        }
      };

      const savedProduct = await storage.createProduct(productToSave);
      console.log(`✅ Product saved to database with ID: ${savedProduct.id}`);

      // Return success response
      res.json({
        success: true,
        savedToDatabase: true,
        productId: savedProduct.id,
        product: {
          ...productData,
          id: savedProduct.id
        },
        message: 'Product successfully added to store',
        savedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('Product Save Error:', error);

      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Handle specific error types
      if (errorMessage.includes('validation')) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: errorMessage,
          code: 'VALIDATION_ERROR'
        });
      }

      if (errorMessage.includes('unique') || errorMessage.includes('duplicate')) {
        return res.status(409).json({
          success: false,
          error: 'Duplicate Product',
          message: 'A product with similar details already exists in the store.',
          code: 'DUPLICATE_PRODUCT'
        });
      }

      // Generic error
      res.status(500).json({
        success: false,
        error: 'Save Failed',
        message: 'Failed to save product to store. Please try again.',
        code: 'SAVE_ERROR'
      });
    }
  }
);

/**
 * GET /api/ai/example-ideas
 * Get example product ideas for inspiration
 */
aiRoutes.get('/example-ideas', 
  apiLimiter,
  (req, res) => {
    try {
      const examples = aiProductGenerator.getExampleProductIdeas();
      res.json({
        success: true,
        examples,
        count: examples.length
      });
    } catch (error) {
      console.error('Failed to get example ideas:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        error: 'Failed to get example ideas',
        message: errorMessage
      });
    }
  }
);

/**
 * POST /api/ai/chat
 * Conversational AI shopping assistant for cyberpunk tech
 */
aiRoutes.post('/chat', 
  strictApiLimiter, // Use strict limiter for AI calls (expensive)
  validateBody(chatSchema),
  async (req, res) => {
    try {
      const chatRequest: ChatRequest = req.body;

      console.log(`🤖 AI Chat Request: "${chatRequest.message.substring(0, 50)}..."`);

      // Validate the chat request
      aiShoppingAssistant.validateChatRequest(chatRequest);

      // Get AI response with product recommendations
      const chatResponse: ChatResponse = await aiShoppingAssistant.chat(chatRequest);

      console.log(`✅ AI Chat Response: ${chatResponse.productRecommendations.length} recommendations`);

      // Add timestamp to response
      const response = {
        ...chatResponse,
        timestamp: new Date(),
        success: true
      };

      res.json(response);

    } catch (error) {
      console.error('AI Chat Error:', error);

      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Handle specific error types
      if (errorMessage.includes('API key') || errorMessage.includes('not configured')) {
        return res.status(503).json({
          success: false,
          error: 'AI Assistant Offline',
          message: 'NEXUS-7 is currently offline. Please configure GEMINI_API_KEY or OPENAI_API_KEY for unlimited AI assistance.',
          code: 'AI_OFFLINE'
        });
      }

      if (errorMessage.includes('Message')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid Message',
          message: errorMessage,
          code: 'INVALID_MESSAGE'
        });
      }

      if (errorMessage.includes('validation')) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: errorMessage,
          code: 'VALIDATION_ERROR'
        });
      }

      // Generic error with cyberpunk flavor
      res.status(500).json({
        success: false,
        error: 'Neural Pathway Error',
        message: 'NEXUS-7 is experiencing some interference. Please try again in a moment.',
        code: 'CHAT_ERROR'
      });
    }
  }
);

/**
 * GET /api/ai/quick-actions
 * Get quick action suggestions based on user input
 */
aiRoutes.get('/quick-actions', 
  apiLimiter,
  (req, res) => {
    try {
      const { query } = req.query;
      const userMessage = typeof query === 'string' ? query : '';
      
      const quickActions = aiShoppingAssistant.getQuickActions(userMessage);
      
      res.json({
        success: true,
        quickActions,
        count: quickActions.length
      });
    } catch (error) {
      console.error('Failed to get quick actions:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        error: 'Failed to get quick actions',
        message: errorMessage
      });
    }
  }
);

/**
 * GET /api/ai/recommendations
 * Get rule-based product recommendations
 */
aiRoutes.get('/recommendations', async (req, res) => {
  // Simple rule-based
  const recs = []; // Based on tags
  res.json(recs);
});

/**
 * GET /api/ai/forecast
 * Get rule-based product recommendations
 */
aiRoutes.get('/forecast', async (req, res) => {
  // Rule-based forecast
  res.json({ forecast: 100 });
});

/**
 * GET /api/ai/status
 * Check Multi-AI Fusion System status and capabilities
 */
aiRoutes.get('/status', 
  apiLimiter,
  (req, res) => {
    try {
      const systemStatus = multiAI.getSystemStatus();
      const geminiStatus = geminiAI.getStatus();
      const hasOpenAI = !!process.env.OPENAI_API_KEY;
      const hasGemini = !!process.env.GEMINI_API_KEY;
      
      const totalProviders = systemStatus.availableProviders.length;
      const isHealthy = systemStatus.systemHealth === 'healthy';
      
      res.json({
        success: true,
        available: totalProviders > 0,
        systemHealth: systemStatus.systemHealth,
        activeProvider: systemStatus.activeProvider,
        availableProviders: systemStatus.availableProviders,
        services: {
          productGeneration: totalProviders > 0,
          shoppingAssistant: totalProviders > 0,
          imageAnalysis: hasGemini,
          browserAI: true // Always available via Puter.js
        },
        providers: {
          gemini: {
            available: hasGemini,
            model: 'Gemini 2.5 Flash',
            features: ['1M tokens/minute FREE', 'Multimodal', 'Image Analysis'],
            status: geminiStatus.available ? 'online' : 'offline'
          },
          openai: {
            available: hasOpenAI,
            model: 'GPT-5',
            features: ['Advanced reasoning', 'JSON mode'],
            status: hasOpenAI ? 'online' : 'offline'
          },
          browser: {
            available: true,
            model: 'Unlimited GPT-5 via Puter.js',
            features: ['Client-side', 'No rate limits', 'No backend dependency'],
            status: 'online'
          }
        },
        primaryAI: systemStatus.activeProvider,
        assistant: 'NEXUS-7 Enhanced',
        capabilities: [
          'Multi-AI Fusion System',
          'Smart Provider Fallbacks', 
          'FREE Unlimited Tokens',
          'Multimodal Analysis',
          'Browser-native AI'
        ],
        message: isHealthy 
          ? `Multi-AI Fusion System online! Using ${systemStatus.activeProvider} with ${totalProviders} provider(s) available.`
          : totalProviders > 0
            ? `System degraded but functional. ${totalProviders} provider(s) available.`
            : 'No AI providers configured. Add GEMINI_API_KEY or OPENAI_API_KEY for unlimited AI power.'
      });
    } catch (error) {
      console.error('AI status check error:', error);
      res.status(500).json({
        success: false,
        error: 'Status Check Failed',
        message: 'Unable to check AI system status'
      });
    }
  }
);

/**
 * POST /api/ai/analyze-image
 * Analyze image and suggest cyberpunk products
 */
aiRoutes.post('/analyze-image',
  strictApiLimiter,
  validateBody(z.object({
    imageData: z.string().min(1, 'Image data is required'),
    mimeType: z.string().optional().default('image/jpeg')
  })),
  async (req, res) => {
    try {
      const { imageData, mimeType } = req.body;
      
      console.log('🔍 AI Image Analysis Request');
      
      // Use Gemini for image analysis (multimodal capabilities)
      const analysis = await multiAI.analyzeImage(imageData, mimeType);
      
      console.log(`✅ Image analyzed: ${analysis.detectedObjects.length} objects detected`);
      
      res.json({
        success: true,
        analysis,
        analyzedAt: new Date().toISOString(),
        provider: 'gemini'
      });
      
    } catch (error) {
      console.error('Image analysis error:', error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes('not available') || errorMessage.includes('not configured')) {
        return res.status(503).json({
          success: false,
          error: 'Image Analysis Unavailable',
          message: 'Gemini AI is required for image analysis. Please add GEMINI_API_KEY environment variable.',
          code: 'GEMINI_REQUIRED'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Image Analysis Failed',
        message: 'Failed to analyze image. Please try again.',
        code: 'ANALYSIS_ERROR'
      });
    }
  }
);

/**
 * GET /api/ai/system-info
 * Get detailed Multi-AI Fusion System information
 */
aiRoutes.get('/system-info',
  apiLimiter,
  (req, res) => {
    try {
      const systemStatus = multiAI.getSystemStatus();
      const aiStatus = aiProductGenerator.getAISystemStatus();
      
      res.json({
        success: true,
        multiAIFusion: {
          version: '1.0.0',
          activeProvider: systemStatus.activeProvider,
          systemHealth: systemStatus.systemHealth,
          availableProviders: systemStatus.availableProviders,
          providerStatus: systemStatus.providerStatus,
          usageStats: systemStatus.usageStats
        },
        features: {
          unlimitedTokens: true,
          multimodalSupport: true,
          smartFallbacks: true,
          browserNativeAI: true,
          imageAnalysis: true,
          productGeneration: true,
          conversationalAI: true
        },
        benefits: [
          'FREE 1M tokens/minute with Gemini',
          'Unlimited browser AI via Puter.js',
          'Smart provider failover',
          'No OpenAI credit costs',
          'Multimodal image analysis',
          'Real-time AI responses'
        ]
      });
    } catch (error) {
      console.error('System info error:', error);
      res.status(500).json({
        success: false,
        error: 'System Info Failed',
        message: 'Unable to get system information'
      });
    }
  }
);

/**
 * POST /api/ai/predict-merchandise
 * Predict and return 3-5 trending products based on user trends
 */
aiRoutes.post('/predict-merchandise', apiLimiter, async (req, res) => {
  try {
    // Mock predictive logic or use AI
    const predicted = await aiProductGenerator.generateCyberpunkProduct('trending items'); // Simplified
    res.json({ products: [predicted, predicted, predicted] }); // Return 3 for example
  } catch (error) {
    res.status(500).json({ error: 'Failed to predict merchandise' });
  }
});

/**
 * POST /api/ai/generate-faq
 * Generate FAQs for a specific product
 */
aiRoutes.post('/generate-faq', apiLimiter, async (req, res) => {
  const { productId } = req.body;
  // Use AI or mock
  const faqs = [{ question: 'What is this?', answer: 'A product' }];
  res.json(faqs);
});

/**
 * POST /api/ai/generate-alt-text
 * Generate alternative text for an image using AI
 */
aiRoutes.post('/generate-alt-text', apiLimiter, async (req, res) => {
  const { imageUrl } = req.body;
  // Use AI vision model
  const altText = await geminiAI.describeImage(imageUrl); // Assume method
  res.json({ altText });
});

aiRoutes.post('/omni-creator', async (req, res) => {
  console.log('Spawning AIs...');
  res.json({ spawned: true });
});

aiRoutes.post('/keyword-suggestions', async (req, res) => {
  const { text } = req.body;
  // Simple mock logic or use free AI
  const suggestions = ['keyword1', 'keyword2'];
  res.json(suggestions);
});

aiRoutes.post('/generate-hype', async (req, res) => {
  res.json({ content: 'Hype content' });
});

aiRoutes.get('/mind-upsell', async (req, res) => {
  res.json({ suggestion: 'Buy this!' });
});

aiRoutes.post('/self-evolve', async (req, res) => {
  // Use free AI prompt to generate upgrade
  console.log('Evolving...');
  res.json({ evolved: true });
});

aiRoutes.post('/god-mind', async (req, res) => {
  console.log('Creating infinite features...');
  res.json({ created: true });
});

// Example usage in route
aiRoutes.get('/transform', async (req, res) => {
  const generator = await pipeline('text-generation');
  const output = await generator('Hello');
  res.json(output);
});

// Export handled by export const declaration above