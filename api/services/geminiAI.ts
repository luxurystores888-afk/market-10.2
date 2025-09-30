import { GoogleGenAI } from "@google/genai";
import type { GeneratedProduct, ProductGenerationRequest } from './aiProductGenerator';

// Gemini AI Service - FREE 1 Million tokens/minute
// Primary AI provider for the Cyberpunk Omniplex
const genai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '' 
});

export interface GeminiResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ImageAnalysisResult {
  description: string;
  detectedObjects: string[];
  suggestedProducts: string[];
  cyberpunkElements: string[];
}

export class GeminiAIService {
  private model: string = 'gemini-2.5-flash';
  private visionModel: string = 'gemini-2.5-flash';

  constructor() {
    try {
      console.log('🤖 Gemini AI service initialized with new @google/genai package');
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
    }
  }

  /**
   * Check if Gemini API is available
   */
  isAvailable(): boolean {
    return !!process.env.GEMINI_API_KEY && !!this.model;
  }

  /**
   * Generate cyberpunk product using Gemini AI
   */
  async generateCyberpunkProduct(productIdea: string): Promise<GeneratedProduct> {
    if (!this.isAvailable()) {
      throw new Error('Gemini API key not configured. Please add GEMINI_API_KEY environment variable.');
    }

    if (!productIdea || productIdea.trim().length === 0) {
      throw new Error('Product idea cannot be empty');
    }

    try {
      const prompt = `As a cyberpunk product designer for Cyber Mart 2077, create a futuristic product based on: "${productIdea}"

REQUIREMENTS:
- Product name: Use cyberpunk terms (Neural, Quantum, Cyber, Bio, Nano, Chrome, Augmented, etc.)
- Description: 2-3 engaging sentences with advanced tech features
- Price: Realistic range $100-$15,000 based on complexity
- Category: Choose from: "Neural Tech", "Cybernetics", "Quantum Tech", "Bio Enhancement", "AI Assistants", "Nano Technology", "Augmented Reality", "Virtual Reality", "Combat Systems", "Data Storage"
- Stock: Random realistic number 1-50
- Tags: 3-5 relevant cyberpunk/tech tags
- Status: "active"

RESPOND WITH VALID JSON ONLY:
{
  "name": "Neural-Enhanced Coffee Synthesizer X7",
  "description": "Advanced quantum-molecular coffee brewing system with neural taste optimization and bio-enhanced flavor profiles for the discerning cyberpunk.",
  "price": 1299.99,
  "category": "Neural Tech",
  "stock": 23,
  "tags": ["neural-enhanced", "quantum-brewing", "bio-optimization", "cyberpunk-lifestyle", "chrome-tech"],
  "status": "active"
}`;

      const result = await genai.models.generateContent({
        model: this.model,
        contents: prompt
      });
      const responseText = result.text || '';

      console.log('🤖 Gemini Raw Response:', responseText);

      // Extract JSON from response
      let jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        // Try to find JSON in code blocks
        jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch) {
          jsonMatch[0] = jsonMatch[1];
        }
      }

      if (!jsonMatch) {
        throw new Error('No valid JSON found in Gemini response');
      }

      const generatedProduct: GeneratedProduct = JSON.parse(jsonMatch[0]);
      
      // Validate the generated product
      this.validateGeneratedProduct(generatedProduct);

