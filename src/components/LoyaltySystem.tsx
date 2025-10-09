// 🏆 LOYALTY & REWARDS SYSTEM - GAMIFIED ENGAGEMENT
import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Star, 
  Gift, 
  Crown, 
  Zap, 
  Target, 
  TrendingUp, 
  Calendar,
  Award,
  Gem,
  Coins,
  ShoppingBag,
  Users,
  Heart,
  MessageCircle,
  Share2,
  CheckCircle,
  Clock,
  Flame,
  Medal,
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  RotateCcw,
  Download,
  ExternalLink,
  Lock,
  Unlock,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

interface LoyaltyPoints {
  total: number;
  available: number;
  lifetime: number;
  thisMonth: number;
  streak: number;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'discount' | 'product' | 'exclusive' | 'experience' | 'cashback';
  image: string;
  value: string;
  availability: 'available' | 'limited' | 'exclusive' | 'coming-soon';
  remainingStock?: number;
  expiresAt?: Date;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  isPopular: boolean;
  requirements?: string[];
}

interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  maxPoints?: number;
  color: string;
  benefits: string[];
  multiplier: number;
  icon: string;
  perks: string[];
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  reward: number;
  progress: number;
  target: number;
  completed: boolean;
  expiresAt: Date;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: 'shopping' | 'social' | 'engagement' | 'referral';
}

interface Transaction {
  id: string;
  type: 'earned' | 'redeemed' | 'expired' | 'bonus';
  points: number;
  description: string;
  timestamp: Date;
  reference?: string;
}

