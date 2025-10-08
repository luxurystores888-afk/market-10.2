import React, { useState } from 'react';
import { Megaphone, TrendingUp, Copy, Check, Download } from 'lucide-react';

export const FreeTrafficGenerator: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [generatedContent, setGeneratedContent] = useState<{
    reddit: string;
    tiktok: string;
    instagram: string;
    twitter: string;
    pinterest: string;
  } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const generateViralContent = () => {
    if (!productName) {
      alert('Please enter a product name!');
      return;
    }

    const content = {
      reddit: `Hey everyone! 👋\n\nI've been searching for ${productName.toLowerCase()} forever and finally found an amazing deal!\n\n💎 Features:\n• Premium quality\n• Fast shipping\n• Great customer service\n• ${productPrice ? `Only $${productPrice}` : 'Amazing price'}\n\nThought this community might appreciate it. Check it out if you're interested!\n\n[No affiliation, just wanted to share]\n\n🔗 ${window.location.origin}\n\n---\nPosting this in: r/deals r/shopping r/producthunt`,
      
      tiktok: `🎬 TikTok Script:\n\nHook (0-3s): "If you need ${productName.toLowerCase()}, WATCH THIS!"\n\nBody (3-15s):\n• Show product close-up\n• Demonstrate key features\n• Quick before/after or comparison\n• Text overlay: "${productPrice ? `Only $${productPrice}` : 'INSANE DEAL'}"\n\nCall-to-action (15-20s):\n"Link in bio! 🔥"\n"Tag someone who needs this!"\n\n📱 Hashtags: #${productName.replace(/\s/g, '')} #tiktokmademebuyit #tiktokfinds #amazonfind #dealoftheday #shopping #viral #fyp #trending\n\n🎵 Use trending audio for maximum reach!`,
      
      instagram: `📸 Instagram Caption:\n\n🔥 ${productName} Alert!\n\nThis has been my favorite purchase this month! 💯\n\n✨ Why I love it:\n• Quality is insane\n• Perfect for [your use case]\n• ${productPrice ? `Only $${productPrice} (such a steal!)` : 'Amazing value'}\n• Shipped super fast\n\nSwipe to see more! →\n\nWho else needs this in their life? Tag them below! 👇\n\n#${productName.replace(/\s/g, '')} #shopping #deals #musthave #instafinds #amazonfind #shopsmall #newproduct #trending #viral #discoverunder10k\n\n🔗 Shop: Link in bio!`,
      
      twitter: `🐦 Twitter Thread:\n\nThread 1/5:\nOkay, I need to talk about ${productName} 🧵\n\nThis might be the best purchase I've made this year. Here's why...\n\n2/5:\nThe quality is WAY better than I expected. ${productPrice ? `And at $${productPrice}` : 'The price'}, it's an absolute steal.\n\nI was skeptical at first but...\n\n3/5:\nAfter using it for [timeframe], I can confidently say:\n✅ Worth every penny\n✅ Better than competitors\n✅ Would buy again\n\n4/5:\nPerfect if you:\n• [Benefit 1]\n• [Benefit 2]\n• [Benefit 3]\n\nSeriously, this is a game-changer.\n\n5/5:\nIf you've been looking for ${productName.toLowerCase()}, this is your sign.\n\nCheck it out: ${window.location.origin}\n\nYou're welcome. 😉\n\n#ProductReview #Shopping #Deals`,
      
      pinterest: `📌 Pinterest Description:\n\nTitle: "${productName} - Must-Have for 2024!"\n\n📝 Description:\nDiscover the ultimate ${productName.toLowerCase()} that everyone's talking about! ${productPrice ? `Only $${productPrice}` : 'Amazing deal'} 💎\n\n✨ Features:\n• Premium quality materials\n• Perfect for everyday use\n• Great reviews from customers\n• Fast & free shipping\n• Money-back guarantee\n\nClick to learn more and grab yours before they sell out! Limited stock available. 🛍️\n\n💡 Perfect for: [Your audience]\n\n#${productName.replace(/\s/g, '')} #Shopping #Deals #ProductReview #BestBuy #OnlineShopping #MustHave #2024Trends\n\n🔗 Pin leads to: ${window.location.origin}`
    };

    setGeneratedContent(content);
  };

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    setCopied(platform);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadAllContent = () => {
    if (!generatedContent) return;

    const allContent = `
FREE VIRAL CONTENT FOR: ${productName}
Generated: ${new Date().toLocaleDateString()}

============================
REDDIT POST
============================
${generatedContent.reddit}

============================
TIKTOK SCRIPT
============================
${generatedContent.tiktok}

============================
INSTAGRAM CAPTION
============================
${generatedContent.instagram}

============================
TWITTER THREAD
============================
${generatedContent.twitter}

============================
PINTEREST PIN
============================
${generatedContent.pinterest}

============================
POSTING STRATEGY
============================
1. Reddit: Post in 3-5 relevant subreddits daily
2. TikTok: Post 2-3 videos daily (morning, afternoon, evening)
3. Instagram: Post 1 feed + 2 stories + 2 reels daily
4. Twitter: Post thread + 5 regular tweets daily
5. Pinterest: Create 10 pins daily

Expected Results:
- Week 1: 1,000-5,000 views
- Week 2: 5,000-20,000 views
- Week 3: 20,000-100,000 views
- Month 2+: One viral hit = millions of views

COST: $0 (100% FREE TRAFFIC!)
`;

    const blob = new Blob([allContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `viral-content-${productName.replace(/\s/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-to-br from-pink-900/30 to-orange-900/30 border border-pink-500/30 rounded-xl p-8 my-8">
      <div className="text-center mb-8">
        <Megaphone className="w-16 h-16 text-pink-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400 mb-2">
          🚀 FREE Traffic Generator
        </h2>
        <p className="text-gray-300">Generate viral content for all platforms - Zero cost, Maximum reach!</p>
      </div>

      {/* Input Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Product Name *</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g., Neural Headset"
            className="w-full bg-black/50 border border-pink-500/50 rounded-lg px-4 py-3 text-white placeholder-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Price (optional)</label>
          <input
            type="text"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            placeholder="e.g., 99.99"
            className="w-full bg-black/50 border border-pink-500/50 rounded-lg px-4 py-3 text-white placeholder-gray-500"
          />
        </div>
        <button
          onClick={generateViralContent}
          className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2"
        >
          <TrendingUp className="w-6 h-6" />
          Generate Viral Content (FREE!)
        </button>
      </div>

      {/* Generated Content */}
      {generatedContent && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Your Viral Content Ready! 🎉</h3>
            <button
              onClick={downloadAllContent}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download All
            </button>
          </div>

          {Object.entries(generatedContent).map(([platform, content]) => (
            <div key={platform} className="bg-black/50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-bold text-white capitalize">{platform}</h4>
                <button
                  onClick={() => copyToClipboard(content, platform)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-black px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  {copied === platform ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono bg-gray-900/50 p-4 rounded overflow-x-auto">
                {content}
              </pre>
            </div>
          ))}

          {/* Posting Strategy */}
          <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-green-400 mb-4">📊 Posting Strategy (100% FREE)</h3>
            <ul className="space-y-2 text-gray-300">
              <li>📱 <strong className="text-white">Reddit:</strong> Post in 3-5 relevant subreddits daily (1M+ potential reach)</li>
              <li>🎵 <strong className="text-white">TikTok:</strong> 2-3 videos daily = 10K-100K views guaranteed</li>
              <li>📸 <strong className="text-white">Instagram:</strong> 1 feed + 2 reels daily = 5K-50K reach</li>
              <li>🐦 <strong className="text-white">Twitter:</strong> 1 thread + 5 tweets daily = 2K-20K impressions</li>
              <li>📌 <strong className="text-white">Pinterest:</strong> 10 pins daily = 100K+ monthly views after 3 months</li>
            </ul>
            <div className="mt-4 p-4 bg-black/50 rounded-lg">
              <p className="text-yellow-400 font-semibold">💰 Expected Results (ZERO ad spend):</p>
              <ul className="mt-2 space-y-1 text-gray-300">
                <li>• Week 1: 1,000-5,000 total views</li>
                <li>• Week 2: 5,000-20,000 total views</li>
                <li>• Month 1: 50,000-200,000 total views</li>
                <li>• Month 3: One viral hit = 1M+ views possible</li>
                <li>• <strong className="text-green-400">Cost: $0</strong> (100% organic!)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Pro Tips */}
      <div className="mt-6 bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
        <h3 className="text-lg font-bold text-purple-400 mb-3">💡 Pro Tips for Viral Success:</h3>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li>✅ Post consistently (daily) - algorithm favors active accounts</li>
          <li>✅ Engage with comments (reply within 1 hour for maximum visibility)</li>
          <li>✅ Use trending sounds/hashtags (ride the wave)</li>
          <li>✅ Post at peak times (check each platform's analytics)</li>
          <li>✅ Create variations (test different hooks)</li>
          <li>✅ Cross-promote (mention other platforms)</li>
          <li>✅ Be authentic (people buy from people, not brands)</li>
          <li>🚀 ONE viral post can change everything - keep posting!</li>
        </ul>
      </div>
    </div>
  );
};

export default FreeTrafficGenerator;
