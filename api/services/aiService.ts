import OpenAI from "openai";
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenAI } from "@google/genai";
import type { InsertAIGeneration } from "../../lib/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const DEFAULT_OPENAI_MODEL = "gpt-5";

// The newest Anthropic model is "claude-sonnet-4-20250514", not "claude-3-7-sonnet-20250219", "claude-3-5-sonnet-20241022" nor "claude-3-sonnet-20240229". 
const DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-4-20250514";

export interface AIProvider {
  name: string;
  status: 'active' | 'inactive' | 'error';
  capabilities: string[];
  costPerToken?: number;
  priority: number;
  maxTokens: number;
  rateLimit: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
  reliability: number; // 0-1 score
  averageResponseTime: number; // in milliseconds
  totalRequests?: number;
  successfulRequests?: number;
  totalCost?: number;
  lastUsed?: Date;
}

export interface ProductGenerationRequest {
  productName: string;
  category?: string;
  additionalContext?: string;
  promptType?: 'cyberpunk' | 'sci-fi' | 'tech-gadgets' | 'fashion' | 'minimal' | 'luxury';
  batchSize?: number;
  preferredProvider?: string;
  maxCost?: number;
}

export interface ProductGenerationResult {
  name: string;
  description: string;
  category: string;
  suggestedPrice: number;
  imagePrompt: string;
  tags: string[];
}

export interface ImageGenerationResult {
  imageUrl: string;
  prompt: string;
  style?: 'cyberpunk' | 'realistic' | 'minimalist' | 'futuristic' | 'artistic';
  cost?: number;
  provider?: string;
  processingTime?: number;
}

export interface ProviderCosts {
  [provider: string]: {
    textGeneration: number; // per 1k tokens
    imageGeneration: number; // per image
    embedding: number; // per 1k tokens
  };
}

export interface TaskOptimization {
  provider: string;
  estimatedCost: number;
  estimatedTime: number;
  reliability: number;
  reasoning: string;
}

interface CircuitBreakerState {
  failures: number;
  state: 'closed' | 'open' | 'half-open';
  nextRetry: number;
  successCount: number;
}

export class AIService {
  private openai: OpenAI | null;
  private anthropic: Anthropic | null;
  private gemini: GoogleGenAI | null;
  private xai: OpenAI | null; // Using OpenAI interface for xAI
  private deepseek: OpenAI | null; // Using OpenAI interface for DeepSeek
  private customApi: OpenAI | null; // Custom API integration
  private perplexity: OpenAI | null; // Perplexity API
  
  // Cost tracking and optimization
  private providerCosts: ProviderCosts = {
    openai: { textGeneration: 0.002, imageGeneration: 0.02, embedding: 0.0001 },
    anthropic: { textGeneration: 0.003, imageGeneration: 0.025, embedding: 0.0001 },
    gemini: { textGeneration: 0.001, imageGeneration: 0.015, embedding: 0.0001 }
  };
  private usageStats: Map<string, any>;
  private rateLimit: Map<string, { requests: number; tokens: number; resetTime: number }>;
  private circuitBreakers: Map<string, CircuitBreakerState>;
  
