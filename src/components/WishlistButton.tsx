import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

interface WishlistButtonProps {
  productId: string;
  variant?: 'default' | 'compact' | 'icon-only';
  className?: string;
  showCount?: boolean;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  variant = 'default',
  className,
  showCount = false
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const { isInWishlist, toggleWishlist, wishlistCount } = useWishlist();
  const { state } = useAuth();
  const isLoggedIn = state.isAuthenticated;
  
  const inWishlist = isInWishlist(productId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      // TODO: Integrate with login modal when available
      alert('Please log in to manage your wishlist');
      return;
    }

    setIsAnimating(true);
    try {
      await toggleWishlist(productId);
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  if (variant === 'icon-only') {
    return (
      <Button
        onClick={handleToggle}
        variant="ghost"
        size="sm"
        className={cn(
          "p-2 transition-all duration-200",
          isAnimating && "scale-110",
          className
        )}
      >
        <Heart
          className={cn(
            "w-5 h-5 transition-all duration-200",
            inWishlist 
              ? "fill-red-500 text-red-500" 
              : "text-gray-400 hover:text-red-400"
          )}
        />
      </Button>
    );
  }

  if (variant === 'compact') {
    return (
      <Button
        onClick={handleToggle}
        variant="outline"
        size="sm"
        className={cn(
          "flex items-center gap-2 transition-all duration-200",
          isAnimating && "scale-105",
          inWishlist && "border-red-500 bg-red-500/10",
          className
        )}
      >
        <Heart
          className={cn(
            "w-4 h-4 transition-all duration-200",
            inWishlist 
              ? "fill-red-500 text-red-500" 
              : "text-gray-400"
          )}
        />
        {inWishlist ? "Saved" : "Save"}
        {showCount && wishlistCount > 0 && (
          <span className="text-xs bg-cyan-500 text-white px-1.5 py-0.5 rounded-full">
            {wishlistCount}
          </span>
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleToggle}
      variant={inWishlist ? "default" : "outline"}
      className={cn(
        "flex items-center gap-2 transition-all duration-200",
        isAnimating && "scale-105",
        inWishlist && "bg-red-500 hover:bg-red-600 border-red-500",
        className
      )}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-all duration-200",
          inWishlist 
            ? "fill-white text-white" 
            : "text-gray-400"
        )}
      />
      {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    </Button>
  );
};