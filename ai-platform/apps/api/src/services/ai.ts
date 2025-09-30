import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { TranslationServiceClient } from '@google-cloud/translate';
import { SpeechClient } from '@google-cloud/speech';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import * as tf from '@tensorflow/tfjs-node';
import { z } from 'zod';

// Configuration schema
const aiConfigSchema = z.object({
  openaiApiKey: z.string().optional(),
  anthropicApiKey: z.string().optional(),
  googleCloudProjectId: z.string().optional(),
  googleCloudKeyFile: z.string().optional(),
});

export type AIConfig = z.infer<typeof aiConfigSchema>;

// AI Provider types
export type AIProvider = 'openai' | 'anthropic' | 'google';
export type AIModel = 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'claude-instant' | 'gemini-pro';

// Message types for chat completion
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
}

// AI Response types
export interface AIResponse {
  content: string;
  model: string;
  provider: AIProvider;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cost: number;
  responseTime: number;
  finishReason?: string;
}

// Translation result
export interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
}

// Speech-to-text result
export interface SpeechToTextResult {
  transcript: string;
  confidence: number;
  language: string;
  words?: Array<{
    word: string;
    startTime: number;
    endTime: number;
    confidence: number;
  }>;
}

// Image analysis result
export interface ImageAnalysisResult {
  labels: Array<{
    description: string;
    score: number;
  }>;
  objects: Array<{
    name: string;
    score: number;
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
  text?: string;
  faces?: Array<{
    emotions: Record<string, number>;
    age: number;
    gender: string;
    confidence: number;
  }>;
  safeSearch: {
    adult: string;
    violence: string;
    racy: string;
    medical: string;
  };
}

// Content generation options
export interface ContentGenerationOptions {
  model?: AIModel;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  provider?: AIProvider;
}

// Personalization data
export interface PersonalizationData {
  userId: string;
  preferences: Record<string, any>;
  history: Array<{
    action: string;
    item: string;
    timestamp: Date;
    rating?: number;
  }>;
  demographics: {
    age?: number;
    gender?: string;
    location?: string;
    interests?: string[];
  };
}

export class AIService {
  private openai: OpenAI | null = null;
  private anthropic: Anthropic | null = null;
  private googleTranslate: TranslationServiceClient | null = null;
  private googleSpeech: SpeechClient | null = null;
  private googleVision: ImageAnnotatorClient | null = null;
  private config: AIConfig;

  // Model pricing (per 1K tokens)
  private pricing = {
    'gpt-4': { prompt: 0.03, completion: 0.06 },
    'gpt-3.5-turbo': { prompt: 0.001, completion: 0.002 },
    'claude-3': { prompt: 0.015, completion: 0.075 },
    'claude-instant': { prompt: 0.0008, completion: 0.0024 },
    'gemini-pro': { prompt: 0.001, completion: 0.002 },
  };

  constructor(config: AIConfig) {
    this.config = aiConfigSchema.parse(config);
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Initialize OpenAI
    if (this.config.openaiApiKey) {
      this.openai = new OpenAI({
        apiKey: this.config.openaiApiKey,
      });
      console.log('✅ OpenAI initialized');
    }

    // Initialize Anthropic
    if (this.config.anthropicApiKey) {
      this.anthropic = new Anthropic({
        apiKey: this.config.anthropicApiKey,
      });
      console.log('✅ Anthropic initialized');
    }

    // Initialize Google Cloud services
    if (this.config.googleCloudProjectId) {
      const clientOptions = {
        projectId: this.config.googleCloudProjectId,
        ...(this.config.googleCloudKeyFile && { keyFilename: this.config.googleCloudKeyFile }),
      };

      this.googleTranslate = new TranslationServiceClient(clientOptions);
      this.googleSpeech = new SpeechClient(clientOptions);
      this.googleVision = new ImageAnnotatorClient(clientOptions);
      console.log('✅ Google Cloud AI services initialized');
    }
  }

  // Main chat completion method
  public async chatCompletion(
    messages: ChatMessage[],
    options: ContentGenerationOptions = {}
  ): Promise<AIResponse> {
    const {
      model = 'gpt-3.5-turbo',
      temperature = 0.7,
      maxTokens = 1000,
      provider = 'openai',
    } = options;

    const startTime = Date.now();

    try {
      switch (provider) {
        case 'openai':
          return await this.openaiChatCompletion(messages, { model, temperature, maxTokens });
        case 'anthropic':
          return await this.anthropicChatCompletion(messages, { model, temperature, maxTokens });
        case 'google':
          return await this.googleChatCompletion(messages, { model, temperature, maxTokens });
        default:
          throw new Error(`Unsupported AI provider: ${provider}`);
      }
    } catch (error) {
      console.error(`AI ${provider} chat completion failed:`, error);
      throw error;
    }
  }

