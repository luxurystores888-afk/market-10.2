import React, { useState, useEffect } from 'react';
import { Share2, Gift, Trophy, Users, Copy, Check } from 'lucide-react';

export const ViralReferralSystem: React.FC = () => {
  const [referralCode, setReferralCode] = useState('');
  const [referralStats, setReferralStats] = useState({
    referrals: 0,
    earnings: 0,
    rank: 0
  });
  const [copied, setCopied] = useState(false);
  const [shareLinks, setShareLinks] = useState({
    facebook: '',
    twitter: '',
    whatsapp: '',
    email: ''
  });

  useEffect(() => {
    // Generate unique referral code
    const userId = localStorage.getItem('userId') || Math.random().toString(36).substring(7);
    localStorage.setItem('userId', userId);
    const code = `CYBER${userId.toUpperCase()}`;
    setReferralCode(code);

    // Generate share links
    const baseUrl = window.location.origin;
    const referralUrl = `${baseUrl}?ref=${code}`;
    const message = encodeURIComponent(`🔥 Check out this amazing store! Use my code ${code} and we both get $10 off! ${referralUrl}`);
    
    setShareLinks({
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${message}`,
      whatsapp: `https://wa.me/?text=${message}`,
      email: `mailto:?subject=Check out this store!&body=${message}`
    });

    // Load stats from localStorage
    const stats = JSON.parse(localStorage.getItem('referralStats') || '{"referrals":0,"earnings":0,"rank":0}');
    setReferralStats(stats);

    // Check if visitor came from referral
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode && refCode !== code) {
      // Track referral
      fetch('/api/referrals/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralCode: refCode, visitorCode: code })
      }).catch(console.error);
      
      // Show welcome bonus
      alert('🎉 Welcome! You got $10 off your first order with code: ' + refCode);
    }
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToSocial = (platform: string) => {
    window.open(shareLinks[platform as keyof typeof shareLinks], '_blank', 'width=600,height=400');
    
    // Track share
    fetch('/api/referrals/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referralCode, platform })
    }).catch(console.error);
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border border-cyan-500/30 rounded-xl p-8 my-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
          🚀 Invite Friends, Earn Money!
        </h2>
        <p className="text-gray-300">Give $10, Get $10 - Unlimited Referrals!</p>
      </div>

      {/* Your Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-black/50 rounded-lg p-4 text-center">
          <Users className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{referralStats.referrals}</div>
          <div className="text-gray-400 text-sm">Friends Referred</div>
        </div>
        <div className="bg-black/50 rounded-lg p-4 text-center">
          <Gift className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">${referralStats.earnings}</div>
          <div className="text-gray-400 text-sm">Earned in Credits</div>
        </div>
        <div className="bg-black/50 rounded-lg p-4 text-center">
          <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">#{referralStats.rank || '∞'}</div>
          <div className="text-gray-400 text-sm">Global Rank</div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Your Referral Code</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralCode}
            readOnly
            className="flex-1 bg-black/50 border border-cyan-500/50 rounded-lg px-4 py-3 text-white text-lg font-mono text-center"
          />
          <button
            onClick={copyCode}
            className="bg-cyan-500 hover:bg-cyan-600 text-black px-6 rounded-lg font-semibold transition-all flex items-center gap-2"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Share on Social Media (FREE Traffic!)</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => shareToSocial('facebook')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all"
          >
            📘 Facebook
          </button>
          <button
            onClick={() => shareToSocial('twitter')}
            className="bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-lg font-semibold transition-all"
          >
            🐦 Twitter
          </button>
          <button
            onClick={() => shareToSocial('whatsapp')}
            className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-all"
          >
            💬 WhatsApp
          </button>
          <button
            onClick={() => shareToSocial('email')}
            className="bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-all"
          >
            ✉️ Email
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-black/30 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">💰 How It Works:</h3>
        <ol className="space-y-3 text-gray-300">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-black font-bold">1</span>
            <span><strong className="text-white">Share your code</strong> with friends on social media (100% FREE!)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-black font-bold">2</span>
            <span><strong className="text-white">They get $10 off</strong> their first purchase</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-black font-bold">3</span>
            <span><strong className="text-white">You get $10 credit</strong> when they make a purchase</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-black font-bold">4</span>
            <span><strong className="text-white">Unlimited referrals!</strong> Refer 10 friends = $100 FREE</span>
          </li>
        </ol>
      </div>

      {/* Bonus Challenges */}
      <div className="mt-6 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-lg p-6">
        <h3 className="text-xl font-bold text-yellow-400 mb-4">🏆 Bonus Challenges:</h3>
        <ul className="space-y-2 text-gray-300">
          <li>✨ Refer 5 friends → Get <strong className="text-white">$50 bonus</strong></li>
          <li>🔥 Refer 10 friends → Get <strong className="text-white">$120 bonus</strong> + VIP status</li>
          <li>💎 Refer 25 friends → Get <strong className="text-white">$350 bonus</strong> + Lifetime VIP</li>
          <li>👑 Top 10 referrers → Win <strong className="text-white">$1,000</strong> each month!</li>
        </ul>
      </div>

      {/* Leaderboard Preview */}
      <div className="mt-6 text-center">
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-all">
          🏆 View Leaderboard & Win Prizes
        </button>
      </div>
    </div>
  );
};

export default ViralReferralSystem;
