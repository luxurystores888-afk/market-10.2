import React, { useState, useEffect } from 'react';
import { Lock, Unlock, DollarSign, TrendingUp, Zap, Clock } from 'lucide-react';

/**
 * 🔓 FEATURE UNLOCK DASHBOARD
 * 
 * Shows:
 * - Current profit
 * - Progress to $5M
 * - FREE features (active now)
 * - PAID features (locked until $5M)
 * - Auto-unlock countdown
 */

interface FeatureStatus {
  name: string;
  tier: 'FREE' | 'PAID';
  isEnabled: boolean;
  cost: string;
  value: string;
  unlocksAt: number;
}

export function FeatureUnlockDashboard() {
  const [profit, setProfit] = useState(0);
  const [features, setFeatures] = useState<FeatureStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const profitGoal = 5000000; // $5M
  const progress = (profit / profitGoal) * 100;
  const remaining = profitGoal - profit;

  useEffect(() => {
    fetchFeatureStatus();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchFeatureStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchFeatureStatus = async () => {
    try {
      const response = await fetch('/api/features/status');
      const data = await response.json();
      
      setProfit(data.currentProfit || 0);
      setFeatures(data.features || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feature status:', error);
      setLoading(false);
    }
  };

  const freeFeatures = features.filter(f => f.tier === 'FREE');
  const paidFeatures = features.filter(f => f.tier === 'PAID');
  const unlockedCount = features.filter(f => f.isEnabled).length;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-cyan-500/30 rounded-2xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
          💎 Feature Unlock System
        </h2>
        <p className="text-gray-400">
          Pay-When-You-Profit Model - Smart Business Strategy
        </p>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-2 border-green-500 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-300 text-sm mb-1">Current Profit:</p>
            <p className="text-4xl font-bold text-green-400">
              ${profit.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-300 text-sm mb-1">Goal:</p>
            <p className="text-2xl font-bold text-white">
              $5,000,000
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="bg-gray-800 rounded-full h-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-1000 flex items-center justify-end pr-2"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              {progress > 5 && (
                <span className="text-white text-xs font-bold">
                  {progress.toFixed(1)}%
                </span>
              )}
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-2 text-center">
            ${remaining.toLocaleString()} remaining to unlock premium features
          </p>
        </div>

        {/* Milestone Markers */}
        <div className="grid grid-cols-5 gap-2 mt-4">
          {[1000000, 2000000, 3000000, 4000000, 5000000].map((milestone, i) => {
            const reached = profit >= milestone;
            return (
              <div key={i} className="text-center">
                <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                  reached ? 'bg-green-400' : 'bg-gray-600'
                }`} />
                <p className={`text-xs ${reached ? 'text-green-400' : 'text-gray-500'}`}>
                  ${(milestone / 1000000).toFixed(0)}M
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Status */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* FREE Features */}
        <div className="bg-gray-800/50 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Unlock className="w-6 h-6 text-green-400" />
            <div>
              <h3 className="text-xl font-bold text-white">FREE Features</h3>
              <p className="text-green-400 text-sm font-semibold">
                ✅ {freeFeatures.length} Active Now - $0/month
              </p>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {freeFeatures.slice(0, 10).map((feature, i) => (
              <div key={i} className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-green-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{feature.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-green-400 text-xs">{feature.value}</span>
                      <span className="text-gray-400 text-xs">{feature.cost}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {freeFeatures.length > 10 && (
              <p className="text-gray-400 text-xs text-center pt-2">
                + {freeFeatures.length - 10} more FREE features...
              </p>
            )}
          </div>
        </div>

        {/* PAID Features */}
        <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="text-xl font-bold text-white">Premium Features</h3>
              <p className="text-purple-400 text-sm font-semibold">
                {progress >= 100 ? '✅ UNLOCKED!' : `🔒 Unlocks at $5M profit`}
              </p>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {paidFeatures.map((feature, i) => (
              <div key={i} className={`border rounded-lg p-3 ${
                feature.isEnabled
                  ? 'bg-purple-500/10 border-purple-500/30'
                  : 'bg-gray-900/30 border-gray-700'
              }`}>
                <div className="flex items-start gap-2">
                  {feature.isEnabled ? (
                    <Unlock className="w-4 h-4 text-purple-400 mt-0.5" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-semibold text-sm ${
                      feature.isEnabled ? 'text-white' : 'text-gray-400'
                    }`}>
                      {feature.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs ${
                        feature.isEnabled ? 'text-purple-400' : 'text-gray-500'
                      }`}>
                        {feature.value}
                      </span>
                      <span className="text-gray-500 text-xs">{feature.cost}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-sm mb-1">Total Features</p>
          <p className="text-3xl font-bold text-white">{features.length}</p>
        </div>
        
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-sm mb-1">Active (FREE)</p>
          <p className="text-3xl font-bold text-green-400">{freeFeatures.length}</p>
        </div>
        
        <div className={`rounded-lg p-4 text-center ${
          progress >= 100
            ? 'bg-purple-500/10 border border-purple-500/30'
            : 'bg-gray-800/50'
        }`}>
          <p className="text-gray-400 text-sm mb-1">Premium</p>
          <p className={`text-3xl font-bold ${
            progress >= 100 ? 'text-purple-400' : 'text-gray-500'
          }`}>
            {paidFeatures.length}
          </p>
        </div>
        
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-sm mb-1">Progress</p>
          <p className="text-3xl font-bold text-cyan-400">{progress.toFixed(0)}%</p>
        </div>
      </div>

      {/* Motivational Message */}
      {progress < 100 && (
        <div className="mt-8 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6 text-center">
          <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
          <h4 className="text-xl font-bold text-white mb-2">
            Keep Going! You're {progress.toFixed(1)}% There! 🚀
          </h4>
          <p className="text-gray-300 mb-4">
            Focus on using the {freeFeatures.length} FREE features to maximize sales.
            Premium features unlock automatically when you hit $5M profit!
          </p>
          <p className="text-cyan-400 font-semibold">
            💡 Smart Strategy: Build with FREE, scale with PAID
          </p>
        </div>
      )}

      {/* Success Message */}
      {progress >= 100 && (
        <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-2 border-purple-500 rounded-xl p-6 text-center">
          <div className="text-6xl mb-4">🎊</div>
          <h4 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            CONGRATULATIONS!
          </h4>
          <p className="text-xl text-white mb-4">
            You've reached $5,000,000 profit!
          </p>
          <p className="text-gray-300 mb-4">
            All {paidFeatures.length} premium features are now UNLOCKED!
          </p>
          <p className="text-purple-400 font-bold text-lg">
            🚀 Time to scale to $100M with enterprise tools!
          </p>
        </div>
      )}
    </div>
  );
}

export default FeatureUnlockDashboard;

