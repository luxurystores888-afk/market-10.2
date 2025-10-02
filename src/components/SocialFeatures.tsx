// 🤝 SOCIAL FEATURES & USER PROFILES - ENHANCED ENGAGEMENT
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Share2, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Trophy, 
  Star,
  Camera,
  Edit3,
  Settings,
  Globe,
  Lock,
  UserPlus,
  UserMinus,
  Gift,
  Award,
  Target,
  TrendingUp,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Copy,
  Check,
  Bell,
  Search,
  Filter,
  MoreHorizontal,
  Send,
  Image as ImageIcon,
  Smile
} from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  coverImage: string;
  bio: string;
  location: string;
  website: string;
  joinedAt: Date;
  followers: number;
  following: number;
  posts: number;
  level: number;
  badges: string[];
  totalSpent: number;
  isVerified: boolean;
  isFollowing?: boolean;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

interface SocialPost {
  id: string;
  userId: string;
  user: UserProfile;
  content: string;
  images: string[];
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  type: 'text' | 'image' | 'product-review' | 'achievement';
  productId?: string;
  productName?: string;
  rating?: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export function SocialFeatures() {
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'current-user',
    username: 'cybertrader99',
    displayName: 'Cyber Trader',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cybertrader99',
    coverImage: 'https://picsum.photos/1200/300?random=1',
    bio: '🚀 AI enthusiast & crypto trader | Building the future of e-commerce | 💎 Diamond hands',
    location: 'Digital Realm',
    website: 'https://cybertrader.ai',
    joinedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    followers: 1247,
    following: 892,
    posts: 156,
    level: 15,
    badges: ['early-adopter', 'ai-expert', 'crypto-whale', 'community-hero'],
    totalSpent: 12450,
    isVerified: true,
    socialLinks: {
      twitter: '@cybertrader99',
      linkedin: 'cybertrader99'
    }
  });

  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'profile' | 'achievements' | 'leaderboard'>('feed');
  const [newPost, setNewPost] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(currentUser);
  const [copiedText, setCopiedText] = useState('');

  useEffect(() => {
    loadSocialData();
  }, []);

  const loadSocialData = async () => {
    // Mock social posts
    const mockPosts: SocialPost[] = [
      {
        id: '1',
        userId: 'user1',
        user: {
          id: 'user1',
          username: 'aienthusiast',
          displayName: 'AI Enthusiast',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aienthusiast',
          coverImage: '',
          bio: '',
          location: '',
          website: '',
          joinedAt: new Date(),
          followers: 234,
          following: 156,
          posts: 45,
          level: 8,
          badges: ['ai-expert'],
          totalSpent: 890,
          isVerified: false,
          socialLinks: {}
        },
        content: 'Just made $2,400 profit using the AI automation system! 🤖💰 The future is here! #AICommerce #ProfitMax',
        images: ['https://picsum.photos/500/300?random=1'],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 47,
        comments: 12,
        shares: 8,
        isLiked: false,
        isBookmarked: false,
        type: 'text'
      },
      {
        id: '2',
        userId: 'user2',
        user: {
          id: 'user2',
          username: 'cryptoqueen',
          displayName: 'Crypto Queen',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cryptoqueen',
          coverImage: '',
          bio: '',
          location: '',
          website: '',
          joinedAt: new Date(),
          followers: 567,
          following: 234,
          posts: 89,
          level: 12,
          badges: ['crypto-whale', 'early-adopter'],
          totalSpent: 5600,
          isVerified: true,
          socialLinks: {}
        },
        content: 'Review: Cyberpunk Neural Interface Headset ⭐⭐⭐⭐⭐\n\nAbsolutely mind-blowing! The AI integration is seamless and the build quality is exceptional. Worth every satoshi! 🔥',
        images: ['https://picsum.photos/500/300?random=2', 'https://picsum.photos/500/300?random=3'],
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        likes: 89,
        comments: 23,
        shares: 15,
        isLiked: true,
        isBookmarked: true,
        type: 'product-review',
        productId: 'neural-headset',
        productName: 'Cyberpunk Neural Interface Headset',
        rating: 5
      }
    ];

    const mockAchievements: Achievement[] = [
      {
        id: 'first-purchase',
        name: 'First Purchase',
        description: 'Made your first purchase on the platform',
        icon: '🛒',
        rarity: 'common',
        unlockedAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'ai-expert',
        name: 'AI Expert',
        description: 'Used AI features 100+ times',
        icon: '🤖',
        rarity: 'rare',
        unlockedAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'crypto-whale',
        name: 'Crypto Whale',
        description: 'Spent over $10,000 using cryptocurrency',
        icon: '🐋',
        rarity: 'epic',
        unlockedAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'community-hero',
        name: 'Community Hero',
        description: 'Helped 50+ community members',
        icon: '🦸',
        rarity: 'legendary',
        unlockedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'review-master',
        name: 'Review Master',
        description: 'Write 25 product reviews',
        icon: '✍️',
        rarity: 'rare',
        progress: 18,
        maxProgress: 25
      }
    ];

    setPosts(mockPosts);
    setAchievements(mockAchievements);
  };

  const createPost = () => {
    if (!newPost.trim()) return;

    const post: SocialPost = {
      id: Date.now().toString(),
      userId: currentUser.id,
      user: currentUser,
      content: newPost,
      images: [],
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
      type: 'text'
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const bookmarkPost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const sharePost = async (post: SocialPost) => {
    const shareText = `Check out this awesome post from ${post.user.displayName}: "${post.content}"`;
    const shareUrl = `https://cybermart2077.com/post/${post.id}`;
    
    if (navigator.share) {
      await navigator.share({
        title: 'Cyber Mart 2077 Post',
        text: shareText,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopiedText(post.id);
      setTimeout(() => setCopiedText(''), 2000);
    }
  };

  const updateProfile = () => {
    setCurrentUser(editedProfile);
    setIsEditing(false);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 1) return `${Math.floor(diff / (1000 * 60))}m ago`;
    if (hours < 24) return `${Math.floor(hours)}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // Add AI curation
  const curatedFeed = useAIForCuration(posts);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            🤝 Social Hub & Community
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Connect, share, and grow with the Pulse community
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          {['feed', 'profile', 'achievements', 'leaderboard'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-all capitalize ${
                activeTab === tab 
                  ? 'bg-cyan-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.displayName}
                    className="w-12 h-12 rounded-full border-2 border-cyan-400"
                  />
                  <div className="flex-1">
                    <textarea
                      placeholder="Share your thoughts with the community..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      rows={3}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
                    />
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-cyan-400 transition-colors">
                          <ImageIcon className="h-5 w-5" />
                        </button>
                        <button className="text-gray-400 hover:text-cyan-400 transition-colors">
                          <Smile className="h-5 w-5" />
                        </button>
                        <button className="text-gray-400 hover:text-cyan-400 transition-colors">
                          <LinkIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <button
                        onClick={createPost}
                        disabled={!newPost.trim()}
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts Feed */}
              <div className="space-y-6">
                {posts.map(post => (
                  <div
                    key={post.id}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-cyan-400/50 transition-all"
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={post.user.avatar}
                        alt={post.user.displayName}
                        className="w-12 h-12 rounded-full border-2 border-cyan-400"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-bold text-white">{post.user.displayName}</h3>
                          {post.user.isVerified && (
                            <div className="bg-blue-500/20 border border-blue-400 px-2 py-1 rounded text-xs text-blue-400">
                              ✓ Verified
                            </div>
                          )}
                          <span className="text-gray-400">@{post.user.username}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-400 text-sm">{formatDate(post.timestamp)}</span>
                        </div>
                        
                        {post.type === 'product-review' && (
                          <div className="bg-purple-500/20 border border-purple-400 rounded-lg p-3 mb-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span className="text-sm text-purple-400">Product Review</span>
                            </div>
                            <div className="text-sm text-white font-medium">{post.productName}</div>
                            <div className="flex items-center space-x-1 mt-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= (post.rating || 0) 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-400'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        <p className="text-gray-300 mb-4 whitespace-pre-wrap">{post.content}</p>
                        
                        {post.images.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            {post.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Post image ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg border border-gray-600"
                              />
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <button
                              onClick={() => likePost(post.id)}
                              className={`flex items-center space-x-1 transition-colors ${
                                post.isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                              }`}
                            >
                              <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                              <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-gray-400 hover:text-cyan-400 transition-colors">
                              <MessageCircle className="h-5 w-5" />
                              <span>{post.comments}</span>
                            </button>
                            <button
                              onClick={() => sharePost(post)}
                              className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors"
                            >
                              <Share2 className="h-5 w-5" />
                              <span>{post.shares}</span>
                              {copiedText === post.id && (
                                <Check className="h-4 w-4 text-green-400" />
                              )}
                            </button>
                          </div>
                          <button
                            onClick={() => bookmarkPost(post.id)}
                            className={`transition-colors ${
                              post.isBookmarked ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                            }`}
                          >
                            <Bookmark className={`h-5 w-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-4">Community Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Active Users</span>
                    <span className="text-green-400 font-bold">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Posts Today</span>
                    <span className="text-cyan-400 font-bold">89</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Revenue</span>
                    <span className="text-purple-400 font-bold">$45.6K</span>
                  </div>
                </div>
              </div>

              {/* Trending Topics */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-4">Trending Topics</h3>
                <div className="space-y-2">
                  {['#AICommerce', '#CryptoPayments', '#NFTMarketplace', '#AutomationProfit', '#CyberpunkStyle'].map((tag, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300">{tag}</span>
                      <span className="text-xs text-gray-400">{Math.floor(Math.random() * 100 + 20)} posts</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Users */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-4">Suggested Users</h3>
                <div className="space-y-3">
                  {[
                    { name: 'AI Master', username: 'aimaster2077', followers: '2.3K' },
                    { name: 'Crypto Guru', username: 'cryptoguru', followers: '1.8K' },
                    { name: 'NFT Artist', username: 'nftcreator', followers: '987' }
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="text-white text-sm font-medium">{user.name}</div>
                          <div className="text-gray-400 text-xs">{user.followers} followers</div>
                        </div>
                      </div>
                      <button className="bg-cyan-500/20 border border-cyan-400 text-cyan-400 px-3 py-1 rounded text-xs hover:bg-cyan-500/30 transition-all">
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
              {/* Cover Image */}
              <div className="relative h-48 bg-gradient-to-r from-cyan-500 to-purple-500">
                <img
                  src={currentUser.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>

              {/* Profile Info */}
              <div className="relative p-6">
                <div className="flex items-start space-x-6">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.displayName}
                    className="w-32 h-32 rounded-full border-4 border-white -mt-16 relative z-10"
                  />
                  <div className="flex-1 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h1 className="text-3xl font-bold text-white">{currentUser.displayName}</h1>
                        {currentUser.isVerified && (
                          <div className="bg-blue-500/20 border border-blue-400 px-3 py-1 rounded text-sm text-blue-400">
                            ✓ Verified
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all flex items-center"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </button>
                    </div>
                    <p className="text-gray-400 mb-1">@{currentUser.username}</p>
                    <p className="text-gray-300 mb-4">{currentUser.bio}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-400 mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {currentUser.location}
                      </div>
                      <div className="flex items-center">
                        <LinkIcon className="h-4 w-4 mr-1" />
                        <a href={currentUser.website} className="text-cyan-400 hover:text-cyan-300">
                          {currentUser.website}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Joined {currentUser.joinedAt.toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm">
                      <div>
                        <span className="font-bold text-white">{currentUser.following}</span>
                        <span className="text-gray-400 ml-1">Following</span>
                      </div>
                      <div>
                        <span className="font-bold text-white">{currentUser.followers}</span>
                        <span className="text-gray-400 ml-1">Followers</span>
                      </div>
                      <div>
                        <span className="font-bold text-white">{currentUser.posts}</span>
                        <span className="text-gray-400 ml-1">Posts</span>
                      </div>
                      <div>
                        <span className="font-bold text-purple-400">Level {currentUser.level}</span>
                      </div>
                      <div>
                        <span className="font-bold text-green-400">${currentUser.totalSpent.toLocaleString()}</span>
                        <span className="text-gray-400 ml-1">Spent</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-6 flex space-x-4">
                  {currentUser.socialLinks.twitter && (
                    <a href={`https://twitter.com/${currentUser.socialLinks.twitter}`} className="text-blue-400 hover:text-blue-300">
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {currentUser.socialLinks.linkedin && (
                    <a href={`https://linkedin.com/in/${currentUser.socialLinks.linkedin}`} className="text-blue-600 hover:text-blue-500">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                </div>

                {/* Badges */}
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-cyan-400 mb-3">Badges</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.badges.map((badge, index) => (
                      <div key={index} className="bg-purple-500/20 border border-purple-400 px-3 py-1 rounded text-sm text-purple-400">
                        {badge.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditing && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                  <h3 className="text-xl font-bold text-cyan-400 mb-4">Edit Profile</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Display Name"
                      value={editedProfile.displayName}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, displayName: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                    />
                    <textarea
                      placeholder="Bio"
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={editedProfile.location}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                    />
                    <input
                      type="url"
                      placeholder="Website"
                      value={editedProfile.website}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={updateProfile}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Your Achievements</h2>
              <p className="text-gray-400">Unlock badges and level up your profile</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`bg-gray-800/50 backdrop-blur-sm border rounded-xl p-6 text-center ${
                    achievement.unlockedAt ? getRarityColor(achievement.rarity) : 'border-gray-600'
                  } ${achievement.unlockedAt ? 'opacity-100' : 'opacity-50'}`}
                >
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{achievement.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{achievement.description}</p>
                  
                  {achievement.unlockedAt ? (
                    <div className="text-xs text-green-400">
                      Unlocked {achievement.unlockedAt.toLocaleDateString()}
                    </div>
                  ) : achievement.progress !== undefined ? (
                    <div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full"
                          style={{ width: `${(achievement.progress / (achievement.maxProgress || 1)) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-400">
                        {achievement.progress}/{achievement.maxProgress}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">Locked</div>
                  )}
                  
                  <div className={`text-xs mt-2 px-2 py-1 rounded ${getRarityColor(achievement.rarity)} bg-opacity-20`}>
                    {achievement.rarity.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Community Leaderboard</h2>
              <p className="text-gray-400">Top performers in the Cyber Mart community</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="text-left p-4 text-gray-300">Rank</th>
                    <th className="text-left p-4 text-gray-300">User</th>
                    <th className="text-left p-4 text-gray-300">Level</th>
                    <th className="text-left p-4 text-gray-300">Total Spent</th>
                    <th className="text-left p-4 text-gray-300">Achievements</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rank: 1, user: currentUser, totalSpent: 12450, achievements: 15 },
                    { rank: 2, user: { ...currentUser, displayName: 'Crypto Master', username: 'cryptomaster', level: 14 }, totalSpent: 10230, achievements: 12 },
                    { rank: 3, user: { ...currentUser, displayName: 'AI Wizard', username: 'aiwizard', level: 13 }, totalSpent: 8970, achievements: 11 }
                  ].map((entry, index) => (
                    <tr key={index} className="border-t border-gray-700 hover:bg-gray-700/30">
                      <td className="p-4">
                        <div className="flex items-center">
                          {entry.rank === 1 && <span className="text-2xl mr-2">🥇</span>}
                          {entry.rank === 2 && <span className="text-2xl mr-2">🥈</span>}
                          {entry.rank === 3 && <span className="text-2xl mr-2">🥉</span>}
                          <span className="font-bold text-white">#{entry.rank}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={entry.user.avatar}
                            alt={entry.user.displayName}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="font-medium text-white">{entry.user.displayName}</div>
                            <div className="text-sm text-gray-400">@{entry.user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-purple-400 font-bold">Level {entry.user.level}</td>
                      <td className="p-4 text-green-400 font-bold">${entry.totalSpent.toLocaleString()}</td>
                      <td className="p-4 text-cyan-400 font-bold">{entry.achievements}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
