import React, { useState, useEffect } from 'react';

interface FirstDayProfitDashboardProps {
  className?: string;
}

export function FirstDayProfitDashboard({ className = '' }: FirstDayProfitDashboardProps) {
  const [firstDayStatus, setFirstDayStatus] = useState<any>(null);
  const [projections, setProjections] = useState<any>(null);
  const [performance, setPerformance] = useState<any>(null);
  const [actionPlan, setActionPlan] = useState<any>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [activationStatus, setActivationStatus] = useState<string>('');

  useEffect(() => {
    fetchFirstDayStatus();
    fetchProjections();
    fetchPerformance();
    fetchActionPlan();
  }, []);

  const fetchFirstDayStatus = async () => {
    try {
      const response = await fetch('/api/first-day-profit/first-day-status');
      const data = await response.json();
      if (data.success) {
        setFirstDayStatus(data.status);
      }
    } catch (error) {
      console.error('Failed to fetch first day status:', error);
    }
  };

  const fetchProjections = async () => {
    try {
      const response = await fetch('/api/first-day-profit/first-day-projections');
      const data = await response.json();
      if (data.success) {
        setProjections(data.projections);
      }
    } catch (error) {
      console.error('Failed to fetch projections:', error);
    }
  };

  const fetchPerformance = async () => {
    try {
      const response = await fetch('/api/first-day-profit/first-day-performance');
      const data = await response.json();
      if (data.success) {
        setPerformance(data.performance);
      }
    } catch (error) {
      console.error('Failed to fetch performance:', error);
    }
  };

  const fetchActionPlan = async () => {
    try {
      const response = await fetch('/api/first-day-profit/first-day-action-plan');
      const data = await response.json();
      if (data.success) {
        setActionPlan(data.actionPlan);
      }
    } catch (error) {
      console.error('Failed to fetch action plan:', error);
    }
  };

  const activateFirstDayProfit = async () => {
    setIsActivating(true);
    setActivationStatus('Activating First Day Profit Engine...');
    
    try {
      const response = await fetch('/api/first-day-profit/activate-first-day-profit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActivationStatus('✅ First Day Profit Engine Activated!');
        fetchFirstDayStatus();
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
    <div className={`first-day-profit-dashboard ${className}`}>
      <div className="bg-gradient-to-br from-green-900 via-blue-900 to-indigo-900 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              💰 First Day Profit Dashboard
            </h1>
            <p className="text-xl text-blue-200 mb-6">
              Real Money from Day 1 - No Demos, No Fake
            </p>
            
            <button
              onClick={activateFirstDayProfit}
              disabled={isActivating}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                isActivating
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105'
              } text-white shadow-lg`}
            >
              {isActivating ? 'Activating...' : '💰 ACTIVATE FIRST DAY PROFIT'}
            </button>
            
            {activationStatus && (
              <div className="mt-4 p-4 bg-black bg-opacity-50 rounded-lg">
                <p className="text-white">{activationStatus}</p>
              </div>
            )}
          </div>

          {/* First Day Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
              <h3 className="text-xl font-bold text-white mb-4">💰 First Day Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-200">Status:</span>
                  <span className={`font-semibold ${firstDayStatus?.isActive ? 'text-green-400' : 'text-red-400'}`}>
                    {firstDayStatus?.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Profit Target:</span>
                  <span className="text-white font-semibold">{formatCurrency(firstDayStatus?.profitTarget || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Features:</span>
                  <span className="text-white font-semibold">{firstDayStatus?.features?.length || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
              <h3 className="text-xl font-bold text-white mb-4">📊 Current Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-200">Revenue:</span>
                  <span className="text-white font-semibold">
                    {performance?.revenue ? formatCurrency(performance.revenue) : '$0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Orders:</span>
                  <span className="text-white font-semibold">{performance?.orders || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Status:</span>
                  <span className={`font-semibold ${performance?.status === 'TARGET_ACHIEVED' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {performance?.status || 'IN_PROGRESS'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
              <h3 className="text-xl font-bold text-white mb-4">🎯 Profit Target</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-200">Target:</span>
                  <span className="text-white font-semibold">$1,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Time:</span>
                  <span className="text-white font-semibold">24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Cost:</span>
                  <span className="text-green-400 font-semibold">$0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Projections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {projections && Object.entries(projections).map(([key, projection]: [string, any]) => (
              <div key={key} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <h3 className="text-lg font-semibold text-white mb-4 capitalize">
                  {key} Estimate
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Visitors:</span>
                    <span className="text-white font-semibold">{projection.visitors}</span>
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
                    <span className="text-blue-200">Revenue:</span>
                    <span className="text-green-400 font-semibold">
                      {formatCurrency(projection.revenue)}
                    </span>
                  </div>
                  <p className="text-sm text-blue-200 mt-2">{projection.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* First Day Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
              <h3 className="text-2xl font-bold text-white mb-4">💰 First Day Products</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Quick Web Development</span>
                  <span className="text-white font-semibold">$500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Social Media Setup</span>
                  <span className="text-white font-semibold">$200</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Business Consultation</span>
                  <span className="text-white font-semibold">$100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Logo Design Service</span>
                  <span className="text-white font-semibold">$150</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Email Marketing Setup</span>
                  <span className="text-white font-semibold">$300</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Local SEO Package</span>
                  <span className="text-white font-semibold">$250</span>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
              <h3 className="text-2xl font-bold text-white mb-4">🚀 Marketing Strategies</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Social media marketing (free)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Local community outreach (free)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Friends and family network (free)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Free advertising credits (free)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Local business groups (free)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <span className="text-blue-200">Online forums and communities (free)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Plan */}
          {actionPlan && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">📅 First Day Action Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(actionPlan).map(([key, plan]: [string, any]) => (
                  <div key={key} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                    <h4 className="text-lg font-bold text-white mb-4">{plan.title}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-blue-200">Time:</span>
                        <span className="text-white font-semibold">{plan.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-200">Cost:</span>
                        <span className="text-green-400 font-semibold">{plan.cost}</span>
                      </div>
                      {plan.revenue && (
                        <div className="flex justify-between">
                          <span className="text-blue-200">Revenue:</span>
                          <span className="text-green-400 font-semibold">{plan.revenue}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <h5 className="text-sm font-semibold text-white mb-2">Tasks:</h5>
                      <ul className="text-sm text-blue-200 space-y-1">
                        {plan.tasks.map((task: string, index: number) => (
                          <li key={index}>• {task}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profit Target */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                💰 First Day Profit Target: $1,000
              </h2>
              <p className="text-xl text-green-100 mb-4">
                Time Required: 24 hours | Cost: $0 | Potential Revenue: $150-$10,000
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white">Conservative</h3>
                  <p className="text-green-200 text-2xl font-bold">
                    {projections?.conservative ? formatCurrency(projections.conservative.revenue) : '$0'}
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white">Moderate</h3>
                  <p className="text-green-200 text-2xl font-bold">
                    {projections?.moderate ? formatCurrency(projections.moderate.revenue) : '$0'}
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white">Viral</h3>
                  <p className="text-green-200 text-2xl font-bold">
                    {projections?.viral ? formatCurrency(projections.viral.revenue) : '$0'}
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
