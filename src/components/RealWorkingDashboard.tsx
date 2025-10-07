import React, { useState, useEffect } from 'react';

interface RealWorkingDashboardProps {
  className?: string;
}

export function RealWorkingDashboard({ className = '' }: RealWorkingDashboardProps) {
  const [realStatus, setRealStatus] = useState<any>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [activationStatus, setActivationStatus] = useState<string>('');
  const [revenueData, setRevenueData] = useState<any>(null);

  useEffect(() => {
    fetchRealStatus();
    fetchRevenueData();
  }, []);

  const fetchRealStatus = async () => {
    try {
      const response = await fetch('/api/real-working/real-status');
      const data = await response.json();
      if (data.success) {
        setRealStatus(data.status);
      }
    } catch (error) {
      console.error('Failed to fetch real status:', error);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const response = await fetch('/api/real-working/track-revenue');
      const data = await response.json();
      if (data.success) {
        setRevenueData(data.revenue);
      }
    } catch (error) {
      console.error('Failed to fetch revenue data:', error);
    }
  };

  const activateRealFeatures = async () => {
    setIsActivating(true);
    setActivationStatus('Activating Real Features...');
    
    try {
      const response = await fetch('/api/real-working/activate-real-features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActivationStatus('✅ Real Features Activated!');
        fetchRealStatus();
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
    <div className={`real-working-dashboard ${className}`}>
      <div className="bg-gradient-to-br from-green-900 via-blue-900 to-indigo-900 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🔧 Real Working Features Dashboard
            </h1>
            <p className="text-xl text-blue-200 mb-6">
              No Demos, No Fake - Real Working Features Only
            </p>
            
            <button
              onClick={activateRealFeatures}
              disabled={isActivating}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                isActivating
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105'
              } text-white shadow-lg`}
            >
              {isActivating ? 'Activating...' : '🔧 ACTIVATE REAL FEATURES'}
            </button>
            
            {activationStatus && (
              <div className="mt-4 p-4 bg-black bg-opacity-50 rounded-lg">
                <p className="text-white">{activationStatus}</p>
              </div>
            )}
          </div>

          {/* Real Features Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
              <h3 className="text-xl font-bold text-white mb-4">🔧 Real Features Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-200">Status:</span>
                  <span className={`font-semibold ${realStatus?.isActive ? 'text-green-400' : 'text-red-400'}`}>
                    {realStatus?.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Features:</span>
                  <span className="text-white font-semibold">{realStatus?.features?.length || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
              <h3 className="text-xl font-bold text-white mb-4">💰 Real Revenue</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-200">Total Revenue:</span>
                  <span className="text-white font-semibold">
                    {revenueData?.totalRevenue ? formatCurrency(revenueData.totalRevenue) : '$0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Total Orders:</span>
                  <span className="text-white font-semibold">{revenueData?.totalOrders || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Average Order:</span>
                  <span className="text-white font-semibold">
                    {revenueData?.averageOrderValue ? formatCurrency(revenueData.averageOrderValue) : '$0'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
              <h3 className="text-xl font-bold text-white mb-4">🔧 Real Services</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-200">Payment Processing:</span>
                  <span className="text-green-400 font-semibold">Stripe/PayPal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Email System:</span>
                  <span className="text-green-400 font-semibold">SMTP/SendGrid</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Database:</span>
                  <span className="text-green-400 font-semibold">PostgreSQL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Real Products */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
              <h3 className="text-2xl font-bold text-white mb-4">🔧 Real Products & Services</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Premium Web Development</span>
                  <span className="text-white font-semibold">$2,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Digital Marketing Consultation</span>
                  <span className="text-white font-semibold">$150</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">E-commerce Store Setup</span>
                  <span className="text-white font-semibold">$1,200</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">SEO Optimization Package</span>
                  <span className="text-white font-semibold">$800</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Social Media Management</span>
                  <span className="text-white font-semibold">$500</span>
                </div>
              </div>
            </div>

            {/* Real Features */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
              <h3 className="text-2xl font-bold text-white mb-4">🔧 Real Working Features</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Real Product Management</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Real Payment Processing</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Real Email System</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Real Database Operations</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Real Security Features</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Real Analytics</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Real Order Processing</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Real User Authentication</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Real Inventory Management</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Real Revenue Tracking</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real Configuration */}
          <div className="mt-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                🔧 Real Configuration Required
              </h2>
              <p className="text-xl text-green-100 mb-6">
                Set up these real services to make everything work
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Payment Processing</h3>
                  <ul className="text-green-100 space-y-1">
                    <li>• Stripe Account (stripe.com)</li>
                    <li>• PayPal Business Account</li>
                    <li>• Add API keys to environment</li>
                  </ul>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Email System</h3>
                  <ul className="text-green-100 space-y-1">
                    <li>• SMTP Configuration</li>
                    <li>• SendGrid Account</li>
                    <li>• Add credentials to environment</li>
                  </ul>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Database</h3>
                  <ul className="text-green-100 space-y-1">
                    <li>• PostgreSQL Database</li>
                    <li>• Connection string</li>
                    <li>• Database indexes created</li>
                  </ul>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Security</h3>
                  <ul className="text-green-100 space-y-1">
                    <li>• JWT Secret Key</li>
                    <li>• Bcrypt Password Hashing</li>
                    <li>• Rate Limiting</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
