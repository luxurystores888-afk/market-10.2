import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface WishlistItem {
  id: string;
  productId: string;
  addedAt: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    imageUrl: string;
    category: string;
    stock: number;
    status: string;
  };
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (productId: string) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useAuth();
  const { user, isAuthenticated: isLoggedIn } = state;

  // Fetch user's wishlist from API
  const refreshWishlist = async () => {
    if (!isLoggedIn || !user) {
      setWishlistItems([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.items || []);
      } else {
        console.error('Failed to fetch wishlist:', await response.text());
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add product to wishlist
  const addToWishlist = async (productId: string): Promise<boolean> => {
    if (!isLoggedIn || !user) {
      console.warn('User must be logged in to add to wishlist');
      return false;
    }

    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await refreshWishlist(); // Refresh the list
        return true;
      } else {
        const error = await response.json();
        console.error('Failed to add to wishlist:', error.error);
        return false;
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId: string): Promise<boolean> => {
    if (!isLoggedIn || !user) {
      return false;
    }

    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await refreshWishlist(); // Refresh the list
        return true;
      } else {
        const error = await response.json();
        console.error('Failed to remove from wishlist:', error.error);
        return false;
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.productId === productId);
  };

  // Toggle product in/out of wishlist
  const toggleWishlist = async (productId: string): Promise<boolean> => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  // Load wishlist when user logs in/out
  useEffect(() => {
    refreshWishlist();
  }, [user, isLoggedIn]);

  const wishlistCount = wishlistItems.length;

  const value: WishlistContextType = {
    wishlistItems,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    refreshWishlist,
    wishlistCount
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};