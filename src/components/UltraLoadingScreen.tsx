// 🌟 ULTRA LOADING SCREEN - MAXIMUM VISUAL IMPACT
import React, { useState, useEffect } from 'react';

interface UltraLoadingScreenProps {
  message?: string;
  progress?: number;
}

export function UltraLoadingScreen({ message = "Loading Cyberpunk Interface...", progress }: UltraLoadingScreenProps) {
  const [loadingText, setLoadingText] = useState(message);
  const [currentProgress, setCurrentProgress] = useState(progress || 0);
  const [particles, setParticles] = useState<Array<any>>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);

    // Animate progress if not provided
    if (progress === undefined) {
      const interval = setInterval(() => {
        setCurrentProgress(prev => {
          if (prev >= 100) return 0;
          return prev + Math.random() * 3;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [progress]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black via-purple-900/50 to-cyan-900/50 star-field">
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              transform: `scale(${particle.size})`
            }}
          />
        ))}
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center max-w-md mx-auto p-8">
        
        {/* Central Logo/Icon */}
        <div className="mb-8">
          <div className="vortex-effect w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <div className="text-4xl animate-pulse">🧠</div>
          </div>
          
          {/* Ultra Glowing Title */}
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 ultra-text-glow mb-4">
            CYBER MART 2077
          </h1>
        </div>

        {/* Loading Message */}
        <div className="mb-8">
          <p className="text-xl text-cyan-400 mb-4 ultra-text-glow data-stream">
            {loadingText}
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-4 mb-4 overflow-hidden crystalline-border">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 transition-all duration-300 ease-out cyber-glow"
              style={{ width: `${currentProgress}%` }}
            ></div>
          </div>
          
          {/* Progress Percentage */}
          <div className="text-lg font-bold text-green-400 ultra-text-glow">
            {Math.round(currentProgress)}% Complete
          </div>
        </div>

        {/* Loading Animation Elements */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          <div className="tornado-loader"></div>
          <div className="sound-wave">
            <div className="sound-bar"></div>
            <div className="sound-bar"></div>
            <div className="sound-bar"></div>
            <div className="sound-bar"></div>
            <div className="sound-bar"></div>
          </div>
          <div className="spiral-effect w-8 h-8"></div>
        </div>

        {/* System Status */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-center space-x-2 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Quantum Systems Online</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-cyan-400">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span>AI Networks Activated</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-purple-400">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span>Reality Engine Loading</span>
          </div>
        </div>

        {/* Loading Tips */}
        <div className="mt-8 p-4 bg-black/50 rounded-lg border border-cyan-500/30 holographic">
          <p className="text-sm text-gray-300">
            💡 <strong>Pro Tip:</strong> Your platform includes infinity features, 
            quantum security, and unlimited AI capabilities!
          </p>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 lightning-bg opacity-30"></div>
      <div className="absolute inset-0 electric-grid opacity-10"></div>
    </div>
  );
}
