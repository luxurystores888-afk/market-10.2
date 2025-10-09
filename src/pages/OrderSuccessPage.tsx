import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Mail, Home } from 'lucide-react';

/**
 * ✅ ORDER SUCCESS PAGE
 * Confirmation page after successful order
 */

export function OrderSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Confetti effect
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <div className="bg-black min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <CheckCircle className="w-32 h-32 text-green-400 animate-bounce" />
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500 rounded-xl p-8 text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Thank you for your purchase!
          </p>
          <div className="bg-black/30 rounded-lg p-4 inline-block">
            <p className="text-gray-400 text-sm mb-1">Order Number</p>
            <p className="text-cyan-400 text-2xl font-bold font-mono">
              #{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">What's Next?</h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Check Your Email</h3>
                <p className="text-gray-400 text-sm">
                  We've sent a confirmation email with your order details and tracking information.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Processing Your Order</h3>
                <p className="text-gray-400 text-sm">
                  We're preparing your items for shipment. You'll receive tracking info within 24 hours.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Estimated Delivery</h3>
                <p className="text-gray-400 text-sm">
                  Your order will arrive in 3-5 business days. Track your package anytime!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Preview */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">💡 Order Tips</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• Save your order number for future reference</li>
            <li>• Check your email for detailed invoice</li>
            <li>• Track your order in the Orders section</li>
            <li>• Contact support if you have any questions</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-all"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
          <button
            onClick={() => navigate('/products')}
            className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-semibold transition-all"
          >
            Continue Shopping
          </button>
        </div>

        {/* Support */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Need help? Contact us at <a href="mailto:support@pulse.com" className="text-cyan-400 hover:underline">support@pulse.com</a></p>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
