import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Sparkles, Wand2, FileText, Languages, Globe2,
  Zap, Settings, Play, Pause, RotateCcw, Download,
  Eye, Heart, Star, Activity, Check,
  Copy, Share2, Edit3, Save, Upload, Database,
  PenTool, Lightbulb, Target, BarChart3, TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types
interface AIProvider {
  id: string;
  name: string;
  icon: string;
  status: 'active' | 'busy' | 'error';
  strength: string[];
  capabilities: string[];
}

interface ContentType {
  id: string;
  name: string;
  description: string;
  icon: any;
  templates: string[];
}

interface GenerationTask {
  id: string;
  type: string;
  productId?: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
  progress: number;
  result?: any;
  provider: string;
  startTime: Date;
  estimatedTime: number;
}

interface ContentTemplate {
  id: string;
  name: string;
  type: string;
  prompt: string;
  variables: string[];
  languages: string[];
}

interface AIContentGenerationSystemProps {
  isOpen: boolean;
  onToggle: () => void;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
}

export default function AIContentGenerationSystem({
  isOpen,
  onToggle,
  position,
  onPositionChange
}: AIContentGenerationSystemProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [activeTab, setActiveTab] = useState('generator');
  const [selectedProvider, setSelectedProvider] = useState('multi-ai');
  const [selectedContentType, setSelectedContentType] = useState('product-description');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [autoMode, setAutoMode] = useState(false);
  const [realTimeMode, setRealTimeMode] = useState(false);
  const [generationTasks, setGenerationTasks] = useState<GenerationTask[]>([]);
  const [contentTemplates, setContentTemplates] = useState<ContentTemplate[]>([]);
  const [generationHistory, setGenerationHistory] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Providers
  const aiProviders: AIProvider[] = [
    {
      id: 'openai',
      name: 'OpenAI GPT-5',
      icon: '🧠',
      status: 'active',
      strength: ['Creativity', 'Versatility', 'Context Understanding'],
      capabilities: ['Product Descriptions', 'SEO Content', 'Marketing Copy', 'Technical Specs']
    },
    {
      id: 'anthropic',
      name: 'Claude Sonnet 4',
      icon: '⚡',
      status: 'active', 
      strength: ['Analysis', 'Reasoning', 'Safety'],
      capabilities: ['Content Analysis', 'Fact Checking', 'Brand Voice', 'Quality Assessment']
    },
    {
      id: 'gemini',
      name: 'Gemini 2.5 Pro',
      icon: '💎',
      status: 'active',
      strength: ['Multimodal', 'Research', 'Innovation'],
      capabilities: ['Image Analysis', 'Market Research', 'Trend Prediction', 'Visual Content']
    },
    {
      id: 'xai',
      name: 'Grok 3',
      icon: '🚀',
      status: 'active',
      strength: ['Real-time', 'Trends', 'Social'],
      capabilities: ['Social Media', 'Trending Topics', 'Real-time Data', 'Viral Content']
    },
    {
      id: 'perplexity',
      name: 'Perplexity Pro',
      icon: '🔍',
      status: 'active',
      strength: ['Research', 'Facts', 'Citations'],
      capabilities: ['Market Research', 'Competitor Analysis', 'Fact Verification', 'Sources']
    },
    {
      id: 'multi-ai',
      name: 'Multi-AI Fusion',
      icon: '🌟',
      status: 'active',
      strength: ['Synergy', 'Quality', 'Diversity'],
      capabilities: ['Best of All', 'Quality Control', 'Multiple Perspectives', 'Optimization']
    }
  ];

  // Content Types
  const contentTypes: ContentType[] = [
    {
      id: 'product-description',
      name: 'Product Descriptions',
      description: 'Compelling product descriptions that convert',
      icon: FileText,
      templates: ['detailed', 'concise', 'feature-focused', 'benefit-driven', 'emotional']
    },
    {
      id: 'seo-content',
      name: 'SEO Content',
      description: 'Search-optimized content with keywords',
      icon: TrendingUp,
      templates: ['meta-descriptions', 'title-tags', 'category-pages', 'landing-pages']
    },
    {
      id: 'marketing-copy',
      name: 'Marketing Copy',
      description: 'Persuasive marketing and advertising content',
      icon: Target,
      templates: ['ads', 'newsletters', 'social-media', 'campaigns', 'promotions']
    },
    {
      id: 'technical-specs',
      name: 'Technical Specifications',
      description: 'Detailed technical documentation',
      icon: Settings,
      templates: ['features', 'specifications', 'compatibility', 'requirements']
    },
    {
      id: 'creative-content',
      name: 'Creative Content',
      description: 'Creative and artistic content pieces',
      icon: Lightbulb,
      templates: ['stories', 'themes', 'concepts', 'narratives', 'brand-voice']
    },
    {
      id: 'multilingual',
      name: 'Multilingual Content',
      description: 'Content in multiple languages',
      icon: Languages,
      templates: ['translations', 'localizations', 'cultural-adaptations']
    }
  ];

  // Supported Languages
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' }
  ];

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as Element).classList.contains('drag-handle')) {
      setIsDragging(true);
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && containerRef.current) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      const maxX = window.innerWidth - containerRef.current.offsetWidth;
      const maxY = window.innerHeight - containerRef.current.offsetHeight;
      
      onPositionChange({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Generate Content
  const generateContent = async (type: string, options: any = {}) => {
    setIsGenerating(true);
    
    const task: GenerationTask = {
      id: Date.now().toString(),
      type,
      status: 'generating',
      progress: 0,
      provider: selectedProvider,
      startTime: new Date(),
      estimatedTime: 30000,
      ...options
    };

    setGenerationTasks(prev => [...prev, task]);

    try {
      console.log('🤖 Generating content:', { type, provider: selectedProvider, options });

      // Simulate AI generation process
      const progressInterval = setInterval(() => {
        setGenerationTasks(prev => 
          prev.map(t => 
            t.id === task.id 
              ? { ...t, progress: Math.min(t.progress + Math.random() * 20, 95) }
              : t
          )
        );
      }, 1000);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));

      clearInterval(progressInterval);

      const generatedContent = {
        title: `AI-Generated ${type} Content`,
        content: `This is high-quality ${type} content generated using ${selectedProvider} AI technology. The content is optimized for engagement, SEO, and conversion.`,
        metadata: {
          provider: selectedProvider,
          language: selectedLanguage,
          timestamp: new Date(),
          wordCount: 150 + Math.floor(Math.random() * 200),
          seoScore: 85 + Math.floor(Math.random() * 15),
          readabilityScore: 80 + Math.floor(Math.random() * 20)
        }
      };

      setGenerationTasks(prev => 
        prev.map(t => 
          t.id === task.id 
            ? { ...t, status: 'completed' as const, progress: 100, result: generatedContent }
            : t
        )
      );

      setGenerationHistory(prev => [generatedContent, ...prev]);

      toast({
        title: "Content Generated Successfully",
        description: `${type} content created using ${selectedProvider}`,
      });

    } catch (error) {
      console.error('Error generating content:', error);
      
      setGenerationTasks(prev => 
        prev.map(t => 
          t.id === task.id 
            ? { ...t, status: 'error' as const }
            : t
        )
      );

      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Batch Generate
  const batchGenerate = async () => {
    toast({
      title: "Batch Generation Started",
      description: "Generating content for multiple products...",
    });

    for (let i = 0; i < 5; i++) {
      await generateContent('product-description', { 
        productId: `product-${i + 1}`,
        batch: true 
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  // Clear completed tasks
  const clearCompleted = () => {
    setGenerationTasks(prev => prev.filter(t => t.status !== 'completed'));
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          onClick={onToggle}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Brain className="h-6 w-6 text-white" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 1000
      }}
      className={cn(
        "w-[900px] h-[600px] bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900",
        "border border-purple-500/50 rounded-xl shadow-2xl backdrop-blur-xl",
        "cursor-move select-none overflow-hidden"
      )}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="drag-handle flex items-center justify-between p-4 border-b border-purple-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600/20 rounded-lg">
            <Brain className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Content Generation System</h3>
            <p className="text-sm text-purple-300">Autonomous Multi-AI Content Creation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-green-500 text-green-400">
            {aiProviders.filter(p => p.status === 'active').length} AI Providers Active
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-purple-400 hover:text-white hover:bg-purple-600/20"
          >
            ✕
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex h-[calc(100%-80px)]">
        {/* Sidebar */}
        <div className="w-64 bg-black/20 border-r border-purple-500/30 p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* AI Provider Selection */}
            <div>
              <Label className="text-purple-300 text-sm font-medium">AI Provider</Label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="mt-1 bg-gray-800/50 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-500/30">
                  {aiProviders.map(provider => (
                    <SelectItem key={provider.id} value={provider.id} className="text-white hover:bg-purple-600/20">
                      <div className="flex items-center gap-2">
                        <span>{provider.icon}</span>
                        <span>{provider.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Content Type */}
            <div>
              <Label className="text-purple-300 text-sm font-medium">Content Type</Label>
              <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                <SelectTrigger className="mt-1 bg-gray-800/50 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-500/30">
                  {contentTypes.map(type => (
                    <SelectItem key={type.id} value={type.id} className="text-white hover:bg-purple-600/20">
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        <span>{type.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Language */}
            <div>
              <Label className="text-purple-300 text-sm font-medium">Language</Label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="mt-1 bg-gray-800/50 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-500/30">
                  {languages.map(lang => (
                    <SelectItem key={lang.code} value={lang.code} className="text-white hover:bg-purple-600/20">
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-purple-500/30" />

            {/* Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-purple-300 text-sm">Auto Mode</Label>
                <Switch
                  checked={autoMode}
                  onCheckedChange={setAutoMode}
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-purple-300 text-sm">Real-time</Label>
                <Switch
                  checked={realTimeMode}
                  onCheckedChange={setRealTimeMode}
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>
            </div>

            <Separator className="bg-purple-500/30" />

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button
                onClick={() => generateContent(selectedContentType)}
                disabled={isGenerating}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Content
              </Button>
              
              <Button
                onClick={batchGenerate}
                variant="outline"
                className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-600/20"
              >
                <Zap className="h-4 w-4 mr-2" />
                Batch Generate
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
              <TabsTrigger value="generator" className="data-[state=active]:bg-purple-600">
                Generator
              </TabsTrigger>
              <TabsTrigger value="tasks" className="data-[state=active]:bg-purple-600">
                Tasks ({generationTasks.length})
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-purple-600">
                History
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generator" className="mt-4 space-y-4">
              {/* Content Generator */}
              <Card className="bg-gray-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-300 flex items-center gap-2">
                    <Wand2 className="h-5 w-5" />
                    Content Generator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {contentTypes.map(type => (
                      <Card
                        key={type.id}
                        className={cn(
                          "cursor-pointer transition-all duration-200 bg-gray-700/50 border-gray-600",
                          selectedContentType === type.id && "ring-2 ring-purple-500 bg-purple-600/20"
                        )}
                        onClick={() => setSelectedContentType(type.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <type.icon className="h-6 w-6 text-purple-400" />
                            <div>
                              <h4 className="font-medium text-white">{type.name}</h4>
                              <p className="text-sm text-gray-400">{type.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks" className="mt-4">
              {/* Generation Tasks */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Generation Tasks</h3>
                  <Button
                    onClick={clearCompleted}
                    variant="outline"
                    size="sm"
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-600/20"
                  >
                    Clear Completed
                  </Button>
                </div>

                <div className="space-y-2">
                  {generationTasks.map(task => (
                    <Card key={task.id} className="bg-gray-800/50 border-purple-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-3 h-3 rounded-full",
                              task.status === 'completed' && "bg-green-400",
                              task.status === 'generating' && "bg-yellow-400 animate-pulse",
                              task.status === 'error' && "bg-red-400",
                              task.status === 'pending' && "bg-gray-400"
                            )} />
                            <div>
                              <p className="font-medium text-white">{task.type}</p>
                              <p className="text-sm text-gray-400">{task.provider}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className={cn(
                            task.status === 'completed' && "border-green-500 text-green-400",
                            task.status === 'generating' && "border-yellow-500 text-yellow-400",
                            task.status === 'error' && "border-red-500 text-red-400",
                            task.status === 'pending' && "border-gray-500 text-gray-400"
                          )}>
                            {task.status}
                          </Badge>
                        </div>
                        
                        {task.status === 'generating' && (
                          <Progress value={task.progress} className="mt-2" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  
                  {generationTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      No generation tasks yet. Start generating content!
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              {/* Generation History */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Generation History</h3>
                
                <div className="space-y-2">
                  {generationHistory.map((item, index) => (
                    <Card key={index} className="bg-gray-800/50 border-purple-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-white">{item.title}</h4>
                            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{item.content}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>Provider: {item.metadata.provider}</span>
                              <span>Words: {item.metadata.wordCount}</span>
                              <span>SEO: {item.metadata.seoScore}/100</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button size="sm" variant="ghost" className="text-purple-400 hover:text-white">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-purple-400 hover:text-white">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {generationHistory.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      No content generated yet. Create your first content!
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-4">
              {/* Analytics Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gray-800/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-purple-300 text-sm">Generation Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Generated:</span>
                        <span className="text-white font-medium">{generationHistory.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Active Tasks:</span>
                        <span className="text-white font-medium">{generationTasks.filter(t => t.status === 'generating').length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Success Rate:</span>
                        <span className="text-green-400 font-medium">96%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-purple-300 text-sm">AI Provider Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {aiProviders.slice(0, 4).map(provider => (
                        <div key={provider.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">{provider.icon} {provider.name}:</span>
                          <span className="text-white font-medium">{Math.floor(Math.random() * 50)}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}