  private async openaiChatCompletion(
    messages: ChatMessage[],
    options: { model: string; temperature: number; maxTokens: number }
  ): Promise<AIResponse> {
    if (!this.openai) {
      throw new Error('OpenAI not initialized');
    }

    const startTime = Date.now();

    const response = await this.openai.chat.completions.create({
      model: options.model,
      messages: messages as any,
      temperature: options.temperature,
      max_tokens: options.maxTokens,
    });

    const responseTime = Date.now() - startTime;
    const usage = response.usage!;
    const cost = this.calculateCost(options.model as AIModel, usage.prompt_tokens, usage.completion_tokens);

    return {
      content: response.choices[0].message.content || '',
      model: options.model,
      provider: 'openai',
      usage: {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
      },
      cost,
      responseTime,
      finishReason: response.choices[0].finish_reason || undefined,
    };
  }

  private async anthropicChatCompletion(
    messages: ChatMessage[],
    options: { model: string; temperature: number; maxTokens: number }
  ): Promise<AIResponse> {
    if (!this.anthropic) {
      throw new Error('Anthropic not initialized');
    }

    const startTime = Date.now();

    // Convert messages to Anthropic format
    const systemMessage = messages.find(m => m.role === 'system');
    const userMessages = messages.filter(m => m.role !== 'system');

    const response = await this.anthropic.messages.create({
      model: options.model.includes('claude') ? options.model : 'claude-3-sonnet-20240229',
      max_tokens: options.maxTokens,
      temperature: options.temperature,
      system: systemMessage?.content,
      messages: userMessages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const responseTime = Date.now() - startTime;
    const usage = response.usage;
    const cost = this.calculateCost(options.model as AIModel, usage.input_tokens, usage.output_tokens);

    return {
      content: response.content[0].type === 'text' ? response.content[0].text : '',
      model: response.model,
      provider: 'anthropic',
      usage: {
        promptTokens: usage.input_tokens,
        completionTokens: usage.output_tokens,
        totalTokens: usage.input_tokens + usage.output_tokens,
      },
      cost,
      responseTime,
      finishReason: response.stop_reason || undefined,
    };
  }

  private async googleChatCompletion(
    messages: ChatMessage[],
    options: { model: string; temperature: number; maxTokens: number }
  ): Promise<AIResponse> {
    // Google Gemini implementation would go here
    // For now, fallback to OpenAI
    return this.openaiChatCompletion(messages, options);
  }

  // Language translation
  public async translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<TranslationResult> {
    if (!this.googleTranslate) {
      throw new Error('Google Translate not initialized');
    }

    try {
      const request = {
        parent: `projects/${this.config.googleCloudProjectId}/locations/global`,
        contents: [text],
        mimeType: 'text/plain',
        sourceLanguageCode: sourceLanguage,
        targetLanguageCode: targetLanguage,
      };

      const [response] = await this.googleTranslate.translateText(request);
      const translation = response.translations![0];

      return {
        translatedText: translation.translatedText!,
        sourceLanguage: translation.detectedLanguageCode || sourceLanguage || 'unknown',
        targetLanguage,
        confidence: 1.0, // Google doesn't provide confidence for basic translation
      };
    } catch (error) {
      console.error('Translation failed:', error);
      throw error;
    }
  }

  // Speech-to-text conversion
  public async speechToText(
    audioBuffer: Buffer,
    options: {
      encoding?: string;
      sampleRateHertz?: number;
      languageCode?: string;
      enableWordTimeOffsets?: boolean;
    } = {}
  ): Promise<SpeechToTextResult> {
    if (!this.googleSpeech) {
      throw new Error('Google Speech not initialized');
    }

    try {
      const {
        encoding = 'WEBM_OPUS',
        sampleRateHertz = 48000,
        languageCode = 'en-US',
        enableWordTimeOffsets = true,
      } = options;

      const request = {
        audio: {
          content: audioBuffer.toString('base64'),
        },
        config: {
          encoding: encoding as any,
          sampleRateHertz,
          languageCode,
          enableWordTimeOffsets,
          enableAutomaticPunctuation: true,
          model: 'latest_long',
        },
      };

      const [response] = await this.googleSpeech.recognize(request);
      const alternative = response.results?.[0]?.alternatives?.[0];

      if (!alternative) {
        throw new Error('No speech recognized');
      }

      return {
        transcript: alternative.transcript!,
        confidence: alternative.confidence || 0,
        language: languageCode,
        words: alternative.words?.map(word => ({
          word: word.word!,
          startTime: Number(word.startTime?.seconds || 0) + Number(word.startTime?.nanos || 0) / 1e9,
          endTime: Number(word.endTime?.seconds || 0) + Number(word.endTime?.nanos || 0) / 1e9,
          confidence: word.confidence || 0,
        })),
      };
    } catch (error) {
      console.error('Speech-to-text failed:', error);
      throw error;
    }
  }

  // Image analysis
  public async analyzeImage(imageBuffer: Buffer): Promise<ImageAnalysisResult> {
    if (!this.googleVision) {
      throw new Error('Google Vision not initialized');
    }

    try {
      const request = {
        image: {
          content: imageBuffer.toString('base64'),
        },
        features: [
          { type: 'LABEL_DETECTION', maxResults: 10 },
          { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
          { type: 'TEXT_DETECTION' },
          { type: 'FACE_DETECTION', maxResults: 10 },
          { type: 'SAFE_SEARCH_DETECTION' },
        ],
      };

      const [response] = await this.googleVision.annotateImage(request);

      return {
        labels: response.labelAnnotations?.map(label => ({
          description: label.description!,
          score: label.score!,
        })) || [],
        objects: response.localizedObjectAnnotations?.map(obj => ({
          name: obj.name!,
          score: obj.score!,
          boundingBox: {
            x: obj.boundingPoly?.normalizedVertices?.[0]?.x || 0,
            y: obj.boundingPoly?.normalizedVertices?.[0]?.y || 0,
            width: (obj.boundingPoly?.normalizedVertices?.[2]?.x || 0) - (obj.boundingPoly?.normalizedVertices?.[0]?.x || 0),
            height: (obj.boundingPoly?.normalizedVertices?.[2]?.y || 0) - (obj.boundingPoly?.normalizedVertices?.[0]?.y || 0),
          },
        })) || [],
        text: response.textAnnotations?.[0]?.description,
        faces: response.faceAnnotations?.map(face => ({
          emotions: {
            joy: this.mapLikelihood(face.joyLikelihood),
            sorrow: this.mapLikelihood(face.sorrowLikelihood),
            anger: this.mapLikelihood(face.angerLikelihood),
            surprise: this.mapLikelihood(face.surpriseLikelihood),
          },
          age: 0, // Google Vision doesn't provide age
          gender: 'unknown', // Google Vision doesn't provide gender
          confidence: face.detectionConfidence || 0,
        })) || [],
        safeSearch: {
          adult: response.safeSearchAnnotation?.adult || 'UNKNOWN',
          violence: response.safeSearchAnnotation?.violence || 'UNKNOWN',
          racy: response.safeSearchAnnotation?.racy || 'UNKNOWN',
          medical: response.safeSearchAnnotation?.medical || 'UNKNOWN',
        },
      };
    } catch (error) {
      console.error('Image analysis failed:', error);
      throw error;
    }
  }

  // Content generation with AI
  public async generateContent(
    prompt: string,
    type: 'text' | 'code' | 'creative' | 'analytical',
    options: ContentGenerationOptions = {}
  ): Promise<AIResponse> {
    const systemPrompts = {
      text: 'You are a helpful assistant that generates clear, concise, and informative text content.',
      code: 'You are an expert programmer. Write clean, efficient, and well-documented code.',
      creative: 'You are a creative writer. Generate engaging, imaginative, and original content.',
      analytical: 'You are a data analyst. Provide thorough, logical, and evidence-based analysis.',
    };

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: options.systemPrompt || systemPrompts[type],
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.chatCompletion(messages, options);
  }

  // Personalized content recommendations
  public async generatePersonalizedRecommendations(
    data: PersonalizationData,
    contentType: 'products' | 'articles' | 'videos' | 'music',
    count: number = 10
  ): Promise<Array<{
    id: string;
    title: string;
    description: string;
    score: number;
    reason: string;
  }>> {
    try {
      // Create a prompt based on user data
      const prompt = `Based on the following user profile, recommend ${count} ${contentType}:
      
User Preferences: ${JSON.stringify(data.preferences)}
User History: ${data.history.slice(-10).map(h => `${h.action} ${h.item}`).join(', ')}
Demographics: ${JSON.stringify(data.demographics)}

Provide recommendations in JSON format with id, title, description, score (0-1), and reason for each recommendation.`;

      const response = await this.generateContent(prompt, 'analytical', {
        model: 'gpt-3.5-turbo',
        temperature: 0.3,
      });

      // Parse the AI response
      try {
        const recommendations = JSON.parse(response.content);
        return Array.isArray(recommendations) ? recommendations : [];
      } catch (parseError) {
        console.error('Failed to parse recommendations:', parseError);
        return [];
      }
    } catch (error) {
      console.error('Failed to generate personalized recommendations:', error);
      return [];
    }
  }

  // Text-to-speech (simplified - would integrate with actual TTS service)
  public async textToSpeech(
    text: string,
    options: {
      voice?: string;
      speed?: number;
      language?: string;
    } = {}
  ): Promise<Buffer> {
    // Placeholder implementation - would integrate with Google Text-to-Speech or similar
    console.log('Text-to-speech conversion:', { text, options });
    return Buffer.from('audio_data_placeholder');
  }

  // Sentiment analysis
  public async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    confidence: number;
  }> {
    try {
      const prompt = `Analyze the sentiment of the following text and respond with only a JSON object containing sentiment ("positive", "negative", or "neutral"), score (-1 to 1), and confidence (0 to 1):

"${text}"`;

      const response = await this.generateContent(prompt, 'analytical', {
        model: 'gpt-3.5-turbo',
        temperature: 0.1,
      });

      const result = JSON.parse(response.content);
      return result;
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      return { sentiment: 'neutral', score: 0, confidence: 0 };
    }
  }

  // Content moderation
  public async moderateContent(content: string): Promise<{
    isAppropriate: boolean;
    categories: string[];
    confidence: number;
    reason?: string;
  }> {
    try {
      const prompt = `Analyze the following content for inappropriate material including hate speech, violence, adult content, spam, or harmful content. Respond with only a JSON object:

"${content}"

Response format: {"isAppropriate": boolean, "categories": ["category1", "category2"], "confidence": 0-1, "reason": "explanation"}`;

      const response = await this.generateContent(prompt, 'analytical', {
        model: 'gpt-3.5-turbo',
        temperature: 0.1,
      });

      return JSON.parse(response.content);
    } catch (error) {
      console.error('Content moderation failed:', error);
      return { isAppropriate: true, categories: [], confidence: 0 };
    }
  }

  // Utility methods
  private calculateCost(model: AIModel, promptTokens: number, completionTokens: number): number {
    const pricing = this.pricing[model];
    if (!pricing) return 0;

    return (promptTokens / 1000 * pricing.prompt) + (completionTokens / 1000 * pricing.completion);
  }

  private mapLikelihood(likelihood?: string): number {
    const mapping: Record<string, number> = {
      'VERY_UNLIKELY': 0.1,
      'UNLIKELY': 0.3,
      'POSSIBLE': 0.5,
      'LIKELY': 0.7,
      'VERY_LIKELY': 0.9,
    };
    return mapping[likelihood || ''] || 0;
  }

  // Health check
  public async healthCheck(): Promise<{
    openai: boolean;
    anthropic: boolean;
    googleCloud: boolean;
  }> {
    const checks = {
      openai: false,
      anthropic: false,
      googleCloud: false,
    };

    // Check OpenAI
    if (this.openai) {
      try {
        await this.openai.models.list();
        checks.openai = true;
      } catch (error) {
        console.error('OpenAI health check failed:', error);
      }
    }

    // Check Anthropic
    if (this.anthropic) {
      // Anthropic doesn't have a simple health check, so we assume it's healthy if initialized
      checks.anthropic = true;
    }

    // Check Google Cloud
    if (this.googleTranslate) {
      try {
        await this.googleTranslate.getSupportedLanguages({
          parent: `projects/${this.config.googleCloudProjectId}/locations/global`,
        });
        checks.googleCloud = true;
      } catch (error) {
        console.error('Google Cloud health check failed:', error);
      }
    }

    return checks;
  }
}
