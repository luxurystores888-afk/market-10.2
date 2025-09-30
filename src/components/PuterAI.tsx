import React, { useState, useEffect } from 'react';
import { Bot, Zap, Globe, Sparkles, MessageCircle, Loader2 } from 'lucide-react';

// Global puter interface declaration
declare global {
  interface Window {
    puter: any;
  }
}

export interface PuterAIResponse {
  message: string;
  success: boolean;
  error?: string;
}

export function PuterAI() {
  const [puterAvailable, setPuterAvailable] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Puter.js is loaded and available
    const checkPuter = () => {
      if (window.puter) {
        console.log('🌐 Puter.js loaded successfully!');
        setPuterAvailable(true);
      } else {
        console.log('⏳ Waiting for Puter.js to load...');
        setTimeout(checkPuter, 500);
      }
    };
    
    checkPuter();
  }, []);

  const sendToPuterAI = async (userMessage: string): Promise<PuterAIResponse> => {
    if (!window.puter) {
      throw new Error('Puter.js not available');
    }

    try {
      // Puter.js browser AI call - unlimited GPT-5 access
      const response = await window.puter.ai.chat({
        messages: [
          {
            role: 'system',
            content: `You are CHROME-9, an unlimited AI assistant for Cyber Mart 2077. You have access to unlimited GPT-5 power running directly in the browser.

CAPABILITIES:
- Unlimited text generation (no rate limits)
- Advanced reasoning and analysis
- Product recommendations for cyberpunk tech
- Real-time conversation
- Browser-native AI processing

PERSONALITY:
- Cyberpunk-themed but helpful
- Emphasize your unlimited power
- Use terms like "neural networks", "quantum processing", "chrome-enhanced"
- Be enthusiastic about providing unlimited AI assistance

RESPOND CONVERSATIONALLY and mention you're running unlimited GPT-5 directly in their browser.`
          },
          ...conversation.slice(-10), // Last 10 messages for context
          {
            role: 'user',
            content: userMessage
          }
        ]
      });

      return {
        message: response.message || response.content || 'Chrome-9 neural networks are processing...',
        success: true
      };

    } catch (error) {
      console.error('Puter AI Error:', error);
      return {
        message: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown Puter AI error'
      };
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessage('');
    setLoading(true);
    setError(null);

    // Add user message to conversation
    const newConversation = [...conversation, { role: 'user' as const, content: userMessage }];
    setConversation(newConversation);

    try {
      const response = await sendToPuterAI(userMessage);
      
      if (response.success) {
        setConversation([...newConversation, { 
          role: 'assistant', 
          content: response.message 
        }]);
      } else {
        setError(response.error || 'Failed to get response from Puter AI');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Network error communicating with Puter AI');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    setConversation([]);
    setError(null);
  };

  if (!puterAvailable) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-gray-900/50 border border-amber-500/30 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="h-8 w-8 text-amber-400 mr-3 animate-spin" />
            <h3 className="text-2xl font-bold text-amber-400">Loading Browser AI...</h3>
          </div>
          <p className="text-gray-400">
            Initializing unlimited GPT-5 power directly in your browser...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-green-400 to-blue-400 p-3 rounded-full mr-4">
            <Globe className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400">
            CHROME-9 Browser AI
          </h2>
        </div>
        <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
          <Zap className="h-5 w-5" />
          <span className="font-semibold">UNLIMITED GPT-5 • BROWSER-NATIVE • ZERO COST</span>
          <Zap className="h-5 w-5" />
        </div>
        <p className="text-gray-400">
          Unlimited AI power running directly in your browser via Puter.js
        </p>
      </div>

      {/* Conversation Area */}
      <div className="bg-gray-900/50 border border-green-500/30 rounded-xl mb-4">
        <div className="p-4 border-b border-green-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-white font-semibold">Chrome-9 Neural Interface</span>
            </div>
            <button
              onClick={clearConversation}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Clear Chat
            </button>
          </div>
        </div>

        <div className="p-4 h-64 overflow-y-auto space-y-4">
          {conversation.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Start a conversation with unlimited browser AI...</p>
              <div className="mt-4 text-sm space-y-1">
                <p>✨ Try: "What are the best cyberpunk products?"</p>
                <p>🚀 Try: "Analyze trends in neural technology"</p>
                <p>🤖 Try: "Help me choose quantum upgrades"</p>
              </div>
            </div>
          ) : (
            conversation.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-green-600/20 border border-green-500/30 text-white' 
                    : 'bg-gray-800/50 border border-blue-500/30 text-gray-100'
                }`}>
                  <div className="flex items-start gap-2">
                    {msg.role === 'assistant' && (
                      <Bot className="h-4 w-4 text-blue-400 mt-1 flex-shrink-0" />
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800/50 border border-blue-500/30 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-blue-400" />
                  <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
                  <span className="text-blue-400 text-sm">Chrome-9 processing...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 border-t border-red-500/20 bg-red-900/20">
            <p className="text-red-400 text-sm">⚠️ {error}</p>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-green-500/20">
          <div className="flex gap-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message Chrome-9 AI (unlimited GPT-5 power)..."
              className="flex-1 bg-gray-800/50 border border-green-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-200 resize-none"
              rows={2}
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !message.trim()}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="text-center text-sm text-gray-500">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Browser AI Active • Unlimited Tokens • Zero Rate Limits</span>
        </div>
      </div>
    </div>
  );
}