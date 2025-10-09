import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Target, Zap, Award, ArrowUp } from 'lucide-react';

/**
 * 💰 PROFIT TRACKER DASHBOARD
 * Real-time profit monitoring and reinvestment strategy
 * Shows current stage and budget allocation
 * 
 * 100% REAL - Tracks actual orders and calculates real profit!
 */

interface ProfitStatus {
  currentProfit: number;
  profitFormatted: string;
  stage: {
    stage: number;
    name: string;
    minProfit: number;
    maxProfit: number;
    reinvestmentRate: number;
  };
  reinvestmentBudget: number;
  reinvestmentFormatted: string;
  nextMilestone: number;
  nextMilestoneFormatted: string;
  progressToNext: number;
}

export const ProfitTrackerDashboard: React.FC = () => {
  const [status, setStatus] = useState<ProfitStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
    // Refresh every minute
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/profit-tracker/status');
      const data = await response.json();
      if (data.success) {
        setStatus(data);
      }
    } catch (error) {
      console.error('Error fetching profit status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 border border-cyan-500/30 rounded-xl p-8 my-8 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-cyan-400">Loading profit data...</p>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="bg-red-500/20 border border-red-500 rounded-xl p-6 my-8">
        <p className="text-red-400 text-center">Unable to load profit data. Make sure backend is running.</p>
      </div>
    );
  }

  const getStageColor = (stage: number) => {
    switch(stage) {
      case 1: return 'from-green-500 to-emerald-500';
      case 2: return 'from-blue-500 to-cyan-500';
      case 3: return 'from-purple-500 to-pink-500';
      case 4: return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-black/50 border-2 border-cyan-500 rounded-xl p-8 my-8">
      <div className="text-center mb-8">
        <DollarSign className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-pulse" />
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
          💰 Profit Tracker & Auto-Reinvestment
        </h2>
        <p className="text-gray-300">
          Real-time profit monitoring with automatic stage upgrades
        </p>
      </div>

      {/* Current Stage */}
      <div className={`bg-gradient-to-r ${getStageColor(status.stage.stage)} p-6 rounded-xl mb-6 text-center`}>
        <div className="text-white text-sm font-semibold mb-2">CURRENT STAGE</div>
        <div className="text-4xl font-bold text-white mb-2">
          Stage {status.stage.stage}: {status.stage.name}
        </div>
        <div className="text-white/80 text-sm">
          {status.stage.reinvestmentRate > 0 && 
            `Reinvesting ${(status.stage.reinvestmentRate * 100)}% of profits`
          }
          {status.stage.reinvestmentRate === 0 && 
            'Free stack - No reinvestment yet'
          }
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-black/50 rounded-lg p-4 border border-green-500/30 text-center">
          <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{status.profitFormatted}</div>
          <div className="text-xs text-gray-400">Total Profit</div>
        </div>

        <div className="bg-black/50 rounded-lg p-4 border border-blue-500/30 text-center">
          <Award className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">Stage {status.stage.stage}</div>
          <div className="text-xs text-gray-400">Current Level</div>
        </div>

        <div className="bg-black/50 rounded-lg p-4 border border-purple-500/30 text-center">
          <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{status.nextMilestoneFormatted}</div>
          <div className="text-xs text-gray-400">Next Milestone</div>
        </div>

        <div className="bg-black/50 rounded-lg p-4 border border-orange-500/30 text-center">
          <Zap className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{status.reinvestmentFormatted}</div>
          <div className="text-xs text-gray-400">Reinvest Budget</div>
        </div>
      </div>

      {/* Progress to Next Stage */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Progress to Stage {status.stage.stage + 1}:</span>
          <span>{status.progressToNext.toFixed(1)}%</span>
        </div>
        <div className="bg-gray-800 rounded-full h-4 overflow-hidden">
          <div 
            className={`bg-gradient-to-r ${getStageColor(status.stage.stage + 1)} h-full transition-all duration-500 relative`}
            style={{ width: `${status.progressToNext}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Stage Information */}
      <div className="bg-black/50 rounded-lg p-6 border border-cyan-500/30">
        <h3 className="text-lg font-bold text-white mb-4">📊 Current Stage Details:</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Stage Name:</span>
            <span className="text-white font-bold">{status.stage.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Profit Range:</span>
            <span className="text-white font-bold">
              ${(status.stage.minProfit / 1_000_000).toFixed(1)}M - ${(status.stage.maxProfit / 1_000_000).toFixed(1)}M
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Reinvestment Rate:</span>
            <span className="text-white font-bold">{(status.stage.reinvestmentRate * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Stage Roadmap */}
      <div className="mt-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-400 mb-4">🗺️ Growth Roadmap:</h3>
        <div className="space-y-3">
          <div className={`p-3 rounded-lg ${status.stage.stage >= 1 ? 'bg-green-500/20 border border-green-500' : 'bg-gray-800/50 border border-gray-700'}`}>
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">Stage 1: Bootstrap</span>
              <span className="text-green-400">$0 - $5M</span>
            </div>
            <p className="text-gray-400 text-xs mt-1">Free stack, organic growth</p>
          </div>

          <div className={`p-3 rounded-lg ${status.stage.stage >= 2 ? 'bg-blue-500/20 border border-blue-500' : 'bg-gray-800/50 border border-gray-700'}`}>
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">Stage 2: Growth</span>
              <span className="text-blue-400">$5M - $50M</span>
            </div>
            <p className="text-gray-400 text-xs mt-1">30% reinvestment → Paid ads + premium infra</p>
          </div>

          <div className={`p-3 rounded-lg ${status.stage.stage >= 3 ? 'bg-purple-500/20 border border-purple-500' : 'bg-gray-800/50 border border-gray-700'}`}>
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">Stage 3: Scale</span>
              <span className="text-purple-400">$50M - $500M</span>
            </div>
            <p className="text-gray-400 text-xs mt-1">40% reinvestment → Partnerships + global</p>
          </div>

          <div className={`p-3 rounded-lg ${status.stage.stage >= 4 ? 'bg-orange-500/20 border border-orange-500' : 'bg-gray-800/50 border border-gray-700'}`}>
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">Stage 4: Unicorn</span>
              <span className="text-orange-400">$500M - $1T</span>
            </div>
            <p className="text-gray-400 text-xs mt-1">50% reinvestment → Institutional + enterprise</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={fetchStatus}
          className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black py-3 rounded-lg font-semibold transition-all"
        >
          🔄 Refresh Status
        </button>
        <button
          onClick={() => window.location.href = '/admin'}
          className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition-all"
        >
          📊 Full Dashboard
        </button>
      </div>
    </div>
  );
};

export default ProfitTrackerDashboard;
