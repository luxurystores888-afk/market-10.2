// 💬 LIVE CHAT & CUSTOMER SUPPORT - AI-POWERED ASSISTANCE
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  Minimize2, 
  Maximize2, 
  X, 
  User, 
  Bot, 
  Paperclip, 
  Smile,
  Phone,
  Video,
  Star,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Brain,
  Search,
  Tag,
  FileText,
  Image as ImageIcon,
  Download,
  Copy,
  MoreHorizontal,
  Headphones,
  Shield,
  Globe,
  Users,
  TrendingUp,
  Eye,
  Settings
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  sender: {
    id: string;
    name: string;
    avatar: string;
    role?: string;
  };
  attachments?: ChatAttachment[];
  reactions?: ChatReaction[];
  isTyping?: boolean;
}

interface ChatAttachment {
  id: string;
  type: 'image' | 'file' | 'link';
  url: string;
  name: string;
  size?: number;
}

interface ChatReaction {
  type: 'helpful' | 'not-helpful' | 'resolved';
  userId: string;
  timestamp: Date;
}

interface Agent {
  id: string;
  name: string;
  avatar: string;
  role: string;
  status: 'online' | 'busy' | 'offline';
  specialties: string[];
  rating: number;
  responseTime: string;
  languages: string[];
}

interface ChatSession {
  id: string;
  status: 'waiting' | 'active' | 'resolved' | 'escalated';
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  agent?: Agent;
  startTime: Date;
  lastActivity: Date;
  satisfaction?: number;
}

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [session, setSession] = useState<ChatSession | null>(null);
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatCategory, setChatCategory] = useState('general');
  const [showSatisfactionSurvey, setShowSatisfactionSurvey] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatCategories = [
    { id: 'general', name: 'General Support', icon: '💬' },
    { id: 'technical', name: 'Technical Help', icon: '🔧' },
    { id: 'billing', name: 'Billing & Orders', icon: '💳' },
    { id: 'ai-assistance', name: 'AI Features', icon: '🤖' },
    { id: 'crypto', name: 'Crypto & Web3', icon: '₿' },
    { id: 'products', name: 'Product Questions', icon: '🛍️' }
  ];

  useEffect(() => {
    loadAvailableAgents();
    if (isOpen && !session) {
      initializeChat();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadAvailableAgents = () => {
    const mockAgents: Agent[] = [
      {
        id: 'ai-assistant',
        name: 'AI Assistant',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ai-assistant',
        role: 'AI Support Bot',
        status: 'online',
        specialties: ['General Support', 'Quick Questions', 'Product Info'],
        rating: 4.9,
        responseTime: 'Instant',
        languages: ['English', 'Spanish', 'French', 'German', 'Chinese']
      },
      {
        id: 'sarah',
        name: 'Sarah Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        role: 'Senior Support Specialist',
        status: 'online',
        specialties: ['Technical Issues', 'AI Features', 'Account Management'],
        rating: 4.8,
        responseTime: '~2 min',
        languages: ['English', 'Chinese']
      },
      {
        id: 'marcus',
        name: 'Marcus Rodriguez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
        role: 'Crypto & Web3 Expert',
        status: 'online',
        specialties: ['Cryptocurrency', 'NFTs', 'Blockchain', 'Wallet Setup'],
        rating: 4.9,
        responseTime: '~3 min',
        languages: ['English', 'Spanish']
      },
      {
        id: 'emma',
        name: 'Emma Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
        role: 'Sales & Product Specialist',
        status: 'busy',
        specialties: ['Product Recommendations', 'Order Issues', 'Billing'],
        rating: 4.7,
        responseTime: '~5 min',
        languages: ['English', 'French']
      }
    ];
    setAvailableAgents(mockAgents);
  };

  const initializeChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      status: 'waiting',
      category: chatCategory,
      priority: 'medium',
      startTime: new Date(),
      lastActivity: new Date()
    };

    setSession(newSession);

    // Start with AI assistant
    const aiAgent = availableAgents.find(agent => agent.id === 'ai-assistant');
    if (aiAgent) {
      newSession.agent = aiAgent;
      newSession.status = 'active';
      setSession(newSession);

      // Welcome message
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'bot',
        content: `Hello! 👋 I'm your AI assistant. I'm here to help you with any questions about Pulse. How can I assist you today?`,
        timestamp: new Date(),
        sender: {
          id: aiAgent.id,
          name: aiAgent.name,
          avatar: aiAgent.avatar,
          role: aiAgent.role
        }
      };

      setMessages([welcomeMessage]);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !session) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date(),
      sender: {
        id: 'current-user',
        name: 'You',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current-user'
      }
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Update session
    setSession(prev => prev ? { ...prev, lastActivity: new Date() } : null);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(newMessage);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: aiResponse,
        timestamp: new Date(),
        sender: {
          id: session.agent!.id,
          name: session.agent!.name,
          avatar: session.agent!.avatar,
          role: session.agent!.role
        }
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('price') || input.includes('cost') || input.includes('payment')) {
      return "I can help you with pricing information! Our products range from $50 to $2000+. We accept regular payments, cryptocurrencies (Bitcoin, Ethereum, etc.), and offer flexible payment plans. What specific product are you interested in?";
    }
    
    if (input.includes('ai') || input.includes('artificial intelligence')) {
      return "Great question about our AI features! 🤖 Our platform includes:\n\n• AI Shopping Assistant (that's me!)\n• Automated product generation\n• Smart price optimization\n• Personalized recommendations\n• AI-powered search\n\nWhich AI feature would you like to know more about?";
    }
    
    if (input.includes('crypto') || input.includes('bitcoin') || input.includes('ethereum') || input.includes('nft')) {
      return "Excellent! We're fully integrated with Web3! 🚀\n\n• Accept Bitcoin, Ethereum, and 20+ cryptocurrencies\n• Built-in NFT marketplace\n• DeFi integrations\n• Crypto wallet connection\n• Automatic conversion to fiat\n\nNeed help setting up crypto payments or exploring our NFT collection?";
    }
    
    if (input.includes('order') || input.includes('shipping') || input.includes('delivery')) {
      return "I can help with order-related questions! 📦\n\n• Track your orders in real-time\n• Free shipping on orders over $100\n• Express delivery available\n• International shipping to 50+ countries\n• Easy returns within 30 days\n\nDo you need to track an existing order or have questions about shipping options?";
    }
    
    if (input.includes('problem') || input.includes('issue') || input.includes('error') || input.includes('bug')) {
      return "I'm sorry you're experiencing an issue! 😔 I'm here to help resolve it quickly.\n\nCould you please describe the specific problem you're encountering? For complex technical issues, I can also connect you with one of our human specialists who can provide more detailed assistance.";
    }
    
    if (input.includes('human') || input.includes('agent') || input.includes('representative')) {
      return "I can connect you with a human agent right away! 👥\n\nOur specialists are available 24/7:\n• Sarah Chen - Technical & AI Expert\n• Marcus Rodriguez - Crypto & Web3 Specialist\n• Emma Johnson - Sales & Products\n\nWould you like me to transfer you to the best specialist for your needs?";
    }
    
    // Default responses
    const defaultResponses = [
      "That's a great question! Let me help you with that. Could you provide a bit more detail about what you're looking for?",
      "I'm here to assist you! Based on what you've shared, I can offer several solutions. What would work best for your situation?",
      "Thanks for reaching out! I have some helpful information about that. What specific aspect would you like me to focus on?",
      "I understand your question. Let me provide you with the most relevant information to help you out!"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const transferToHuman = (agentId: string) => {
    const agent = availableAgents.find(a => a.id === agentId);
    if (!agent || !session) return;

    setSession(prev => prev ? { ...prev, agent, status: 'active' } : null);

    const transferMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'system',
      content: `You've been connected to ${agent.name}, ${agent.role}. They'll be with you shortly!`,
      timestamp: new Date(),
      sender: {
        id: 'system',
        name: 'System',
        avatar: ''
      }
    };

    const agentGreeting: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'agent',
      content: `Hi! I'm ${agent.name}, and I specialize in ${agent.specialties.join(', ')}. I've reviewed your conversation and I'm ready to help. What can I assist you with?`,
      timestamp: new Date(),
      sender: {
        id: agent.id,
        name: agent.name,
        avatar: agent.avatar,
        role: agent.role
      }
    };

    setMessages(prev => [...prev, transferMessage, agentGreeting]);
  };

  const endChat = () => {
    if (session && session.status === 'active') {
      setShowSatisfactionSurvey(true);
    } else {
      closeChat();
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setMessages([]);
    setSession(null);
    setShowSatisfactionSurvey(false);
    setUnreadCount(0);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-105 relative"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              {unreadCount}
            </div>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${isMinimized ? 'w-80' : 'w-96'} ${isMinimized ? 'h-16' : 'h-[600px]'} transition-all duration-300`}>
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {session?.agent ? (
                <img
                  src={session.agent.avatar}
                  alt={session.agent.name}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ) : (
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Headphones className="h-4 w-4 text-white" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
            </div>
            <div>
              <div className="text-white font-medium">
                {session?.agent ? session.agent.name : 'Customer Support'}
              </div>
              <div className="text-white/80 text-xs">
                {session?.agent ? session.agent.role : 'Choose your support option'}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white/80 hover:text-white transition-colors"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={endChat}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800">
              {!session && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">👋</div>
                  <h3 className="text-white font-bold mb-2">Welcome to Pulse Support!</h3>
                  <p className="text-gray-400 mb-4">Choose a category to get started:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {chatCategories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setChatCategory(category.id);
                          initializeChat();
                        }}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-all text-sm"
                      >
                        <div className="text-lg mb-1">{category.icon}</div>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex space-x-2 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <img
                      src={message.sender.avatar}
                      alt={message.sender.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className={`rounded-lg p-3 ${
                        message.type === 'user' 
                          ? 'bg-cyan-500 text-white' 
                          : message.type === 'system'
                          ? 'bg-gray-600 text-gray-200'
                          : 'bg-gray-700 text-white'
                      }`}>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>
                      <div className={`text-xs text-gray-400 mt-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex space-x-2 max-w-xs lg:max-w-md">
                    <img
                      src={session?.agent?.avatar}
                      alt="Agent"
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Available Agents (show when no session) */}
            {!session && (
              <div className="p-4 border-t border-gray-700 bg-gray-800">
                <div className="text-sm text-gray-400 mb-3">Available Specialists:</div>
                <div className="space-y-2">
                  {availableAgents.slice(1).map(agent => (
                    <div
                      key={agent.id}
                      className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <img src={agent.avatar} alt={agent.name} className="w-6 h-6 rounded-full" />
                        <div>
                          <div className="text-white text-xs font-medium">{agent.name}</div>
                          <div className="text-gray-400 text-xs">{agent.role}</div>
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        agent.status === 'online' ? 'bg-green-500/20 text-green-400' :
                        agent.status === 'busy' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {agent.responseTime}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {session && session.agent?.id === 'ai-assistant' && (
              <div className="p-4 border-t border-gray-700 bg-gray-800">
                <div className="text-sm text-gray-400 mb-2">Quick Actions:</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => transferToHuman('sarah')}
                    className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-xs hover:bg-blue-500/30 transition-all"
                  >
                    💻 Technical Help
                  </button>
                  <button
                    onClick={() => transferToHuman('marcus')}
                    className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded text-xs hover:bg-orange-500/30 transition-all"
                  >
                    ₿ Crypto Support
                  </button>
                  <button
                    onClick={() => transferToHuman('emma')}
                    className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-xs hover:bg-green-500/30 transition-all"
                  >
                    🛍️ Product Help
                  </button>
                </div>
              </div>
            )}

            {/* Message Input */}
            {session && (
              <div className="p-4 border-t border-gray-700 bg-gray-900">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm"
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white p-2 rounded-lg transition-all"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                  <span>Powered by AI • Response time: {session.agent?.responseTime}</span>
                  <button
                    onClick={endChat}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    End Chat
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Satisfaction Survey Modal */}
        {showSatisfactionSurvey && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-sm">
              <h3 className="text-lg font-bold text-white mb-4">How was your experience?</h3>
              <div className="flex justify-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => {
                      setSession(prev => prev ? { ...prev, satisfaction: rating } : null);
                      setTimeout(closeChat, 1000);
                    }}
                    className="text-2xl hover:scale-110 transition-transform"
                  >
                    <Star className={`h-8 w-8 ${rating <= 3 ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
                  </button>
                ))}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSession(prev => prev ? { ...prev, satisfaction: 5 } : null);
                    closeChat();
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm transition-all"
                >
                  Great!
                </button>
                <button
                  onClick={closeChat}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg text-sm transition-all"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
