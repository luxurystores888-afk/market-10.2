// 🔍 ADVANCED SEARCH & INTELLIGENT FILTERS - AI-POWERED DISCOVERY
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  X, 
  Star, 
  DollarSign, 
  Calendar,
  Tag,
  Grid,
  List,
  TrendingUp,
  Zap,
  Target,
  Brain,
  Eye,
  Clock,
  MapPin,
  Users,
  Heart,
  Bookmark,
  Share2,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Bot,
  Layers,
  BarChart3
} from 'lucide-react';

interface SearchFilters {
  category: string;
  priceRange: [number, number];
  rating: number;
  availability: 'all' | 'in-stock' | 'pre-order';
  dateRange: string;
  tags: string[];
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'popular' | 'ai-recommended';
  aiPersonalization: boolean;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  tags: string[];
  availability: 'in-stock' | 'pre-order' | 'out-of-stock';
  createdAt: Date;
  views: number;
  likes: number;
  aiScore: number;
  isAIGenerated: boolean;
  isFeatured: boolean;
  isNew: boolean;
  discount?: number;
}

interface SmartSuggestion {
  type: 'category' | 'price' | 'feature' | 'similar';
  text: string;
  action: () => void;
}

export function AdvancedSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    priceRange: [0, 10000],
    rating: 0,
    availability: 'all',
    dateRange: 'all',
    tags: [],
    sortBy: 'relevance',
    aiPersonalization: true
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<SearchResult[]>([]);
  const [voiceInput, setVoiceInput] = useState('');
  const [visualStream, setVisualStream] = useState(null);

  const categories = [
    { id: 'all', name: 'All Categories', count: 1247 },
    { id: 'ai-tools', name: 'AI Tools', count: 234 },
    { id: 'cyberpunk', name: 'Cyberpunk Tech', count: 189 },
    { id: 'crypto', name: 'Crypto & NFTs', count: 156 },
    { id: 'gadgets', name: 'Smart Gadgets', count: 298 },
    { id: 'fashion', name: 'Cyber Fashion', count: 145 },
    { id: 'gaming', name: 'Gaming Gear', count: 267 },
    { id: 'software', name: 'Software', count: 198 }
  ];

  const availableTags = [
    'ai-powered', 'blockchain', 'smart', 'premium', 'limited-edition',
    'eco-friendly', 'wireless', 'voice-control', 'ar-enabled', 'nft-exclusive'
  ];

  useEffect(() => {
    loadSearchData();
    loadPopularSearches();
  }, []);

  useEffect(() => {
    if (searchQuery || filters.category !== 'all' || filters.tags.length > 0) {
      performSearch();
    }
  }, [searchQuery, filters]);

  const loadSearchData = async () => {
    // Mock data - in production, fetch from API
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: 'Neural Interface Headset Pro',
        description: 'Advanced brain-computer interface with AI assistance and cyberpunk design',
        price: 899,
        originalPrice: 1299,
        rating: 4.8,
        reviews: 234,
        image: 'https://picsum.photos/400/300?random=1',
        category: 'ai-tools',
        tags: ['ai-powered', 'premium', 'neural-interface'],
        availability: 'in-stock',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        views: 5678,
        likes: 234,
        aiScore: 0.95,
        isAIGenerated: true,
        isFeatured: true,
        isNew: true,
        discount: 31
      },
      {
        id: '2',
        title: 'Cyberpunk LED Jacket',
        description: 'Smart jacket with programmable LED strips and climate control',
        price: 299,
        rating: 4.6,
        reviews: 156,
        image: 'https://picsum.photos/400/300?random=2',
        category: 'fashion',
        tags: ['smart', 'led', 'cyberpunk'],
        availability: 'in-stock',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        views: 3421,
        likes: 189,
        aiScore: 0.87,
        isAIGenerated: false,
        isFeatured: false,
        isNew: false
      },
      {
        id: '3',
        title: 'Quantum Computing Simulator',
        description: 'AI-powered quantum algorithm simulator for learning and development',
        price: 1599,
        rating: 4.9,
        reviews: 89,
        image: 'https://picsum.photos/400/300?random=3',
        category: 'software',
        tags: ['ai-powered', 'quantum', 'premium'],
        availability: 'pre-order',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        views: 2134,
        likes: 98,
        aiScore: 0.92,
        isAIGenerated: true,
        isFeatured: true,
        isNew: true
      }
    ];

    setResults(mockResults);
    setAiRecommendations(mockResults.slice(0, 3));
  };

  const loadPopularSearches = () => {
    setPopularSearches([
      'neural interface',
      'cyberpunk fashion',
      'ai assistant',
      'quantum computer',
      'smart home',
      'crypto wallet',
      'vr headset',
      'led clothing'
    ]);
  };

  const performSearch = async () => {
    setLoading(true);
    
    // Simulate AI-powered search
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate smart suggestions based on search
    const newSuggestions: SmartSuggestion[] = [
      {
        type: 'category',
        text: 'Search in AI Tools category',
        action: () => setFilters(prev => ({ ...prev, category: 'ai-tools' }))
      },
      {
        type: 'price',
        text: 'Filter by price $500-$1000',
        action: () => setFilters(prev => ({ ...prev, priceRange: [500, 1000] }))
      },
      {
        type: 'feature',
        text: 'Show only AI-powered products',
        action: () => setFilters(prev => ({ ...prev, tags: [...prev.tags, 'ai-powered'] }))
      }
    ];
    
    setSuggestions(newSuggestions);
    
    // Add to search history
    if (searchQuery && !searchHistory.includes(searchQuery)) {
      setSearchHistory(prev => [searchQuery, ...prev.slice(0, 4)]);
    }
    
    setLoading(false);
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, 10000],
      rating: 0,
      availability: 'all',
      dateRange: 'all',
      tags: [],
      sortBy: 'relevance',
      aiPersonalization: true
    });
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const filteredResults = results.filter(result => {
    // Apply filters
    if (filters.category !== 'all' && result.category !== filters.category) return false;
    if (result.price < filters.priceRange[0] || result.price > filters.priceRange[1]) return false;
    if (filters.rating > 0 && result.rating < filters.rating) return false;
    if (filters.availability !== 'all' && result.availability !== filters.availability) return false;
    if (filters.tags.length > 0 && !filters.tags.every(tag => result.tags.includes(tag))) return false;
    
    // Search query matching
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return result.title.toLowerCase().includes(query) ||
             result.description.toLowerCase().includes(query) ||
             result.tags.some(tag => tag.toLowerCase().includes(query));
    }
    
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'newest': return b.createdAt.getTime() - a.createdAt.getTime();
      case 'popular': return b.views - a.views;
      case 'ai-recommended': return b.aiScore - a.aiScore;
      default: return 0;
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-400'
            }`}
          />
        ))}
      </div>
    );
  };

  const startVoiceSearch = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = (e) => setSearchQuery(e.results[0][0].transcript);
    recognition.start();
  };

  const startVisualSearch = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        setVisualStream(stream);
        // Process stream for search (e.g., capture frame and send to AI)
        const video = document.createElement('video');
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d').drawImage(video, 0, 0);
          const imageData = canvas.toDataURL('image/jpeg');
          // Send to /api/ai/analyze-image for search
          fetch('/api/ai/analyze-image', { method: 'POST', body: JSON.stringify({ image: imageData }) })
            .then(res => res.json())
            .then(data => setSearchQuery(data.detectedObject || ''));
        };
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            🔍 AI-Powered Search & Discovery
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Find exactly what you need with intelligent search and smart recommendations
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products, categories, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800/70 backdrop-blur-sm border border-gray-600 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-lg"
              />
              {loading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-cyan-400 border-t-transparent"></div>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-4 rounded-xl font-medium transition-all flex items-center ${
                showFilters 
                  ? 'bg-cyan-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-4 rounded-xl transition-all ${
                  viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-4 rounded-xl transition-all ${
                  viewMode === 'list' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Suggestions */}
        {!searchQuery && (
          <div className="mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Popular Searches */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Popular Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(search)}
                      className="bg-gray-700/50 hover:bg-cyan-500/20 border border-gray-600 hover:border-cyan-400 text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-lg text-sm transition-all"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  AI Recommendations
                </h3>
                <div className="space-y-2">
                  {aiRecommendations.slice(0, 3).map((product, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700/30 transition-all cursor-pointer">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{product.title}</div>
                        <div className="text-gray-400 text-xs">{formatPrice(product.price)}</div>
                      </div>
                      <div className="text-purple-400 text-xs">
                        {Math.round(product.aiScore * 100)}% match
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Smart Suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-6">
            <div className="bg-purple-500/10 border border-purple-400/30 rounded-xl p-4">
              <h3 className="text-purple-400 font-medium mb-3 flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                Smart Suggestions
              </h3>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={suggestion.action}
                    className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400 text-purple-300 px-3 py-1 rounded-lg text-sm transition-all"
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-cyan-400">Advanced Filters</h3>
              <div className="flex space-x-2">
                <button
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price Range: {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      priceRange: [prev.priceRange[0], parseInt(e.target.value)] 
                    }))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Rating</label>
                <div className="flex space-x-2">
                  {[0, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setFilters(prev => ({ ...prev, rating }))}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        filters.rating === rating
                          ? 'bg-yellow-500/20 border border-yellow-400 text-yellow-400'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {rating === 0 ? 'Any' : `${rating}★+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="relevance">Relevance</option>
                  <option value="ai-recommended">AI Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Tags Filter */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Features & Tags</label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      filters.tags.includes(tag)
                        ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-400'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {tag.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Personalization Toggle */}
            <div className="mt-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={filters.aiPersonalization}
                  onChange={(e) => setFilters(prev => ({ ...prev, aiPersonalization: e.target.checked }))}
                  className="w-4 h-4 text-cyan-400 bg-gray-700 border-gray-600 rounded focus:ring-cyan-400"
                />
                <span className="text-gray-300 flex items-center">
                  <Bot className="h-4 w-4 mr-2 text-purple-400" />
                  Enable AI personalization for better recommendations
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-white">
              Search Results ({filteredResults.length})
            </h2>
            {searchQuery && (
              <span className="text-gray-400">for "{searchQuery}"</span>
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Updated in real-time</span>
          </div>
        </div>

        {/* Results Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResults.map(result => (
              <div
                key={result.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-cyan-400/50 transition-all group"
              >
                <div className="relative">
                  <img
                    src={result.image}
                    alt={result.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex space-x-2">
                    {result.isNew && (
                      <span className="bg-green-500/90 text-white px-2 py-1 rounded text-xs font-medium">
                        NEW
                      </span>
                    )}
                    {result.isFeatured && (
                      <span className="bg-purple-500/90 text-white px-2 py-1 rounded text-xs font-medium">
                        FEATURED
                      </span>
                    )}
                    {result.discount && (
                      <span className="bg-red-500/90 text-white px-2 py-1 rounded text-xs font-medium">
                        -{result.discount}%
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 flex space-x-2">
                    {result.isAIGenerated && (
                      <div className="bg-blue-500/90 text-white p-1 rounded">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}
                    <button className="bg-black/50 text-white p-1 rounded hover:bg-black/70 transition-all">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{result.title}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{result.description}</p>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    {renderStars(result.rating)}
                    <span className="text-gray-400 text-sm">({result.reviews})</span>
                    {filters.aiPersonalization && (
                      <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                        {Math.round(result.aiScore * 100)}% match
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-400">{formatPrice(result.price)}</span>
                      {result.originalPrice && (
                        <span className="text-gray-400 text-sm line-through">{formatPrice(result.originalPrice)}</span>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      result.availability === 'in-stock' ? 'bg-green-500/20 text-green-400' :
                      result.availability === 'pre-order' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {result.availability.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {result.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {result.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {result.likes}
                      </span>
                    </div>
                    <span>{result.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredResults.map(result => (
              <div
                key={result.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-cyan-400/50 transition-all"
              >
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    <img
                      src={result.image}
                      alt={result.title}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                    {result.isAIGenerated && (
                      <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full">
                        <Bot className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{result.title}</h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">{formatPrice(result.price)}</div>
                        {result.originalPrice && (
                          <div className="text-gray-400 text-sm line-through">{formatPrice(result.originalPrice)}</div>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-300 mb-3">{result.description}</p>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        {renderStars(result.rating)}
                        <span className="text-gray-400 text-sm">({result.reviews} reviews)</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        result.availability === 'in-stock' ? 'bg-green-500/20 text-green-400' :
                        result.availability === 'pre-order' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {result.availability.replace('-', ' ').toUpperCase()}
                      </span>
                      {filters.aiPersonalization && (
                        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                          {Math.round(result.aiScore * 100)}% AI match
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {result.tags.map(tag => (
                          <span key={tag} className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {result.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {result.likes}
                        </span>
                        <span>{result.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredResults.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search terms or filters</p>
            <button
              onClick={clearFilters}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