  constructor() {
    // Initialize providers with proper error handling for missing keys
    this.openai = process.env.OPENAI_API_KEY ? new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 30000,
      maxRetries: 3
    }) : null as any;
    
    this.anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      timeout: 30000
    }) : null as any;
    
    this.gemini = process.env.GEMINI_API_KEY ? new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY
    }) : null as any;
    
    this.xai = process.env.XAI_API_KEY ? new OpenAI({ 
      baseURL: "https://api.x.ai/v1", 
      apiKey: process.env.XAI_API_KEY,
      timeout: 30000,
      maxRetries: 2
    }) : null as any;
    
    this.deepseek = process.env.DEEPSEEK_API_KEY ? new OpenAI({ 
      baseURL: "https://api.deepseek.com/v1", 
      apiKey: process.env.DEEPSEEK_API_KEY,
      timeout: 30000,
      maxRetries: 3
    }) : null as any;
    
    // Custom API configuration
    this.customApi = (process.env.CUSTOM_API_KEY && process.env.CUSTOM_API_URL) ? new OpenAI({
      baseURL: process.env.CUSTOM_API_URL,
      apiKey: process.env.CUSTOM_API_KEY,
      timeout: 30000,
      maxRetries: 2
    }) : null;
    
    // Perplexity API configuration
    this.perplexity = process.env.PERPLEXITY_API_KEY ? new OpenAI({
      baseURL: "https://api.perplexity.ai",
      apiKey: process.env.PERPLEXITY_API_KEY,
      timeout: 30000,
      maxRetries: 2
    }) : null as any;
    
    // Initialize cost tracking and optimization
    this.initializeCostTracking();
    this.usageStats = new Map();
    this.rateLimit = new Map();
    this.circuitBreakers = new Map();
    this.initializeCircuitBreakers();
  }

  private initializeCircuitBreakers() {
    const providers = ['openai', 'anthropic', 'gemini', 'xai', 'deepseek', 'perplexity', 'custom'];
    for (const provider of providers) {
      this.circuitBreakers.set(provider, {
        failures: 0,
        state: 'closed',
        nextRetry: 0,
        successCount: 0
      });
    }
  }

  private async checkCircuitBreaker(provider: string): Promise<boolean> {
    const breaker = this.circuitBreakers.get(provider);
    if (!breaker) return true;

    const now = Date.now();
    
    switch (breaker.state) {
      case 'open':
        if (now > breaker.nextRetry) {
          breaker.state = 'half-open';
          breaker.successCount = 0;
          return true;
        }
        return false;
      
      case 'half-open':
        return true;
      
      case 'closed':
      default:
        return true;
    }
  }

  private recordProviderResult(provider: string, success: boolean, responseTime: number, actualCost: number = 0) {
    const breaker = this.circuitBreakers.get(provider);
    if (breaker) {
      if (success) {
        breaker.failures = 0;
        if (breaker.state === 'half-open') {
          breaker.successCount++;
          if (breaker.successCount >= 3) {
            breaker.state = 'closed';
          }
        }
      } else {
        breaker.failures++;
        if (breaker.failures >= 5) {
          breaker.state = 'open';
          breaker.nextRetry = Date.now() + (60000 * Math.pow(2, Math.min(breaker.failures - 5, 5))); 
        }
      }
    }
    
    this.trackUsage(provider, actualCost, success, responseTime);
  }

  private checkRateLimit(provider: string, estimatedTokens: number = 1000): boolean {
    const now = Date.now();
    const limit = this.rateLimit.get(provider);
    
    if (!limit || now > limit.resetTime) {
      this.rateLimit.set(provider, {
        requests: 1,
        tokens: estimatedTokens,
        resetTime: now + 60000
      });
      return true;
    }
    
    const providerLimits = this.getProviderRateLimits(provider);
    if (limit.requests >= providerLimits.requestsPerMinute || 
        limit.tokens + estimatedTokens > providerLimits.tokensPerMinute) {
      return false;
    }
    
    limit.requests++;
    limit.tokens += estimatedTokens;
    return true;
  }

  private getProviderRateLimits(provider: string): { requestsPerMinute: number; tokensPerMinute: number } {
    const limits: Record<string, { requestsPerMinute: number; tokensPerMinute: number }> = {
      openai: { requestsPerMinute: 500, tokensPerMinute: 80000 },
      anthropic: { requestsPerMinute: 300, tokensPerMinute: 40000 },
      gemini: { requestsPerMinute: 1000, tokensPerMinute: 100000 },
      xai: { requestsPerMinute: 200, tokensPerMinute: 30000 },
      deepseek: { requestsPerMinute: 600, tokensPerMinute: 100000 },
      perplexity: { requestsPerMinute: 100, tokensPerMinute: 20000 },
      custom: { requestsPerMinute: 100, tokensPerMinute: 20000 }
    };
    return limits[provider] || { requestsPerMinute: 60, tokensPerMinute: 10000 };
  }

  private initializeCostTracking() {
    // Current pricing as of 2025 (approximate costs per 1k tokens/images)
    this.providerCosts = {
      openai: {
        textGeneration: 0.002, // GPT-5 pricing
        imageGeneration: 0.04, // DALL-E 3 per image
        embedding: 0.0001
      },
      anthropic: {
        textGeneration: 0.003, // Claude Sonnet 4 pricing
        imageGeneration: 0, // No image generation
        embedding: 0
      },
      gemini: {
        textGeneration: 0.001, // Gemini 2.5 Flash
        imageGeneration: 0.02,
        embedding: 0.00005
      },
      xai: {
        textGeneration: 0.002, // Grok pricing
        imageGeneration: 0,
        embedding: 0
      },
      deepseek: {
        textGeneration: 0.00014, // Very cost-effective
        imageGeneration: 0,
        embedding: 0.00002
      },
      perplexity: {
        textGeneration: 0.002,
        imageGeneration: 0,
        embedding: 0
      }
    };
  }
  
  async getProviderStatus(): Promise<AIProvider[]> {
    const stats = this.getUsageStats();
    const providers: AIProvider[] = [
      {
        name: "OpenAI GPT-5",
        status: (process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR) && 
                (process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR) !== "default_key" ? 'active' : 'inactive',
        capabilities: ["Text Generation", "Image Generation", "Analysis"],
        costPerToken: this.providerCosts.openai.textGeneration,
        priority: 8,
        maxTokens: 128000,
        rateLimit: { requestsPerMinute: 500, tokensPerMinute: 80000 },
        reliability: 0.95,
        averageResponseTime: 2500,
        totalRequests: stats.openai?.totalRequests || 0,
        successfulRequests: stats.openai?.successfulRequests || 0,
        totalCost: stats.openai?.totalCost || 0,
        lastUsed: stats.openai?.lastUsed
      },
      {
        name: "Anthropic Claude",
        status: process.env.ANTHROPIC_API_KEY ? 'active' : 'inactive',
        capabilities: ["Text Generation", "Analysis", "Reasoning"],
        costPerToken: this.providerCosts.anthropic.textGeneration,
        priority: 9,
        maxTokens: 200000,
        rateLimit: { requestsPerMinute: 300, tokensPerMinute: 40000 },
        reliability: 0.97,
        averageResponseTime: 3000,
        totalRequests: stats.anthropic?.totalRequests || 0,
        successfulRequests: stats.anthropic?.successfulRequests || 0,
        totalCost: stats.anthropic?.totalCost || 0,
        lastUsed: stats.anthropic?.lastUsed
      },
      {
        name: "Google Gemini",
        status: process.env.GEMINI_API_KEY ? 'active' : 'inactive',
        capabilities: ["Text Generation", "Image Analysis", "Multimodal"],
        costPerToken: this.providerCosts.gemini.textGeneration,
        priority: 7,
        maxTokens: 1000000,
        rateLimit: { requestsPerMinute: 1000, tokensPerMinute: 100000 },
        reliability: 0.92,
        averageResponseTime: 2000,
        totalRequests: stats.gemini?.totalRequests || 0,
        successfulRequests: stats.gemini?.successfulRequests || 0,
        totalCost: stats.gemini?.totalCost || 0,
        lastUsed: stats.gemini?.lastUsed
      },
      {
        name: "xAI Grok",
        status: process.env.XAI_API_KEY ? 'active' : 'inactive',
        capabilities: ["Text Generation", "Real-time Data", "Analysis"],
        costPerToken: this.providerCosts.xai.textGeneration,
        priority: 6,
        maxTokens: 131072,
        rateLimit: { requestsPerMinute: 200, tokensPerMinute: 30000 },
        reliability: 0.88,
        averageResponseTime: 3500,
        totalRequests: stats.xai?.totalRequests || 0,
        successfulRequests: stats.xai?.successfulRequests || 0,
        totalCost: stats.xai?.totalCost || 0,
        lastUsed: stats.xai?.lastUsed
      },
      {
        name: "Perplexity",
        status: process.env.PERPLEXITY_API_KEY ? 'active' : 'inactive',
        capabilities: ["Research", "Real-time Web Search", "Citations"],
        costPerToken: this.providerCosts.perplexity.textGeneration,
        priority: 5,
        maxTokens: 8192,
        rateLimit: { requestsPerMinute: 100, tokensPerMinute: 20000 },
        reliability: 0.90,
        averageResponseTime: 4000,
        totalRequests: stats.perplexity?.totalRequests || 0,
        successfulRequests: stats.perplexity?.successfulRequests || 0,
        totalCost: stats.perplexity?.totalCost || 0,
        lastUsed: stats.perplexity?.lastUsed
      },
      {
        name: "DeepSeek R1",
        status: process.env.DEEPSEEK_API_KEY ? 'active' : 'inactive',
        capabilities: ["Advanced Reasoning", "Mathematical Analysis", "Code Generation", "Text Generation"],
        costPerToken: this.providerCosts.deepseek.textGeneration,
        priority: 10, // Highest priority due to cost-effectiveness
        maxTokens: 64000,
        rateLimit: { requestsPerMinute: 600, tokensPerMinute: 100000 },
        reliability: 0.94,
        averageResponseTime: 2200,
        totalRequests: stats.deepseek?.totalRequests || 0,
        successfulRequests: stats.deepseek?.successfulRequests || 0,
        totalCost: stats.deepseek?.totalCost || 0,
        lastUsed: stats.deepseek?.lastUsed
      }
    ];
    
    // Add custom API if configured
    if (this.customApi) {
      providers.push({
        name: process.env.CUSTOM_API_NAME || "Custom AI",
        status: 'active',
        capabilities: ["Custom Integration", "Text Generation", "Custom Analysis"],
        costPerToken: 0.002,
        priority: 5,
        maxTokens: 32000,
        rateLimit: { requestsPerMinute: 100, tokensPerMinute: 20000 },
        reliability: 0.85,
        averageResponseTime: 3000,
        totalRequests: stats.custom?.totalRequests || 0,
        successfulRequests: stats.custom?.successfulRequests || 0,
        totalCost: stats.custom?.totalCost || 0,
        lastUsed: stats.custom?.lastUsed
      });
    }

    return providers;
  }
  
  // Intelligent provider selection and cost optimization methods
  
  private getUsageStats(): any {
    const stats: any = {};
    for (const [provider, data] of this.usageStats) {
      stats[provider] = data;
    }
    return stats;
  }
  
  private trackUsage(provider: string, cost: number, success: boolean, responseTime: number) {
    const current = this.usageStats.get(provider) || {
      totalRequests: 0,
      successfulRequests: 0,
      totalCost: 0,
      averageResponseTime: 0,
      lastUsed: null
    };
    
    current.totalRequests++;
    if (success) current.successfulRequests++;
    current.totalCost += cost;
    current.averageResponseTime = ((current.averageResponseTime * (current.totalRequests - 1)) + responseTime) / current.totalRequests;
    current.lastUsed = new Date();
    
    this.usageStats.set(provider, current);
  }
  
  async selectOptimalProvider(task: 'text' | 'image' | 'analysis', options: {
    maxCost?: number;
    maxTime?: number;
    preferredProvider?: string;
    fallbackEnabled?: boolean;
  } = {}): Promise<TaskOptimization> {
    const providers = await this.getProviderStatus();
    const activeProviders = providers.filter(p => p.status === 'active');
    
    if (activeProviders.length === 0) {
      throw new Error('No active AI providers available');
    }
    
    // If preferred provider is specified and available, prioritize it
    if (options.preferredProvider) {
      const preferred = activeProviders.find(p => 
        p.name.toLowerCase().includes(options.preferredProvider!.toLowerCase())
      );
      if (preferred) {
        return {
          provider: options.preferredProvider.toLowerCase(),
          estimatedCost: preferred.costPerToken || 0.002,
          estimatedTime: preferred.averageResponseTime || 3000,
          reliability: preferred.reliability || 0.9,
          reasoning: `Using preferred provider: ${preferred.name}`
        };
      }
    }
    
    // Score each provider based on cost, reliability, and speed
    const scoredProviders = activeProviders.map(provider => {
      const costScore = Math.max(0, 1 - (provider.costPerToken! / 0.01)); // Normalize cost
      const reliabilityScore = provider.reliability || 0.9;
      const speedScore = Math.max(0, 1 - (provider.averageResponseTime || 3000) / 10000); // Normalize speed
      
      // Weight: cost 40%, reliability 40%, speed 20%
      const totalScore = (costScore * 0.4) + (reliabilityScore * 0.4) + (speedScore * 0.2);
      
      return {
        ...provider,
        score: totalScore,
        estimatedCost: provider.costPerToken || 0.002,
        estimatedTime: provider.averageResponseTime || 3000
      };
    });
    
    // Filter by constraints
    let filteredProviders = scoredProviders;
    
    if (options.maxCost) {
      filteredProviders = filteredProviders.filter(p => p.estimatedCost <= options.maxCost!);
    }
    
    if (options.maxTime) {
      filteredProviders = filteredProviders.filter(p => p.estimatedTime <= options.maxTime!);
    }
    
    // Task-specific provider selection
    if (task === 'image') {
      filteredProviders = filteredProviders.filter(p => 
        p.capabilities.includes('Image Generation')
      );
    } else if (task === 'analysis') {
      filteredProviders = filteredProviders.filter(p => 
        p.capabilities.includes('Analysis') || 
        p.capabilities.includes('Reasoning') ||
        p.capabilities.includes('Research')
      );
    }
    
    if (filteredProviders.length === 0) {
      if (options.fallbackEnabled && activeProviders.length > 0) {
        const fallbackProvider = activeProviders[0];
        filteredProviders = [{
          ...fallbackProvider,
          score: 0.5,
          estimatedCost: fallbackProvider.costPerToken || 0.002,
          estimatedTime: fallbackProvider.averageResponseTime || 3000
        }];
      } else {
        throw new Error('No providers meet the specified criteria');
      }
    }
    
    // Select the best provider
    const bestProvider = filteredProviders.sort((a, b) => b.score - a.score)[0];
    
    return {
      provider: bestProvider.name.toLowerCase().split(' ')[0], // Extract provider key
      estimatedCost: bestProvider.estimatedCost,
      estimatedTime: bestProvider.estimatedTime,
      reliability: bestProvider.reliability || 0.9,
      reasoning: `Selected ${bestProvider.name} (Score: ${bestProvider.score.toFixed(2)}) - Best balance of cost, reliability, and speed`
    };
  }
  
  async getPromptTemplate(promptType: string, productName: string, category?: string, additionalContext?: string): Promise<string> {
    const templates = {
      cyberpunk: `Generate a futuristic cyberpunk product in a neon-soaked dystopian world:

Product Name: ${productName}
${category ? `Category: ${category}` : ''}
${additionalContext ? `Context: ${additionalContext}` : ''}

Create a product that fits the cyberpunk aesthetic: high-tech, low-life, neon colors, augmented reality integration, corporate dystopia themes, street-level technology, and rebellious undertones. Include elements like:
- Neural interfaces or brain-computer connections
- Holographic displays and AR/VR integration  
- Corporate mega-brand aesthetics
- Anti-establishment messaging
- Bioluminescent or neon design elements
- Dystopian functionality meets street culture

Generate: enhanced name, compelling description (2-3 paragraphs), category, competitive price, detailed visual prompt for cyberpunk imagery, and relevant tags.

Respond in JSON format with keys: name, description, category, suggestedPrice, imagePrompt, tags`,
      
      'sci-fi': `Create an advanced science fiction product from the far future:

Product Name: ${productName}
${category ? `Category: ${category}` : ''}
${additionalContext ? `Context: ${additionalContext}` : ''}

Design a product with cutting-edge technology concepts: space-age materials, quantum physics applications, interstellar travel compatibility, AI integration, bioengineering, terraforming tools, or galactic trade items. Include:
- Advanced materials (graphene, metamaterials, smart matter)
- Quantum mechanics applications
- Space exploration functionality
- AI consciousness or learning capabilities
- Biocompatible or bio-enhancing features
- Clean, minimalist futuristic design

Generate: enhanced name, compelling description (2-3 paragraphs), category, competitive price, detailed visual prompt for sci-fi imagery, and relevant tags.

Respond in JSON format with keys: name, description, category, suggestedPrice, imagePrompt, tags`,
      
      'tech-gadgets': `Design a cutting-edge technology gadget for modern tech enthusiasts:

Product Name: ${productName}
${category ? `Category: ${category}` : ''}
${additionalContext ? `Context: ${additionalContext}` : ''}

Create a practical yet innovative gadget that solves real problems with modern technology: IoT integration, smartphone connectivity, wireless charging, voice control, machine learning, or sustainable tech. Focus on:
- Practical everyday applications
- Seamless device integration
- User-friendly interfaces
- Sustainable and eco-friendly design
- Premium build quality
- Smart automation features

Generate: enhanced name, compelling description (2-3 paragraphs), category, competitive price, detailed visual prompt for modern tech imagery, and relevant tags.

Respond in JSON format with keys: name, description, category, suggestedPrice, imagePrompt, tags`,
      
      fashion: `Create a stylish fashion product that combines trends with functionality:

Product Name: ${productName}
${category ? `Category: ${category}` : ''}
${additionalContext ? `Context: ${additionalContext}` : ''}

Design a fashion item that merges current trends with practical features: sustainable materials, versatile styling, comfort technology, weather resistance, or smart textiles. Include:
- Current fashion trends and seasonal relevance
- Sustainable and ethical production
- Versatile styling options
- Comfort and performance features
- Premium material quality
- Inclusive sizing and accessibility

Generate: enhanced name, compelling description (2-3 paragraphs), category, competitive price, detailed visual prompt for fashion photography, and relevant tags.

Respond in JSON format with keys: name, description, category, suggestedPrice, imagePrompt, tags`,
      
      minimal: `Create a clean, minimalist product focused on essential functionality:

Product Name: ${productName}
${category ? `Category: ${category}` : ''}
${additionalContext ? `Context: ${additionalContext}` : ''}

Design with minimalist principles: essential functionality only, clean aesthetic, premium materials, timeless design, and sustainable manufacturing. Focus on:
- Core functionality without unnecessary features
- Clean, geometric design language
- Premium, sustainable materials
- Timeless aesthetic that won't date
- Exceptional build quality
- Mindful consumption principles

Generate: enhanced name, compelling description (2-3 paragraphs), category, competitive price, detailed visual prompt for minimalist product photography, and relevant tags.

Respond in JSON format with keys: name, description, category, suggestedPrice, imagePrompt, tags`,
      
      luxury: `Craft an ultra-premium luxury product for discerning customers:

Product Name: ${productName}
${category ? `Category: ${category}` : ''}
${additionalContext ? `Context: ${additionalContext}` : ''}

Create an exclusive luxury item with: handcrafted details, rare materials, limited availability, heritage craftsmanship, personalization options, and prestige branding. Include:
- Exceptional materials (precious metals, rare woods, fine leather)
- Artisanal craftsmanship and attention to detail
- Exclusive or limited edition positioning
- Premium brand heritage and story
- Personalization and bespoke options
- White-glove service and packaging

Generate: enhanced name, compelling description (2-3 paragraphs), category, premium price point, detailed visual prompt for luxury product photography, and relevant tags.

Respond in JSON format with keys: name, description, category, suggestedPrice, imagePrompt, tags`
    };
    
    return templates[promptType as keyof typeof templates] || this.getDefaultProductPrompt(productName, category, additionalContext);
  }
  
  private getDefaultProductPrompt(productName: string, category?: string, additionalContext?: string): string {
    return `Generate a comprehensive e-commerce product based on this input:
Product Name: ${productName}
${category ? `Category: ${category}` : ''}
${additionalContext ? `Additional Context: ${additionalContext}` : ''}

Create a professional product with:
1. Enhanced product name (if needed)
2. Compelling marketing description (2-3 paragraphs)
3. Appropriate category
4. Competitive price in USD
5. SEO-friendly tags
6. Detailed image generation prompt

Respond in JSON format with keys: name, description, category, suggestedPrice, imagePrompt, tags`;
  }

  async generateProduct(request: ProductGenerationRequest, provider?: string): Promise<ProductGenerationResult> {
    const startTime = Date.now();
    
    // Intelligent provider selection if not specified
    let selectedProvider = provider;
    if (!selectedProvider) {
      const optimization = await this.selectOptimalProvider('text', {
        maxCost: request.maxCost,
        preferredProvider: request.preferredProvider,
        fallbackEnabled: true
      });
      selectedProvider = optimization.provider;
    }
    
    // Get appropriate prompt template
    const prompt = request.promptType 
      ? await this.getPromptTemplate(request.promptType, request.productName, request.category, request.additionalContext)
      : this.getDefaultProductPrompt(request.productName, request.category, request.additionalContext);

    try {
      let response;
      let result;
      let cost = 0;

      switch (selectedProvider) {
        case "deepseek":
          if (!this.deepseek) {
            throw new Error('DeepSeek provider not configured - missing DEEPSEEK_API_KEY');
          }
          if (!await this.checkCircuitBreaker('deepseek')) {
            throw new Error('DeepSeek provider is temporarily unavailable (circuit breaker open)');
          }
          if (!this.checkRateLimit('deepseek', 2000)) {
            throw new Error('DeepSeek rate limit exceeded, please try again later');
          }
          
          response = await this.deepseek.chat.completions.create({
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content: "You are an expert e-commerce product creator with deep market knowledge. Generate realistic, marketable products with competitive pricing and compelling descriptions. Focus on innovation and market trends."
              },
              { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
          });
          result = JSON.parse(response.choices[0].message.content || '{}');
          const deepseekTokens = this.extractTokenCount(response, 'deepseek');
          cost = this.calculateCost('deepseek', 'text', deepseekTokens, 'deepseek-chat');
          break;

        case "anthropic":
          if (!this.anthropic) {
            throw new Error('Anthropic provider not configured - missing ANTHROPIC_API_KEY');
          }
          if (!await this.checkCircuitBreaker('anthropic')) {
            throw new Error('Anthropic provider is temporarily unavailable (circuit breaker open)');
          }
          if (!this.checkRateLimit('anthropic', 1500)) {
            throw new Error('Anthropic rate limit exceeded, please try again later');
          }
          
          const anthropicResponse = await this.anthropic.messages.create({
            max_tokens: 1024,
            messages: [{ role: 'user', content: `${prompt}\n\nRespond in JSON format only.` }],
            model: DEFAULT_ANTHROPIC_MODEL,
          });
          result = JSON.parse(anthropicResponse.content[0].type === 'text' ? anthropicResponse.content[0].text : '{}');
          const anthropicTokens = this.extractTokenCount(anthropicResponse, 'anthropic');
          cost = this.calculateCost('anthropic', 'text', anthropicTokens, DEFAULT_ANTHROPIC_MODEL);
          break;

        case "gemini":
          if (!this.gemini) {
            throw new Error('Gemini provider not configured - missing GEMINI_API_KEY');
          }
          const geminiResponse = await this.gemini.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `${prompt}\n\nRespond in JSON format only.`,
          });
          result = JSON.parse(geminiResponse.text || '{}');
          cost = this.calculateCost('gemini', 'text', 1000); // Gemini doesn't return token usage easily
          break;

        case "xai":
          if (!this.xai) {
            throw new Error('xAI provider not configured - missing XAI_API_KEY');
          }
          response = await this.xai.chat.completions.create({
            model: "grok-2-1212",
            messages: [
              {
                role: "system",
                content: "You are an expert e-commerce product creator. Generate realistic, marketable products with competitive pricing and compelling descriptions."
              },
              { role: "user", content: prompt }
            ]
          });
          result = JSON.parse(response.choices[0].message.content || '{}');
          cost = this.calculateCost('xai', 'text', response.usage?.total_tokens || 1000);
          break;

        case "custom":
          if (this.customApi) {
            response = await this.customApi.chat.completions.create({
              model: process.env.CUSTOM_API_MODEL || "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content: "You are an expert e-commerce product creator. Generate realistic, marketable products with competitive pricing and compelling descriptions."
                },
                { role: "user", content: prompt }
              ],
              response_format: { type: "json_object" },
            });
            result = JSON.parse(response.choices[0].message.content || '{}');
          } else {
            throw new Error("Custom API not configured");
          }
          break;

        default: // OpenAI
          if (!this.openai) {
            throw new Error('OpenAI provider not configured - missing OPENAI_API_KEY');
          }
          response = await this.openai.chat.completions.create({
            model: DEFAULT_OPENAI_MODEL,
            messages: [
              {
                role: "system",
                content: "You are an expert e-commerce product creator. Generate realistic, marketable products with competitive pricing and compelling descriptions."
              },
              { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
          });
          result = JSON.parse(response.choices[0].message.content || '{}');
          cost = this.calculateCost('openai', 'text', response.usage?.total_tokens || 1000);
          selectedProvider = 'openai';
      }
      
      // Track usage statistics
      const responseTime = Date.now() - startTime;
      this.trackUsage(selectedProvider, cost, true, responseTime);
      
      return {
        name: result.name || request.productName,
        description: result.description || "Product description will be generated here.",
        category: result.category || request.category || "General",
        suggestedPrice: result.suggestedPrice || 99.99,
        imagePrompt: result.imagePrompt || `Professional product photo of ${request.productName}`,
        tags: result.tags || [request.productName.toLowerCase()]
      };
    } catch (error) {
      // Track failed usage
      const responseTime = Date.now() - startTime;
      this.trackUsage(selectedProvider || 'unknown', 0, false, responseTime);
      
      console.error(`Error generating product with ${selectedProvider}:`, error);
      throw new Error(`Failed to generate product with ${selectedProvider}`);
    }
  }

  async generateProductImage(prompt: string, productName: string, style?: string): Promise<ImageGenerationResult> {
    // Check if OpenAI is properly configured (check both env vars)
    const openaiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR;
    const hasValidOpenAI = openaiKey && openaiKey !== "default_key";
    
    if (!hasValidOpenAI) {
      return {
        imageUrl: "https://via.placeholder.com/1024x1024/2a2a2a/ffffff?text=Configure+OpenAI+for+Image+Generation",
        prompt: prompt
      };
    }

    try {
      const enhancedPrompt = `Professional e-commerce product photography: ${prompt}. Clean white background, high quality, studio lighting, commercial photography style, 4K resolution`;
      
      if (!this.openai) {
        throw new Error('OpenAI provider not configured - missing OPENAI_API_KEY');
      }
      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      });

      return {
        imageUrl: response.data?.[0]?.url || "",
        prompt: enhancedPrompt
      };
    } catch (error) {
      console.error("Error generating image with OpenAI:", error);
      // Return placeholder instead of throwing error
      return {
        imageUrl: "https://via.placeholder.com/1024x1024/ff4444/ffffff?text=Image+Generation+Failed",
        prompt: prompt
      };
    }
  }

  async regenerateDescription(productName: string, currentDescription: string, provider: string = "openai"): Promise<string> {
    const prompt = `Rewrite this product description to be more compelling and unique:

Product: ${productName}
Current Description: ${currentDescription}

Create a fresh, engaging description that highlights different features and benefits. Make it professional and marketing-focused.`;

    try {
      switch (provider) {
        case "anthropic":
          if (!this.anthropic) {
            throw new Error('Anthropic provider not configured');
          }
          const anthropicResponse = await this.anthropic.messages.create({
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }],
            model: DEFAULT_ANTHROPIC_MODEL,
          });
          return anthropicResponse.content[0].type === 'text' ? anthropicResponse.content[0].text : currentDescription;

        case "gemini":
          if (!this.gemini) {
            throw new Error('Gemini provider not configured');
          }
          const geminiResponse = await this.gemini.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
          });
          return geminiResponse.text || currentDescription;

        case "xai":
          if (!this.xai) {
            throw new Error('xAI provider not configured');
          }
          const xaiResponse = await this.xai.chat.completions.create({
            model: "grok-2-1212",
            messages: [{ role: "user", content: prompt }],
          });
          return xaiResponse.choices[0].message.content || currentDescription;

        case "deepseek":
          if (!this.deepseek) {
            throw new Error('DeepSeek provider not configured');
          }
          const deepseekResponse = await this.deepseek.chat.completions.create({
            model: "deepseek-chat",
            messages: [{ role: "user", content: prompt }],
          });
          return deepseekResponse.choices[0].message.content || currentDescription;

        case "custom":
          if (this.customApi) {
            const customResponse = await this.customApi.chat.completions.create({
              model: process.env.CUSTOM_API_MODEL || "gpt-3.5-turbo",
              messages: [{ role: "user", content: prompt }],
            });
            return customResponse.choices[0].message.content || currentDescription;
          }
          throw new Error("Custom API not configured");

        default: // OpenAI
          if (!this.openai) {
            throw new Error('OpenAI provider not configured');
          }
          const openaiResponse = await this.openai.chat.completions.create({
            model: DEFAULT_OPENAI_MODEL,
            messages: [
              {
                role: "system",
                content: "You are an expert copywriter specializing in e-commerce product descriptions."
              },
              { role: "user", content: prompt }
            ],
          });
          return openaiResponse.choices[0].message.content || currentDescription;
      }
    } catch (error) {
      console.error(`Error regenerating description with ${provider}:`, error);
      throw new Error(`Failed to regenerate description with ${provider}`);
    }
  }

  async analyzePricing(productName: string, description: string): Promise<{ suggestedPrice: number; reasoning: string }> {
    const prompt = `Analyze this product and suggest a competitive market price:

Product: ${productName}
Description: ${description}

Research similar products and provide:
1. Suggested retail price in USD
2. Brief reasoning for the price

Respond in JSON format with keys: suggestedPrice, reasoning`;

    try {
      if (!this.openai) {
        throw new Error('OpenAI provider not configured');
      }
      if (!this.openai) {
        throw new Error('OpenAI provider not configured');
      }
      const response = await this.openai.chat.completions.create({
        model: DEFAULT_OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a pricing expert with deep knowledge of e-commerce markets and competitive pricing strategies."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        suggestedPrice: result.suggestedPrice || 99.99,
        reasoning: result.reasoning || "Price based on market analysis"
      };
    } catch (error) {
      console.error("Error analyzing pricing:", error);
      return {
        suggestedPrice: 99.99,
        reasoning: "Default pricing due to analysis error"
      };
    }
  }

  async extractProductFromText(text: string): Promise<ProductGenerationResult | null> {
    const prompt = `Extract product information from this text and create a structured product:

Text: ${text}

If this contains product information, extract and enhance it into a complete product listing.
If no clear product is found, return null.

Respond in JSON format with keys: name, description, category, suggestedPrice, imagePrompt, tags, or null if no product found.`;

    try {
      if (!this.openai) {
        throw new Error('OpenAI provider not configured');
      }
      const response = await this.openai.chat.completions.create({
        model: DEFAULT_OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content: "You are an expert at extracting and structuring product information from various text sources."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || 'null');
      
      if (!result || !result.name) {
        return null;
      }
      
      return result;
    } catch (error) {
      console.error("Error extracting product from text:", error);
      return null;
    }
  }

  async suggestCategories(productNames: string[]): Promise<string[]> {
    const prompt = `Analyze these product names and suggest appropriate e-commerce categories:

Product Names: ${productNames.join(', ')}

Suggest relevant, specific categories that would help organize these products in an online store. Consider market trends and customer search behavior.

Respond in JSON format with an array of category suggestions: { "categories": ["category1", "category2", ...] }`;

    try {
      if (!this.deepseek) {
        throw new Error('DeepSeek provider not configured');
      }
      const response = await this.deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system", 
            content: "You are an e-commerce categorization expert with deep knowledge of market segmentation and customer behavior."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result.categories || ["General", "Electronics", "Home & Garden"];
    } catch (error) {
      console.error("Error suggesting categories:", error);
      return ["General", "Electronics", "Home & Garden", "Fashion", "Sports"];
    }
  }

  async optimizeProductForSEO(product: any): Promise<{ title: string; description: string; keywords: string[] }> {
    const prompt = `Optimize this product for search engines and marketplace visibility:

Product: ${product.name}
Description: ${product.description}
Category: ${product.category}
Price: $${product.price}

Create SEO-optimized:
1. Title (under 60 characters, keyword-rich)
2. Meta description (under 160 characters, compelling)
3. Keywords array (relevant search terms)

Respond in JSON format: { "title": "...", "description": "...", "keywords": [...] }`;

    try {
      if (!this.deepseek) {
        throw new Error('DeepSeek provider not configured');
      }
      const response = await this.deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are an SEO expert specializing in e-commerce product optimization and search visibility."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        title: result.title || product.name,
        description: result.description || product.description,
        keywords: result.keywords || [product.name.toLowerCase()]
      };
    } catch (error) {
      console.error("Error optimizing for SEO:", error);
      return {
        title: product.name,
        description: product.description,
        keywords: [product.name.toLowerCase()]
      };
    }
  }

  async generateMarketingCopy(product: any, type: "social" | "email" | "ad"): Promise<string> {
    const prompts = {
      social: `Create engaging social media copy for this product:`,
      email: `Write compelling email marketing copy for this product:`,
      ad: `Create persuasive advertising copy for this product:`
    };

    const prompt = `${prompts[type]}

Product: ${product.name}
Description: ${product.description}
Price: $${product.price}
Category: ${product.category}

Make it compelling, action-oriented, and optimized for conversions. Include relevant emojis and call-to-action.`;

    try {
      if (!this.deepseek) {
        throw new Error('DeepSeek provider not configured');
      }
      const response = await this.deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a marketing copywriter expert specializing in high-converting product copy and customer psychology."
          },
          { role: "user", content: prompt }
        ],
      });

      return response.choices[0].message.content || `Check out our amazing ${product.name}! Perfect for ${product.category} enthusiasts. Get yours today!`;
    } catch (error) {
      console.error("Error generating marketing copy:", error);
      return `Check out our amazing ${product.name}! Perfect for ${product.category} enthusiasts. Get yours today!`;
    }
  }
  
  private calculateCost(provider: string, type: 'text' | 'image' | 'embedding', tokens: number = 1000, model?: string): number {
    const costs = this.providerCosts[provider];
    if (!costs) return 0.002; // Default cost
    
    switch (type) {
      case 'text':
        // Apply model-specific pricing adjustments
        let baseCost = costs.textGeneration;
        if (provider === 'openai' && model?.includes('gpt-5')) {
          baseCost = 0.002; // GPT-5 specific pricing
        } else if (provider === 'anthropic' && model?.includes('claude-sonnet-4')) {
          baseCost = 0.003; // Claude Sonnet 4 pricing
        }
        return (baseCost * tokens) / 1000;
      case 'image':
        return costs.imageGeneration;
      case 'embedding':
        return (costs.embedding * tokens) / 1000;
      default:
        return costs.textGeneration * tokens / 1000;
    }
  }

  private extractTokenCount(response: any, provider: string): number {
    try {
      switch (provider) {
        case 'openai':
        case 'xai':
        case 'deepseek':
        case 'perplexity':
          return response.usage?.total_tokens || 0;
        case 'anthropic':
          return (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);
        case 'gemini':
          return this.estimateTokens(response.response?.text() || response.text || '');
        default:
          return 0;
      }
    } catch (error) {
      console.warn(`Failed to extract token count for ${provider}:`, error);
      return 0;
    }
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
  
  async getAIAnalytics(): Promise<{
    totalRequests: number;
    totalCost: number;
    providerBreakdown: any[];
    costTrends: any[];
    averageResponseTime: number;
    successRate: number;
  }> {
    let totalRequests = 0;
    let totalCost = 0;
    let totalResponseTime = 0;
    let totalSuccessful = 0;
    
    const providerBreakdown: any[] = [];
    
    for (const [provider, stats] of this.usageStats.entries()) {
      totalRequests += stats.totalRequests || 0;
      totalCost += stats.totalCost || 0;
      totalResponseTime += (stats.averageResponseTime || 0) * (stats.totalRequests || 0);
      totalSuccessful += stats.successfulRequests || 0;
      
      providerBreakdown.push({
        provider,
        requests: stats.totalRequests || 0,
        cost: stats.totalCost || 0,
        successRate: stats.totalRequests > 0 ? (stats.successfulRequests / stats.totalRequests) : 0,
        averageResponseTime: stats.averageResponseTime || 0,
        lastUsed: stats.lastUsed
      });
    }
    
    return {
      totalRequests,
      totalCost,
      providerBreakdown,
      costTrends: [], // Would be populated from historical data
      averageResponseTime: totalRequests > 0 ? totalResponseTime / totalRequests : 0,
      successRate: totalRequests > 0 ? totalSuccessful / totalRequests : 0
    };
  }
  
  async generateProductBatch(requests: ProductGenerationRequest[]): Promise<{ products: ProductGenerationResult[], errors: string[], totalCost: number, processingTime: number }> {
    const startTime = Date.now();
    const products: ProductGenerationResult[] = [];
    const errors: string[] = [];
    let totalCost = 0;
    
    // Process in parallel batches of 3 to avoid rate limits
    const batchSize = 3;
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const batchPromises = batch.map(async (request, index) => {
        try {
          const product = await this.generateProduct(request);
          return { success: true, product, index: i + index };
        } catch (error) {
          console.error(`Error in batch ${i + index}:`, error);
          return { success: false, error: error instanceof Error ? error.message : 'Unknown error', index: i + index };
        }
      });
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          if (result.value.success && result.value.product) {
            products.push(result.value.product);
          } else {
            errors.push(`Product ${result.value.index}: ${result.value.error}`);
          }
        } else {
          errors.push(`Batch processing error: ${result.reason}`);
        }
      }
      
      // Add delay between batches to respect rate limits
      if (i + batchSize < requests.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Calculate total cost from usage stats
    for (const [provider, stats] of this.usageStats.entries()) {
      totalCost += stats.totalCost || 0;
    }
    
    return {
      products,
      errors,
      totalCost,
      processingTime: Date.now() - startTime
    };
  }
  
  async generateImageBatch(requests: { prompt: string; productName: string; style?: 'cyberpunk' | 'realistic' | 'minimalist' | 'futuristic' | 'artistic' }[]): Promise<{ images: ImageGenerationResult[], errors: string[], totalCost: number, processingTime: number }> {
    const startTime = Date.now();
    const images: ImageGenerationResult[] = [];
    const errors: string[] = [];
    let totalCost = 0;
    
    // Process images sequentially to avoid rate limits (DALL-E has strict limits)
    for (let i = 0; i < requests.length; i++) {
      const request = requests[i];
      try {
        const image = await this.generateProductImage(request.prompt, request.productName, request.style);
        images.push(image);
        totalCost += image.cost || 0;
        
        // Add delay between requests to respect OpenAI rate limits
        if (i < requests.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
        }
      } catch (error) {
        console.error(`Error generating image ${i}:`, error);
        errors.push(`Image ${i}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return {
      images,
      errors,
      totalCost,
      processingTime: Date.now() - startTime
    };
  }
  
  async enhanceProductWithAI(product: any): Promise<{
    enhancedDescription: string;
    seoData: { title: string; description: string; keywords: string[] };
    marketingCopy: { social: string; email: string; ad: string };
    pricingAnalysis: { suggestedPrice: number; reasoning: string };
    suggestedTags: string[];
    categoryRecommendation: string;
  }> {
    try {
      // Run all AI enhancements in parallel for efficiency
      const [enhancedDescription, seoData, socialCopy, emailCopy, adCopy, pricingAnalysis] = await Promise.all([
        this.regenerateDescription(product.name, product.description || '', 'deepseek'),
        this.optimizeProductForSEO(product),
        this.generateMarketingCopy(product, 'social'),
        this.generateMarketingCopy(product, 'email'),
        this.generateMarketingCopy(product, 'ad'),
        this.analyzePricing(product.name, product.description || '')
      ]);
      
      // Generate suggested tags and category
      const suggestedCategories = await this.suggestCategories([product.name]);
      const categoryRecommendation = suggestedCategories[0] || product.category || 'General';
      
      // Extract tags from description and name
      const suggestedTags = this.extractTagsFromText(`${product.name} ${enhancedDescription}`);
      
      return {
        enhancedDescription,
        seoData,
        marketingCopy: {
          social: socialCopy,
          email: emailCopy,
          ad: adCopy
        },
        pricingAnalysis,
        suggestedTags,
        categoryRecommendation
      };
    } catch (error) {
      console.error('Error enhancing product with AI:', error);
      throw new Error('Failed to enhance product with AI');
    }
  }
  
  private extractTagsFromText(text: string): string[] {
    const words = text.toLowerCase().split(/\W+/);
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'over', 'after'];
    const uniqueWords = [...new Set(words.filter(word => word.length > 3 && !commonWords.includes(word)))];
    return uniqueWords.slice(0, 10); // Return top 10 relevant words as tags
  }
  
  async getProviderRecommendation(taskType: 'text' | 'image' | 'analysis', requirements?: {
    budget?: 'low' | 'medium' | 'high';
    speed?: 'fast' | 'medium' | 'slow';
    quality?: 'standard' | 'high' | 'premium';
  }): Promise<{ provider: string; reasoning: string; estimatedCost: number }> {
    const optimization = await this.selectOptimalProvider(taskType, {
      maxCost: requirements?.budget === 'low' ? 0.001 : requirements?.budget === 'medium' ? 0.005 : undefined,
      maxTime: requirements?.speed === 'fast' ? 2000 : requirements?.speed === 'medium' ? 5000 : undefined
    });
    
    return {
      provider: optimization.provider,
      reasoning: optimization.reasoning,
      estimatedCost: optimization.estimatedCost
    };
  }
}

export const aiService = new AIService();
