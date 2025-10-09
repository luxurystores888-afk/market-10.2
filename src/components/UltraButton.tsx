// 🚀 ULTRA BUTTON COMPONENT - MAXIMUM VISUAL IMPACT
import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface UltraButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'cosmic' | 'quantum';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function UltraButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  disabled = false,
  loading = false,
  className = ''
}: UltraButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'flame-button bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white';
      case 'secondary':
        return 'crystalline-border bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/40 hover:to-cyan-500/40 text-purple-400';
      case 'danger':
        return 'fire-effect bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white';
      case 'success':
        return 'cyber-glow bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white';
      case 'cosmic':
        return 'rainbow-border dynamic-gradient text-white';
      case 'quantum':
        return 'ultra-glow-card holographic bg-gradient-to-r from-yellow-400 to-pink-400 text-black';
      default:
        return 'flame-button text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'md':
        return 'px-6 py-3 text-base';
      case 'lg':
        return 'px-8 py-4 text-lg';
      case 'xl':
        return 'px-12 py-6 text-xl';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        ultra-button
        ${getVariantClasses()}
        ${getSizeClasses()}
        rounded-xl font-semibold
        transition-all duration-300
        transform hover:scale-105
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95
        rocket-trail
        ${isPressed ? 'scale-95' : ''}
        ${className}
      `}
    >
      <div className="flex items-center justify-center space-x-2">
        {loading ? (
          <div className="tornado-loader w-4 h-4"></div>
        ) : Icon ? (
          <Icon className="h-5 w-5" />
        ) : null}
        <span>{children}</span>
      </div>
      
      {/* Sound Wave Effect for Cosmic Variant */}
      {variant === 'cosmic' && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="sound-wave scale-50">
            <div className="sound-bar"></div>
            <div className="sound-bar"></div>
            <div className="sound-bar"></div>
          </div>
        </div>
      )}
    </button>
  );
}
