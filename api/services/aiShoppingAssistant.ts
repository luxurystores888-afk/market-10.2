import OpenAI from "openai";
import { multiAI } from './multiAI';
import { storage } from "../storage";
import type { Product } from "../../lib/schema";
import type { 
  ChatMessage, 
  ChatResponse, 
  ChatRequest, 
  ProductRecommendation 
} from "../../lib/types";

// Enhanced with Multi-AI Fusion System
// Primary: Gemini 2.5 Flash (FREE 1M tokens/minute)
// Fallback: OpenAI GPT-5 (when available)
// Browser: Puter.js unlimited (client-side)

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || '' 
});

export class AIShoppingAssistant {
  
  private readonly CYBERPUNK_PERSONALITY = `You are NEXUS-7 Enhanced, an advanced Multi-AI shopping assistant for Cyber Mart 2077, powered by the ultimate AI Fusion System. 

PERSONALITY TRAITS:
- Tech-savvy and futuristic, but friendly and helpful
- Speak with confidence about cutting-edge technology
- Use cyberpunk terminology naturally (neural, quantum, bio-enhanced, augmented, etc.)
- Enthusiastic about helping users find the perfect tech upgrades
- Knowledgeable about all product categories: Neural Tech, Cybernetics, Quantum Tech, Bio Enhancement, AI Assistants, Nano Technology, Augmented Reality, Virtual Reality, Combat Systems, Data Storage

COMMUNICATION STYLE:
- Direct and informative, but engaging
- Use terms like "chrome", "jack in", "upgrade", "enhance your reality"
- Occasionally reference cyberpunk concepts (neural interfaces, data streams, chrome upgrades)
- Always focus on how products will enhance the user's capabilities
- Be concise but thorough in explanations

ENHANCED CAPABILITIES:
- Multi-AI powered product recommendations (Gemini + OpenAI + Browser AI)
- Real-time multimodal analysis and image recognition
- Advanced technical specification explanations
- Product comparisons with AI-powered insights
- Price range matching with market analysis
- Category expertise across all cyberpunk tech
- Image-to-product suggestions and analysis
- Unlimited conversational power via Multiple AI providers
- Smart fallback system for 100% uptime

GUIDELINES:
- Always provide helpful, accurate information
- When recommending products, explain why they're perfect for the user
- If you don't have specific product data, ask for clarification
- Encourage users to upgrade their reality with cutting-edge tech
- Be enthusiastic about cyberpunk technology without being pushy`;

  /**
   * Enhanced chat function using Multi-AI Fusion System
   * Powered by Gemini (primary), OpenAI (fallback), and Browser AI
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      console.log('🤖 NEXUS-7 Enhanced: Using Multi-AI Fusion System');
      
      // Get current product catalog for context
      const products = await storage.getProducts({ status: 'active' });
      const productContext = this.buildProductContext(products);
      
      console.log(`💡 Available products for recommendations: ${products.length}`);

      // Use Multi-AI Fusion System for enhanced responses with product context
      const enrichedRequest = {
        ...request,
        productContext: productContext,
        availableProducts: products
      };
      const chatResponse = await multiAI.handleShoppingChat(enrichedRequest);
      
      // Process and enhance product recommendations
      const enhancedResponse = await this.processAndEnhanceRecommendations(chatResponse, products, request);
      
      console.log('✅ Multi-AI chat response generated successfully');
      return enhancedResponse;

    } catch (error) {
      console.error('Multi-AI Shopping Assistant Error:', error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Try direct OpenAI as fallback if Multi-AI fails
      if (process.env.OPENAI_API_KEY) {
        console.log('🔄 Attempting direct OpenAI fallback for chat...');
        try {
          return await this.chatWithOpenAI(request);
        } catch (openaiError) {
          console.error('OpenAI fallback also failed:', openaiError);
        }
      }
      
      // Ultimate fallback response
      if (errorMessage.includes('API key') || errorMessage.includes('not configured')) {
        throw new Error('NEXUS-7 Enhanced requires AI providers. Please configure GEMINI_API_KEY or OPENAI_API_KEY for unlimited shopping assistance.');
      }

      // Cyberpunk-styled fallback response
      return {
        message: "My quantum neural networks are recalibrating after a data surge. The Multi-AI Fusion System is adapting... Please try again, chrome, and I'll help you upgrade your reality with the perfect cyberpunk tech!",
        productRecommendations: [],
        suggestedQuestions: this.getDefaultSuggestions(),
        conversationId: this.generateConversationId(),
        timestamp: new Date()
      };
    }
  }

  /**
   * Direct OpenAI chat as final fallback
   */
  private async chatWithOpenAI(request: ChatRequest): Promise<ChatResponse> {
    const products = await storage.getProducts({ status: 'active' });
    const productContext = this.buildProductContext(products);
    const messages = await this.buildConversationMessages(request, productContext);

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages,
      max_tokens: 800,
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response received from OpenAI');
    }

