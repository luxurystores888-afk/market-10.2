import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, TrendingUp, Users, Gift } from 'lucide-react';

/**
 * 🏆 REFERRAL LEADERBOARD & CONTEST
 * 
 * Impact: 10-50% monthly growth from referrals
 * Dropbox: 3,900% growth from referral program
 * 
 * Features:
 * - Monthly referral competition
 * - Top 10 leaderboard
 * - Real-time rankings
 * - Prizes for winners
 * - Social sharing
 */

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  referrals: number;
  revenue: number;
  trend: 'up' | 'down' | 'same';
}

const prizes = [
  { rank: 1, prize: '$500 Gift Card', icon: '🥇', color: 'from-yellow-500 to-yellow-600' },
  { rank: 2, prize: '$250 Gift Card', icon: '🥈', color: 'from-gray-400 to-gray-500' },
  { rank: 3, prize: '$100 Gift Card', icon: '🥉', color: 'from-orange-600 to-orange-700' },
  { rank: 4-10, prize: '$50 Credit', icon: '🎁', color: 'from-cyan-500 to-cyan-600' }
];

export function ReferralLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      rank: 1,
      userId: '1',
      username: 'Sarah M.',
      referrals: 47,
      revenue: 2350,
      trend: 'up'
    },
    {
      rank: 2,
      userId: '2',
      username: 'John D.',
      referrals: 39,
      revenue: 1950,
      trend: 'same'
    },
    {
      rank: 3,
      userId: '3',
      username: 'Emma R.',
      referrals: 35,
      revenue: 1750,
      trend: 'up'
    }
    // More entries...
  ]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeUntilMonthEnd());

  function calculateTimeUntilMonthEnd() {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const diff = endOfMonth.getTime() - now.getTime();

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24)
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeUntilMonthEnd());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          🏆 Monthly Referral Contest
        </h2>
        <p className="text-gray-400">
          Refer friends and win amazing prizes!
        </p>
      </div>

      {/* Contest Countdown */}
      <div className="bg-gray-900/50 border border-purple-500/50 rounded-lg p-4 mb-6 text-center">
        <p className="text-gray-400 text-sm mb-2">Contest Ends In:</p>
        <p className="text-3xl font-bold text-purple-400 font-mono">
          {timeLeft.days}d {timeLeft.hours}h
        </p>
      </div>

      {/* Prizes */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Gift className="w-4 h-4 text-yellow-400" />
          Prizes This Month:
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">🥇 1st Place:</span>
            <span className="text-yellow-400 font-bold">$500 Gift Card</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">🥈 2nd Place:</span>
            <span className="text-gray-400 font-bold">$250 Gift Card</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">🥉 3rd Place:</span>
            <span className="text-orange-400 font-bold">$100 Gift Card</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">🎁 4th-10th:</span>
            <span className="text-cyan-400 font-bold">$50 Store Credit</span>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          Top Referrers:
        </h3>
        
        <div className="space-y-2">
          {leaderboard.map(entry => (
            <div
              key={entry.userId}
              className={`bg-gray-900/50 border rounded-lg p-4 flex items-center gap-4 ${
                entry.rank <= 3
                  ? 'border-yellow-500/50 ring-1 ring-yellow-500/20'
                  : 'border-gray-700'
              }`}
            >
              {/* Rank Badge */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                entry.rank === 1 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                entry.rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                entry.rank === 3 ? 'bg-gradient-to-br from-orange-600 to-orange-700' :
                'bg-gray-800'
              }`}>
                {entry.rank <= 3 ? (
                  <span>
                    {entry.rank === 1 && '🥇'}
                    {entry.rank === 2 && '🥈'}
                    {entry.rank === 3 && '🥉'}
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm font-bold">#{entry.rank}</span>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <p className="text-white font-semibold">{entry.username}</p>
                <p className="text-gray-400 text-sm">
                  {entry.referrals} referrals • ${entry.revenue.toLocaleString()} revenue
                </p>
              </div>

              {/* Trend */}
              <div className={`flex items-center gap-1 ${
                entry.trend === 'up' ? 'text-green-400' :
                entry.trend === 'down' ? 'text-red-400' :
                'text-gray-400'
              }`}>
                {entry.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                {entry.trend === 'down' && <TrendingUp className="w-4 h-4 rotate-180" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Stats (if user is logged in) */}
      <div className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
        <p className="text-cyan-400 font-semibold mb-2">Your Stats This Month:</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Referrals:</p>
            <p className="text-white font-bold text-lg">0</p>
          </div>
          <div>
            <p className="text-gray-400">Your Rank:</p>
            <p className="text-white font-bold text-lg">-</p>
          </div>
        </div>
        <button className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white py-2 rounded-lg font-semibold transition-all">
          Start Referring & Win!
        </button>
      </div>

      {/* Rules */}
      <details className="mt-4">
        <summary className="text-gray-400 text-sm cursor-pointer hover:text-white transition-colors">
          Contest Rules
        </summary>
        <div className="mt-2 text-gray-400 text-xs space-y-1">
          <p>• Contest runs from 1st to last day of each month</p>
          <p>• Winners announced within 3 days of month end</p>
          <p>• Prizes delivered via email within 7 days</p>
          <p>• Only verified referrals count</p>
          <p>• Terms & conditions apply</p>
        </div>
      </details>
    </div>
  );
}

export default ReferralLeaderboard;

