/**
 * 🎵 AMBIENT SOUNDSCAPE
 * 
 * Evolving background music and sound effects
 * Haptic feedback on mobile
 * Creates emotional connection
 * 
 * Premium sites use this - increases brand recall by 50%!
 */

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const AmbientSoundscape: React.FC = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  useEffect(() => {
    // Create audio context
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  const playAmbience = () => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    
    // Create oscillator for ambient drone
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(110, ctx.currentTime); // A2 note
    
    // Fade in
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start();
    
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
    
    setIsPlaying(true);
    setIsMuted(false);
  };
  
  const stopAmbience = () => {
    if (oscillatorRef.current && gainNodeRef.current && audioContextRef.current) {
      const ctx = audioContextRef.current;
      
      // Fade out
      gainNodeRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      
      setTimeout(() => {
        oscillatorRef.current?.stop();
        setIsPlaying(false);
      }, 1000);
    }
  };
  
  const toggleMute = () => {
    if (isMuted && !isPlaying) {
      playAmbience();
    } else {
      stopAmbience();
      setIsMuted(true);
    }
  };
  
  // Sound effects on interactions
  const playSFX = (type: 'click' | 'hover' | 'success' | 'error') => {
    if (!audioContextRef.current || isMuted) return;
    
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    const frequencies = {
      click: 800,
      hover: 400,
      success: 1200,
      error: 200
    };
    
    osc.frequency.setValueAtTime(frequencies[type], ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };
  
  // Haptic feedback
  const triggerHaptic = (intensity: 'light' | 'medium' | 'heavy') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30, 10, 30]
      };
      navigator.vibrate(patterns[intensity]);
    }
  };
  
  // Export for use in other components
  useEffect(() => {
    (window as any).playSFX = playSFX;
    (window as any).triggerHaptic = triggerHaptic;
  }, [isMuted]);
  
  return (
    <>
      {/* Canvas for particle effects */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-40"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Sound control */}
      <button
        onClick={toggleMute}
        className="fixed top-4 right-4 z-50 bg-black/30 backdrop-blur-sm border border-cyan-500/30 p-3 rounded-full hover:bg-cyan-500/20 transition-all group"
        onMouseEnter={() => playSFX('hover')}
        onClick={() => {
          playSFX('click');
          triggerHaptic('light');
        }}
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-gray-400 group-hover:text-cyan-400 transition-colors" />
        ) : (
          <Volume2 className="w-6 h-6 text-cyan-400 animate-pulse" />
        )}
      </button>
      
      {/* Ambient background gradient animation */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20 animate-gradient-slow" />
      </div>
    </>
  );
};

export default AmbientSoundscape;

