import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Volume2, VolumeX, Settings, 
  MessageSquare, Search, ShoppingCart, Loader2,
  Activity, Play, Pause, RotateCcw, Send,
  Brain, Zap, Sparkles, Headphones, Phone,
  Languages, Gauge
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceCommand {
  id: string;
  command: string;
  timestamp: Date;
  response: string;
  confidence: number;
  intent: 'search' | 'navigate' | 'purchase' | 'inquiry' | 'help' | 'unknown';
  entities: Array<{
    type: string;
    value: string;
    confidence: number;
  }>;
}

interface VoiceSettings {
  language: string;
  voiceSpeed: number;
  voicePitch: number;
  autoListen: boolean;
  continuousMode: boolean;
  noiseReduction: boolean;
  wakeWord: string;
  confidence: number;
  timeout: number;
}

interface SpeechSynthesisState {
  speaking: boolean;
  paused: boolean;
  pending: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
}

interface VoiceAnalytics {
  totalCommands: number;
  successfulCommands: number;
  averageConfidence: number;
  popularIntents: Record<string, number>;
  languageUsage: Record<string, number>;
  sessionDuration: number;
}

export default function VoiceShoppingAssistant() {
  // State Management
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Voice Command History
  const [commandHistory, setCommandHistory] = useState<VoiceCommand[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  
  // Settings State
  const [settings, setSettings] = useState<VoiceSettings>({
    language: 'en-US',
    voiceSpeed: 1.0,
    voicePitch: 1.0,
    autoListen: false,
    continuousMode: false,
    noiseReduction: true,
    wakeWord: 'hey cybershop',
    confidence: 0.7,
    timeout: 10000
  });

  // Speech Synthesis State
  const [synthState, setSynthState] = useState<SpeechSynthesisState>({
    speaking: false,
    paused: false,
    pending: false,
    voices: [],
    selectedVoice: null
  });

  // Analytics
  const [analytics, setAnalytics] = useState<VoiceAnalytics>({
    totalCommands: 0,
    successfulCommands: 0,
    averageConfidence: 0,
    popularIntents: {},
    languageUsage: {},
    sessionDuration: 0
  });

  // Refs
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sessionStartRef = useRef<Date>(new Date());

  // Toast for notifications
  const { toast } = useToast();

  // Initialize Speech Recognition
  const initializeSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice Assistant Unavailable",
        description: "Speech recognition is not supported in this browser",
        variant: "destructive"
      });
      return false;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = settings.continuousMode;
    recognition.interimResults = true;
    recognition.lang = settings.language;

    recognition.onstart = () => {
      console.log('🎤 Voice recognition started');
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          setConfidence(confidence);
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(interimTranscript);
      
      if (finalTranscript) {
        setFinalTranscript(finalTranscript);
        processVoiceCommand(finalTranscript, confidence || 0.8);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access to use voice shopping",
          variant: "destructive"
        });
      }
    };

    recognition.onend = () => {
      console.log('🎤 Voice recognition ended');
      setIsListening(false);
      
      if (settings.autoListen && isExpanded) {
        setTimeout(startListening, 1000);
      }
    };

    recognitionRef.current = recognition;
    return true;
  }, [settings, isExpanded]);

  // Initialize Speech Synthesis
  const initializeSpeechSynthesis = useCallback(() => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return false;
    }

    synthRef.current = window.speechSynthesis;
    
    const updateVoices = () => {
      const voices = synthRef.current!.getVoices();
      setSynthState(prev => ({
        ...prev,
        voices,
        selectedVoice: voices.find(voice => voice.lang === settings.language) || voices[0] || null
      }));
    };

    updateVoices();
    synthRef.current.onvoiceschanged = updateVoices;

    return true;
  }, [settings.language]);

  // Process Voice Command
  const processVoiceCommand = async (command: string, confidence: number) => {
    if (confidence < settings.confidence) {
      speak("I didn't catch that clearly. Could you please repeat?");
      return;
    }

    setIsProcessing(true);
    console.log('🧠 Processing voice command:', command);

    try {
      // Analyze command intent and entities
      const analysis = await analyzeVoiceCommand(command);
      
      // Create voice command record
      const voiceCommand: VoiceCommand = {
        id: `cmd_${Date.now()}`,
        command,
        timestamp: new Date(),
        response: '',
        confidence,
        intent: analysis.intent,
        entities: analysis.entities
      };

      // Process based on intent
      let response = '';
      
      switch (analysis.intent) {
        case 'search':
          response = await handleSearchCommand(analysis.entities);
          break;
        case 'navigate':
          response = await handleNavigationCommand(analysis.entities);
          break;
        case 'purchase':
          response = await handlePurchaseCommand(analysis.entities);
          break;
        case 'inquiry':
          response = await handleInquiryCommand(analysis.entities);
          break;
        case 'help':
          response = getHelpResponse();
          break;
        default:
          response = "I didn't understand that command. Try saying 'help' to see what I can do.";
      }

      voiceCommand.response = response;
      setCurrentResponse(response);
      
      // Update command history
      setCommandHistory(prev => [voiceCommand, ...prev.slice(0, 9)]);
      
      // Update analytics
      updateAnalytics(voiceCommand);
      
      // Speak response
      speak(response);

    } catch (error) {
      console.error('Error processing voice command:', error);
      speak("Sorry, I encountered an error processing your request.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Analyze Voice Command
  const analyzeVoiceCommand = async (command: string): Promise<{
    intent: VoiceCommand['intent'];
    entities: VoiceCommand['entities'];
  }> => {
    const lowerCommand = command.toLowerCase();
    
    // Simple intent detection (in production, use NLU service)
    let intent: VoiceCommand['intent'] = 'unknown';
    const entities: VoiceCommand['entities'] = [];

    if (lowerCommand.includes('search') || lowerCommand.includes('find') || lowerCommand.includes('look for')) {
      intent = 'search';
      // Extract search terms
      const searchMatch = lowerCommand.match(/(?:search|find|look for)\s+(.+)/);
      if (searchMatch) {
        entities.push({
          type: 'search_term',
          value: searchMatch[1],
          confidence: 0.9
        });
      }
    } else if (lowerCommand.includes('go to') || lowerCommand.includes('navigate') || lowerCommand.includes('open')) {
      intent = 'navigate';
      // Extract destination
      const navMatch = lowerCommand.match(/(?:go to|navigate to|open)\s+(.+)/);
      if (navMatch) {
        entities.push({
          type: 'destination',
          value: navMatch[1],
          confidence: 0.9
        });
      }
    } else if (lowerCommand.includes('buy') || lowerCommand.includes('purchase') || lowerCommand.includes('add to cart')) {
      intent = 'purchase';
      // Extract product name
      const productMatch = lowerCommand.match(/(?:buy|purchase|add to cart)\s+(.+)/);
      if (productMatch) {
        entities.push({
          type: 'product_name',
          value: productMatch[1],
          confidence: 0.8
        });
      }
    } else if (lowerCommand.includes('what') || lowerCommand.includes('how') || lowerCommand.includes('tell me')) {
      intent = 'inquiry';
    } else if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
      intent = 'help';
    }

    return { intent, entities };
  };

  // Handle Commands
  const handleSearchCommand = async (entities: VoiceCommand['entities']): Promise<string> => {
    const searchTerm = entities.find(e => e.type === 'search_term')?.value;
    if (searchTerm) {
      // Trigger search in the application
      window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`;
      return `Searching for ${searchTerm}. I found several products that match your request.`;
    }
    return "What would you like to search for?";
  };

  const handleNavigationCommand = async (entities: VoiceCommand['entities']): Promise<string> => {
    const destination = entities.find(e => e.type === 'destination')?.value;
    if (destination) {
      const routes: Record<string, string> = {
        'home': '/',
        'products': '/products',
        'cart': '/cart',
        'orders': '/orders',
        'profile': '/profile',
        'dashboard': '/dashboard'
      };
      
      const route = routes[destination.toLowerCase()] || routes[Object.keys(routes).find(key => 
        destination.toLowerCase().includes(key)
      ) || ''];
      
      if (route) {
        window.location.href = route;
        return `Navigating to ${destination}.`;
      }
    }
    return "Where would you like to go? You can say home, products, cart, orders, or dashboard.";
  };

  const handlePurchaseCommand = async (entities: VoiceCommand['entities']): Promise<string> => {
    const productName = entities.find(e => e.type === 'product_name')?.value;
    if (productName) {
      // Search for the product and add to cart
      return `I'll help you purchase ${productName}. Let me search for that product.`;
    }
    return "What product would you like to buy?";
  };

  const handleInquiryCommand = async (entities: VoiceCommand['entities']): Promise<string> => {
    return "I'm your AI shopping assistant. I can help you search for products, navigate the store, and answer questions about your orders.";
  };

  const getHelpResponse = (): string => {
    return `I'm your voice shopping assistant! I can help you with:
    - Searching: Say "search for headphones" or "find laptops"
    - Navigation: Say "go to products" or "open my cart"
    - Shopping: Say "buy wireless mouse" or "add to cart"
    - Questions: Ask me about products or orders
    Just speak naturally and I'll understand!`;
  };

  // Speech Synthesis
  const speak = (text: string) => {
    if (!synthRef.current || !synthState.selectedVoice) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = synthState.selectedVoice;
    utterance.rate = settings.voiceSpeed;
    utterance.pitch = settings.voicePitch;
    utterance.lang = settings.language;

    utterance.onstart = () => {
      setSynthState(prev => ({ ...prev, speaking: true, pending: false }));
    };

    utterance.onend = () => {
      setSynthState(prev => ({ ...prev, speaking: false, paused: false }));
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setSynthState(prev => ({ ...prev, speaking: false, pending: false }));
    };

    setSynthState(prev => ({ ...prev, pending: true }));
    synthRef.current.speak(utterance);
  };

  // Control Functions
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setFinalTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setSynthState(prev => ({ ...prev, speaking: false, paused: false, pending: false }));
    }
  };

  // Update Analytics
  const updateAnalytics = (command: VoiceCommand) => {
    setAnalytics(prev => ({
      totalCommands: prev.totalCommands + 1,
      successfulCommands: command.intent !== 'unknown' ? prev.successfulCommands + 1 : prev.successfulCommands,
      averageConfidence: (prev.averageConfidence + command.confidence) / 2,
      popularIntents: {
        ...prev.popularIntents,
        [command.intent]: (prev.popularIntents[command.intent] || 0) + 1
      },
      languageUsage: {
        ...prev.languageUsage,
        [settings.language]: (prev.languageUsage[settings.language] || 0) + 1
      },
      sessionDuration: (new Date().getTime() - sessionStartRef.current.getTime()) / 1000
    }));
  };

  // Initialize on mount
  useEffect(() => {
    const initSpeech = initializeSpeechRecognition();
    const initSynth = initializeSpeechSynthesis();
    
    if (initSpeech && initSynth) {
      setIsInitialized(true);
      speak("Voice shopping assistant activated. How can I help you today?");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Collapsed Voice Button */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setIsExpanded(true)}
              className={cn(
                "h-14 w-14 rounded-full shadow-2xl border-2",
                "bg-gradient-to-r from-primary to-secondary",
                "border-accent/50 hover:border-accent",
                "transition-all duration-300",
                isListening && "animate-pulse border-green-400",
                synthState.speaking && "border-blue-400"
              )}
            >
              {isListening ? (
                <Activity className="h-6 w-6 text-white animate-pulse" />
              ) : synthState.speaking ? (
                <Volume2 className="h-6 w-6 text-white" />
              ) : (
                <Headphones className="h-6 w-6 text-white" />
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Voice Assistant Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4"
          >
            <Card className="w-96 bg-background/95 backdrop-blur border-accent/20 shadow-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-cyber text-primary flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>Voice Assistant</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSettings(!showSettings)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsExpanded(false)}
                    >
                      ✕
                    </Button>
                  </div>
                </div>

                {/* Status Indicators */}
                <div className="flex items-center space-x-3 text-sm">
                  <Badge 
                    variant={isInitialized ? "default" : "secondary"}
                    className="bg-green-500/20 text-green-400 border-green-500/30"
                  >
                    {isInitialized ? "Ready" : "Initializing"}
                  </Badge>
                  
                  {isListening && (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse">
                      Listening
                    </Badge>
                  )}
                  
                  {synthState.speaking && (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      Speaking
                    </Badge>
                  )}
                  
                  {isProcessing && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      Processing
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Voice Controls */}
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={toggleListening}
                    disabled={!isInitialized}
                    className={cn(
                      "flex-1 cyberpunk-button",
                      isListening ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                    )}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="h-4 w-4 mr-2" />
                        Stop Listening
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        Start Listening
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={stopSpeaking}
                    disabled={!synthState.speaking}
                    variant="outline"
                    size="sm"
                  >
                    <VolumeX className="h-4 w-4" />
                  </Button>
                </div>

                {/* Transcript Display */}
                <div className="bg-muted/20 rounded-lg p-3 min-h-[60px]">
                  <div className="text-xs text-muted-foreground mb-1">Speech Input</div>
                  {transcript || finalTranscript ? (
                    <div className="space-y-1">
                      {finalTranscript && (
                        <div className="text-sm text-foreground font-medium">
                          {finalTranscript}
                        </div>
                      )}
                      {transcript && (
                        <div className="text-sm text-muted-foreground italic">
                          {transcript}
                        </div>
                      )}
                      {confidence > 0 && (
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-muted-foreground">Confidence:</span>
                          <Progress value={confidence * 100} className="h-1 flex-1" />
                          <span className="text-xs font-mono">{Math.round(confidence * 100)}%</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {isListening ? "Listening..." : "Click 'Start Listening' to begin"}
                    </div>
                  )}
                </div>

                {/* Current Response */}
                {currentResponse && (
                  <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                    <div className="text-xs text-primary mb-1">Assistant Response</div>
                    <div className="text-sm text-foreground">{currentResponse}</div>
                  </div>
                )}

                {/* Quick Commands */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Quick Commands</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => speak("What would you like to search for?")}
                      className="text-xs"
                    >
                      <Search className="h-3 w-3 mr-1" />
                      Search
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => speak("Where would you like to go?")}
                      className="text-xs"
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Navigate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => speak(getHelpResponse())}
                      className="text-xs"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Help
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = '/cart'}
                      className="text-xs"
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Cart
                    </Button>
                  </div>
                </div>

                {/* Command History */}
                {commandHistory.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Recent Commands</div>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {commandHistory.slice(0, 3).map((cmd) => (
                        <div key={cmd.id} className="bg-muted/10 rounded p-2 text-xs">
                          <div className="font-medium">{cmd.command}</div>
                          <div className="text-muted-foreground mt-1">{cmd.response}</div>
                          <div className="flex items-center justify-between mt-1">
                            <Badge variant="outline" className="text-xs">
                              {cmd.intent}
                            </Badge>
                            <span className="text-muted-foreground">
                              {Math.round(cmd.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Analytics Summary */}
                {analytics.totalCommands > 0 && (
                  <div className="bg-muted/10 rounded-lg p-3">
                    <div className="text-xs font-medium text-muted-foreground mb-2">Session Stats</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-muted-foreground">Commands</div>
                        <div className="font-mono">{analytics.totalCommands}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Success Rate</div>
                        <div className="font-mono">
                          {Math.round((analytics.successfulCommands / analytics.totalCommands) * 100)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Avg Confidence</div>
                        <div className="font-mono">{Math.round(analytics.averageConfidence * 100)}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Duration</div>
                        <div className="font-mono">{Math.round(analytics.sessionDuration)}s</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}