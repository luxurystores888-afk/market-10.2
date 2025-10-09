// ⭐ USER REVIEWS & RATINGS SYSTEM - ENHANCED SOCIAL PROOF
import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, Flag, Award, TrendingUp, Users, Shield } from 'lucide-react';

interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  content: string;
  timestamp: Date;
  helpful: number;
  notHelpful: number;
  verified: boolean;
  images: string[];
  tags: string[];
  helpfulVotes: string[];
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
  verifiedPercentage: number;
  recentTrend: 'up' | 'down' | 'stable';
}

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
}

export function UserReviews({ productId }: { productId?: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {},
    verifiedPercentage: 0,
    recentTrend: 'stable'
  });
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: '',
    images: [] as string[]
  });
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [filter, setFilter] = useState<'all' | 'verified' | 'withImages' | 'recent'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'mostHelpful'>('newest');

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    // Mock data - in production, fetch from API
    const mockReviews: Review[] = [
      {
        id: '1',
        productId: productId || '1',
        userId: 'user1',
        userName: 'CyberGamer99',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CyberGamer99',
        rating: 5,
        title: 'Absolutely incredible! The AI integration is mind-blowing',
        content: 'I\'ve been using this product for a month now and it has completely transformed my workflow. The AI features are incredibly intuitive and the build quality is exceptional. Worth every penny!',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        helpful: 24,
        notHelpful: 1,
        verified: true,
        images: ['https://picsum.photos/300/200?random=1', 'https://picsum.photos/300/200?random=2'],
        tags: ['ai', 'quality', 'recommended'],
        helpfulVotes: []
      },
      {
        id: '2',
        productId: productId || '1',
        userId: 'user2',
        userName: 'TechEnthusiast',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechEnthusiast',
        rating: 4,
        title: 'Great product with minor issues',
        content: 'Overall a solid product. The main features work perfectly, but I had some issues with the initial setup. Customer support was helpful though.',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        helpful: 12,
        notHelpful: 2,
        verified: true,
        images: ['https://picsum.photos/300/200?random=3'],
        tags: ['good', 'setup-issues'],
        helpfulVotes: []
      },
      {
        id: '3',
        productId: productId || '1',
        userId: 'user3',
        userName: 'EarlyAdopter',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EarlyAdopter',
        rating: 5,
        title: 'Revolutionary technology!',
        content: 'This is the future of e-commerce. The automation features are game-changing and the ROI has been incredible. Highly recommend to anyone serious about online business.',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        helpful: 18,
        notHelpful: 0,
        verified: true,
        images: [],
        tags: ['revolutionary', 'automation', 'roi'],
        helpfulVotes: []
      }
    ];

    setReviews(mockReviews);
    calculateStats(mockReviews);
  };

  const calculateStats = (reviewList: Review[]) => {
    const total = reviewList.length;
    const average = total > 0 ? reviewList.reduce((sum, r) => sum + r.rating, 0) / total : 0;
    const verified = reviewList.filter(r => r.verified).length;
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    reviewList.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });

    setStats({
      averageRating: Math.round(average * 10) / 10,
      totalReviews: total,
      ratingDistribution: distribution,
      verifiedPercentage: total > 0 ? Math.round((verified / total) * 100) : 0,
      recentTrend: 'up'
    });
  };

  const submitReview = async () => {
    if (!newReview.title || !newReview.content) return;

    await fetch('/api/community/blockchain-review', {
      method: 'POST',
      body: JSON.stringify(newReview)
    });

    setNewReview({ rating: 5, title: '', content: '', images: [] });
    setIsWritingReview(false);
    calculateStats([...reviews, {
      id: Date.now().toString(),
      productId: productId || '1',
      userId: 'current-user',
      userName: 'You',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      rating: newReview.rating,
      title: newReview.title,
      content: newReview.content,
      timestamp: new Date(),
      helpful: 0,
      notHelpful: 0,
      verified: true,
      images: newReview.images,
      tags: [],
      helpfulVotes: []
    }]);
  };

  const voteHelpful = (reviewId: string, helpful: boolean) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            helpful: helpful ? review.helpful + 1 : review.helpful,
            notHelpful: !helpful ? review.notHelpful + 1 : review.notHelpful
          }
        : review
    ));
  };

  const filteredAndSortedReviews = () => {
    let filtered = reviews;

    // Apply filters
    switch (filter) {
      case 'verified':
        filtered = filtered.filter(r => r.verified);
        break;
      case 'withImages':
        filtered = filtered.filter(r => r.images.length > 0);
        break;
      case 'recent':
        filtered = filtered.filter(r => 
          new Date().getTime() - r.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
        );
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        break;
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'mostHelpful':
        filtered.sort((a, b) => b.helpful - a.helpful);
        break;
    }

    return filtered;
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-400'
            } ${interactive ? 'cursor-pointer hover:text-yellow-300' : ''}`}
            onClick={() => interactive && setNewReview(prev => ({ ...prev, rating: star }))}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6 rounded-xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4">
          ⭐ Customer Reviews & Ratings
        </h2>
        <p className="text-gray-300">Real feedback from our community</p>
      </div>

      {/* Review Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.averageRating}</div>
          <div className="flex justify-center mb-2">{renderStars(Math.round(stats.averageRating))}</div>
          <div className="text-sm text-gray-400">Average Rating</div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-cyan-400 mb-2">{stats.totalReviews}</div>
          <div className="text-sm text-gray-400">Total Reviews</div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">{stats.verifiedPercentage}%</div>
          <div className="text-sm text-gray-400">Verified Reviews</div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2 flex items-center justify-center">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="text-sm text-gray-400">Growing Community</div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold mb-4 text-cyan-400">Rating Distribution</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = stats.ratingDistribution[rating] || 0;
            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
            return (
              <div key={rating} className="flex items-center space-x-3">
                <span className="text-sm w-8">{rating}★</span>
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-400 w-12">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
        >
          <option value="all">All Reviews</option>
          <option value="verified">Verified Only</option>
          <option value="withImages">With Images</option>
          <option value="recent">Recent (7 days)</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
          <option value="mostHelpful">Most Helpful</option>
        </select>
        <button
          onClick={() => setIsWritingReview(true)}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center"
        >
          <Star className="h-4 w-4 mr-2" />
          Write Review
        </button>
      </div>

      {/* Write Review Modal */}
      {isWritingReview && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-cyan-400">Write Your Review</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              {renderStars(newReview.rating, true)}
            </div>
            <input
              type="text"
              placeholder="Review title..."
              value={newReview.title}
              onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
            />
            <textarea
              placeholder="Share your experience..."
              value={newReview.content}
              onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
            />
            <div className="flex space-x-3">
              <button
                onClick={submitReview}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
              >
                Submit Review
              </button>
              <button
                onClick={() => setIsWritingReview(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredAndSortedReviews().map(review => (
          <div
            key={review.id}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-cyan-400/50 transition-all"
          >
            <div className="flex items-start space-x-4">
              <img
                src={review.userAvatar}
                alt={review.userName}
                className="w-12 h-12 rounded-full border-2 border-cyan-400"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-lg font-bold text-white">{review.title}</h4>
                  {review.verified && (
                    <span className="bg-green-500/20 border border-green-400 px-2 py-1 rounded text-xs text-green-400 flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 mb-3">
                  <span className="text-gray-300">{review.userName}</span>
                  <div className="flex items-center">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-gray-400">
                    {review.timestamp.toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300 mb-4">{review.content}</p>
                
                {/* Review Images */}
                {review.images.length > 0 && (
                  <div className="flex space-x-2 mb-4">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Review image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-600"
                      />
                    ))}
                  </div>
                )}

                {/* Helpful Votes */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => voteHelpful(review.id, true)}
                    className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  <button
                    onClick={() => voteHelpful(review.id, false)}
                    className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span>Not Helpful ({review.notHelpful})</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors">
                    <Flag className="h-4 w-4" />
                    <span>Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { UserReviews };