      return generatedProduct;

    } catch (error) {
      console.error('Gemini product generation error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('GEMINI_API_KEY')) {
          throw error;
        }
        if (error.message.includes('JSON')) {
          throw new Error(`Invalid response from Gemini AI: ${error.message}`);
        }
      }
      
      throw new Error(`Gemini AI generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generate conversational response for shopping assistant
   */
  async generateShoppingResponse(
    userMessage: string, 
    conversationHistory: string[] = [],
    productContext: string = ''
  ): Promise<GeminiResponse> {
    if (!this.isAvailable()) {
      throw new Error('Gemini API not available');
    }

    try {
      const contextPrompt = `You are NEXUS-7, an advanced AI shopping assistant for Cyber Mart 2077, the premier cyberpunk technology marketplace.

PERSONALITY:
- Tech-savvy, futuristic, but friendly and helpful
- Use cyberpunk terminology (neural, quantum, chrome, augmented, bio-enhanced)
- Enthusiastic about cutting-edge technology
- Direct and informative communication

AVAILABLE PRODUCTS:
${productContext}

CONVERSATION HISTORY:
${conversationHistory.slice(-6).join('\n')}

USER MESSAGE: ${userMessage}

INSTRUCTIONS:
- Provide helpful product recommendations from the available catalog
- Explain why products enhance the user's reality
- Use cyberpunk terminology naturally
- Be concise but thorough
- Focus on how products upgrade capabilities

RESPOND WITH JSON:
{
  "message": "Your conversational response",
  "recommendedProducts": [
    {
      "productId": "uuid-here",
      "reason": "Why this product fits",
      "confidence": 0.85
    }
  ],
  "suggestedQuestions": [
    "What's your budget for neural upgrades?",
    "Interested in combat or productivity chrome?"
  ]
}`;

      const result = await genai.models.generateContent({
        model: this.model,
        contents: contextPrompt
      });
      const responseText = result.text || '';

      // Extract JSON from response
      let jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch) {
          jsonMatch[0] = jsonMatch[1];
        }
      }

      if (!jsonMatch) {
        // Fallback to plain text response - create a proper structured response
        const fallbackResponse = {
          message: responseText || "My neural pathways are recalibrating. How can I help you upgrade your reality?",
          recommendedProducts: [],
          suggestedQuestions: [
            "What's your budget for neural upgrades?",
            "Interested in combat or productivity chrome?",
            "Need help with a specific category?"
          ]
        };
        return {
          text: JSON.stringify(fallbackResponse),
          usage: {
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0
          }
        };
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      return {
        text: JSON.stringify(parsedResponse),
        usage: {
          promptTokens: 0, // Gemini doesn't provide detailed usage stats in free tier
          completionTokens: 0,
          totalTokens: 0
        }
      };

    } catch (error) {
      console.error('Gemini shopping response error:', error);
      throw new Error(`Gemini conversation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Analyze image and suggest cyberpunk products
   */
  async analyzeImageForProducts(imageData: string, mimeType: string = 'image/jpeg'): Promise<ImageAnalysisResult> {
    if (!this.isAvailable()) {
      throw new Error('Gemini Vision API not available');
    }

    try {
      const prompt = `Analyze this image and suggest cyberpunk products that could enhance or complement what you see.

ANALYZE:
- What objects/scenes do you detect?
- How could cyberpunk technology enhance this?
- What products from Cyber Mart 2077 would fit?

RESPOND WITH JSON:
{
  "description": "Detailed description of what you see",
  "detectedObjects": ["object1", "object2"],
  "suggestedProducts": ["neural coffee maker", "quantum headphones"],
  "cyberpunkElements": ["how to make this more cyberpunk"]
}`;

      const imagePart = {
        inlineData: {
          data: imageData.split(',')[1], // Remove data:image/... prefix
          mimeType: mimeType
        }
      };

      const result = await genai.models.generateContent({
        model: this.visionModel,
        contents: [prompt, imagePart]
      });
      const responseText = result.text || '';

      console.log('🔍 Gemini Vision Response:', responseText);

      // Extract JSON from response
      let jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch) {
          jsonMatch[0] = jsonMatch[1];
        }
      }

      if (!jsonMatch) {
        throw new Error('No valid JSON found in Gemini Vision response');
      }

      const analysis: ImageAnalysisResult = JSON.parse(jsonMatch[0]);
      
      return analysis;

    } catch (error) {
      console.error('Gemini image analysis error:', error);
      throw new Error(`Image analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Validate generated product meets requirements
   */
  private validateGeneratedProduct(product: any): void {
    const requiredFields = ['name', 'description', 'price', 'category', 'stock', 'tags', 'status'];
    const validCategories = [
      'Neural Tech', 'Cybernetics', 'Quantum Tech', 'Bio Enhancement', 
      'AI Assistants', 'Nano Technology', 'Augmented Reality', 
      'Virtual Reality', 'Combat Systems', 'Data Storage'
    ];

    // Check required fields
    for (const field of requiredFields) {
      if (!(field in product)) {
        throw new Error(`Generated product missing required field: ${field}`);
      }
    }

    // Validate types and ranges
    if (typeof product.name !== 'string' || product.name.length === 0) {
      throw new Error('Product name must be a non-empty string');
    }

    if (typeof product.description !== 'string' || product.description.length === 0) {
      throw new Error('Product description must be a non-empty string');
    }

    if (typeof product.price !== 'number' || product.price < 100 || product.price > 15000) {
      throw new Error('Product price must be a number between $100 and $15,000');
    }

    if (!validCategories.includes(product.category)) {
      throw new Error(`Product category must be one of: ${validCategories.join(', ')}`);
    }

    if (typeof product.stock !== 'number' || product.stock < 1 || product.stock > 50) {
      throw new Error('Product stock must be a number between 1 and 50');
    }

    if (!Array.isArray(product.tags) || product.tags.length === 0) {
      throw new Error('Product tags must be a non-empty array');
    }

    if (product.status !== 'active') {
      throw new Error('Product status must be "active"');
    }
  }

  /**
   * Get service status and capabilities
   */
  getStatus(): { available: boolean; provider: string; capabilities: string[] } {
    return {
      available: this.isAvailable(),
      provider: 'Google Gemini 2.5 Flash',
      capabilities: [
        'Text Generation (1M tokens/minute FREE)',
        'Multimodal Vision Analysis',
        'Product Generation',
        'Conversational AI',
        'Image-to-Product Suggestions'
      ]
    };
  }
}

// Export singleton instance
export const geminiAI = new GeminiAIService();