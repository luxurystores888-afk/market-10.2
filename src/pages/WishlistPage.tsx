import React from 'react';
import { Heart, ShoppingCart, Trash2, Eye } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export const WishlistPage: React.FC = () => {
  const { wishlistItems, isLoading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { state } = useAuth();
  const isLoggedIn = state.isAuthenticated;
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Your Wishlist</h1>
            <p className="text-gray-400 mb-6">Please log in to view your saved items</p>
            <Button onClick={() => alert('Please log in to view your wishlist')} className="bg-cyan-500 hover:bg-cyan-600">
              Log In to View Wishlist
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = (item: any) => {
    const product = {
      id: item.product.id,
      name: item.product.name,
      description: item.product.description,
      price: parseFloat(item.product.price),
      imageUrl: item.product.imageUrl,
      category: item.product.category,
      stock: item.product.stock
    };
    addToCart(product, 1);
    console.log(`Added ${item.product.name} to cart`);
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    await removeFromWishlist(productId);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-400 mb-6">Start exploring our cyberpunk collection and save your favorite items</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              Explore Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Your Wishlist
          </h1>
          <p className="text-gray-400">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="bg-gray-900 border-gray-700 hover:border-cyan-500/50 transition-all duration-300">
              <CardContent className="p-6">
                {/* Product Image */}
                <div className="relative mb-4">
                  <img
                    src={item.product.imageUrl || '/api/placeholder/300/200'}
                    alt={item.product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      onClick={() => handleRemoveFromWishlist(item.productId)}
                      variant="ghost"
                      size="sm"
                      className="bg-black/50 hover:bg-red-500/20 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {item.product.name}
                  </h3>
                  
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {item.product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-cyan-400">
                      ${parseFloat(item.product.price).toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-2">
                    {item.product.stock > 0 ? (
                      <span className="text-green-400 text-sm">✓ In Stock ({item.product.stock})</span>
                    ) : (
                      <span className="text-red-400 text-sm">Out of Stock</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.product.stock <= 0}
                      className="flex-1 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600"
                      size="sm"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    
                    <Link to={`/product/${item.productId}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-3"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="px-8"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};