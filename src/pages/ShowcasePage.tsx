import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Mic, Eye, Wallet, Box, Headphones, 
  Brain, Sparkles, Rocket, Shield 
} from 'lucide-react';
import Product3DViewer from '../components/Product3DViewer';
import VoiceShoppingAssistant from '../components/VoiceShoppingAssistant';
import DemoComponent from '../components/DemoComponent';
import AdvancedCryptoPayments from '../components/AdvancedCryptoPayments';
import MetaverseCommerceBridge from '../components/MetaverseCommerceBridge';
import BlockchainIntegrationHub from '../components/BlockchainIntegrationHub';

export function ShowcasePage() {
  const [activeDemo, setActiveDemo] = useState<string>('3d-viewer');

  const features = [
    {
      id: '3d-viewer',
      title: '3D Holographic Viewer',
      description: 'AR/VR Product visualization with real-time customization',
      icon: Box,
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'voice-shopping',
      title: 'Voice Shopping Assistant',
      description: 'Hands-free shopping with AI speech recognition',
      icon: Mic,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'crypto-payments',
      title: 'Advanced Crypto Payments',
      description: 'Multi-wallet support with DeFi integration',
      icon: Wallet,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'metaverse',
      title: 'Metaverse Commerce',
      description: 'Virtual world shopping experiences',
      icon: Eye,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'blockchain',
      title: 'Blockchain Integration',
      description: 'Web3 commerce with smart contracts',
      icon: Shield,
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const renderDemo = () => {
    switch (activeDemo) {
      case '3d-viewer':
        return (
          <div className="h-full">
            <Product3DViewer
              productId="demo-product"
              title="Neural Interface Headset X1"
              enableAR={true}
              enableVR={true}
              enableCustomization={true}
              showHolographicEffect={true}
            />
          </div>
        );
      case 'voice-shopping':
        return (
          <div className="h-full flex items-center justify-center">
            <VoiceShoppingAssistant />
          </div>
        );
      case 'crypto-payments':
        return (
          <div className="h-full overflow-auto">
            <AdvancedCryptoPayments />
          </div>
        );
      case 'metaverse':
        return (
          <div className="h-full">
            <MetaverseCommerceBridge />
          </div>
        );
      case 'blockchain':
        return (
          <div className="h-full">
            <BlockchainIntegrationHub />
          </div>
        );
      default:
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-cyan-400">
              <Brain className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold">Select a feature to explore</h3>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-purple-900/20"></div>
        <div className="relative container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                CYBER MART
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
                2077
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              The most advanced cyberpunk e-commerce platform with AI-powered shopping, 
              3D holographic displays, voice controls, and Web3 integration
            </p>
            <div className="flex items-center justify-center space-x-4 text-cyan-400">
              <Sparkles className="h-8 w-8" />
              <span className="text-lg">Reality-transcending commerce experience</span>
              <Sparkles className="h-8 w-8" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Feature Navigation */}
      <div className="px-4 mb-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {features.map((feature, index) => (
              <motion.button
                key={feature.id}
                onClick={() => setActiveDemo(feature.id)}
                className={`p-6 rounded-xl border transition-all duration-300 ${
                  activeDemo === feature.id
                    ? 'border-cyan-400 bg-gradient-to-br from-cyan-500/20 to-purple-500/20'
                    : 'border-gray-700 bg-gray-900/50 hover:border-purple-400'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 mx-auto`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Area */}
      <div className="px-4 pb-16">
        <div className="container mx-auto">
          <motion.div
            key={activeDemo}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900/50 border border-cyan-500/30 rounded-xl overflow-hidden"
            style={{ height: '80vh' }}
          >
            {renderDemo()}
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-4 bg-gradient-to-r from-gray-900 to-black">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-cyan-400 mb-2">5+</div>
              <div className="text-gray-400">AI Services</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">20+</div>
              <div className="text-gray-400">Cryptocurrencies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-400 mb-2">∞</div>
              <div className="text-gray-400">3D Customization</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
              <div className="text-gray-400">Cyberpunk</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}