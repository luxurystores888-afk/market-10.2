import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail,
  ArrowRight, ExternalLink, Copy, Download, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useAuth } from '../context/AuthContext';

interface OrderTrackingProps {
  orderId: string;
  onClose?: () => void;
}

interface TrackingStep {
  status: string;
  title: string;
  description: string;
  timestamp: string | null;
  completed: boolean;
  trackingNumber?: string;
}

interface OrderDetails {
  id: string;
  status: string;
  trackingNumber: string | null;
  createdAt: string;
  shippedAt: string | null;
  deliveredAt: string | null;
  orderItems?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  totalAmount?: string;
  subtotalAmount?: string;
  shippingCost?: string;
  taxAmount?: string;
}

interface TrackingData {
  order: OrderDetails;
  timeline: TrackingStep[];
  estimatedDelivery: string | null;
}

export function OrderTracking({ orderId, onClose }: OrderTrackingProps) {
  const { state: authState } = useAuth();
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrackingData();
  }, [orderId]);

  const fetchTrackingData = async () => {
    if (!authState.token) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/orders/${orderId}/tracking`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setTrackingData(data);
      } else {
        setError(data.error || 'Failed to load tracking information');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Tracking fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyTrackingNumber = () => {
    if (trackingData?.order.trackingNumber) {
      navigator.clipboard.writeText(trackingData.order.trackingNumber);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'confirmed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'processing': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'shipped': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'refunded': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStepIcon = (step: TrackingStep, index: number) => {
    if (step.completed) {
      return <CheckCircle className="w-6 h-6 text-green-400" />;
    }
    
    switch (step.status) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-400" />;
      case 'confirmed':
        return <CheckCircle className="w-6 h-6 text-blue-400" />;
      case 'processing':
        return <Package className="w-6 h-6 text-purple-400" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-cyan-400" />;
      case 'delivered':
        return <MapPin className="w-6 h-6 text-green-400" />;
      default:
        return <div className="w-6 h-6 rounded-full border-2 border-gray-600 flex items-center justify-center text-xs text-gray-400">{index + 1}</div>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-400 mb-4">❌</div>
        <p className="text-red-400">{error}</p>
        <Button onClick={fetchTrackingData} className="mt-4" variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (!trackingData) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Order Tracking</h2>
          <p className="text-gray-400">Order #{orderId}</p>
        </div>
        {onClose && (
          <Button onClick={onClose} variant="outline" size="sm">
            Close
          </Button>
        )}
      </div>

      {/* Status Overview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Badge className={`${getStatusColor(trackingData.order.status)} border font-medium`}>
                {trackingData.order.status.toUpperCase()}
              </Badge>
              <p className="text-gray-400 text-sm mt-1">
                Order placed on {formatDate(trackingData.order.createdAt)}
              </p>
            </div>
            {trackingData.order.trackingNumber && (
              <div className="text-right">
                <p className="text-gray-300 text-sm">Tracking Number</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyan-400">{trackingData.order.trackingNumber}</span>
                  <Button
                    onClick={copyTrackingNumber}
                    size="sm"
                    variant="ghost"
                    className="p-1 h-auto"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {trackingData.estimatedDelivery && trackingData.order.status !== 'delivered' && (
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-cyan-400 font-medium">Estimated Delivery</p>
                  <p className="text-gray-300 text-sm">
                    {formatDate(trackingData.estimatedDelivery)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tracking Timeline */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Tracking Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {trackingData.timeline.map((step, index) => (
              <motion.div
                key={step.status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 relative ${
                    step.completed ? 'text-green-400' : 'text-gray-600'
                  }`}>
                    {getStepIcon(step, index)}
                    {index < trackingData.timeline.length - 1 && (
                      <div className={`absolute top-8 left-3 w-0.5 h-12 ${
                        step.completed ? 'bg-green-400/30' : 'bg-gray-700'
                      }`} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${
                        step.completed ? 'text-white' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </h4>
                      {step.timestamp && (
                        <span className={`text-sm ${
                          step.completed ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {formatDate(step.timestamp)}
                        </span>
                      )}
                    </div>
                    
                    <p className={`text-sm mt-1 ${
                      step.completed ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {step.description}
                    </p>
                    
                    {step.trackingNumber && (
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <span className="text-gray-400">Tracking:</span>
                        <span className="font-mono text-cyan-400">{step.trackingNumber}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="p-1 h-auto text-cyan-400 hover:text-cyan-300"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Information */}
      {trackingData.order.status === 'shipped' && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Delivery Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-white mb-2">Carrier Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Carrier:</span>
                    <span className="text-white">CyberLogistics Express</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Service:</span>
                    <span className="text-white">Standard Delivery</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Weight:</span>
                    <span className="text-white">2.5 lbs</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Contact Support</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-4 h-4" />
                    <span>1-800-CYBER-01</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="w-4 h-4" />
                    <span>support@cyberlogistics.com</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivered Status */}
      {trackingData.order.status === 'delivered' && (
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Package Delivered!</h3>
            <p className="text-gray-300 mb-4">
              Your order was delivered on {formatDate(trackingData.order.deliveredAt)}
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm">
                Rate Your Experience
              </Button>
              <Button variant="outline" size="sm">
                Reorder Items
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <h4 className="font-medium text-white mb-3">Need Help?</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <Package className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-white font-medium">Track Package</p>
              <p className="text-gray-400">Get real-time updates</p>
            </div>
            <div className="text-center">
              <Phone className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-white font-medium">Contact Support</p>
              <p className="text-gray-400">24/7 customer service</p>
            </div>
            <div className="text-center">
              <ArrowRight className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-white font-medium">Delivery Options</p>
              <p className="text-gray-400">Change delivery preferences</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}