import { geminiAI } from './geminiAI';
import { aiProductGenerator } from './aiProductGenerator';
import { aiShoppingAssistant } from './aiShoppingAssistant';
import type { GeneratedProduct } from './aiProductGenerator';
import type { ChatRequest, ChatResponse } from '../../lib/types';

export type AIProvider = 'gemini' | 'openai' | 'browser';

export interface MultiAIConfig {
  primaryProvider: AIProvider;
  fallbackProviders: AIProvider[];
  maxRetries: number;
  retryDelay: number;
  preferredProvider?: AIProvider; // User preference
}

export interface AIProviderStatus {
  provider: AIProvider;
  available: boolean;
  lastChecked: Date;
  errorCount: number;
  responseTime?: number;
}

export interface AIUsageStats {
  provider: AIProvider;
  requestsToday: number;
  tokensUsed: number;
  errorsToday: number;
  avgResponseTime: number;
}

export class MultiAIFusionSystem {
  private config: MultiAIConfig;
  private providerStatus: Map<AIProvider, AIProviderStatus>;
  private usageStats: Map<AIProvider, AIUsageStats>;
  private lastFailoverTime: Date | null = null;

  constructor(config?: Partial<MultiAIConfig>) {
    this.config = {
      primaryProvider: 'gemini', // Gemini as primary (FREE 1M tokens/minute)
      fallbackProviders: ['openai'], // OpenAI as fallback
      maxRetries: 3,
      retryDelay: 1000,
      ...config
    };

    this.providerStatus = new Map();
    this.usageStats = new Map();
    
    this.initializeProviders();
  }

  /**
   * Initialize all AI providers and check their status
   */
  private initializeProviders(): void {
    const providers: AIProvider[] = ['gemini', 'openai', 'browser'];
    
    providers.forEach(provider => {
      this.providerStatus.set(provider, {
        provider,
        available: false,
        lastChecked: new Date(),
        errorCount: 0
      });

      this.usageStats.set(provider, {
        provider,
        requestsToday: 0,
        tokensUsed: 0,
        errorsToday: 0,
        avgResponseTime: 0
      });
    });

    // Check provider availability
    this.checkProviderAvailability();
  }

  /**
   * Check availability of all AI providers
   */
  private async checkProviderAvailability(): Promise<void> {
    console.log('🔍 Checking AI provider availability...');

    // Check Gemini
    const geminiStatus = this.providerStatus.get('gemini')!;
    geminiStatus.available = geminiAI.isAvailable();
    geminiStatus.lastChecked = new Date();
    
    // Check OpenAI
    const openaiStatus = this.providerStatus.get('openai')!;
    openaiStatus.available = !!process.env.OPENAI_API_KEY;
    openaiStatus.lastChecked = new Date();

    // Browser AI is always available (no backend dependency)
    const browserStatus = this.providerStatus.get('browser')!;
    browserStatus.available = true;
    browserStatus.lastChecked = new Date();

    console.log('📊 AI Provider Status:');
    console.log(`  • Gemini: ${geminiStatus.available ? '✅' : '❌'}`);
    console.log(`  • OpenAI: ${openaiStatus.available ? '✅' : '❌'}`);
    console.log(`  • Browser: ${browserStatus.available ? '✅' : '❌'}`);
  }

  /**
   * Get the best available provider based on current status and config
   */
  private getBestProvider(): AIProvider {
    // Check if primary provider is available
    const primaryStatus = this.providerStatus.get(this.config.primaryProvider);
    if (primaryStatus?.available && primaryStatus.errorCount < 3) {
      return this.config.primaryProvider;
    }

    // Check fallback providers
    for (const provider of this.config.fallbackProviders) {
      const status = this.providerStatus.get(provider);
      if (status?.available && status.errorCount < 3) {
        if (this.lastFailoverTime === null || 
            Date.now() - this.lastFailoverTime.getTime() > 30000) { // 30 second cooldown
          console.log(`🔄 Failing over to ${provider} provider`);
          this.lastFailoverTime = new Date();
          return provider;
        }
      }
    }

    // Last resort: return primary even if it has errors
    return this.config.primaryProvider;
  }

  /**
   * Record provider usage and performance
   */
  private recordUsage(provider: AIProvider, responseTime: number, success: boolean): void {
    const stats = this.usageStats.get(provider)!;
    const status = this.providerStatus.get(provider)!;

    stats.requestsToday++;
    if (success) {
      status.errorCount = Math.max(0, status.errorCount - 1); // Reduce error count on success
      status.responseTime = responseTime;
      stats.avgResponseTime = (stats.avgResponseTime + responseTime) / 2;
    } else {
      status.errorCount++;
      stats.errorsToday++;
    }

    status.lastChecked = new Date();
  }

  /**
   * Generate cyberpunk product using the best available AI provider
   */
  async generateCyberpunkProduct(productIdea: string): Promise<GeneratedProduct> {
    const provider = this.getBestProvider();
    const startTime = Date.now();

    console.log(`🤖 Using ${provider} for product generation: "${productIdea}"`);

    try {
      let result: GeneratedProduct;

      switch (provider) {
        case 'gemini':
          result = await geminiAI.generateCyberpunkProduct(productIdea);
          break;
        
        case 'openai':
          result = await aiProductGenerator.generateCyberpunkProduct(productIdea);
          break;
        
        case 'browser':
          // Browser AI would be handled on the client side
          throw new Error('Browser AI should be used on the client side');
        
        default:
          throw new Error(`Unknown AI provider: ${provider}`);
      }

      // Record successful usage
      const responseTime = Date.now() - startTime;
      this.recordUsage(provider, responseTime, true);

      console.log(`✅ ${provider} generated product in ${responseTime}ms: ${result.name}`);
      
      return result;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.recordUsage(provider, responseTime, false);

      console.error(`❌ ${provider} failed after ${responseTime}ms:`, error);

      // Try fallback if primary failed
      if (provider === this.config.primaryProvider && this.config.fallbackProviders.length > 0) {
        console.log('🔄 Attempting fallback...');
        
        // Temporarily set fallback as primary for retry
        const originalPrimary = this.config.primaryProvider;
        this.config.primaryProvider = this.config.fallbackProviders[0];
        
        try {
          const fallbackResult = await this.generateCyberpunkProduct(productIdea);
          this.config.primaryProvider = originalPrimary; // Restore original
          return fallbackResult;
        } catch (fallbackError) {
          this.config.primaryProvider = originalPrimary; // Restore original
          console.error('❌ Fallback also failed:', fallbackError);
        }
      }

      // If all else fails, throw the original error
      throw error;
    }
  }

