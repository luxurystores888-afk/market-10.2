// 📝 BLOG & KNOWLEDGE BASE CMS - ENHANCED CONTENT MANAGEMENT
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Edit3, 
  Save, 
  Trash2, 
  Eye, 
  Calendar, 
  Tag, 
  Search, 
  Plus,
  TrendingUp,
  Users,
  Clock,
  Filter,
  Image as ImageIcon,
  Link,
  Code,
  Bold,
  Italic,
  List,
  Quote
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  authorAvatar: string;
  publishedAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
  category: string;
  tags: string[];
  featuredImage: string;
  views: number;
  likes: number;
  comments: number;
  seoTitle?: string;
  seoDescription?: string;
  readingTime: number;
}

interface BlogCategory {
  id: string;
  name: string;
  description: string;
  postCount: number;
  color: string;
  icon: string;
}

export function BlogCMS() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [view, setView] = useState<'list' | 'grid' | 'editor'>('list');
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    excerpt: '',
    category: 'general',
    tags: [],
    status: 'draft',
    featuredImage: ''
  });

  useEffect(() => {
    loadBlogData();
  }, []);

  const loadBlogData = async () => {
    // Mock data - in production, fetch from API
    const mockCategories: BlogCategory[] = [
      { id: 'general', name: 'General', description: 'General topics and updates', postCount: 12, color: 'blue', icon: '📝' },
      { id: 'tutorials', name: 'Tutorials', description: 'Step-by-step guides', postCount: 8, color: 'green', icon: '🎓' },
      { id: 'news', name: 'News', description: 'Latest updates and announcements', postCount: 15, color: 'red', icon: '📰' },
      { id: 'tips', name: 'Tips & Tricks', description: 'Pro tips and best practices', postCount: 6, color: 'purple', icon: '💡' },
      { id: 'case-studies', name: 'Case Studies', description: 'Success stories and analysis', postCount: 4, color: 'orange', icon: '📊' }
    ];

    const mockPosts: BlogPost[] = [
      {
        id: '1',
        title: 'How to Maximize Profits with AI-Powered E-commerce Automation',
        slug: 'maximize-profits-ai-ecommerce-automation',
        content: `# Maximizing Profits with AI-Powered E-commerce Automation

In today's competitive e-commerce landscape, automation isn't just a luxury—it's a necessity. Our AI-powered platform has helped thousands of businesses increase their revenue by an average of 300% within the first 90 days.

## The Power of Automated Product Generation

Our advanced AI system analyzes market trends, customer behavior, and competitor pricing to automatically generate high-converting product listings. Here's how it works:

1. **Market Analysis**: AI scans thousands of data points to identify trending products
2. **Content Creation**: Generates compelling product descriptions, titles, and marketing copy
3. **Pricing Optimization**: Dynamically adjusts prices based on demand and competition
4. **Inventory Management**: Automatically restocks popular items

## Real Results from Real Businesses

- **TechGadgets Inc.**: Increased revenue by 450% in 6 months
- **FashionForward**: Boosted conversion rates by 280%
- **HomeDecor Plus**: Reduced manual work by 90%

## Getting Started

Ready to transform your business? Here's how to get started:

1. Enable AI automation in your dashboard
2. Set your profit margins and preferences
3. Let the AI work its magic
4. Watch your revenue grow

The future of e-commerce is automated, and the future is now.`,
        excerpt: 'Learn how AI-powered automation can increase your e-commerce revenue by 300% or more. Real case studies and actionable strategies.',
        author: 'AI Expert',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AIExpert',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'published',
        category: 'tutorials',
        tags: ['ai', 'automation', 'ecommerce', 'profit'],
        featuredImage: 'https://picsum.photos/800/400?random=1',
        views: 1247,
        likes: 89,
        comments: 23,
        seoTitle: 'AI E-commerce Automation: 300% Revenue Increase Guide',
        seoDescription: 'Discover how AI automation can boost your e-commerce revenue by 300%. Real case studies and proven strategies.',
        readingTime: 8
      },
      {
        id: '2',
        title: 'The Future of Crypto Payments in E-commerce',
        slug: 'future-crypto-payments-ecommerce',
        content: `# The Future of Crypto Payments in E-commerce

Cryptocurrency is revolutionizing how we think about online payments. With over 300 million crypto users worldwide, integrating crypto payments into your e-commerce platform isn't just innovative—it's essential for staying competitive.

## Why Crypto Payments Matter

- **Global Reach**: Accept payments from anywhere in the world
- **Lower Fees**: Reduce transaction costs by up to 80%
- **Faster Settlements**: Get paid instantly, not in days
- **Privacy**: Enhanced security and privacy for customers

## Implementation Guide

Our platform makes crypto integration simple:

1. **Multi-Chain Support**: Ethereum, Bitcoin, Polygon, and more
2. **Automatic Conversion**: Convert crypto to fiat automatically
3. **Tax Compliance**: Built-in tax reporting and compliance
4. **Security**: Enterprise-grade security for all transactions

## Success Stories

Businesses using our crypto payment system report:
- 40% increase in international sales
- 60% reduction in payment processing fees
- 25% higher average order values

Ready to embrace the future of payments?`,
        excerpt: 'Discover how cryptocurrency payments can expand your global reach and reduce transaction costs by up to 80%.',
        author: 'Crypto Specialist',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoSpecialist',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'published',
        category: 'news',
        tags: ['crypto', 'payments', 'blockchain', 'future'],
        featuredImage: 'https://picsum.photos/800/400?random=2',
        views: 892,
        likes: 67,
        comments: 18,
        seoTitle: 'Crypto Payments E-commerce: Future of Online Transactions',
        seoDescription: 'Learn how crypto payments can expand your global reach and reduce costs. Complete implementation guide.',
        readingTime: 6
      }
    ];

    setCategories(mockCategories);
    setPosts(mockPosts);
  };

  const createPost = async () => {
    if (!newPost.title || !newPost.content) return;

    const post: BlogPost = {
      id: Date.now().toString(),
      title: newPost.title!,
      slug: newPost.title!.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      content: newPost.content!,
      excerpt: newPost.excerpt || newPost.content!.substring(0, 150) + '...',
      author: 'You',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      publishedAt: new Date(),
      updatedAt: new Date(),
      status: newPost.status as any || 'draft',
      category: newPost.category || 'general',
      tags: newPost.tags || [],
      featuredImage: newPost.featuredImage || 'https://picsum.photos/800/400?random=' + Date.now(),
      views: 0,
      likes: 0,
      comments: 0,
      readingTime: Math.ceil(newPost.content!.split(' ').length / 200)
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({ title: '', content: '', excerpt: '', category: 'general', tags: [], status: 'draft', featuredImage: '' });
    setIsCreating(false);
    setView('list');
  };

  const updatePost = async (postId: string, updates: Partial<BlogPost>) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, ...updates, updatedAt: new Date() }
        : post
    ));
    setIsEditing(false);
    setSelectedPost(null);
  };

  const deletePost = async (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
    setSelectedPost(null);
  };

  const filteredPosts = () => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    return filtered;
  };

  const formatContent = (content: string) => {
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 text-cyan-400">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 text-white">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2 text-gray-300">$1</h3>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic text-gray-300">$1</em>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1 text-gray-300">$1</li>')
      .replace(/\n\n/gim, '</p><p class="mb-4 text-gray-300">')
      .replace(/^(?!<[h|l])(.*$)/gim, '<p class="mb-4 text-gray-300">$1</p>');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            📝 Blog & Knowledge Base CMS
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Create, manage, and publish content that drives traffic and engagement
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <div className="bg-green-500/20 border border-green-400 px-4 py-2 rounded-full flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              {posts.length} Articles Published
            </div>
            <div className="bg-blue-500/20 border border-blue-400 px-4 py-2 rounded-full flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              {posts.reduce((sum, post) => sum + post.views, 0)} Total Views
            </div>
            <div className="bg-purple-500/20 border border-purple-400 px-4 py-2 rounded-full flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Growing Audience
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
          <div className="flex space-x-2">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg transition-all ${
                view === 'list' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView('grid')}
              className={`px-4 py-2 rounded-lg transition-all ${
                view === 'grid' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Grid
            </button>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </button>
        </div>

        {/* Create/Edit Post Modal */}
        {(isCreating || isEditing) && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 text-cyan-400">
              {isCreating ? 'Create New Article' : 'Edit Article'}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Article title..."
                value={isCreating ? newPost.title : selectedPost?.title}
                onChange={(e) => {
                  if (isCreating) {
                    setNewPost(prev => ({ ...prev, title: e.target.value }));
                  } else if (selectedPost) {
                    setSelectedPost(prev => prev ? { ...prev, title: e.target.value } : null);
                  }
                }}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
              />
              <textarea
                placeholder="Article excerpt..."
                value={isCreating ? newPost.excerpt : selectedPost?.excerpt}
                onChange={(e) => {
                  if (isCreating) {
                    setNewPost(prev => ({ ...prev, excerpt: e.target.value }));
                  } else if (selectedPost) {
                    setSelectedPost(prev => prev ? { ...prev, excerpt: e.target.value } : null);
                  }
                }}
                rows={2}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={isCreating ? newPost.category : selectedPost?.category}
                  onChange={(e) => {
                    if (isCreating) {
                      setNewPost(prev => ({ ...prev, category: e.target.value }));
                    } else if (selectedPost) {
                      setSelectedPost(prev => prev ? { ...prev, category: e.target.value } : null);
                    }
                  }}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
                <select
                  value={isCreating ? newPost.status : selectedPost?.status}
                  onChange={(e) => {
                    if (isCreating) {
                      setNewPost(prev => ({ ...prev, status: e.target.value as any }));
                    } else if (selectedPost) {
                      setSelectedPost(prev => prev ? { ...prev, status: e.target.value as any } : null);
                    }
                  }}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <textarea
                placeholder="Write your article content here... (Markdown supported)"
                value={isCreating ? newPost.content : selectedPost?.content}
                onChange={(e) => {
                  if (isCreating) {
                    setNewPost(prev => ({ ...prev, content: e.target.value }));
                  } else if (selectedPost) {
                    setSelectedPost(prev => prev ? { ...prev, content: e.target.value } : null);
                  }
                }}
                rows={12}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none font-mono"
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    if (isCreating) {
                      createPost();
                    } else if (selectedPost) {
                      updatePost(selectedPost.id, selectedPost);
                    }
                  }}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isCreating ? 'Create Article' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setIsEditing(false);
                    setSelectedPost(null);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts Display */}
        {view === 'list' ? (
          <div className="space-y-4">
            {filteredPosts().map(post => (
              <div
                key={post.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-cyan-400/50 transition-all"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-32 h-24 object-cover rounded-lg border border-gray-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-bold text-white">{post.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        post.status === 'published' ? 'bg-green-500/20 text-green-400 border border-green-400' :
                        post.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400' :
                        'bg-gray-500/20 text-gray-400 border border-gray-400'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-3">{post.excerpt}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {post.publishedAt.toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {post.views} views
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readingTime} min read
                      </span>
                      <span className="flex items-center">
                        {categories.find(c => c.id === post.category)?.icon} {categories.find(c => c.id === post.category)?.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                      <button
                        onClick={() => {
                          setSelectedPost(post);
                          setView('editor');
                        }}
                        className="bg-cyan-500/20 border border-cyan-400 text-cyan-400 px-3 py-1 rounded text-sm hover:bg-cyan-500/30 transition-all flex items-center"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPost(post);
                          setIsEditing(true);
                        }}
                        className="bg-blue-500/20 border border-blue-400 text-blue-400 px-3 py-1 rounded text-sm hover:bg-blue-500/30 transition-all flex items-center"
                      >
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="bg-red-500/20 border border-red-400 text-red-400 px-3 py-1 rounded text-sm hover:bg-red-500/30 transition-all flex items-center"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts().map(post => (
              <div
                key={post.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-cyan-400/50 transition-all"
              >
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-bold text-white line-clamp-2">{post.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      post.status === 'published' ? 'bg-green-500/20 text-green-400' :
                      post.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>{post.views} views</span>
                    <span>{post.readingTime} min</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setView('editor');
                      }}
                      className="flex-1 bg-cyan-500/20 border border-cyan-400 text-cyan-400 px-3 py-2 rounded text-sm hover:bg-cyan-500/30 transition-all"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setIsEditing(true);
                      }}
                      className="flex-1 bg-blue-500/20 border border-blue-400 text-blue-400 px-3 py-2 rounded text-sm hover:bg-blue-500/30 transition-all"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Editor View */
          selectedPost && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedPost.title}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500/20 border border-blue-400 text-blue-400 px-4 py-2 rounded hover:bg-blue-500/30 transition-all flex items-center"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-all"
                  >
                    Back to List
                  </button>
                </div>
              </div>
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: formatContent(selectedPost.content) }} />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
