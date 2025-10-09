// 🚀 AUTOMATION DASHBOARD - INFINITE PROFIT CONTROL CENTER

import React, { useState, useEffect } from 'react';
import { Play, Pause, TrendingUp, DollarSign, Zap, Bot, Target, BarChart3 } from 'lucide-react';
import axios from 'axios';

interface AutomationStatus {
  automationActive: boolean;
  revenueMetrics: {
    totalRevenue: number;
    totalProducts: number;
    totalOrders: number;
    ordersLast24h: number;
    productsGeneratedLast24h: number;
    conversionRate: string;
    averageOrderValue: string;
    profitMargin: string;
  };
  automationFeatures: {
    productGeneration: {
      status: string;
      lastRun: string;
      nextRun: string;
      productsGenerated: number;
    };
    pricingOptimization: {
      status: string;
      lastRun: string;
      nextRun: string;
      priceUpdates: string;
    };
    marketingCampaigns: {
      status: string;
      lastRun: string;
      nextRun: string;
      campaignsLaunched: string;
    };
    inventoryManagement: {
      status: string;
      lastRun: string;
      nextRun: string;
      restockedItems: string;
    };
  };
  recentGeneratedProducts: Array<{
    name: string;
    price: number;
    category: string;
    created: string;
  }>;
}

interface RevenueProjections {
  current: number;
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  automationImpact: Record<string, string>;
}