  /**
   * Handle shopping assistant chat using the best available AI provider
   */
  async handleShoppingChat(request: ChatRequest): Promise<ChatResponse> {
    const provider = this.getBestProvider();
    const startTime = Date.now();

    console.log(`💬 Using ${provider} for shopping chat`);

    try {
      let result: ChatResponse;

      switch (provider) {
        case 'gemini':
          // Use Gemini for shopping assistant with product context
          const productContext = (request as any).productContext || '';
          const geminiResponse = await geminiAI.generateShoppingResponse(
            request.message,
            request.conversationHistory?.map(msg => `${msg.role}: ${msg.content}`) || [],
            productContext
          );
          
          // Parse Gemini response
          const parsedGemini = JSON.parse(geminiResponse.text);
          result = {
            message: parsedGemini.message,
            productRecommendations: [], // Would need to process product IDs
            suggestedQuestions: parsedGemini.suggestedQuestions || [],
            conversationId: Date.now().toString(),
            timestamp: new Date()
          };
          break;
        
        case 'openai':
          result = await aiShoppingAssistant.chat(request);
          break;
        
        case 'browser':
          throw new Error('Browser AI should be used on the client side');
        
        default:
          throw new Error(`Unknown AI provider: ${provider}`);
      }

      // Record successful usage
      const responseTime = Date.now() - startTime;
      this.recordUsage(provider, responseTime, true);

      console.log(`✅ ${provider} handled chat in ${responseTime}ms`);
      
      return result;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.recordUsage(provider, responseTime, false);

      console.error(`❌ ${provider} chat failed after ${responseTime}ms:`, error);

      // Prevent infinite loops - only try fallback once
      if (provider === this.config.primaryProvider && 
          this.config.fallbackProviders.length > 0 && 
          !request._fallbackAttempted) {
        console.log('🔄 Attempting chat fallback...');
        
        // Mark as fallback attempted to prevent infinite loops
        const fallbackRequest = { ...request, _fallbackAttempted: true };
        
        const originalPrimary = this.config.primaryProvider;
        this.config.primaryProvider = this.config.fallbackProviders[0];
        
        try {
          const fallbackResult = await this.handleShoppingChat(fallbackRequest);
          this.config.primaryProvider = originalPrimary;
          return fallbackResult;
        } catch (fallbackError) {
          this.config.primaryProvider = originalPrimary;
          console.error('❌ Chat fallback also failed:', fallbackError);
        }
      }

      throw error;
    }
  }

  /**
   * Analyze image using multimodal AI (Gemini preferred)
   */
  async analyzeImage(imageData: string, mimeType: string = 'image/jpeg'): Promise<any> {
    // Always prefer Gemini for image analysis (multimodal capabilities)
    const provider = geminiAI.isAvailable() ? 'gemini' : this.getBestProvider();
    const startTime = Date.now();

    console.log(`📸 Using ${provider} for image analysis`);

    try {
      let result: any;

      switch (provider) {
        case 'gemini':
          result = await geminiAI.analyzeImageForProducts(imageData, mimeType);
          break;
        
        default:
          throw new Error(`Image analysis not supported by ${provider}`);
      }

      const responseTime = Date.now() - startTime;
      this.recordUsage(provider, responseTime, true);

      console.log(`✅ ${provider} analyzed image in ${responseTime}ms`);
      
      return result;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.recordUsage(provider, responseTime, false);

      console.error(`❌ ${provider} image analysis failed:`, error);
      throw error;
    }
  }

  /**
   * Get system status and provider information
   */
  getSystemStatus(): {
    activeProvider: AIProvider;
    availableProviders: AIProvider[];
    systemHealth: 'healthy' | 'degraded' | 'critical';
    providerStatus: Array<AIProviderStatus>;
    usageStats: Array<AIUsageStats>;
  } {
    const activeProvider = this.getBestProvider();
    const availableProviders = Array.from(this.providerStatus.entries())
      .filter(([_, status]) => status.available)
      .map(([provider, _]) => provider);

    let systemHealth: 'healthy' | 'degraded' | 'critical' = 'healthy';
    
    if (availableProviders.length === 0) {
      systemHealth = 'critical';
    } else if (availableProviders.length === 1 || 
               this.providerStatus.get(this.config.primaryProvider)?.errorCount! > 2) {
      systemHealth = 'degraded';
    }

    return {
      activeProvider,
      availableProviders,
      systemHealth,
      providerStatus: Array.from(this.providerStatus.values()),
      usageStats: Array.from(this.usageStats.values())
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<MultiAIConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('🔧 Multi-AI config updated:', this.config);
  }

  /**
   * Force check all providers
   */
  async refreshProviders(): Promise<void> {
    await this.checkProviderAvailability();
  }
}

// Export singleton instance
export const multiAI = new MultiAIFusionSystem();

// Configuration types exported above in class definition
