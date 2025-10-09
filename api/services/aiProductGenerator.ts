import OpenAI from "openai";
import { multiAI } from './multiAI';
import { mockDataGenerators } from '../../lib/mockData';

// Enhanced with Multi-AI Fusion System for FREE unlimited AI power
// Primary: Gemini 2.5 Flash (1M tokens/minute FREE)
// Fallback: OpenAI GPT-5 (when available)
// Browser: Puter.js unlimited GPT-5

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || '' 
});

export interface GeneratedProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  tags: string[];
  status: 'active';
}

export interface ProductGenerationRequest {
  productIdea: string;
}

export class AIProductGenerator {
  
  /**
   * Generate a cyberpunk-themed product using Multi-AI Fusion System
   * Primary: Gemini 2.5 Flash (FREE 1M tokens/minute)
   * Fallback: OpenAI GPT-5 (when available)
   */
  async generateCyberpunkProduct(productIdea: string): Promise<GeneratedProduct> {
    if (!productIdea || productIdea.trim().length === 0) {
      throw new Error('Product idea cannot be empty');
    }

    try {
      console.log('🚀 Using Multi-AI Fusion System for product generation');
      
      // Use the Multi-AI system which handles provider selection and fallbacks
      const generatedProduct = await multiAI.generateCyberpunkProduct(productIdea);
      
      console.log(`✅ Multi-AI generated product: ${generatedProduct.name}`);
      return generatedProduct;

    } catch (error) {
      console.error('Multi-AI product generation error:', error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // If Multi-AI fails completely, try direct OpenAI as last resort
      if (process.env.OPENAI_API_KEY) {
        console.log('🔄 Attempting direct OpenAI fallback...');
        return this.generateWithOpenAI(productIdea);
      }
      
      // If no providers available, throw informative error
      if (errorMessage.includes('API key') || errorMessage.includes('not configured')) {
        const error = new Error('AI services are not configured. Please add GEMINI_API_KEY or OPENAI_API_KEY environment variables for unlimited product generation.');
        error.name = 'API_KEY_MISSING';
        throw error;
      }
      
      throw new Error(`AI product generation failed: ${errorMessage}`);
    }
  }

  /**
   * Direct OpenAI generation as final fallback
   */
  private async generateWithOpenAI(productIdea: string): Promise<GeneratedProduct> {
    const prompt = `Generate a cyberpunk-themed product based on this idea: "${productIdea}"

Create a futuristic, cyberpunk-style product with the following specifications:
- Product name: Make it sound cyberpunk/futuristic (use terms like Neural, Quantum, Cyber, Bio, Nano, etc.)
- Description: 2-3 sentences, engaging and futuristic, describe advanced technology features
- Price: Realistic range between $100-$15,000 based on product complexity
- Category: Choose from: "Neural Tech", "Cybernetics", "Quantum Tech", "Bio Enhancement", "AI Assistants", "Nano Technology", "Augmented Reality", "Virtual Reality", "Combat Systems", "Data Storage"
- Stock: Random realistic number between 1-50
- Tags: 3-5 relevant cyberpunk/tech tags

Respond with JSON in exactly this format:
{
  "name": "product name",
  "description": "product description",
  "price": 1299.99,
  "category": "Neural Tech",
  "stock": 15,
  "tags": ["tag1", "tag2", "tag3"],
  "status": "active"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a cyberpunk product designer creating futuristic technology products. Always respond with valid JSON format. Make products sound cutting-edge and cyberpunk-themed."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response received from OpenAI');
    }

    const generatedProduct: GeneratedProduct = JSON.parse(content);
    this.validateGeneratedProduct(generatedProduct);
    
    return generatedProduct;
  }

  /**
   * Validate that the generated product meets our requirements
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
   * Get AI system status with provider information
   */
  getAISystemStatus(): {
    multiAI: any;
    providers: string[];
    primaryProvider: string;
    systemHealth: string;
  } {
    const systemStatus = multiAI.getSystemStatus();
    return {
      multiAI: systemStatus,
      providers: systemStatus.availableProviders,
      primaryProvider: systemStatus.activeProvider,
      systemHealth: systemStatus.systemHealth
    };
  }

  /**
   * Get some example cyberpunk product ideas for inspiration
   */
  getExampleProductIdeas(): string[] {
    return mockDataGenerators.productIdeas();
  }
}

// Export a singleton instance enhanced with Multi-AI capabilities
export const aiProductGenerator = new AIProductGenerator();

// Export additional types and utilities
export { multiAI } from './multiAI';
