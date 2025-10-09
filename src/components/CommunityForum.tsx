// 🗣️ COMMUNITY FORUM - ENHANCED USER ENGAGEMENT
import React, { useState, useEffect } from 'react';
import { MessageCircle, ThumbsUp, Reply, Flag, Star, Users, TrendingUp } from 'lucide-react';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  timestamp: Date;
  likes: number;
  replies: number;
  category: string;
  tags: string[];
  isPinned: boolean;
  isLocked: boolean;
}

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  postCount: number;
  icon: string;
  color: string;
}

export function CommunityForum() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  useEffect(() => {
    loadForumData();
  }, []);

  const loadForumData = async () => {
    // Mock data - in production, fetch from API
    const mockCategories: ForumCategory[] = [
      { id: 'general', name: 'General Discussion', description: 'General topics and questions', postCount: 45, icon: '💬', color: 'blue' },
      { id: 'products', name: 'Product Reviews', description: 'Share your product experiences', postCount: 23, icon: '⭐', color: 'green' },
      { id: 'tech', name: 'Tech Support', description: 'Get help with technical issues', postCount: 18, icon: '🔧', color: 'purple' },
      { id: 'featured', name: 'Featured Topics', description: 'Highlighted discussions', postCount: 12, icon: '🌟', color: 'yellow' },
      { id: 'crypto', name: 'Crypto & NFTs', description: 'Blockchain and Web3 discussions', postCount: 31, icon: '₿', color: 'orange' }
    ];

    const mockPosts: ForumPost[] = [
      {
        id: '1',
        title: 'Amazing experience with the new AI shopping assistant!',
        content: 'The AI assistant helped me find the perfect cyberpunk gaming setup. It understood exactly what I was looking for and suggested products I never would have found on my own.',
        author: 'CyberGamer99',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CyberGamer99',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 24,
        replies: 8,
        category: 'products',
        tags: ['ai', 'gaming', 'cyberpunk'],
        isPinned: true,
        isLocked: false
      },
      {
        id: '2',
        title: 'How to maximize profits with automated product generation?',
        content: 'I\'ve been using the automated product generation feature for a month now and my revenue has increased by 300%. Here are my tips for optimizing the AI settings...',
        author: 'ProfitMaster',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProfitMaster',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        likes: 42,
        replies: 15,
        category: 'featured',
        tags: ['automation', 'profit', 'ai', 'tips'],
        isPinned: true,
        isLocked: false
      },
      {
        id: '3',
        title: 'NFT marketplace integration - any success stories?',
        content: 'Has anyone had success selling NFTs through the integrated marketplace? I\'m thinking of creating a cyberpunk art collection but want to hear about others\' experiences first.',
        author: 'NFTArtist',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NFTArtist',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        likes: 18,
        replies: 12,
        category: 'crypto',
        tags: ['nft', 'marketplace', 'art', 'cyberpunk'],
        isPinned: false,
        isLocked: false
      }
    ];

    setCategories(mockCategories);
    setPosts(mockPosts);
  };

  const createPost = async () => {
    if (!newPost.title || !newPost.content) return;

    const post: ForumPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: 'You',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      timestamp: new Date(),
      likes: 0,
      replies: 0,
      category: newPost.category,
      tags: [],
      isPinned: false,
      isLocked: false
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({ title: '', content: '', category: 'general' });
    setIsCreatingPost(false);
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            🗣️ Pulse Community Forum
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Connect, share, and learn with the Pulse community
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <div className="bg-green-500/20 border border-green-400 px-4 py-2 rounded-full flex items-center">
              <Users className="h-4 w-4 mr-2" />
              {posts.reduce((sum, post) => sum + post.likes, 0)} Total Likes
            </div>
            <div className="bg-blue-500/20 border border-blue-400 px-4 py-2 rounded-full flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              {posts.length} Active Discussions
            </div>
            <div className="bg-purple-500/20 border border-purple-400 px-4 py-2 rounded-full flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Growing Community
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-cyan-400">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedCategory === 'all' 
                      ? 'bg-cyan-500/20 border border-cyan-400' 
                      : 'hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">💬</span>
                    <div>
                      <div className="font-semibold">All Topics</div>
                      <div className="text-sm text-gray-400">{posts.length} posts</div>
                    </div>
                  </div>
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedCategory === category.id 
                        ? 'bg-cyan-500/20 border border-cyan-400' 
                        : 'hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{category.icon}</span>
                      <div>
                        <div className="font-semibold">{category.name}</div>
                        <div className="text-sm text-gray-400">{category.postCount} posts</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Create Post Button */}
            <div className="mb-6">
              <button
                onClick={() => setIsCreatingPost(true)}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Start New Discussion
              </button>
            </div>

            {/* Create Post Modal */}
            {isCreatingPost && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-cyan-400">Create New Post</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Post title..."
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                  />
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Share your thoughts..."
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={createPost}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
                    >
                      Post Discussion
                    </button>
                    <button
                      onClick={() => setIsCreatingPost(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <div
                  key={post.id}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-cyan-400/50 transition-all"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={post.authorAvatar}
                      alt={post.author}
                      className="w-12 h-12 rounded-full border-2 border-cyan-400"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-bold text-white">{post.title}</h3>
                        {post.isPinned && (
                          <span className="bg-yellow-500/20 border border-yellow-400 px-2 py-1 rounded text-xs text-yellow-400">
                            📌 Pinned
                          </span>
                        )}
                        {post.isLocked && (
                          <span className="bg-red-500/20 border border-red-400 px-2 py-1 rounded text-xs text-red-400">
                            🔒 Locked
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 mb-4">{post.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>by {post.author}</span>
                          <span>•</span>
                          <span>{post.timestamp.toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{categories.find(c => c.id === post.category)?.icon} {categories.find(c => c.id === post.category)?.name}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => likePost(post.id)}
                            className="flex items-center space-x-1 text-gray-400 hover:text-cyan-400 transition-colors"
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-gray-400 hover:text-cyan-400 transition-colors">
                            <Reply className="h-4 w-4" />
                            <span>{post.replies}</span>
                          </button>
                          <button className="text-gray-400 hover:text-red-400 transition-colors">
                            <Flag className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
