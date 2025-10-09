import React, { useEffect, useState } from 'react';
import { RacingGame } from '../components/RacingGame';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Gamepad2, Car, ShoppingBag, Trophy, Zap, Star } from 'lucide-react';
import GiveawayEntry from '../components/GiveawayEntry';

type GameMode = 'menu' | 'racing' | 'showroom' | 'shopping';

export const GamingPage: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<GameMode>('menu');
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    // Fetch challenges
    setChallenges([{ title: 'Daily Challenge' }]);
  }, []);

  const renderMainMenu = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            CYBER GAMING HUB
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Experience the future of interactive shopping through immersive gaming
          </p>
          <div className="flex items-center justify-center gap-2 text-cyan-400">
            <Gamepad2 className="w-6 h-6" />
            <span className="text-lg">Choose Your Experience</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Racing Game */}
          <Card className="bg-gray-900/80 border-cyan-500/50 hover:border-cyan-400 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Car className="w-8 h-8 text-cyan-400" />
                </div>
                <CardTitle className="text-cyan-400">Neon Rush Racing</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                High-speed cyberpunk racing with product collection. Race through neon-lit tracks while discovering and collecting premium tech products.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Trophy className="w-4 h-4" />
                  <span>Score-based challenges</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Zap className="w-4 h-4" />
                  <span>Boost mechanics</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Product collection</span>
                </div>
              </div>
              <Button 
                onClick={() => setCurrentMode('racing')} 
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                Start Racing
              </Button>
            </CardContent>
          </Card>

          {/* Virtual Showroom */}
          <Card className="bg-gray-900/80 border-purple-500/50 hover:border-purple-400 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Star className="w-8 h-8 text-purple-400" />
                </div>
                <CardTitle className="text-purple-400">Virtual Showroom</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Explore immersive 3D environments showcasing our premium cyberpunk products in interactive virtual spaces.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Star className="w-4 h-4" />
                  <span>Interactive 3D models</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Immersive exploration</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Direct purchasing</span>
                </div>
              </div>
              <Button 
                onClick={() => setCurrentMode('showroom')} 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                disabled
              >
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* Interactive Shopping */}
          <Card className="bg-gray-900/80 border-green-500/50 hover:border-green-400 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <ShoppingBag className="w-8 h-8 text-green-400" />
                </div>
                <CardTitle className="text-green-400">Shopping Quest</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Gamified shopping experience with quests, rewards, and achievements. Complete challenges to unlock exclusive products.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Trophy className="w-4 h-4" />
                  <span>Achievement system</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Star className="w-4 h-4" />
                  <span>Exclusive rewards</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Quest mechanics</span>
                </div>
              </div>
              <Button 
                onClick={() => setCurrentMode('shopping')} 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                disabled
              >
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-6">Gaming Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
              <div className="text-3xl font-bold text-cyan-400 mb-2">1,247</div>
              <div className="text-gray-400">Players Today</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
              <div className="text-3xl font-bold text-purple-400 mb-2">95,432</div>
              <div className="text-gray-400">Products Collected</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
              <div className="text-3xl font-bold text-green-400 mb-2">$2.1M</div>
              <div className="text-gray-400">Total Sales</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentMode) {
      case 'racing':
        return <RacingGame />;
      case 'showroom':
        return <div>Virtual Showroom - Coming Soon</div>;
      case 'shopping':
        return <div>Shopping Quest - Coming Soon</div>;
      default:
        return renderMainMenu();
    }
  };

  return (
    <div className="relative">
      {/* Back to Menu Button (when in game) */}
      {currentMode !== 'menu' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
          <Button
            onClick={() => setCurrentMode('menu')}
            variant="outline"
            className="bg-gray-900/90 border-cyan-500/50 text-white hover:bg-gray-800"
          >
            ← Back to Gaming Hub
          </Button>
        </div>
      )}
      
      {renderContent()}
      <GiveawayEntry />
    </div>
  );
};