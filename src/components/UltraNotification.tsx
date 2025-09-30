// 🌟 ULTRA NOTIFICATION SYSTEM - STUNNING ALERTS
import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, Zap, Crown } from 'lucide-react';

interface UltraNotificationProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'cosmic' | 'quantum';
  title: string;
  message: string;
  duration?: number;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function UltraNotification({ 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose,
  action 
}: UltraNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 100));
          if (newProgress <= 0) {
            setIsVisible(false);
            onClose?.();
            return 0;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [duration, onClose]);

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          classes: 'cyber-glow border-green-400 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400',
          progressColor: 'bg-green-400'
        };
      case 'error':
        return {
          icon: AlertTriangle,
          classes: 'fire-effect border-red-400 bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400',
          progressColor: 'bg-red-400'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          classes: 'crystalline-border border-yellow-400 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400',
          progressColor: 'bg-yellow-400'
        };
      case 'info':
        return {
          icon: Info,
          classes: 'holographic border-blue-400 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400',
          progressColor: 'bg-blue-400'
        };
      case 'cosmic':
        return {
          icon: Crown,
          classes: 'rainbow-border dynamic-gradient text-white ultra-text-glow',
          progressColor: 'bg-gradient-to-r from-cyan-400 to-purple-400'
        };
      case 'quantum':
        return {
          icon: Zap,
          classes: 'ultra-glow-card particle-system border-purple-400 text-purple-400',
          progressColor: 'bg-purple-400'
        };
      default:
        return {
          icon: Info,
          classes: 'border-gray-400 bg-gray-500/20 text-gray-400',
          progressColor: 'bg-gray-400'
        };
    }
  };

  const config = getTypeConfig();
  const IconComponent = config.icon;

  if (!isVisible) return null;

  return (
    <div className={`
      fixed top-4 right-4 z-50 max-w-md w-full
      border-2 rounded-xl p-4 backdrop-blur-xl
      transform transition-all duration-500 ease-out
      animate-in slide-in-from-right
      ${config.classes}
    `}>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="vortex-effect w-8 h-8 rounded-full flex items-center justify-center">
            <IconComponent className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-lg ultra-text-glow">{title}</h3>
        </div>
        
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="ultra-button text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Message */}
      <p className="text-white/90 mb-4 leading-relaxed">{message}</p>

      {/* Action Button */}
      {action && (
        <div className="mb-4">
          <button
            onClick={action.onClick}
            className="ultra-button crystalline-border text-white px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            {action.label}
          </button>
        </div>
      )}

      {/* Progress Bar */}
      {duration > 0 && (
        <div className="w-full bg-black/50 rounded-full h-1 overflow-hidden">
          <div 
            className={`h-full transition-all duration-100 ease-linear ${config.progressColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Background Effects */}
      <div className="absolute inset-0 lightning-bg opacity-10 rounded-xl"></div>
      {type === 'cosmic' && (
        <div className="absolute inset-0 star-field opacity-20 rounded-xl"></div>
      )}
    </div>
  );
}