export function LoyaltySystem() {
  const [points, setPoints] = useState<LoyaltyPoints>({
    total: 12450,
    available: 8920,
    lifetime: 28750,
    thisMonth: 1340,
    streak: 7
  });
  
  const [currentTier, setCurrentTier] = useState<LoyaltyTier>({
    id: 'gold',
    name: 'Gold Cyber Elite',
    minPoints: 10000,
    maxPoints: 25000,
    color: 'yellow',
    benefits: ['2x points on all purchases', '15% exclusive discounts', 'Priority support', 'Early access to new products'],
    multiplier: 2,
    icon: '👑',
    perks: ['Free shipping on all orders', 'Monthly exclusive deals', 'VIP customer service']
  });

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'challenges' | 'history'>('overview');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [quests, setQuests] = useState<Challenge[]>([]);

  const tiers: LoyaltyTier[] = [
    {
      id: 'bronze',
      name: 'Bronze Explorer',
      minPoints: 0,
      maxPoints: 999,
      color: 'orange',
      benefits: ['1x points', '5% member discount'],
      multiplier: 1,
      icon: '🥉',
      perks: ['Welcome bonus', 'Basic support']
    },
    {
      id: 'silver',
      name: 'Silver Innovator',
      minPoints: 1000,
      maxPoints: 4999,
      color: 'gray',
      benefits: ['1.5x points', '10% member discount', 'Free shipping over $50'],
      multiplier: 1.5,
      icon: '🥈',
      perks: ['Monthly newsletter', 'Priority queue']
    },
    {
      id: 'gold',
      name: 'Gold Cyber Elite',
      minPoints: 5000,
      maxPoints: 14999,
      color: 'yellow',
      benefits: ['2x points', '15% exclusive discount', 'Priority support'],
      multiplier: 2,
      icon: '🥇',
      perks: ['Free shipping always', 'Exclusive events']
    },
    {
      id: 'platinum',
      name: 'Platinum Visionary',
      minPoints: 15000,
      maxPoints: 49999,
      color: 'blue',
      benefits: ['3x points', '20% VIP discount', 'Personal concierge'],
      multiplier: 3,
      icon: '💎',
      perks: ['Beta product access', 'Annual gift']
    },
    {
      id: 'diamond',
      name: 'Diamond Transcendent',
      minPoints: 50000,
      color: 'purple',
      benefits: ['5x points', '25% ultimate discount', 'White-glove service'],
      multiplier: 5,
      icon: '👑',
      perks: ['Lifetime benefits', 'Exclusive community']
    }
  ];

  useEffect(() => {
    loadLoyaltyData();
    fetch('/api/loyalty/smart-challenges').then(res => res.json()).then(setQuests);
  }, []);

  const loadLoyaltyData = async () => {
    // Mock rewards data
    const mockRewards: Reward[] = [
      {
        id: '1',
        name: '20% Off Next Purchase',
        description: 'Get 20% off your next order on any item',
        cost: 500,
        type: 'discount',
        image: 'https://picsum.photos/200/150?random=1',
        value: '20% OFF',
        availability: 'available',
        tier: 'bronze',
        isPopular: true
      },
      {
        id: '2',
        name: 'Free Cyberpunk T-Shirt',
        description: 'Exclusive Cyber Mart 2077 limited edition t-shirt',
        cost: 1200,
        type: 'product',
        image: 'https://picsum.photos/200/150?random=2',
        value: '$25 Value',
        availability: 'limited',
        remainingStock: 47,
        tier: 'silver',
        isPopular: true
      },
      {
        id: '3',
        name: 'VIP Early Access',
        description: '48-hour early access to all new product launches',
        cost: 2500,
        type: 'exclusive',
        image: 'https://picsum.photos/200/150?random=3',
        value: 'Exclusive',
        availability: 'exclusive',
        tier: 'gold',
        isPopular: false,
        requirements: ['Gold tier or higher']
      },
      {
        id: '4',
        name: '$50 Cashback',
        description: 'Direct cashback to your account or crypto wallet',
        cost: 5000,
        type: 'cashback',
        image: 'https://picsum.photos/200/150?random=4',
        value: '$50',
        availability: 'available',
        tier: 'platinum',
        isPopular: true
      },
      {
        id: '5',
        name: 'Personal AI Consultation',
        description: '1-on-1 AI setup and optimization session with expert',
        cost: 8000,
        type: 'experience',
        image: 'https://picsum.photos/200/150?random=5',
        value: '$200 Value',
        availability: 'exclusive',
        tier: 'diamond',
        isPopular: false,
        requirements: ['Diamond tier required']
      }
    ];

    const mockChallenges: Challenge[] = [
      {
        id: '1',
        title: 'Daily Login Streak',
        description: 'Login for 7 consecutive days',
        type: 'daily',
        reward: 50,
        progress: 7,
        target: 7,
        completed: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        difficulty: 'easy',
        category: 'engagement'
      },
      {
        id: '2',
        title: 'Social Butterfly',
        description: 'Share 5 products on social media',
        type: 'weekly',
        reward: 200,
        progress: 3,
        target: 5,
        completed: false,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        difficulty: 'medium',
        category: 'social'
      },
      {
        id: '3',
        title: 'Big Spender',
        description: 'Spend $500 this month',
        type: 'monthly',
        reward: 1000,
        progress: 340,
        target: 500,
        completed: false,
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        difficulty: 'hard',
        category: 'shopping'
      },
      {
        id: '4',
        title: 'Refer Friends',
        description: 'Invite 3 friends to join Cyber Mart',
        type: 'monthly',
        reward: 1500,
        progress: 1,
        target: 3,
        completed: false,
        expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        difficulty: 'expert',
        category: 'referral'
      }
    ];

    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'earned',
        points: 150,
        description: 'Purchase: Neural Interface Headset',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        reference: 'ORDER-12345'
      },
      {
        id: '2',
        type: 'earned',
        points: 50,
        description: 'Daily login bonus',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
      },
      {
        id: '3',
        type: 'redeemed',
        points: -500,
        description: 'Redeemed: 20% Off Coupon',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        reference: 'REWARD-789'
      },
      {
        id: '4',
        type: 'bonus',
        points: 200,
        description: 'Weekly challenge completed',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];

    setRewards(mockRewards);
    setChallenges(mockChallenges);
    setTransactions(mockTransactions);
  };

  const redeemReward = (reward: Reward) => {
    if (points.available >= reward.cost) {
      setPoints(prev => ({
        ...prev,
        available: prev.available - reward.cost,
        total: prev.total - reward.cost
      }));
      
      // Add transaction
      const transaction: Transaction = {
        id: Date.now().toString(),
        type: 'redeemed',
        points: -reward.cost,
        description: `Redeemed: ${reward.name}`,
        timestamp: new Date(),
        reference: `REWARD-${reward.id}`
      };
      
      setTransactions(prev => [transaction, ...prev]);
      setSelectedReward(null);
    }
  };

  const completeChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, completed: true, progress: challenge.target }
        : challenge
    ));
    
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      setPoints(prev => ({
        ...prev,
        available: prev.available + challenge.reward,
        total: prev.total + challenge.reward,
        thisMonth: prev.thisMonth + challenge.reward
      }));
    }
  };

  const getTierColor = (tier: string) => {
    const colors = {
      bronze: 'text-orange-400 border-orange-400',
      silver: 'text-gray-400 border-gray-400',
      gold: 'text-yellow-400 border-yellow-400',
      platinum: 'text-blue-400 border-blue-400',
      diamond: 'text-purple-400 border-purple-400'
    };
    return colors[tier as keyof typeof colors] || 'text-gray-400 border-gray-400';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'text-green-400 bg-green-500/20',
      medium: 'text-yellow-400 bg-yellow-500/20',
      hard: 'text-orange-400 bg-orange-500/20',
      expert: 'text-red-400 bg-red-500/20'
    };
    return colors[difficulty as keyof typeof colors] || 'text-gray-400 bg-gray-500/20';
  };

  const getProgressToNextTier = () => {
    const nextTier = tiers.find(tier => tier.minPoints > points.total);
    if (!nextTier) return { progress: 100, remaining: 0, nextTier: null };
    
    const currentTierMax = currentTier.maxPoints || currentTier.minPoints;
    const progress = ((points.total - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100;
    const remaining = nextTier.minPoints - points.total;
    
    return { progress: Math.min(progress, 100), remaining, nextTier };
  };

  const tierProgress = getProgressToNextTier();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            🏆 Loyalty & Rewards Hub
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Earn points, unlock rewards, and level up your shopping experience
          </p>
        </div>

        {/* Points Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">{points.available.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Available Points</div>
            <div className="text-xs text-green-400 mt-1">Ready to spend</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{points.lifetime.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Lifetime Points</div>
            <div className="text-xs text-blue-400 mt-1">Total earned</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{points.thisMonth.toLocaleString()}</div>
            <div className="text-sm text-gray-400">This Month</div>
            <div className="text-xs text-green-400 mt-1">+23% vs last month</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2 flex items-center justify-center">
              <Flame className="h-8 w-8 mr-2" />
              {points.streak}
            </div>
            <div className="text-sm text-gray-400">Day Streak</div>
            <div className="text-xs text-orange-400 mt-1">Keep it up!</div>
          </div>
        </div>

        {/* Current Tier */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{currentTier.icon}</div>
              <div>
                <h3 className="text-2xl font-bold text-yellow-400">{currentTier.name}</h3>
                <p className="text-yellow-300">Tier Benefits: {currentTier.multiplier}x points multiplier</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentTier.benefits.slice(0, 3).map((benefit, index) => (
                    <span key={index} className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white mb-2">
                {points.total.toLocaleString()} / {tierProgress.nextTier?.minPoints.toLocaleString() || '∞'} pts
              </div>
              {tierProgress.nextTier && (
                <>
                  <div className="w-48 bg-gray-700 rounded-full h-3 mb-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${tierProgress.progress}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-300">
                    {tierProgress.remaining.toLocaleString()} points to {tierProgress.nextTier.name}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          {['overview', 'rewards', 'challenges', 'history'].map(tab => (
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tier Progress */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
                <Crown className="h-5 w-5 mr-2" />
                Tier Progress
              </h3>
              <div className="space-y-4">
                {tiers.map((tier, index) => {
                  const isCurrentTier = tier.id === currentTier.id;
                  const isUnlocked = points.total >= tier.minPoints;
                  const isNext = tierProgress.nextTier?.id === tier.id;
                  
                  return (
                    <div
                      key={tier.id}
                      className={`flex items-center space-x-4 p-3 rounded-lg ${
                        isCurrentTier ? 'bg-yellow-500/20 border border-yellow-400' :
                        isUnlocked ? 'bg-green-500/10 border border-green-400/30' :
                        'bg-gray-700/30 border border-gray-600'
                      }`}
                    >
                      <div className="text-2xl">{tier.icon}</div>
                      <div className="flex-1">
                        <div className="font-bold text-white">{tier.name}</div>
                        <div className="text-sm text-gray-400">
                          {tier.minPoints.toLocaleString()}+ points • {tier.multiplier}x multiplier
                        </div>
                      </div>
                      <div className="text-right">
                        {isCurrentTier ? (
                          <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">
                            CURRENT
                          </span>
                        ) : isUnlocked ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : isNext ? (
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                            NEXT
                          </span>
                        ) : (
                          <Lock className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Your Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Points earned this week</span>
                  <span className="text-green-400 font-bold">+340</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Rewards redeemed</span>
                  <span className="text-purple-400 font-bold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Challenges completed</span>
                  <span className="text-cyan-400 font-bold">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Referrals made</span>
                  <span className="text-yellow-400 font-bold">3</span>
                </div>
              </div>
            </div>

            {/* Popular Rewards Preview */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-cyan-400 flex items-center">
                  <Gift className="h-5 w-5 mr-2" />
                  Popular Rewards
                </h3>
                <button
                  onClick={() => setActiveTab('rewards')}
                  className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center"
                >
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="space-y-3">
                {rewards.filter(r => r.isPopular).slice(0, 3).map(reward => (
                  <div key={reward.id} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                    <img
                      src={reward.image}
                      alt={reward.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium">{reward.name}</div>
                      <div className="text-gray-400 text-sm">{reward.cost} points</div>
                    </div>
                    <button
                      onClick={() => setSelectedReward(reward)}
                      disabled={points.available < reward.cost}
                      className={`px-3 py-1 rounded text-sm transition-all ${
                        points.available >= reward.cost
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-gray-600/20 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {points.available >= reward.cost ? 'Redeem' : 'Need More'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Challenges Preview */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-cyan-400 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Active Challenges
                </h3>
                <button
                  onClick={() => setActiveTab('challenges')}
                  className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center"
                >
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="space-y-3">
                {challenges.filter(c => !c.completed).slice(0, 3).map(challenge => (
                  <div key={challenge.id} className="p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white font-medium">{challenge.title}</div>
                      <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    <div className="text-gray-400 text-sm mb-2">{challenge.description}</div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-3">
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full"
                            style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {challenge.progress}/{challenge.target}
                        </div>
                      </div>
                      <div className="text-green-400 font-bold text-sm">
                        +{challenge.reward} pts
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Available Rewards</h2>
              <div className="text-sm text-gray-400">
                You have {points.available.toLocaleString()} points to spend
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map(reward => (
                <div
                  key={reward.id}
                  className={`bg-gray-800/50 backdrop-blur-sm border rounded-xl overflow-hidden hover:border-cyan-400/50 transition-all ${
                    points.available >= reward.cost ? 'border-gray-700' : 'border-red-500/30 opacity-75'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={reward.image}
                      alt={reward.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3 flex space-x-2">
                      {reward.isPopular && (
                        <span className="bg-red-500/90 text-white px-2 py-1 rounded text-xs font-medium">
                          POPULAR
                        </span>
                      )}
                      {reward.availability === 'limited' && (
                        <span className="bg-yellow-500/90 text-white px-2 py-1 rounded text-xs font-medium">
                          LIMITED
                        </span>
                      )}
                      {reward.availability === 'exclusive' && (
                        <span className="bg-purple-500/90 text-white px-2 py-1 rounded text-xs font-medium">
                          EXCLUSIVE
                        </span>
                      )}
                    </div>
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium ${getTierColor(reward.tier)}`}>
                      {reward.tier.toUpperCase()}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">{reward.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">{reward.description}</p>
                    
                    {reward.remainingStock && (
                      <div className="text-yellow-400 text-xs mb-2">
                        Only {reward.remainingStock} left!
                      </div>
                    )}

                    {reward.requirements && (
                      <div className="text-red-400 text-xs mb-3">
                        Requirements: {reward.requirements.join(', ')}
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold text-cyan-400">
                        {reward.cost.toLocaleString()} pts
                      </div>
                      <div className="text-purple-400 font-medium">
                        {reward.value}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedReward(reward)}
                      disabled={points.available < reward.cost}
                      className={`w-full py-2 rounded-lg font-medium transition-all ${
                        points.available >= reward.cost
                          ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {points.available >= reward.cost ? 'Redeem Reward' : `Need ${(reward.cost - points.available).toLocaleString()} more points`}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Daily & Weekly Challenges</h2>
              <div className="text-sm text-gray-400">
                Complete challenges to earn bonus points
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challenges.map(challenge => (
                <div
                  key={challenge.id}
                  className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 ${
                    challenge.completed ? 'opacity-75' : 'hover:border-cyan-400/50'
                  } transition-all`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-bold text-white">{challenge.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{challenge.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">+{challenge.reward} pts</div>
                      <div className="text-gray-400 text-xs">{challenge.type}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 text-sm">Progress</span>
                      <span className="text-cyan-400 text-sm">
                        {challenge.progress}/{challenge.target}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          challenge.completed 
                            ? 'bg-gradient-to-r from-green-400 to-green-600'
                            : 'bg-gradient-to-r from-cyan-400 to-purple-400'
                        }`}
                        style={{ width: `${Math.min((challenge.progress / challenge.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-gray-400 text-xs">
                      Expires: {challenge.expiresAt.toLocaleDateString()}
                    </div>
                    {challenge.completed ? (
                      <div className="flex items-center text-green-400 text-sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completed
                      </div>
                    ) : challenge.progress >= challenge.target ? (
                      <button
                        onClick={() => completeChallenge(challenge.id)}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-all"
                      >
                        Claim Reward
                      </button>
                    ) : (
                      <div className="text-gray-400 text-sm">
                        {challenge.target - challenge.progress} more to go
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Points History</h2>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="text-left p-4 text-gray-300">Date</th>
                    <th className="text-left p-4 text-gray-300">Type</th>
                    <th className="text-left p-4 text-gray-300">Description</th>
                    <th className="text-right p-4 text-gray-300">Points</th>
                    <th className="text-left p-4 text-gray-300">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(transaction => (
                    <tr key={transaction.id} className="border-t border-gray-700 hover:bg-gray-700/30">
                      <td className="p-4 text-gray-300">
                        {transaction.timestamp.toLocaleDateString()}
                        <div className="text-xs text-gray-500">
                          {transaction.timestamp.toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          transaction.type === 'earned' ? 'bg-green-500/20 text-green-400' :
                          transaction.type === 'redeemed' ? 'bg-red-500/20 text-red-400' :
                          transaction.type === 'bonus' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {transaction.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-white">{transaction.description}</td>
                      <td className={`p-4 text-right font-bold ${
                        transaction.points > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.points > 0 ? '+' : ''}{transaction.points.toLocaleString()}
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {transaction.reference || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Redeem Reward Modal */}
        {selectedReward && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Confirm Redemption</h3>
              <div className="mb-4">
                <img
                  src={selectedReward.image}
                  alt={selectedReward.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="text-lg font-bold text-white">{selectedReward.name}</h4>
                <p className="text-gray-400 text-sm">{selectedReward.description}</p>
              </div>
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-700/50 rounded-lg">
                <span className="text-white">Cost:</span>
                <span className="text-cyan-400 font-bold">{selectedReward.cost.toLocaleString()} points</span>
              </div>
              <div className="flex items-center justify-between mb-6 p-3 bg-gray-700/50 rounded-lg">
                <span className="text-white">Your balance after:</span>
                <span className="text-green-400 font-bold">
                  {(points.available - selectedReward.cost).toLocaleString()} points
                </span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => redeemReward(selectedReward)}
                  disabled={points.available < selectedReward.cost}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
                >
                  Confirm Redemption
                </button>
                <button
                  onClick={() => setSelectedReward(null)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
