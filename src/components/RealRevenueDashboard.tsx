import React, { useState, useEffect } from 'react';

interface RevenueProjection {
  visitors: number;
  conversionRate: number;
  sales: number;
  averageOrderValue: number;
  revenue: number;
  description: string;
}

interface RealRevenueDashboardProps {
  className?: string;
}

export function RealRevenueDashboard({ className = '' }: RealRevenueDashboardProps) {
  const [projections, setProjections] = useState<Record<string, RevenueProjection>>({});
  const [isActivating, setIsActivating] = useState(false);
  const [activationStatus, setActivationStatus] = useState<string>('');

  useEffect(() => {
    fetchRevenueProjections();
  }, []);

  const fetchRevenueProjections = async () => {
    try {
      const response = await fetch('/api/real-revenue/revenue-projections');
      const data = await response.json();
      if (data.success) {
        setProjections(data.projections);
      }
    } catch (error) {
      console.error('Failed to fetch revenue projections:', error);
    }
  };

  const activateRealRevenue = async () => {
    setIsActivating(true);
    setActivationStatus('Activating Real Revenue Engine...');
    
    try {
      const response = await fetch('/api/real-revenue/activate-all-revenue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActivationStatus('✅ Real Revenue Engine Activated!');
        fetchRevenueProjections();
      } else {
        setActivationStatus('❌ Activation failed');
      }
    } catch (error) {
      setActivationStatus('❌ Activation failed');
      console.error('Activation error:', error);
    } finally {
      setIsActivating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className={`real-revenue-dashboard ${className}`}>
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              💰 Real Revenue Dashboard
            </h1>
            <p className="text-xl text-blue-200 mb-6">
              $10,000 - $50,000 First Day Revenue Engine
            </p>
            
            <button
              onClick={activateRealRevenue}
              disabled={isActivating}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                isActivating
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105'
              } text-white shadow-lg`}
            >
              {isActivating ? 'Activating...' : '🚀 ACTIVATE REAL REVENUE ENGINE'}
            </button>
            
            {activationStatus && (
              <div className="mt-4 p-4 bg-black bg-opacity-50 rounded-lg">
                <p className="text-white">{activationStatus}</p>
              </div>
            )}
          </div>

          {/* Revenue Projections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Object.entries(projections).map(([key, projection]) => (
              <div key={key} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <h3 className="text-lg font-semibold text-white mb-4 capitalize">
                  {key} Estimate
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Visitors:</span>
                    <span className="text-white font-semibold">{projection.visitors.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Conversion:</span>
                    <span className="text-white font-semibold">{(projection.conversionRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Sales:</span>
                    <span className="text-white font-semibold">{projection.sales}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">AOV:</span>
                    <span className="text-white font-semibold">{formatCurrency(projection.averageOrderValue)}</span>
                  </div>
                  <div className="border-t border-white border-opacity-20 pt-2 mt-4">
                    <div className="flex justify-between">
                      <span className="text-green-200 font-bold">Revenue:</span>
                      <span className="text-green-400 font-bold text-xl">
                        {formatCurrency(projection.revenue)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-blue-200 mt-2">{projection.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* High-Value Products */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
              <h3 className="text-2xl font-bold text-white mb-4">💎 High-Value Products</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">AI Business Automation Suite</span>
                  <span className="text-white font-semibold">$997</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Digital Marketing Mastery Course</span>
                  <span className="text-white font-semibold">$497</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">E-commerce Empire Builder</span>
                  <span className="text-white font-semibold">$797</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">AI Content Creation System</span>
                  <span className="text-white font-semibold">$697</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Cryptocurrency Trading Bot</span>
                  <span className="text-white font-semibold">$1,297</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Business Consulting Package</span>
                  <span className="text-white font-semibold">$1,997</span>
                </div>
              </div>
            </div>

            {/* Viral Marketing Features */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
              <h3 className="text-2xl font-bold text-white mb-4">🚀 Viral Marketing Features</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Social Media Viral Campaigns</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Referral System (15% commission)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Urgency & Scarcity Tactics</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Targeted Advertising ($3,300 budget)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Email Marketing Automation</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Gamification Features</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Payment Processing (Stripe/PayPal/Crypto)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Target */}
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                🎯 Revenue Target: $10,000 - $50,000
              </h2>
              <p className="text-xl text-green-100 mb-4">
                Expected Reach: 100,000+ users | Conversion Rate: 8% | AOV: $750
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white">Conservative</h3>
                  <p className="text-green-200 text-2xl font-bold">
                    {projections.conservative ? formatCurrency(projections.conservative.revenue) : '$0'}
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white">Moderate</h3>
                  <p className="text-green-200 text-2xl font-bold">
                    {projections.moderate ? formatCurrency(projections.moderate.revenue) : '$0'}
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white">Viral</h3>
                  <p className="text-green-200 text-2xl font-bold">
                    {projections.viral ? formatCurrency(projections.viral.revenue) : '$0'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