const AutomationDashboard: React.FC = () => {
  const [status, setStatus] = useState<AutomationStatus | null>(null);
  const [projections, setProjections] = useState<RevenueProjections | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    fetchStatus();
    fetchProjections();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStatus();
      fetchProjections();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await axios.get('/api/automation/status');
      setStatus(response.data.data);
    } catch (error) {
      console.error('Failed to fetch automation status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjections = async () => {
    try {
      const response = await axios.get('/api/automation/projections');
      setProjections(response.data.projections);
    } catch (error) {
      console.error('Failed to fetch projections:', error);
    }
  };

  const startAutomation = async () => {
    setIsStarting(true);
    try {
      const response = await axios.post('/api/automation/start');
      console.log('Automation started:', response.data);
      fetchStatus();
    } catch (error) {
      console.error('Failed to start automation:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const stopAutomation = async () => {
    try {
      await axios.post('/api/automation/stop');
      fetchStatus();
    } catch (error) {
      console.error('Failed to stop automation:', error);
    }
  };

  const optimizeNow = async () => {
    try {
      await axios.post('/api/automation/optimize-now');
      fetchStatus();
    } catch (error) {
      console.error('Failed to trigger optimization:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-400 text-xl">Loading Automation Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
            🚀 AUTOMATION CONTROL CENTER
          </h1>
          <p className="text-gray-300 text-lg">
            Hyper-Automated Revenue Generation System - Maximum Profit Mode
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full ${status?.automationActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-xl font-semibold">
                {status?.automationActive ? '🟢 INFINITE PROFIT MODE ACTIVE' : '🔴 Manual Mode'}
              </span>
            </div>
            
            <div className="flex space-x-4">
              {status?.automationActive ? (
                <button
                  onClick={stopAutomation}
                  className="bg-red-500/20 hover:bg-red-500/40 border border-red-400/50 text-red-400 px-6 py-2 rounded-lg flex items-center space-x-2 transition-all"
                >
                  <Pause className="h-4 w-4" />
                  <span>Stop Automation</span>
                </button>
              ) : (
                <button
                  onClick={startAutomation}
                  disabled={isStarting}
                  className="bg-green-500/20 hover:bg-green-500/40 border border-green-400/50 text-green-400 px-6 py-2 rounded-lg flex items-center space-x-2 transition-all disabled:opacity-50"
                >
                  <Play className="h-4 w-4" />
                  <span>{isStarting ? 'Starting...' : 'Start Automation'}</span>
                </button>
              )}
              
              <button
                onClick={optimizeNow}
                className="bg-purple-500/20 hover:bg-purple-500/40 border border-purple-400/50 text-purple-400 px-6 py-2 rounded-lg flex items-center space-x-2 transition-all"
              >
                <Zap className="h-4 w-4" />
                <span>Optimize Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Revenue Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-8 w-8 text-green-400" />
              <span className="text-green-400 text-sm font-semibold">TOTAL REVENUE</span>
            </div>
            <div className="text-2xl font-bold text-green-400">
              ${status?.revenueMetrics.totalRevenue.toLocaleString() || '0'}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="h-8 w-8 text-blue-400" />
              <span className="text-blue-400 text-sm font-semibold">ORDERS (24H)</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {status?.revenueMetrics.ordersLast24h || 0}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Bot className="h-8 w-8 text-purple-400" />
              <span className="text-purple-400 text-sm font-semibold">AI PRODUCTS</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {status?.revenueMetrics.productsGeneratedLast24h || 0}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-8 w-8 text-orange-400" />
              <span className="text-orange-400 text-sm font-semibold">CONVERSION</span>
            </div>
            <div className="text-2xl font-bold text-orange-400">
              {status?.revenueMetrics.conversionRate || '0%'}
            </div>
          </div>
        </div>

        {/* Revenue Projections */}
        {projections && (
          <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2" />
              INFINITE GROWTH PROJECTIONS
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Current</div>
                <div className="text-xl font-bold text-white">${projections.current.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Daily (+15%)</div>
                <div className="text-xl font-bold text-green-400">${projections.daily.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Weekly (+150%)</div>
                <div className="text-xl font-bold text-blue-400">${projections.weekly.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Monthly (+700%)</div>
                <div className="text-xl font-bold text-purple-400">${projections.monthly.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Yearly (+4900%)</div>
                <div className="text-xl font-bold text-yellow-400">${projections.yearly.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        {/* Automation Features Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">🤖 AI Product Generation</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400 font-semibold">
                  {status?.automationFeatures.productGeneration.status || 'INACTIVE'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Products Generated:</span>
                <span className="text-white">{status?.automationFeatures.productGeneration.productsGenerated || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Next Run:</span>
                <span className="text-white text-sm">
                  {status?.automationFeatures.productGeneration.nextRun ? 
                    new Date(status.automationFeatures.productGeneration.nextRun).toLocaleTimeString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">💰 Dynamic Pricing</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400 font-semibold">
                  {status?.automationFeatures.pricingOptimization.status || 'INACTIVE'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Price Updates:</span>
                <span className="text-white">{status?.automationFeatures.pricingOptimization.priceUpdates || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Next Update:</span>
                <span className="text-white text-sm">
                  {status?.automationFeatures.pricingOptimization.nextRun ? 
                    new Date(status.automationFeatures.pricingOptimization.nextRun).toLocaleTimeString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">📢 Marketing Campaigns</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400 font-semibold">
                  {status?.automationFeatures.marketingCampaigns.status || 'INACTIVE'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Active Campaigns:</span>
                <span className="text-white">{status?.automationFeatures.marketingCampaigns.campaignsLaunched || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Next Campaign:</span>
                <span className="text-white text-sm">
                  {status?.automationFeatures.marketingCampaigns.nextRun ? 
                    new Date(status.automationFeatures.marketingCampaigns.nextRun).toLocaleTimeString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">📦 Smart Inventory</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400 font-semibold">
                  {status?.automationFeatures.inventoryManagement.status || 'INACTIVE'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Restocked Items:</span>
                <span className="text-white">{status?.automationFeatures.inventoryManagement.restockedItems || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Next Check:</span>
                <span className="text-white text-sm">
                  {status?.automationFeatures.inventoryManagement.nextRun ? 
                    new Date(status.automationFeatures.inventoryManagement.nextRun).toLocaleTimeString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Generated Products */}
        {status?.recentGeneratedProducts && status.recentGeneratedProducts.length > 0 && (
          <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">🆕 Recently Generated Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {status.recentGeneratedProducts.map((product, index) => (
                <div key={index} className="bg-black/50 border border-gray-600 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">{product.name}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-green-400 font-bold">${product.price}</span>
                    <span className="text-gray-400 text-sm">{product.category}</span>
                  </div>
                  <div className="text-gray-500 text-xs mt-2">
                    {new Date(product.created).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutomationDashboard;