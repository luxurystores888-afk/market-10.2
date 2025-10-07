import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWeb3 } from '../context/Web3Context';
import { Minus, Plus, Trash2, ArrowLeft, CreditCard, Wallet, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice, parsePrice } from '../utils/price';
import { CryptoCheckout } from '../components/CryptoCheckout';
import UpsellSuggestions from '../components/UpsellSuggestions';
import MindUpsell from '../components/MindUpsell';

export function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const { state: web3State } = useWeb3();
  const [showCryptoCheckout, setShowCryptoCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'traditional' | 'crypto'>('traditional');
  const [roundUp, setRoundUp] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20 pt-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🚀</div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-400 mb-8">Start exploring our cyberpunk tech collection</p>
            <Link
              to="/products"
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Explore Products</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const total = totalPrice;
  const finalTotal = roundUp ? Math.ceil(total) : total;
  const donation = roundUp ? finalTotal - total : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20 pt-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-400">{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="bg-gray-900/50 border border-cyan-500/30 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    {/* Product Image Placeholder */}
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-900/30 to-cyan-900/30 rounded-lg flex items-center justify-center">
                      <div className="text-cyan-400 text-2xl">🔮</div>
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-1">{item.product.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">{item.product.description}</p>
                      <div className="flex items-center space-x-2 mb-3">
                        {item.product.tags?.map((tag, index) => (
                          <span key={index} className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                        ${formatPrice(item.product.price)}
                      </p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end space-y-2">
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      
                      <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-2 text-gray-300 hover:text-cyan-400 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-2 text-gray-300 hover:text-cyan-400 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <p className="text-gray-400 text-sm">
                        Subtotal: ${(parsePrice(item.product.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Clear Cart Button */}
            <div className="mt-6">
              <button
                onClick={clearCart}
                className="text-red-400 hover:text-red-300 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear Cart</span>
              </button>
            </div>
          </div>
          
          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 border border-cyan-500/30 rounded-xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Quantum Shipping</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Neural Tax</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between text-white font-bold text-xl">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Payment Method Selection */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Payment Method</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('traditional')}
                    className={`p-4 rounded-xl border transition-all ${
                      paymentMethod === 'traditional'
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-gray-600 bg-gray-800/50 hover:border-cyan-500/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-cyan-400" />
                      <div className="text-left">
                        <div className="text-white font-medium">Traditional</div>
                        <div className="text-gray-400 text-sm">Credit/Debit Cards</div>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('crypto')}
                    className={`p-4 rounded-xl border transition-all ${
                      paymentMethod === 'crypto'
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-600 bg-gray-800/50 hover:border-purple-500/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Wallet className="h-5 w-5 text-purple-400" />
                      <div className="text-left">
                        <div className="text-white font-medium">Crypto</div>
                        <div className="text-gray-400 text-sm">Anonymous & Secure</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Checkout Buttons */}
              {paymentMethod === 'traditional' ? (
                <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 mb-4">
                  <CreditCard className="h-5 w-5" />
                  <span>Proceed to Checkout</span>
                </button>
              ) : (
                <>
                  {web3State.isConnected ? (
                    <button 
                      onClick={() => setShowCryptoCheckout(true)}
                      className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 mb-4"
                    >
                      <Zap className="h-5 w-5" />
                      <span>Pay with Crypto</span>
                    </button>
                  ) : (
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Wallet className="h-5 w-5 text-purple-400" />
                        <span className="text-purple-400 font-medium">Connect Wallet Required</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">
                        Connect your crypto wallet to proceed with anonymous blockchain payment
                      </p>
                      <button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2">
                        <Wallet className="h-4 w-4" />
                        <span>Connect Wallet</span>
                      </button>
                    </div>
                  )}
                </>
              )}
              
              <Link
                to="/products"
                className="w-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Continue Shopping</span>
              </Link>
              
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm mb-2">
                  {paymentMethod === 'crypto' 
                    ? '🌐 Decentralized blockchain payment' 
                    : '🔒 Quantum-encrypted secure checkout'
                  }
                </p>
                <div className="flex justify-center space-x-2">
                  {paymentMethod === 'crypto' ? (
                    <>
                      <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">Web3</span>
                      <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">Anonymous</span>
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">IPFS</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">256-bit Neural</span>
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Blockchain</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Crypto Checkout Modal */}
      <CryptoCheckout 
        isOpen={showCryptoCheckout}
        onClose={() => setShowCryptoCheckout(false)}
        onPaymentComplete={(txHash) => {
          console.log('🎉 Payment completed! TX:', txHash);
          setShowCryptoCheckout(false);
        }}
      />
      <UpsellSuggestions cartItems={items} />
      <MindUpsell />
    </div>
  );
}