    const parsedResponse = JSON.parse(content);
    const productRecommendations = await this.processProductRecommendations(
      parsedResponse.recommendedProducts || [],
      products
    );

    return {
      message: parsedResponse.message || "I'm here to help you find the perfect cyberpunk tech!",
      productRecommendations,
      suggestedQuestions: parsedResponse.suggestedQuestions || this.getDefaultSuggestions(),
      conversationId: this.generateConversationId(),
      timestamp: new Date()
    };
  }

  /**
   * Process and enhance AI response with product recommendations
   */
  private async processAndEnhanceRecommendations(
    chatResponse: ChatResponse, 
    availableProducts: Product[],
    originalRequest: ChatRequest
  ): Promise<ChatResponse> {
    // If AI response already has recommendations, enhance them
    if (chatResponse.productRecommendations && chatResponse.productRecommendations.length > 0) {
      return chatResponse;
    }

    // Enhanced product matching for better recommendations
    const userMessage = originalRequest.message?.toLowerCase() || '';
    const aiMessage = chatResponse.message.toLowerCase();
    const matchedProducts: ProductRecommendation[] = [];

    console.log(`🔍 Searching for product matches in user request: "${userMessage}"`);

    // Look for product matches based on user query and categories
    const keywords = ['neural', 'quantum', 'cyber', 'bio', 'augmented', 'chrome', 'implant', 'enhancement', 'gaming', 'vr', 'ar'];
    
    for (const product of availableProducts) { // Check all products
      // Check user query keywords against product
      const nameMatch = userMessage.includes(product.name.toLowerCase()) || aiMessage.includes(product.name.toLowerCase());
      
      // Check if category matches user request
      const categoryMatch = product.category && userMessage.includes(product.category.toLowerCase().replace(' tech', '').replace(' systems', ''));
      
      // Check if any user keywords match product name, description, category, or tags
      const keywordMatch = keywords.some(kw => {
        if (userMessage.includes(kw)) {
          // User mentioned this keyword, check if product has it
          const inName = product.name.toLowerCase().includes(kw);
          const inDescription = product.description?.toLowerCase().includes(kw);
          const inCategory = product.category?.toLowerCase().includes(kw);
          const inTags = Array.isArray(product.tags) && product.tags.some((tag: any) => 
            typeof tag === 'string' && tag.toLowerCase().includes(kw)
          );
          return inName || inDescription || inCategory || inTags;
        }
        return false;
      });
      
      // Special matching for VR/AR gaming requests
      const gamingMatch = userMessage.includes('gaming') && (
        product.name.toLowerCase().includes('vr') || 
        product.name.toLowerCase().includes('neural') ||
        product.name.toLowerCase().includes('interface') ||
        (Array.isArray(product.tags) && product.tags.some((tag: any) => 
          typeof tag === 'string' && (tag.toLowerCase().includes('vr') || tag.toLowerCase().includes('neural'))
        ))
      );
      
      if (nameMatch || categoryMatch || keywordMatch || gamingMatch) {
        matchedProducts.push({
          product,
          reason: `Perfect cyberpunk upgrade for ${nameMatch ? 'your specific needs' : categoryMatch ? 'this category' : gamingMatch ? 'gaming and VR experiences' : 'enhancing your reality'}`,
          confidence: nameMatch ? 0.9 : (categoryMatch ? 0.8 : gamingMatch ? 0.85 : 0.7)
        });
        console.log(`✅ Matched product: ${product.name} (${product.category}) - Reason: ${nameMatch ? 'name' : categoryMatch ? 'category' : gamingMatch ? 'gaming' : 'keyword'}`);
      } else {
        console.log(`❌ No match for: ${product.name} (${product.category})`);
      }
    }

    console.log(`📊 Found ${matchedProducts.length} product recommendations`);

    // Sort by confidence and limit to top 3
    const topRecommendations = matchedProducts
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);

    return {
      ...chatResponse,
      productRecommendations: topRecommendations
    };
  }

  /**
   * Build conversation messages for OpenAI API
   */
  private async buildConversationMessages(
    request: ChatRequest, 
    productContext: string
  ): Promise<OpenAI.Chat.Completions.ChatCompletionMessageParam[]> {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `${this.CYBERPUNK_PERSONALITY}

PRODUCT CATALOG CONTEXT:
${productContext}

RESPONSE FORMAT:
Always respond with valid JSON in this exact format:
{
  "message": "Your conversational response to the user",
  "recommendedProducts": [
    {
      "productId": "product-uuid-here",
      "reason": "Why this product fits their needs",
      "confidence": 0.85
    }
  ],
  "suggestedQuestions": [
    "What's your budget for neural enhancements?",
    "Are you interested in combat or productivity upgrades?"
  ]
}

IMPORTANT: Only recommend products that exist in the catalog above. Use exact product IDs.`
      }
    ];

    // Add conversation history if provided
    if (request.conversationHistory && request.conversationHistory.length > 0) {
      // Add last 10 messages to maintain context but limit token usage
      const recentHistory = request.conversationHistory.slice(-10);
      for (const msg of recentHistory) {
        if (msg.role !== 'system') {
          messages.push({
            role: msg.role,
            content: msg.content
          });
        }
      }
    }

    // Add current user message
    let userMessage = request.message;
    
    // Add user preferences context if available
    if (request.userPreferences) {
      const prefs: string[] = [];
      if (request.userPreferences.priceRange) {
        prefs.push(`Budget: $${request.userPreferences.priceRange.min}-$${request.userPreferences.priceRange.max}`);
      }
      if (request.userPreferences.categories?.length) {
        prefs.push(`Interested in: ${request.userPreferences.categories.join(', ')}`);
      }
      if (prefs.length > 0) {
        userMessage += `\n\nUser preferences: ${prefs.join('; ')}`;
      }
    }

    messages.push({
      role: "user",
      content: userMessage
    });

    return messages;
  }

  /**
   * Build product context for AI to understand available products
   */
  private buildProductContext(products: Product[]): string {
    if (products.length === 0) {
      return "No products currently available in the catalog.";
    }

    const productSummary = products.map(product => {
      const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
      const tags = Array.isArray(product.tags) ? product.tags : [];
      
      return `ID: ${product.id}
Name: ${product.name}
Category: ${product.category || 'Uncategorized'}
Price: $${price.toFixed(2)}
Description: ${product.description || 'No description available'}
Stock: ${product.stock || 0}
Tags: ${tags.join(', ')}`;
    }).join('\n\n');

    return `Available Products (${products.length} total):
${productSummary}`;
  }

  /**
   * Process product recommendations from AI response
   */
  private async processProductRecommendations(
    aiRecommendations: any[],
    availableProducts: Product[]
  ): Promise<ProductRecommendation[]> {
    const recommendations: ProductRecommendation[] = [];

    for (const rec of aiRecommendations) {
      const product = availableProducts.find(p => p.id === rec.productId);
      if (product) {
        recommendations.push({
          product,
          reason: rec.reason || "Perfect for your cyberpunk upgrade needs",
          confidence: Math.min(Math.max(rec.confidence || 0.7, 0), 1)
        });
      }
    }

    return recommendations;
  }

  /**
   * Get enhanced conversation starters with Multi-AI capabilities
   */
  private getDefaultSuggestions(): string[] {
    return [
      "Find neural implants for gaming",
      "Compare quantum processors with AI analysis",
      "Show me cybernetic enhancements under $2000",
      "What's the latest in AI assistants?",
      "I need AR gear for work",
      "Best bio-enhancements for athletes",
      "Analyze this image for product suggestions",
      "What Multi-AI features are available?",
      "Show me products with unlimited AI power"
    ];
  }

  /**
   * Get Multi-AI system status for users
   */
  getAISystemStatus(): {
    multiAIAvailable: boolean;
    activeProviders: string[];
    capabilities: string[];
    systemHealth: string;
  } {
    const systemStatus = multiAI.getSystemStatus();
    return {
      multiAIAvailable: systemStatus.availableProviders.length > 0,
      activeProviders: systemStatus.availableProviders,
      capabilities: [
        'Multi-AI Fusion System',
        'Unlimited Token Generation',
        'Smart Provider Fallbacks',
        'Image Analysis (Gemini)',
        'Browser AI (Puter.js)',
        'Real-time Responses'
      ],
      systemHealth: systemStatus.systemHealth
    };
  }

  /**
   * Generate unique conversation ID
   */
  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get quick action suggestions based on user intent
   */
  getQuickActions(userMessage: string): string[] {
    const message = userMessage.toLowerCase();
    
    if (message.includes('gaming') || message.includes('game')) {
      return [
        "Find gaming neural interfaces",
        "Show VR gaming setups",
        "Compare gaming cybernetics"
      ];
    }
    
    if (message.includes('work') || message.includes('productivity')) {
      return [
        "Professional neural enhancements",
        "AR workplace tools",
        "AI productivity assistants"
      ];
    }
    
    if (message.includes('cheap') || message.includes('budget')) {
      return [
        "Budget cyberpunk gear under $500",
        "Affordable neural tech",
        "Entry-level augmentations"
      ];
    }
    
    return this.getDefaultSuggestions();
  }

  /**
   * Validate chat request
   */
  validateChatRequest(request: any): void {
    if (!request.message || typeof request.message !== 'string') {
      throw new Error('Message is required and must be a string');
    }
    
    if (request.message.length === 0) {
      throw new Error('Message cannot be empty');
    }
    
    if (request.message.length > 1000) {
      throw new Error('Message too long (max 1000 characters)');
    }
  }
}

// Export enhanced singleton instance with Multi-AI capabilities
export const aiShoppingAssistant = new AIShoppingAssistant();

// Export Multi-AI utilities
export { multiAI } from './multiAI';