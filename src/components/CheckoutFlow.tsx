import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, ArrowRight, ArrowLeft, CreditCard, MapPin, 
  Package, Check, Loader2, AlertCircle, Truck, Calendar,
  Bitcoin, Coins, Wallet, Shield, Clock, Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Add Stripe import and logic
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_yourpublickey'); // Free test key; replace with yours

interface CheckoutFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderComplete: (orderId: string) => void;
}

interface OrderSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
}

interface ShippingAddress {
  id?: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

interface PaymentDetails {
  method: 'crypto' | 'card';
  cryptoType?: 'BTC' | 'ETH' | 'USDC' | 'USDT';
  walletAddress?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardName?: string;
}

const CHECKOUT_STEPS = [
  { id: 'review', title: 'Review Cart', icon: ShoppingCart },
  { id: 'shipping', title: 'Shipping', icon: MapPin },
  { id: 'payment', title: 'Payment', icon: CreditCard },
  { id: 'confirmation', title: 'Confirmation', icon: Check }
];

export function CheckoutFlow({ isOpen, onClose, onOrderComplete }: CheckoutFlowProps) {
  const { items, totalPrice, clearCart } = useCart();
  const { state: authState, actions: authActions } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Add state and effect for upsells
  const [upsells, setUpsells] = useState([]);

  useEffect(() => {
    fetch('/api/recommendations/cart').then(res => res.json()).then(setUpsells);
  }, []);

  // Form states
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: authState.user?.name || '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US'
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    method: 'crypto',
    cryptoType: 'BTC'
  });

  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express' | 'overnight'>('standard');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Load order summary on mount
  useEffect(() => {
    if (isOpen && items.length > 0) {
      calculateOrderSummary();
    }
  }, [isOpen, items]);

  const calculateOrderSummary = async () => {
    const subtotal = totalPrice;
    const tax = subtotal * 0.08; // 8% tax
    
    let shipping = 0;
    switch (deliveryOption) {
      case 'standard':
        shipping = subtotal > 100 ? 0 : 15;
        break;
      case 'express':
        shipping = 25;
        break;
      case 'overnight':
        shipping = 45;
        break;
    }

    setOrderSummary({
      subtotal,
      tax,
      shipping,
      total: subtotal + tax + shipping,
      items: items.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.imageUrl
      }))
    });
  };

  const handleNextStep = () => {
    setError(null);
    
    if (currentStep === 0) {
      // Review step - just proceed
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Shipping step - validate address
      if (!shippingAddress.name || !shippingAddress.addressLine1 || 
          !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
        setError('Please fill in all required shipping information');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Payment step - validate payment details
      if (paymentDetails.method === 'crypto' && !paymentDetails.walletAddress) {
        setError('Please enter your crypto wallet address');
        return;
      }
      if (paymentDetails.method === 'card' && 
          (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv)) {
        setError('Please fill in all card details');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handlePlaceOrder = async () => {
    if (!orderSummary || !authState.user) return;

    setIsProcessing(true);
    setError(null);

    try {
      const orderData = {
        userId: authState.user.id,
        items: orderSummary.items,
        shippingAddress,
        paymentDetails,
        deliveryOption,
        specialInstructions,
        subtotal: orderSummary.subtotal,
        tax: orderSummary.tax,
        shipping: orderSummary.shipping,
        total: orderSummary.total,
        currency: 'USD'
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok) {
        setOrderId(result.orderId);
        clearCart();
        onOrderComplete(result.orderId);
        
        // Send confirmation email (handled by backend)
        await fetch('/api/orders/send-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authState.token}`
          },
          body: JSON.stringify({ orderId: result.orderId })
        });

      } else {
        setError(result.error || 'Failed to place order');
      }
    } catch (error) {
      setError('Network error occurred. Please try again.');
      console.error('Order placement error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getCryptoIcon = (type: string) => {
    switch (type) {
      case 'BTC': return '₿';
      case 'ETH': return 'Ξ';
      case 'USDC': return '$';
      case 'USDT': return '₮';
      default: return '₿';
    }
  };

  const getDeliveryEstimate = (option: string) => {
    switch (option) {
      case 'standard': return '5-7 business days';
      case 'express': return '2-3 business days';
      case 'overnight': return '1 business day';
      default: return '5-7 business days';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed inset-4 bg-gray-900 border border-cyan-500/30 rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Steps */}
          <div className="border-b border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Secure Checkout</h2>
              <Button onClick={onClose} variant="ghost" size="sm" className="text-gray-400">
                ✕
              </Button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between">
              {CHECKOUT_STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    index <= currentStep 
                      ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400' 
                      : 'border-gray-600 text-gray-600'
                  }`}>
                    {index < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`ml-3 text-sm font-medium ${
                    index <= currentStep ? 'text-cyan-400' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </span>
                  {index < CHECKOUT_STEPS.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      index < currentStep ? 'bg-cyan-400' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <AnimatePresence mode="wait">
                {/* Step 0: Review Cart */}
                {currentStep === 0 && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <ShoppingCart className="w-5 h-5" />
                          Order Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                            <div className="flex items-center gap-4">
                              {item.product.imageUrl && (
                                <img 
                                  src={item.product.imageUrl} 
                                  alt={item.product.name}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <h4 className="font-medium text-white">{item.product.name}</h4>
                                <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-white">${(item.product.price * item.quantity).toFixed(2)}</p>
                              <p className="text-gray-400 text-sm">${item.product.price.toFixed(2)} each</p>
                            </div>
                          </div>
                        ))}
                        
                        <Separator className="bg-gray-700" />
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-gray-300">
                            <span>Subtotal</span>
                            <span>${orderSummary?.subtotal.toFixed(2) || '0.00'}</span>
                          </div>
                          <div className="flex justify-between text-gray-300">
                            <span>Tax</span>
                            <span>${orderSummary?.tax.toFixed(2) || '0.00'}</span>
                          </div>
                          <div className="flex justify-between text-gray-300">
                            <span>Shipping</span>
                            <span>${orderSummary?.shipping.toFixed(2) || '0.00'}</span>
                          </div>
                          <Separator className="bg-gray-700" />
                          <div className="flex justify-between text-lg font-bold text-white">
                            <span>Total</span>
                            <span>${orderSummary?.total.toFixed(2) || '0.00'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Step 1: Shipping */}
                {currentStep === 1 && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          Shipping Address
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-gray-300">Full Name *</Label>
                            <Input
                              value={shippingAddress.name}
                              onChange={(e) => setShippingAddress(prev => ({ ...prev, name: e.target.value }))}
                              className="bg-gray-700 border-gray-600 text-white"
                              placeholder="John Doe"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-300">Phone</Label>
                            <Input
                              value={shippingAddress.phone || ''}
                              onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                              className="bg-gray-700 border-gray-600 text-white"
                              placeholder="+1 (555) 000-0000"
                            />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label className="text-gray-300">Address Line 1 *</Label>
                            <Input
                              value={shippingAddress.addressLine1}
                              onChange={(e) => setShippingAddress(prev => ({ ...prev, addressLine1: e.target.value }))}
                              className="bg-gray-700 border-gray-600 text-white"
                              placeholder="123 Main Street"
                            />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label className="text-gray-300">Address Line 2</Label>
                            <Input
                              value={shippingAddress.addressLine2 || ''}
                              onChange={(e) => setShippingAddress(prev => ({ ...prev, addressLine2: e.target.value }))}
                              className="bg-gray-700 border-gray-600 text-white"
                              placeholder="Apt, Suite, Building (Optional)"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-300">City *</Label>
                            <Input
                              value={shippingAddress.city}
                              onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                              className="bg-gray-700 border-gray-600 text-white"
                              placeholder="New York"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-300">State/Province *</Label>
                            <Input
                              value={shippingAddress.state}
                              onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                              className="bg-gray-700 border-gray-600 text-white"
                              placeholder="NY"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-300">Postal Code *</Label>
                            <Input
                              value={shippingAddress.postalCode}
                              onChange={(e) => setShippingAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                              className="bg-gray-700 border-gray-600 text-white"
                              placeholder="10001"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-300">Country *</Label>
                            <Select 
                              value={shippingAddress.country} 
                              onValueChange={(value) => setShippingAddress(prev => ({ ...prev, country: value }))}
                            >
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="US">🇺🇸 United States</SelectItem>
                                <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                                <SelectItem value="GB">🇬🇧 United Kingdom</SelectItem>
                                <SelectItem value="AU">🇦🇺 Australia</SelectItem>
                                <SelectItem value="DE">🇩🇪 Germany</SelectItem>
                                <SelectItem value="FR">🇫🇷 France</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Truck className="w-5 h-5" />
                          Delivery Options
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {[
                          { id: 'standard', name: 'Standard Delivery', price: orderSummary?.subtotal && orderSummary.subtotal > 100 ? 0 : 15, time: '5-7 business days' },
                          { id: 'express', name: 'Express Delivery', price: 25, time: '2-3 business days' },
                          { id: 'overnight', name: 'Overnight Delivery', price: 45, time: '1 business day' }
                        ].map((option) => (
                          <label 
                            key={option.id}
                            className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700/70 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="delivery"
                                value={option.id}
                                checked={deliveryOption === option.id}
                                onChange={(e) => {
                                  setDeliveryOption(e.target.value as any);
                                  calculateOrderSummary();
                                }}
                                className="text-cyan-400"
                              />
                              <div>
                                <p className="text-white font-medium">{option.name}</p>
                                <p className="text-gray-400 text-sm">{option.time}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-medium">
                                {option.price === 0 ? 'FREE' : `$${option.price}`}
                              </p>
                              {option.id === 'standard' && orderSummary?.subtotal && orderSummary.subtotal <= 100 && (
                                <p className="text-gray-400 text-xs">Free over $100</p>
                              )}
                            </div>
                          </label>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Step 2: Payment */}
                {currentStep === 2 && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <CreditCard className="w-5 h-5" />
                          Payment Method
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Payment Method Selection */}
                        <div className="grid grid-cols-2 gap-4">
                          <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                            paymentDetails.method === 'crypto' 
                              ? 'border-cyan-400 bg-cyan-400/10' 
                              : 'border-gray-600 hover:border-gray-500'
                          }`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="crypto"
                              checked={paymentDetails.method === 'crypto'}
                              onChange={() => setPaymentDetails(prev => ({ ...prev, method: 'crypto' }))}
                              className="sr-only"
                            />
                            <div className="text-center">
                              <Bitcoin className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                              <p className="text-white font-medium">Cryptocurrency</p>
                              <p className="text-gray-400 text-sm">BTC, ETH, USDC, USDT</p>
                            </div>
                          </label>
                          
                          <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                            paymentDetails.method === 'card' 
                              ? 'border-cyan-400 bg-cyan-400/10' 
                              : 'border-gray-600 hover:border-gray-500'
                          }`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="card"
                              checked={paymentDetails.method === 'card'}
                              onChange={() => setPaymentDetails(prev => ({ ...prev, method: 'card' }))}
                              className="sr-only"
                            />
                            <div className="text-center">
                              <CreditCard className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                              <p className="text-white font-medium">Credit Card</p>
                              <p className="text-gray-400 text-sm">Visa, Mastercard, Amex</p>
                            </div>
                          </label>
                        </div>

                        {/* Crypto Payment Details */}
                        {paymentDetails.method === 'crypto' && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-gray-300">Cryptocurrency</Label>
                              <Select 
                                value={paymentDetails.cryptoType} 
                                onValueChange={(value) => setPaymentDetails(prev => ({ ...prev, cryptoType: value as any }))}
                              >
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="BTC">
                                    <span className="flex items-center gap-2">
                                      <span>₿</span> Bitcoin (BTC)
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="ETH">
                                    <span className="flex items-center gap-2">
                                      <span>Ξ</span> Ethereum (ETH)
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="USDC">
                                    <span className="flex items-center gap-2">
                                      <span>$</span> USD Coin (USDC)
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="USDT">
                                    <span className="flex items-center gap-2">
                                      <span>₮</span> Tether (USDT)
                                    </span>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="text-gray-300">Your Wallet Address</Label>
                              <Input
                                value={paymentDetails.walletAddress || ''}
                                onChange={(e) => setPaymentDetails(prev => ({ ...prev, walletAddress: e.target.value }))}
                                className="bg-gray-700 border-gray-600 text-white font-mono"
                                placeholder="Enter your wallet address"
                              />
                            </div>

                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                              <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-yellow-400 font-medium">Crypto Payment Instructions</p>
                                  <p className="text-gray-300 text-sm mt-1">
                                    After placing your order, you'll receive payment instructions with our wallet address. 
                                    Send exactly <span className="font-mono font-bold">
                                      {getCryptoIcon(paymentDetails.cryptoType || 'BTC')} {orderSummary?.total.toFixed(6)}
                                    </span> to complete your purchase.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Card Payment Details */}
                        {paymentDetails.method === 'card' && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-gray-300">Cardholder Name</Label>
                              <Input
                                value={paymentDetails.cardName || ''}
                                onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardName: e.target.value }))}
                                className="bg-gray-700 border-gray-600 text-white"
                                placeholder="John Doe"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="text-gray-300">Card Number</Label>
                              <Input
                                value={paymentDetails.cardNumber || ''}
                                onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                                className="bg-gray-700 border-gray-600 text-white font-mono"
                                placeholder="1234 5678 9012 3456"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-gray-300">Expiry Date</Label>
                                <Input
                                  value={paymentDetails.expiryDate || ''}
                                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                                  className="bg-gray-700 border-gray-600 text-white"
                                  placeholder="MM/YY"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-gray-300">CVV</Label>
                                <Input
                                  value={paymentDetails.cvv || ''}
                                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
                                  className="bg-gray-700 border-gray-600 text-white"
                                  placeholder="123"
                                />
                              </div>
                            </div>

                            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-blue-400" />
                                <p className="text-blue-400 text-sm">
                                  Your payment information is secured with 256-bit SSL encryption
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Step 3: Confirmation */}
                {currentStep === 3 && (
                  <motion.div
                    key="confirmation"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {!orderId ? (
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            <Check className="w-5 h-5" />
                            Review Your Order
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Order Summary */}
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-white mb-2">Items ({orderSummary?.items.length})</h4>
                              {orderSummary?.items.map((item, index) => (
                                <div key={index} className="flex justify-between py-2 text-sm">
                                  <span className="text-gray-300">{item.name} × {item.quantity}</span>
                                  <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                            
                            <Separator className="bg-gray-700" />
                            
                            <div>
                              <h4 className="font-medium text-white mb-2">Shipping Address</h4>
                              <div className="text-sm text-gray-300">
                                <p>{shippingAddress.name}</p>
                                <p>{shippingAddress.addressLine1}</p>
                                {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
                                <p>{shippingAddress.country}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-white mb-2">Delivery</h4>
                              <p className="text-sm text-gray-300 capitalize">
                                {deliveryOption.replace('-', ' ')} - {getDeliveryEstimate(deliveryOption)}
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-white mb-2">Payment Method</h4>
                              <p className="text-sm text-gray-300 capitalize">
                                {paymentDetails.method === 'crypto' 
                                  ? `Cryptocurrency (${paymentDetails.cryptoType})`
                                  : 'Credit Card'
                                }
                              </p>
                            </div>
                            
                            <Separator className="bg-gray-700" />
                            
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-300">Subtotal</span>
                                <span className="text-white">${orderSummary?.subtotal.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-300">Tax</span>
                                <span className="text-white">${orderSummary?.tax.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-300">Shipping</span>
                                <span className="text-white">${orderSummary?.shipping.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-lg font-bold border-t border-gray-700 pt-2">
                                <span className="text-white">Total</span>
                                <span className="text-cyan-400">${orderSummary?.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            onClick={handlePlaceOrder}
                            disabled={isProcessing}
                            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-medium py-4 text-lg"
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Processing Order...
                              </>
                            ) : (
                              <>
                                <Package className="w-5 h-5 mr-2" />
                                Place Order
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      // Order Success
                      <Card className="bg-green-500/10 border-green-500/30">
                        <CardContent className="p-8 text-center">
                          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-green-400" />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">Order Placed Successfully!</h3>
                          <p className="text-gray-300 mb-4">
                            Your order #{orderId} has been confirmed and is being processed.
                          </p>
                          <div className="flex items-center justify-center gap-4 text-sm text-gray-400 mb-6">
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              Confirmation sent
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Processing started
                            </span>
                          </div>
                          <Button 
                            onClick={onClose}
                            className="bg-cyan-500 hover:bg-cyan-600"
                          >
                            Continue Shopping
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-900/30 border border-red-500/30 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400">{error}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Footer with Navigation */}
          {currentStep < 3 && !orderId && (
            <div className="border-t border-gray-800 p-6 flex justify-between">
              <Button
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              
              <Button
                onClick={handleNextStep}
                className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}