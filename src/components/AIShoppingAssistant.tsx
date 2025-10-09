import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Zap, ShoppingCart, Sparkles, ChevronDown } from 'lucide-react';
import type { ChatMessage, ChatResponse, ProductRecommendation } from '@/lib/types';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/price';

interface AIShoppingAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface UIMessage extends ChatMessage {
  isLoading?: boolean;
}

export function AIShoppingAssistant({ isOpen, onToggle }: AIShoppingAssistantProps) {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToCart } = useCart();

  // Default suggestions
  const defaultSuggestions = [
    "Find neural implants for gaming",
    "Compare quantum processors",
    "Show me cybernetic enhancements under $2000",
    "What's the latest in AI assistants?",
    "I need AR gear for work",
    "Best bio-enhancements for athletes"
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when first opened
      const welcomeMessage: UIMessage = {
        id: 'welcome',
        role: 'assistant',
        content: "Greetings, chrome. I'm NEXUS-7, your personal cyberpunk tech advisor. Ready to upgrade your reality? What kind of neural enhancements or quantum tech are you looking for today?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      setSuggestedQuestions(defaultSuggestions);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: UIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShowSuggestions(false);

    // Add loading message
    const loadingMessage: UIMessage = {
      id: `loading-${Date.now()}`,
      role: 'assistant',
      content: 'NEXUS-7 is analyzing your request...',
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText.trim(),
          conversationHistory: messages.filter(m => !m.isLoading).map(msg => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp.toISOString()
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `AI service error: ${response.status}`);
      }

      const chatResponse: ChatResponse & { success: boolean } = await response.json();

      if (!chatResponse.success) {
        throw new Error(chatResponse.message || 'AI service unavailable');
      }

      // Remove loading message and add AI response
      setMessages(prev => {
        const withoutLoading = prev.filter(m => !m.isLoading);
        
        const aiMessage: UIMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: chatResponse.message,
          timestamp: new Date(),
          productRecommendations: chatResponse.productRecommendations
        };

        return [...withoutLoading, aiMessage];
      });

      setSuggestedQuestions(chatResponse.suggestedQuestions || defaultSuggestions);

    } catch (error) {
      console.error('Chat error:', error);
      
      // Remove loading message and add error message
      setMessages(prev => {
        const withoutLoading = prev.filter(m => !m.isLoading);
        
        const errorMessage: UIMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: error instanceof Error 
            ? `Neural pathway error: ${error.message}. Please try again, chrome.`
            : 'My circuits are experiencing interference. Please try again.',
          timestamp: new Date()
        };

        return [...withoutLoading, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    sendMessage(suggestion);
  };

  const handleAddToCart = (product: ProductRecommendation['product']) => {
    // Convert product recommendation to cart-compatible product format
    const cartProduct = {
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      imageUrl: product.imageUrl || undefined, // Convert null to undefined for cart compatibility
      category: product.category || undefined,
      stock: product.stock || 0,
      tags: Array.isArray(product.tags) ? product.tags as string[] : undefined
    };
    
    addToCart(cartProduct, 1);
    
    // Add confirmation message
    const confirmationMessage: UIMessage = {
      id: `cart-${Date.now()}`,
      role: 'assistant',
      content: `Excellent choice! I've added the ${product.name} to your cart. Ready to jack in with more chrome, or shall we continue browsing?`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, confirmationMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-black/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900/50 to-purple-900/50 p-4 border-b border-cyan-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-cyan-400 to-purple-400 p-2 rounded-lg">
            <Zap className="h-5 w-5 text-black" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              NEXUS-7
            </h3>
            <p className="text-xs text-gray-400">AI Shopping Assistant</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-cyan-400 transition-colors p-1"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-cyan-500/30">
        {messages.map((message) => (
          <div key={message.id}>
            {/* Message bubble */}
            <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                    : 'bg-gray-900/50 border border-cyan-500/20 text-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {message.isLoading && (
                    <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                  )}
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>

            {/* Product recommendations */}
            {message.productRecommendations && message.productRecommendations.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-cyan-400 font-semibold flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Recommended Chrome Upgrades:
                </p>
                {message.productRecommendations.map((rec, idx) => (
                  <div key={idx} className="bg-gray-900/30 border border-cyan-500/20 rounded-xl p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-cyan-400 text-sm">{rec.product.name}</h4>
                        <p className="text-xs text-gray-300 mt-1">{rec.reason}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold text-purple-400">
                            ${formatPrice(typeof rec.product.price === 'string' ? parseFloat(rec.product.price) : rec.product.price)}
                          </span>
                          <span className="text-xs text-gray-400">
                            Stock: {rec.product.stock}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddToCart(rec.product)}
                        className="ml-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center space-x-1"
                      >
                        <ShoppingCart className="h-3 w-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && suggestedQuestions.length > 0 && (
        <div className="px-4 py-2 border-t border-cyan-500/20">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-xs text-cyan-400 flex items-center space-x-1 mb-2"
          >
            <span>Quick Suggestions</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${showSuggestions ? 'rotate-180' : ''}`} />
          </button>
          <div className="grid grid-cols-1 gap-1">
            {suggestedQuestions.slice(0, 3).map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-left text-xs text-gray-300 hover:text-cyan-400 p-2 bg-gray-900/30 hover:bg-cyan-500/10 rounded-lg transition-colors border border-transparent hover:border-cyan-500/30"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-cyan-500/30">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about cyberpunk tech..."
            className="flex-1 bg-gray-900/50 border border-cyan-500/30 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage(inputMessage)}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 text-white p-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Floating Chat Button Component
interface FloatingChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
  hasUnreadMessages?: boolean;
}

export function FloatingChatButton({ onClick, isOpen, hasUnreadMessages = false }: FloatingChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-40 p-4 rounded-full transition-all duration-300 transform hover:scale-110 ${
        isOpen
          ? 'bg-gray-800 border-2 border-cyan-500/50'
          : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
      }`}
      style={{
        boxShadow: isOpen 
          ? '0 0 30px rgba(6, 182, 212, 0.3)' 
          : '0 10px 30px rgba(6, 182, 212, 0.3), 0 0 50px rgba(168, 85, 247, 0.2)'
      }}
    >
      <div className="relative">
        <MessageCircle className={`h-6 w-6 ${isOpen ? 'text-cyan-400' : 'text-white'} transition-colors`} />
        {hasUnreadMessages && !isOpen && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}
        {!isOpen && (
          <div className="absolute inset-0 animate-ping">
            <div className="w-6 h-6 rounded-full bg-cyan-400/20" />
          </div>
        )}
      </div>
    </button>
  );
}